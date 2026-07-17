/**
 * Slim core entry — compare / diff / hasChanges without patch or serialize.
 *
 *   import { diff, hasChanges } from "@jayoncode/object-diff/core";
 *
 * Root `@jayoncode/object-diff` still re-exports patch + serialize for compatibility.
 */
export { compare } from "../compare/compare.js";
export {
  added,
  diff,
  hasChanges,
  removed,
  unchanged,
  updated,
} from "../compare/difference/diff.js";
export {
  CircularReferenceError,
  InvalidOptionsError,
  InvalidPatchError,
  MaxDepthExceededError,
  NotImplementedError,
  ObjectDiffError,
  PatchApplyError,
  PluginError,
  UnsupportedTypeError,
} from "../errors/index.js";

export type {
  CircularReferenceStrategy,
  CompareOptions,
  ComparisonOutcome,
  CustomComparator,
  DiffMetadata,
  DiffOptions,
  DiffRecord,
  DiffResult,
  DiffType,
  IdentityKey,
  Path,
  PathSegment,
  ResolvedCompareOptions,
  ResolvedDiffOptions,
  ValueKind,
} from "../types/index.js";
