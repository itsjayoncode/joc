export { compare } from "./compare/compare.js";
export { added, diff, hasChanges, removed, unchanged, updated } from "./compare/difference/diff.js";
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
} from "./errors/index.js";
export {
  applyPatch,
  applyPatchWithInverse,
  optimizePatch,
  patch,
  revertPatch,
  validatePatch,
} from "./patch/index.js";
export { serialize } from "./serialize/index.js";
export type {
  ApplyPatchOptions,
  ApplyPatchWithInverseResult,
  CircularReferenceStrategy,
  CompareOptions,
  ComparisonOutcome,
  CustomComparator,
  DiffMetadata,
  DiffOptions,
  DiffRecord,
  DiffResult,
  DiffType,
  FormatterPlugin,
  IdentityKey,
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
