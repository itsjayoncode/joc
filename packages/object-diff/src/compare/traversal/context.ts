import type { IdentityKey, Path, PathSegment, ResolvedCompareOptions } from "../../types/index.js";

export interface TraversalContext {
  readonly path: Path;
  readonly depth: number;
  readonly maxDepth: number;
  readonly circular: "error" | "skip";
  readonly seenA: WeakMap<object, Path>;
  readonly seenB: WeakMap<object, Path>;
  readonly identityKey: IdentityKey | undefined;
  readonly shouldVisit: ((path: Path) => boolean) | undefined;
  readonly detectMoves: boolean;
  readonly compareOptions: ResolvedCompareOptions | undefined;
  /**
   * Called when an array element moves from one index to another.
   * Return true to stop traversal early (hasChanges).
   */
  readonly onMove:
    | ((from: Path, to: Path, previous: unknown, current: unknown) => boolean | undefined)
    | undefined;
}

export type PairVisitor = (
  a: unknown,
  b: unknown,
  key: PathSegment | undefined,
  context: TraversalContext,
) => boolean | undefined;

export interface CreateTraversalContextOptions {
  readonly identityKey?: IdentityKey;
  readonly shouldVisit?: (path: Path) => boolean;
  readonly detectMoves?: boolean;
  readonly compareOptions?: ResolvedCompareOptions;
  readonly onMove?: (
    from: Path,
    to: Path,
    previous: unknown,
    current: unknown,
  ) => boolean | undefined;
}

export function createTraversalContext(
  maxDepth: number,
  circular: "error" | "skip",
  options: CreateTraversalContextOptions = {},
): TraversalContext {
  return {
    path: [],
    depth: 0,
    maxDepth,
    circular,
    seenA: new WeakMap<object, Path>(),
    seenB: new WeakMap<object, Path>(),
    identityKey: options.identityKey,
    shouldVisit: options.shouldVisit,
    detectMoves: options.detectMoves === true,
    compareOptions: options.compareOptions,
    onMove: options.onMove,
  };
}

export function childContext(context: TraversalContext, segment: PathSegment): TraversalContext {
  return {
    ...context,
    path: [...context.path, segment],
    depth: context.depth + 1,
  };
}
