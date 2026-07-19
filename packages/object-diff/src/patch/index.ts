import { optimizePatch } from "./optimize.js";
import { validatePatch } from "./validate.js";
import { compare } from "../compare/compare.js";
import { InvalidPatchError, PatchApplyError } from "../errors/index.js";
import { cloneValue } from "../utils/index.js";

import type {
  ApplyPatchOptions,
  ApplyPatchWithInverseResult,
  DiffRecord,
  DiffResult,
  Patch,
  PatchFormat,
  PatchOperation,
  PatchOptions,
} from "../types/index.js";

function assertSafePathSegment(segment: string | number): void {
  // Explicit equality checks — CodeQL does not treat Set.has as a sanitizer.
  if (
    typeof segment === "string" &&
    (segment === "__proto__" || segment === "constructor" || segment === "prototype")
  ) {
    throw new InvalidPatchError(`Unsafe path segment "${segment}" is not allowed.`);
  }
}

function setPropertyValue(
  parent: Record<string | number, unknown> | unknown[],
  key: string | number,
  value: unknown,
): void {
  assertSafePathSegment(key);

  if (Array.isArray(parent) && typeof key === "number") {
    parent[key] = value;
    return;
  }

  // Own-property write — avoids [[Set]] / __proto__ pollution from dynamic assignment.
  Object.defineProperty(parent, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

function toJsonPointer(path: string): string {
  if (path === "") {
    return "";
  }

  const segments = path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean);

  return `/${segments.map((segment) => segment.replace(/~/g, "~0").replace(/\//g, "~1")).join("/")}`;
}

/**
 * Generate a patch from a diff result.
 */
export function patch(diffResult: DiffResult, options?: PatchOptions): Patch {
  const format: PatchFormat = options?.format ?? "json-patch";

  let operations: Patch =
    format === "merge"
      ? generateMergePatch(diffResult.changes)
      : diffResult.changes
          .filter((change) => change.type !== "unchanged")
          .map((change) => operationFromChange(change));

  if (options?.optimize) {
    operations = optimizePatch(operations);
  }

  return operations;
}

function operationFromChange(change: DiffRecord): PatchOperation {
  const pointer = toJsonPointer(change.path);

  switch (change.type) {
    case "added":
      return { op: "add", path: pointer, value: change.current };
    case "removed":
      return { op: "remove", path: pointer };
    case "changed":
      return { op: "replace", path: pointer, value: change.current };
    case "moved": {
      if (!change.from) {
        throw new InvalidPatchError(`Moved change at "${change.path}" is missing from path.`);
      }

      return {
        op: "move",
        from: toJsonPointer(change.from),
        path: pointer,
      };
    }
    case "unchanged":
      throw new InvalidPatchError(
        `Cannot create patch operation for unchanged path "${change.path}".`,
      );
    default:
      throw new InvalidPatchError(`Unsupported change type for path "${change.path}".`);
  }
}

function generateMergePatch(changes: readonly DiffRecord[]): Patch {
  return changes
    .filter((change) => change.type !== "unchanged" && change.type !== "moved")
    .map((change) => ({
      op: change.type === "removed" ? "remove" : "replace",
      path: toJsonPointer(change.path),
      ...(change.type === "removed" ? {} : { value: change.current }),
    }));
}

function parsePointer(pointer: string): Array<string | number> {
  if (pointer === "" || pointer === "/") {
    return [];
  }

  return pointer
    .split("/")
    .slice(1)
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"))
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment))
    .map((segment) => {
      assertSafePathSegment(segment);
      return segment;
    });
}

function getParent(
  target: unknown,
  segments: Array<string | number>,
): {
  parent: Record<string | number, unknown> | unknown[];
  key: string | number;
} {
  if (segments.length === 0) {
    throw new PatchApplyError("Cannot apply patch operation without a target path.");
  }

  let current: unknown = target;

  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index];
    if (segment === undefined) {
      throw new PatchApplyError("Invalid path segment.");
    }

    if (current === null || typeof current !== "object") {
      throw new PatchApplyError(`Invalid path segment "${String(segment)}".`);
    }

    current = (current as Record<string | number, unknown>)[segment];
  }

  const key = segments[segments.length - 1];
  if (key === undefined) {
    throw new PatchApplyError("Invalid path key.");
  }

  if (current === null || typeof current !== "object") {
    throw new PatchApplyError(`Invalid parent for key "${String(key)}".`);
  }

  return { parent: current as Record<string | number, unknown> | unknown[], key };
}

function readValueAt(target: unknown, pointer: string): unknown {
  const segments = parsePointer(pointer);
  if (segments.length === 0) {
    return target;
  }

  let current: unknown = target;
  for (const segment of segments) {
    if (current === null || typeof current !== "object") {
      return undefined;
    }

    current = (current as Record<string | number, unknown>)[segment];
  }

  return current;
}

function removeValueAt(target: unknown, pointer: string): { target: unknown; value: unknown } {
  const segments = parsePointer(pointer);

  if (segments.length === 0) {
    throw new PatchApplyError("Cannot remove the document root.");
  }

  const { parent, key } = getParent(target, segments);
  let value: unknown;

  if (Array.isArray(parent) && typeof key === "number") {
    value = parent[key];
    parent.splice(key, 1);
  } else {
    assertSafePathSegment(key);
    value = (parent as Record<string | number, unknown>)[key];
    Reflect.deleteProperty(parent, key);
  }

  return { target, value };
}

function addValueAt(target: unknown, pointer: string, value: unknown): unknown {
  const segments = parsePointer(pointer);

  if (segments.length === 0) {
    return value;
  }

  const { parent, key } = getParent(target, segments);

  if (Array.isArray(parent) && typeof key === "number") {
    parent.splice(key, 0, value);
  } else {
    setPropertyValue(parent, key, value);
  }

  return target;
}

