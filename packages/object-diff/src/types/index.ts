/**
 * Supported change kinds emitted by the difference engine.
 */
export type DiffType = "added" | "removed" | "changed" | "unchanged" | "moved";

/**
 * Path segment used for nested value addressing.
 */
export type PathSegment = string | number;

/**
 * Canonical path representation for a nested value.
 */
export type Path = readonly PathSegment[];

/**
 * A single recorded change between two values.
 */
export interface DiffRecord {
  readonly path: string;
  readonly type: DiffType;
  readonly previous?: unknown;
  readonly current?: unknown;
  /** Source display path when `type` is `moved`. */
  readonly from?: string;
}

/**
 * Metadata collected during a diff operation.
 */
export interface DiffMetadata {
  readonly durationMs: number;
  readonly changeCount: number;
  readonly addedCount: number;
  readonly removedCount: number;
  readonly changedCount: number;
  readonly unchangedCount: number;
  readonly movedCount: number;
}

/**
 * Result of a diff operation.
 */
export interface DiffResult {
  readonly changes: readonly DiffRecord[];
  readonly metadata: DiffMetadata;
}

/**
 * How circular references are handled during traversal.
 */
export type CircularReferenceStrategy = "error" | "skip";

/**
 * Custom comparator hook. Return true if equal, false if unequal, undefined to use default.
 */
export type CustomComparator = (a: unknown, b: unknown, path: Path) => boolean | undefined;

/**
 * Identity key for array element matching (Phase 2).
 * String form reads a property; function form returns an id or undefined (positional leftover).
 */
export type IdentityKey = string | ((item: unknown, path: Path) => string | number | undefined);

/**
 * Options for diff and filtered diff helpers.
 */
export interface DiffOptions {
  readonly maxDepth?: number;
  readonly includeUnchanged?: boolean;
  /**
   * When true, pair equal removed+added values into `moved` records
   * (and JSON Patch `move` ops).
   */
  readonly detectMoves?: boolean;
  readonly circular?: CircularReferenceStrategy;
  readonly customComparator?: CustomComparator;
  readonly treatUndefinedAsMissing?: boolean;
  /** Match array elements by identity instead of index. */
  readonly identityKey?: IdentityKey;
  /** Skip paths matching these patterns (`*`, `**` supported). */
  readonly ignore?: readonly string[];
  /** Only emit/visit paths matching these patterns (ancestors still visited). */
  readonly include?: readonly string[];
}

/**
 * Options for deep equality comparison.
 */
export interface CompareOptions {
  readonly maxDepth?: number;
  readonly circular?: CircularReferenceStrategy;
  readonly customComparator?: CustomComparator;
}

/**
 * Normalized diff options used internally.
 */
export interface ResolvedDiffOptions {
  readonly maxDepth: number;
  readonly includeUnchanged: boolean;
  readonly detectMoves: boolean;
  readonly circular: CircularReferenceStrategy;
  readonly customComparator: CustomComparator | undefined;
  readonly treatUndefinedAsMissing: boolean;
  readonly identityKey: IdentityKey | undefined;
  readonly ignore: readonly string[] | undefined;
  readonly include: readonly string[] | undefined;
}

/**
 * Normalized compare options used internally.
 */
export interface ResolvedCompareOptions {
  readonly maxDepth: number;
  readonly circular: CircularReferenceStrategy;
  readonly customComparator: CustomComparator | undefined;
}

/**
 * JSON Patch operation kinds (RFC 6902).
 */
export type PatchOperationType = "add" | "remove" | "replace" | "move" | "copy" | "test";

/**
 * A single JSON Patch style operation.
 */
export interface PatchOperation {
  readonly op: PatchOperationType;
  readonly path: string;
  readonly from?: string;
  readonly value?: unknown;
}

/**
 * A patch is an ordered list of operations.
 */
export type Patch = readonly PatchOperation[];

/**
 * Patch generation format.
 */
export type PatchFormat = "json-patch" | "merge";

/**
 * Options for patch generation.
 */
export interface PatchOptions {
  readonly format?: PatchFormat;
  /** Coalesce sequential replaces and drop no-op-friendly noise. Default false. */
  readonly optimize?: boolean;
}

/**
 * Options for applying patches.
 */
export interface ApplyPatchOptions {
  readonly mutable?: boolean;
  /** Validate operations before apply. Default true. */
  readonly validate?: boolean;
}

/**
 * Result of applying a patch while recording a faithful inverse.
 */
export interface ApplyPatchWithInverseResult<T> {
  readonly value: T;
  readonly inverse: Patch;
}

/**
 * Supported serializer output formats.
 */
export type SerializeFormat =
  "json" | "pretty" | "markdown" | "table" | "html" | "console" | "human";

/**
 * Options for serialization.
 */
export interface SerializeOptions {
  readonly title?: string;
  /** When false, `console` format omits ANSI colors. Default true. */
  readonly color?: boolean;
}

/**
 * Optional custom formatter registered via `createSerializer` (no import side effects).
 */
export interface FormatterPlugin {
  readonly name: string;
  format(result: DiffResult, options?: SerializeOptions): string;
}

/**
 * Internal value kind for traversal dispatch.
 */
export type ValueKind =
  "primitive" | "array" | "object" | "date" | "regexp" | "map" | "set" | "typed-array" | "function";

/**
 * Result of comparing two values at a path.
 */
export type ComparisonOutcome = "equal" | "unequal" | "type-mismatch";
