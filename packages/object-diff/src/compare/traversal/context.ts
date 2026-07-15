import type { Path, PathSegment } from "../../types/index.js";

export interface TraversalContext {
  readonly path: Path;
  readonly depth: number;
  readonly maxDepth: number;
  readonly circular: "error" | "skip";
  readonly seenA: WeakMap<object, Path>;
  readonly seenB: WeakMap<object, Path>;
}

export type PairVisitor = (
  a: unknown,
  b: unknown,
  key: PathSegment | undefined,
  context: TraversalContext,
) => boolean | undefined;

export function createTraversalContext(
  maxDepth: number,
  circular: "error" | "skip",
): TraversalContext {
  return {
    path: [],
    depth: 0,
    maxDepth,
    circular,
    seenA: new WeakMap<object, Path>(),
    seenB: new WeakMap<object, Path>(),
  };
}

export function childContext(context: TraversalContext, segment: PathSegment): TraversalContext {
  return {
    ...context,
    path: [...context.path, segment],
    depth: context.depth + 1,
  };
}
