import {
  childContext,
  createTraversalContext,
  type PairVisitor,
  type TraversalContext,
} from "./context.js";
import { CircularReferenceError, MaxDepthExceededError } from "../../errors/index.js";
import {
  getValueKind,
  isMap,
  isPlainObject,
  isSet,
  isTypedArray,
  valuesEqualPrimitives,
} from "../../utils/index.js";

import type { Path } from "../../types/index.js";

function trackCircular(
  value: object,
  seen: WeakMap<object, Path>,
  path: Path,
  strategy: "error" | "skip",
): boolean {
  if (seen.has(value)) {
    if (strategy === "error") {
      throw new CircularReferenceError(
        `Circular reference detected at path "${formatPath(path)}".`,
        {
          details: { path: formatPath(path) },
        },
      );
    }

    return true;
  }

  seen.set(value, path);
  return false;
}

function formatPath(path: Path): string {
  if (path.length === 0) {
    return "(root)";
  }

  return path
    .map((segment, index) => {
      if (typeof segment === "number") {
        return `[${String(segment)}]`;
      }

      return index === 0 ? segment : `.${segment}`;
    })
    .join("");
}

function ensureDepth(context: TraversalContext): void {
  if (context.depth > context.maxDepth) {
    throw new MaxDepthExceededError(
      `Maximum depth of ${String(context.maxDepth)} exceeded at path "${formatPath(context.path)}".`,
      { details: { path: formatPath(context.path), maxDepth: context.maxDepth } },
    );
  }
}

function walkPairValue(
  a: unknown,
  b: unknown,
  context: TraversalContext,
  visitor: PairVisitor,
): boolean | undefined {
  ensureDepth(context);

  if (valuesEqualPrimitives(a, b)) {
    return visitor(a, b, undefined, context);
  }

  const kindA = getValueKind(a);
  const kindB = getValueKind(b);

  if (kindA !== kindB) {
    return visitor(a, b, undefined, context);
  }

  switch (kindA) {
    case "primitive":
    case "function":
      return visitor(a, b, undefined, context);
    case "date":
    case "regexp":
      return visitor(a, b, undefined, context);
    case "array":
      return walkArrayPair(a as unknown[], b as unknown[], context, visitor);
    case "object":
      return walkObjectPair(
        a as Record<string, unknown>,
        b as Record<string, unknown>,
        context,
        visitor,
      );
    case "map":
      return walkMapPair(a as Map<unknown, unknown>, b as Map<unknown, unknown>, context, visitor);
    case "set":
      return walkSetPair(a as Set<unknown>, b as Set<unknown>, context, visitor);
    case "typed-array":
      return walkTypedArrayPair(a as ArrayBufferView, b as ArrayBufferView, context, visitor);
    default:
      return visitor(a, b, undefined, context);
  }
}

function walkArrayPair(
  a: unknown[],
  b: unknown[],
  context: TraversalContext,
  visitor: PairVisitor,
): boolean | undefined {
  const maxLength = Math.max(a.length, b.length);

  for (let index = 0; index < maxLength; index += 1) {
    const child = childContext(context, index);
    const result = walkPairValue(a[index], b[index], child, visitor);
    if (result === true) {
      return true;
    }
  }

  return undefined;
}

function walkObjectPair(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
  context: TraversalContext,
  visitor: PairVisitor,
): boolean | undefined {
  if (trackCircular(a, context.seenA, context.path, context.circular)) {
    return undefined;
  }

  if (trackCircular(b, context.seenB, context.path, context.circular)) {
    return undefined;
  }

  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

  for (const key of keys) {
    const child = childContext(context, key);
    const aHas = Object.prototype.hasOwnProperty.call(a, key);
    const bHas = Object.prototype.hasOwnProperty.call(b, key);
    const left = aHas ? a[key] : undefined;
    const right = bHas ? b[key] : undefined;

    if (!aHas && bHas) {
      const result = visitor(undefined, right, key, child);
      if (result === true) {
        return true;
      }
      continue;
    }

    if (aHas && !bHas) {
      const result = visitor(left, undefined, key, child);
      if (result === true) {
        return true;
      }
      continue;
    }

    const result = walkPairValue(left, right, child, visitor);
    if (result === true) {
      return true;
    }
  }

  return undefined;
}

function walkMapPair(
  a: Map<unknown, unknown>,
  b: Map<unknown, unknown>,
  context: TraversalContext,
  visitor: PairVisitor,
): boolean | undefined {
  if (trackCircular(a, context.seenA, context.path, context.circular)) {
    return undefined;
  }

  if (trackCircular(b, context.seenB, context.path, context.circular)) {
    return undefined;
  }

  const keys = new Set([...a.keys(), ...b.keys()]);

  for (const key of keys) {
    const child = childContext(context, String(key));
    const result = walkPairValue(a.get(key), b.get(key), child, visitor);
    if (result === true) {
      return true;
    }
  }

  return undefined;
}

function walkSetPair(
  a: Set<unknown>,
  b: Set<unknown>,
  context: TraversalContext,
  visitor: PairVisitor,
): boolean | undefined {
  if (trackCircular(a, context.seenA, context.path, context.circular)) {
    return undefined;
  }

  if (trackCircular(b, context.seenB, context.path, context.circular)) {
    return undefined;
  }

  const values = new Set([...a.values(), ...b.values()]);

  for (const value of values) {
    const child = childContext(context, String(value));
    const result = walkPairValue(
      a.has(value) ? value : undefined,
      b.has(value) ? value : undefined,
      child,
      visitor,
    );
    if (result === true) {
      return true;
    }
  }

  return undefined;
}

function walkTypedArrayPair(
  a: ArrayBufferView,
  b: ArrayBufferView,
  context: TraversalContext,
  visitor: PairVisitor,
): boolean | undefined {
  const arrayA = Array.from(a as unknown as ArrayLike<number>);
  const arrayB = Array.from(b as unknown as ArrayLike<number>);
  return walkArrayPair(arrayA, arrayB, context, visitor);
}

export function walkPair(
  a: unknown,
  b: unknown,
  visitor: PairVisitor,
  maxDepth: number,
  circular: "error" | "skip",
): boolean | undefined {
  const context = createTraversalContext(maxDepth, circular);
  return walkPairValue(a, b, context, visitor);
}

export function forEachKey(
  a: unknown,
  b: unknown,
  callback: (
    key: string | number | undefined,
    aValue: unknown,
    bValue: unknown,
    path: Path,
  ) => void,
  context: TraversalContext,
): void {
  walkPairValue(a, b, context, (left, right, key) => {
    callback(key, left, right, context.path);
    return undefined;
  });
}

export { isMap, isPlainObject, isSet, isTypedArray };
