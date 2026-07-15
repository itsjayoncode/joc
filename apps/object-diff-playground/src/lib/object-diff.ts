import {
  compare,
  diff,
  hasChanges,
  patch,
  applyPatch,
  revertPatch,
  serialize,
} from "@jayoncode/object-diff";

import type { DiffResult } from "@jayoncode/object-diff";

export const SAMPLE_OBJECT_A = {
  user: { name: "John", active: true },
  tags: ["alpha", "beta"],
  meta: { version: 1 },
};

export const SAMPLE_OBJECT_B = {
  user: { name: "Jane", active: true },
  tags: ["alpha", "gamma"],
  meta: { version: 2 },
  role: "admin",
};

export function getObjectDiffIntegrationSummary() {
  return {
    packageName: "@jayoncode/object-diff",
    entryPoint: "src/lib/object-diff.ts",
    capabilities: ["diff", "compare", "hasChanges", "patch", "applyPatch", "serialize"],
  };
}

export function runSampleComparison(): DiffResult {
  return diff(SAMPLE_OBJECT_A, SAMPLE_OBJECT_B);
}

export function runQuickCompare(a: unknown, b: unknown): DiffResult {
  return diff(a, b);
}

export function objectsEqual(a: unknown, b: unknown): boolean {
  return compare(a, b);
}

export function objectsChanged(a: unknown, b: unknown): boolean {
  return hasChanges(a, b);
}

export function toMarkdown(result: DiffResult): string {
  return serialize(result, "markdown", { title: "Object Diff Result" });
}

export function toTable(result: DiffResult): string {
  return serialize(result, "table");
}

export function applySamplePatch(source: unknown, result: DiffResult): unknown {
  return applyPatch(source, patch(result));
}

export { compare, diff, hasChanges, patch, applyPatch, revertPatch, serialize };
