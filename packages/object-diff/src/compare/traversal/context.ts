import type { IdentityKey, Path, PathSegment } from "../../types/index.js";

export interface TraversalContext {
  readonly path: Path;
  readonly depth: number;
  readonly maxDepth: number;
  readonly circular: "error" | "skip";
  readonly seenA: WeakMap<object, Path>;
  readonly seenB: WeakMap<object, Path>;
  readonly identityKey: IdentityKey | undefined;
  readonly shouldVisit: ((path: Path) => boolean) | undefined;
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
  };
}

export function childContext(context: TraversalContext, segment: PathSegment): TraversalContext {
  return {
    ...context,
    path: [...context.path, segment],
    depth: context.depth + 1,
  };
}
