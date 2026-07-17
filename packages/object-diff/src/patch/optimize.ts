import type { Patch, PatchOperation } from "../types/index.js";

/**
 * Optimize a patch: coalesce sequential replaces on the same path (keep last).
 * Does not reorder independent operations.
 */
export function optimizePatch(patchOperations: Patch): Patch {
  if (patchOperations.length <= 1) {
    return patchOperations;
  }

  const optimized: PatchOperation[] = [];

  for (const operation of patchOperations) {
    const previous = optimized[optimized.length - 1];

    if (
      previous &&
      previous.op === "replace" &&
      operation.op === "replace" &&
      previous.path === operation.path
    ) {
      optimized[optimized.length - 1] = operation;
      continue;
    }

    // remove immediately followed by add on same path → replace
    if (
      previous &&
      previous.op === "remove" &&
      operation.op === "add" &&
      previous.path === operation.path
    ) {
      optimized[optimized.length - 1] = {
        op: "replace",
        path: operation.path,
        value: operation.value,
      };
      continue;
    }

    optimized.push(operation);
  }

  return optimized;
}
