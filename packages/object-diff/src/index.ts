export { compare } from "./compare/compare.js";
export { added, diff, hasChanges, removed, unchanged, updated } from "./compare/difference/diff.js";
export {
  CircularReferenceError,
  InvalidPatchError,
  MaxDepthExceededError,
  ObjectDiffError,
  PatchApplyError,
  UnsupportedTypeError,
} from "./errors/index.js";
export { applyPatch, patch, revertPatch } from "./patch/index.js";
export { serialize } from "./serialize/index.js";
export type {
  ApplyPatchOptions,
  CircularReferenceStrategy,
  CompareOptions,
  ComparisonOutcome,
  CustomComparator,
  DiffMetadata,
  DiffOptions,
  DiffRecord,
  DiffResult,
  DiffType,
  Patch,
  PatchFormat,
  PatchOperation,
  PatchOperationType,
  PatchOptions,
  Path,
  PathSegment,
  ResolvedCompareOptions,
  ResolvedDiffOptions,
  SerializeFormat,
  SerializeOptions,
  ValueKind,
} from "./types/index.js";