function applyOperation(target: unknown, operation: PatchOperation): unknown {
  switch (operation.op) {
    case "test": {
      const current = readValueAt(target, operation.path);
      if (!compare(current, operation.value)) {
        throw new PatchApplyError(`Patch test failed at path "${operation.path}".`, {
          details: { path: operation.path, expected: operation.value, actual: current },
        });
      }

      return target;
    }
    case "copy": {
      if (typeof operation.from !== "string") {
        throw new InvalidPatchError('Patch operation "copy" requires a from pointer.');
      }

      const fromSegments = parsePointer(operation.from);
      if (fromSegments.length > 0) {
        try {
          getParent(target, fromSegments);
        } catch (cause) {
          throw new PatchApplyError(`Cannot copy from missing path "${operation.from}".`, {
            cause,
            details: { from: operation.from },
          });
        }
      }

      const value = cloneValue(readValueAt(target, operation.from));
      return addValueAt(target, operation.path, value);
    }
    case "move": {
      if (typeof operation.from !== "string") {
        throw new InvalidPatchError('Patch operation "move" requires a from pointer.');
      }

      const removed = removeValueAt(target, operation.from);
      return addValueAt(removed.target, operation.path, removed.value);
    }
    default:
      break;
  }

  const segments = parsePointer(operation.path);

  if (segments.length === 0) {
    if (operation.op === "replace" || operation.op === "add") {
      return operation.value;
    }

    throw new PatchApplyError("Root-level remove is not supported.");
  }

  const { parent, key } = getParent(target, segments);

  switch (operation.op) {
    case "add":
      if (Array.isArray(parent) && typeof key === "number") {
        parent.splice(key, 0, operation.value);
      } else {
        setPropertyValue(parent, key, operation.value);
      }
      break;
    case "replace":
      setPropertyValue(parent, key, operation.value);
      break;
    case "remove":
      if (Array.isArray(parent) && typeof key === "number") {
        parent.splice(key, 1);
      } else {
        assertSafePathSegment(key);
        Reflect.deleteProperty(parent, key);
      }
      break;
    default:
      throw new InvalidPatchError(`Unsupported patch operation "${operation.op as string}".`);
  }

  return target;
}

function invertOperation(operation: PatchOperation, previousValue: unknown): PatchOperation | null {
  switch (operation.op) {
    case "add":
      return { op: "remove", path: operation.path };
    case "remove":
      return { op: "add", path: operation.path, value: previousValue };
    case "replace":
      return { op: "replace", path: operation.path, value: previousValue };
    case "move":
      if (typeof operation.from !== "string") {
        throw new InvalidPatchError('Cannot invert move without "from".');
      }

      return { op: "move", from: operation.path, path: operation.from };
    case "copy":
      return { op: "remove", path: operation.path };
    case "test":
      return null;
    default:
      throw new InvalidPatchError(`Cannot invert operation "${operation.op as string}".`);
  }
}

/**
 * Apply a patch to a target value. Returns a new value by default.
 */
export function applyPatch<T>(target: T, patchOperations: Patch, options?: ApplyPatchOptions): T {
  if (options?.validate !== false) {
    validatePatch(patchOperations);
  } else if (!Array.isArray(patchOperations)) {
    throw new InvalidPatchError("Patch must be an array of operations.");
  }

  let working: unknown = options?.mutable ? target : cloneValue(target);

  for (const operation of patchOperations) {
    working = applyOperation(working, operation);
  }

  return working as T;
}

/**
 * Apply a patch and return a faithful inverse patch (previous values captured).
 */
export function applyPatchWithInverse<T>(
  target: T,
  patchOperations: Patch,
  options?: ApplyPatchOptions,
): ApplyPatchWithInverseResult<T> {
  if (options?.validate !== false) {
    validatePatch(patchOperations);
  } else if (!Array.isArray(patchOperations)) {
    throw new InvalidPatchError("Patch must be an array of operations.");
  }

  let working: unknown = options?.mutable ? target : cloneValue(target);
  const inverse: PatchOperation[] = [];

  for (const operation of patchOperations) {
    const previousValue =
      operation.op === "move" || operation.op === "copy"
        ? readValueAt(working, operation.path)
        : readValueAt(working, operation.path);
    const inverseOp = invertOperation(operation, previousValue);
    if (inverseOp) {
      inverse.unshift(inverseOp);
    }

    working = applyOperation(working, operation);
  }

  return {
    value: working as T,
    inverse,
  };
}

/**
 * Revert a previously applied patch.
 * Prefer `applyPatchWithInverse` when you need faithful undo of replaces/removes.
 * This helper inverts ops structurally; remove→add uses `undefined` unless values were journaled.
 */
export function revertPatch<T>(target: T, patchOperations: Patch, options?: ApplyPatchOptions): T {
  if (options?.validate !== false) {
    validatePatch(patchOperations);
  }

  const reversed: Patch = [...patchOperations].reverse().flatMap((operation) => {
    if (operation.op === "add") {
      return [{ op: "remove" as const, path: operation.path }];
    }

    if (operation.op === "remove") {
      return [{ op: "add" as const, path: operation.path, value: undefined }];
    }

    if (operation.op === "test") {
      return [];
    }

    if (operation.op === "move" && typeof operation.from === "string") {
      return [{ op: "move" as const, from: operation.path, path: operation.from }];
    }

    if (operation.op === "copy") {
      return [{ op: "remove" as const, path: operation.path }];
    }

    const inverted = invertOperation(operation, undefined);
    return inverted ? [inverted] : [];
  });

  return applyPatch(target, reversed, { ...options, validate: false });
}

export { optimizePatch } from "./optimize.js";
export { validatePatch } from "./validate.js";
