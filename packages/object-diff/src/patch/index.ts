import { InvalidPatchError, PatchApplyError } from "../errors/index.js";
import { cloneValue } from "../utils/index.js";

import type {
  ApplyPatchOptions,
  DiffRecord,
  DiffResult,
  Patch,
  PatchFormat,
  PatchOperation,
  PatchOptions,
} from "../types/index.js";

const UNSAFE_PATH_KEYS = new Set(["__proto__", "constructor", "prototype"]);

function assertSafePathSegment(segment: string | number): void {
  if (typeof segment === "string" && UNSAFE_PATH_KEYS.has(segment)) {
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

  (parent as Record<string | number, unknown>)[key] = value;
}

function isPatchOperation(value: unknown): value is PatchOperation {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as PatchOperation;
  return typeof candidate.op === "string" && typeof candidate.path === "string";
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

  if (format === "merge") {
    return generateMergePatch(diffResult.changes);
  }

  return diffResult.changes.map((change) => operationFromChange(change));
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
    .filter((change) => change.type !== "unchanged")
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

function applyOperation(target: unknown, operation: PatchOperation): void {
  const segments = parsePointer(operation.path);

  if (segments.length === 0) {
    throw new PatchApplyError("Root-level patch operations are not supported.");
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
}

function invertOperation(operation: PatchOperation, previousValue: unknown): PatchOperation {
  switch (operation.op) {
    case "add":
      return { op: "remove", path: operation.path };
    case "remove":
      return { op: "add", path: operation.path, value: previousValue };
    case "replace":
      return { op: "replace", path: operation.path, value: previousValue };
    default:
      throw new InvalidPatchError(`Cannot invert operation "${operation.op as string}".`);
  }
}

/**
 * Apply a patch to a target value. Returns a new value by default.
 */
export function applyPatch<T>(target: T, patchOperations: Patch, options?: ApplyPatchOptions): T {
  if (!Array.isArray(patchOperations)) {
    throw new InvalidPatchError("Patch must be an array of operations.");
  }

  const working = options?.mutable ? target : cloneValue(target);

  for (const operation of patchOperations) {
    if (!isPatchOperation(operation)) {
      throw new InvalidPatchError("Invalid patch operation shape.");
    }

    applyOperation(working, operation);
  }

  return working;
}

/**
 * Revert a previously applied patch.
 */
export function revertPatch<T>(target: T, patchOperations: Patch, options?: ApplyPatchOptions): T {
  const reversed: Patch = [...patchOperations].reverse().map((operation) => {
    if (operation.op === "add") {
      return { op: "remove" as const, path: operation.path };
    }

    if (operation.op === "remove") {
      return { op: "add" as const, path: operation.path, value: undefined };
    }

    return invertOperation(operation, undefined);
  });

  return applyPatch(target, reversed, options);
}
