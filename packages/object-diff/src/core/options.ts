import type {
  CompareOptions,
  DiffOptions,
  ResolvedCompareOptions,
  ResolvedDiffOptions,
} from "../types/index.js";

const DEFAULT_MAX_DEPTH = Number.POSITIVE_INFINITY;

export function normalizeDiffOptions(options: DiffOptions = {}): ResolvedDiffOptions {
  return {
    maxDepth: options.maxDepth ?? DEFAULT_MAX_DEPTH,
    includeUnchanged: options.includeUnchanged ?? false,
    detectMoves: options.detectMoves ?? false,
    circular: options.circular ?? "error",
    customComparator: options.customComparator,
    treatUndefinedAsMissing: options.treatUndefinedAsMissing ?? false,
  };
}

export function normalizeCompareOptions(options: CompareOptions = {}): ResolvedCompareOptions {
  return {
    maxDepth: options.maxDepth ?? DEFAULT_MAX_DEPTH,
    circular: options.circular ?? "error",
    customComparator: options.customComparator,
  };
}
