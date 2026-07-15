/**
 * Supported change kinds emitted by the difference engine.
 */
export type DiffType = "added" | "removed" | "changed" | "unchanged";

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
 * Options for diff and filtered diff helpers.
 */
export interface DiffOptions {
  readonly maxDepth?: number;
  readonly includeUnchanged?: boolean;
  readonly detectMoves?: boolean;
  readonly circular?: CircularReferenceStrategy;
  readonly customComparator?: CustomComparator;
  readonly treatUndefinedAsMissing?: boolean;
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
 * JSON Patch operation kinds supported in v1.
 */
export type PatchOperationType = "add" | "remove" | "replace";

/**
 * A single JSON Patch style operation.
 */
export interface PatchOperation {
  readonly op: PatchOperationType;
  readonly path: string;
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
}

/**
 * Options for applying patches.
 */
export interface ApplyPatchOptions {
  readonly mutable?: boolean;
}

/**
 * Supported serializer output formats.
 */
export type SerializeFormat = "json" | "pretty" | "markdown" | "table";

/**
 * Options for serialization.
 */
export interface SerializeOptions {
  readonly title?: string;
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
