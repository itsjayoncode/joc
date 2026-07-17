import {
  compare,
  diff,
  hasChanges,
  patch,
  applyPatch,
  revertPatch,
  optimizePatch,
  validatePatch,
  serialize,
} from "@jayoncode/object-diff";
import { merge } from "@jayoncode/object-diff/merge";
import { statistics } from "@jayoncode/object-diff/stats";

import type { DiffResult, Patch, SerializeFormat } from "@jayoncode/object-diff";
import type { MergeOptions, MergeResult } from "@jayoncode/object-diff/merge";
import type { DiffStatistics, StatisticsOptions } from "@jayoncode/object-diff/stats";

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
    capabilities: [
      "diff",
      "compare",
      "hasChanges",
      "patch",
      "applyPatch",
      "serialize",
      "view",
      "merge",
      "query",
      "stats",
      "plugins",
    ],
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

export function toFormat(result: DiffResult, format: SerializeFormat): string {
  return serialize(result, format, { title: "Object Diff Result", color: false });
}

export function applySamplePatch(source: unknown, result: DiffResult): unknown {
  return applyPatch(source, patch(result));
}

export function runMerge(left: unknown, right: unknown, options?: MergeOptions): MergeResult {
  return merge(left, right, options);
}

export function runStatistics(
  result: DiffResult,
  patchOps?: Patch,
  options?: StatisticsOptions,
): DiffStatistics {
  return statistics(result, patchOps, options);
}

export {
  compare,
  diff,
  hasChanges,
  patch,
  applyPatch,
  revertPatch,
  optimizePatch,
  validatePatch,
  serialize,
  merge,
  statistics,
};

export type {
  DiffResult,
  Patch,
  SerializeFormat,
  CircularReferenceStrategy,
  PatchFormat,
  DiffType,
  DiffOptions,
  PatchOptions,
  ApplyPatchOptions,
} from "@jayoncode/object-diff";
export type { MergeOptions, MergeResult } from "@jayoncode/object-diff/merge";
export type { DiffStatistics, StatisticsOptions } from "@jayoncode/object-diff/stats";

