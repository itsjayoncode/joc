import { InvalidPatchError } from "../errors/index.js";

import type { Patch, PatchOperation, PatchOperationType } from "../types/index.js";

const SUPPORTED_OPS = new Set<PatchOperationType>([
  "add",
  "remove",
  "replace",
  "move",
  "copy",
  "test",
]);

function assertSafePointer(pointer: string): void {
  if (pointer !== "" && !pointer.startsWith("/")) {
    throw new InvalidPatchError(`JSON Pointer path must be empty or start with "/": "${pointer}".`);
  }

  if (pointer === "" || pointer === "/") {
    return;
  }

  for (const raw of pointer.split("/").slice(1)) {
    const segment = raw.replace(/~1/g, "/").replace(/~0/g, "~");
    if (segment === "__proto__" || segment === "constructor" || segment === "prototype") {
      throw new InvalidPatchError(`Unsafe path segment "${segment}" is not allowed.`);
    }
  }
}

function isPatchOperation(value: unknown): value is PatchOperation {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as PatchOperation;
  return typeof candidate.op === "string" && typeof candidate.path === "string";
}

/**
 * Validate a patch document. Throws InvalidPatchError on failure.
 */
export function validatePatch(patchOperations: unknown): asserts patchOperations is Patch {
  if (!Array.isArray(patchOperations)) {
    throw new InvalidPatchError("Patch must be an array of operations.");
  }

  for (const [index, operation] of patchOperations.entries()) {
    if (!isPatchOperation(operation)) {
      throw new InvalidPatchError(`Invalid patch operation shape at index ${String(index)}.`);
    }

    if (!SUPPORTED_OPS.has(operation.op)) {
      throw new InvalidPatchError(
        `Unsupported patch operation "${operation.op}" at index ${String(index)}.`,
      );
    }

    assertSafePointer(operation.path);

    if (
      (operation.op === "add" || operation.op === "replace" || operation.op === "test") &&
      !("value" in operation)
    ) {
      throw new InvalidPatchError(
        `Patch operation "${operation.op}" at index ${String(index)} requires a value.`,
      );
    }

    if (operation.op === "move" || operation.op === "copy") {
      if (typeof operation.from !== "string") {
        throw new InvalidPatchError(
          `Patch operation "${operation.op}" at index ${String(index)} requires a from pointer.`,
        );
      }

      assertSafePointer(operation.from);
    }
  }
}
