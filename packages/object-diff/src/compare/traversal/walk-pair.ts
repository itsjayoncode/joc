import {
  childContext,
  createTraversalContext,
  type CreateTraversalContextOptions,
  type PairVisitor,
  type TraversalContext,
} from "./context.js";
import {
  CircularReferenceError,
  InvalidOptionsError,
  MaxDepthExceededError,
} from "../../errors/index.js";
import { resolveIdentity } from "../../utils/identity.js";
import {
  getValueKind,
  isMap,
  isPlainObject,
  isSet,
  isTypedArray,
  valuesEqualPrimitives,
} from "../../utils/index.js";
import { compareValues } from "../comparison/compare-values.js";
import { longestCommonSubsequencePairs, pairRemainingEquals } from "../difference/detect-moves.js";

import type { IdentityKey, Path, ResolvedCompareOptions } from "../../types/index.js";

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

function elementEquals(
  left: unknown,
  right: unknown,
  compareOptions: ResolvedCompareOptions | undefined,
): boolean {
  if (!compareOptions) {
    return Object.is(left, right);
  }
  return compareValues(left, right, compareOptions);
}

function walkPairValue(
  a: unknown,
  b: unknown,
  context: TraversalContext,
  visitor: PairVisitor,
): boolean | undefined {
  if (context.shouldVisit && !context.shouldVisit(context.path)) {
    return undefined;
  }

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
  if (context.detectMoves) {
    return walkArrayPairDetectMoves(a, b, context, visitor);
  }

  if (context.identityKey) {
    return walkArrayPairByIdentity(a, b, context, visitor, context.identityKey);
  }

  const maxLength = Math.max(a.length, b.length);

  for (let index = 0; index < maxLength; index += 1) {
    const child = childContext(context, index);
    if (context.shouldVisit && !context.shouldVisit(child.path)) {
      continue;
    }

    const result = walkPairValue(a[index], b[index], child, visitor);
    if (result === true) {
      return true;
    }
  }

  return undefined;
}

function walkArrayPairDetectMoves(
  a: unknown[],
  b: unknown[],
  context: TraversalContext,
  visitor: PairVisitor,
): boolean | undefined {
  if (context.identityKey) {
    return walkArrayPairDetectMovesByIdentity(a, b, context, visitor, context.identityKey);
  }

  const equals = (left: unknown, right: unknown) =>
    elementEquals(left, right, context.compareOptions);

  const lcs = longestCommonSubsequencePairs(a, b, equals);
  const pairedA = new Set(lcs.map((pair) => pair.aIndex));
  const pairedB = new Set(lcs.map((pair) => pair.bIndex));
  const movePairs = pairRemainingEquals(a, b, pairedA, pairedB, equals);

  for (const pair of lcs) {
    const child = childContext(context, pair.bIndex);
    if (context.shouldVisit && !context.shouldVisit(child.path)) {
      continue;
    }
    const result = walkPairValue(a[pair.aIndex], b[pair.bIndex], child, visitor);
    if (result === true) {
      return true;
    }
  }

  for (const pair of movePairs) {
    if (context.onMove) {
      const from = [...context.path, pair.aIndex] as Path;
      const to = [...context.path, pair.bIndex] as Path;
      const stop = context.onMove(from, to, a[pair.aIndex], b[pair.bIndex]);
      if (stop === true) {
        return true;
      }
    }

    const child = childContext(context, pair.bIndex);
    if (context.shouldVisit && !context.shouldVisit(child.path)) {
      continue;
    }

    if (equals(a[pair.aIndex], b[pair.bIndex])) {
      continue;
    }

    const result = walkPairValue(a[pair.aIndex], b[pair.bIndex], child, visitor);
    if (result === true) {
      return true;
    }
  }

  const matchedA = new Set([...pairedA, ...movePairs.map((pair) => pair.aIndex)]);
  const matchedB = new Set([...pairedB, ...movePairs.map((pair) => pair.bIndex)]);

  for (let aIndex = 0; aIndex < a.length; aIndex += 1) {
    if (matchedA.has(aIndex)) {
      continue;
    }
    const child = childContext(context, aIndex);
    if (context.shouldVisit && !context.shouldVisit(child.path)) {
      continue;
    }
    const result = visitor(a[aIndex], undefined, aIndex, child);
    if (result === true) {
      return true;
    }
  }

  for (let bIndex = 0; bIndex < b.length; bIndex += 1) {
    if (matchedB.has(bIndex)) {
      continue;
    }
    const child = childContext(context, bIndex);
    if (context.shouldVisit && !context.shouldVisit(child.path)) {
      continue;
    }
    const result = visitor(undefined, b[bIndex], bIndex, child);
    if (result === true) {
      return true;
    }
  }

  return undefined;
}

function walkArrayPairDetectMovesByIdentity(
  a: unknown[],
  b: unknown[],
  context: TraversalContext,
  visitor: PairVisitor,
  identityKey: IdentityKey,
): boolean | undefined {
  const leftById = new Map<string | number, { index: number; value: unknown }>();
  const rightById = new Map<string | number, { index: number; value: unknown }>();
  const leftNoId: Array<{ index: number; value: unknown }> = [];
  const rightNoId: Array<{ index: number; value: unknown }> = [];

  for (let index = 0; index < a.length; index += 1) {
    const value = a[index];
    const id = resolveIdentity(value, [...context.path, index], identityKey);
    if (id === undefined) {
      leftNoId.push({ index, value });
      continue;
    }
    if (leftById.has(id)) {
      throw new InvalidOptionsError(
        `Duplicate identity key "${String(id)}" in left array at path "${formatPath(context.path)}".`,
        { details: { path: formatPath(context.path), id } },
      );
    }
    leftById.set(id, { index, value });
  }

  for (let index = 0; index < b.length; index += 1) {
    const value = b[index];
    const id = resolveIdentity(value, [...context.path, index], identityKey);
    if (id === undefined) {
      rightNoId.push({ index, value });
      continue;
    }
    if (rightById.has(id)) {
      throw new InvalidOptionsError(
        `Duplicate identity key "${String(id)}" in right array at path "${formatPath(context.path)}".`,
        { details: { path: formatPath(context.path), id } },
      );
    }
    rightById.set(id, { index, value });
  }

  for (const [id, right] of rightById) {
    const left = leftById.get(id);
    const child = childContext(context, right.index);
    if (context.shouldVisit && !context.shouldVisit(child.path)) {
      continue;
    }

    if (!left) {
      const result = visitor(undefined, right.value, right.index, child);
      if (result === true) {
        return true;
      }
      continue;
    }

    if (left.index !== right.index && context.onMove) {
      const from = [...context.path, left.index] as Path;
      const to = [...context.path, right.index] as Path;
      const stop = context.onMove(from, to, left.value, right.value);
      if (stop === true) {
        return true;
      }
    }

    const result = walkPairValue(left.value, right.value, child, visitor);
    if (result === true) {
      return true;
    }
  }

  for (const [id, left] of leftById) {
    if (rightById.has(id)) {
      continue;
    }
    const child = childContext(context, left.index);
    if (context.shouldVisit && !context.shouldVisit(child.path)) {
      continue;
    }
    const result = visitor(left.value, undefined, left.index, child);
    if (result === true) {
      return true;
    }
  }

  if (leftNoId.length > 0 || rightNoId.length > 0) {
    const leftValues = leftNoId.map((entry) => entry.value);
    const rightValues = rightNoId.map((entry) => entry.value);
    const equals = (left: unknown, right: unknown) =>
      elementEquals(left, right, context.compareOptions);
    const lcs = longestCommonSubsequencePairs(leftValues, rightValues, equals);
    const pairedL = new Set(lcs.map((pair) => pair.aIndex));
    const pairedR = new Set(lcs.map((pair) => pair.bIndex));
    const moves = pairRemainingEquals(leftValues, rightValues, pairedL, pairedR, equals);

    for (const pair of lcs) {
      const left = leftNoId[pair.aIndex];
      const right = rightNoId[pair.bIndex];
      if (!left || !right) {
        continue;
      }
      const child = childContext(context, right.index);
      if (context.shouldVisit && !context.shouldVisit(child.path)) {
        continue;
      }
      const result = walkPairValue(left.value, right.value, child, visitor);
      if (result === true) {
        return true;
      }
    }

    for (const pair of moves) {
      const left = leftNoId[pair.aIndex];
      const right = rightNoId[pair.bIndex];
      if (!left || !right) {
        continue;
      }
      if (context.onMove) {
        const from = [...context.path, left.index] as Path;
        const to = [...context.path, right.index] as Path;
        const stop = context.onMove(from, to, left.value, right.value);
        if (stop === true) {
          return true;
        }
      }
    }

    for (let i = 0; i < leftNoId.length; i += 1) {
      if (pairedL.has(i) || moves.some((pair) => pair.aIndex === i)) {
        continue;
      }
      const left = leftNoId[i];
      if (!left) {
        continue;
      }
      const child = childContext(context, left.index);
      if (context.shouldVisit && !context.shouldVisit(child.path)) {
        continue;
      }
      const result = visitor(left.value, undefined, left.index, child);
      if (result === true) {
        return true;
      }
    }

    for (let i = 0; i < rightNoId.length; i += 1) {
      if (pairedR.has(i) || moves.some((pair) => pair.bIndex === i)) {
        continue;
      }
      const right = rightNoId[i];
      if (!right) {
        continue;
      }
      const child = childContext(context, right.index);
      if (context.shouldVisit && !context.shouldVisit(child.path)) {
        continue;
      }
      const result = visitor(undefined, right.value, right.index, child);
      if (result === true) {
        return true;
      }
    }
  }

  return undefined;
}

function walkArrayPairByIdentity(
  a: unknown[],
  b: unknown[],
  context: TraversalContext,
  visitor: PairVisitor,
  identityKey: IdentityKey,
): boolean | undefined {
  const leftById = new Map<string | number, { index: number; value: unknown }>();
  const rightById = new Map<string | number, { index: number; value: unknown }>();
  const leftNoId: Array<{ index: number; value: unknown }> = [];
  const rightNoId: Array<{ index: number; value: unknown }> = [];

  for (let index = 0; index < a.length; index += 1) {
    const value = a[index];
    const id = resolveIdentity(value, [...context.path, index], identityKey);
    if (id === undefined) {
      leftNoId.push({ index, value });
      continue;
    }

    if (leftById.has(id)) {
      throw new InvalidOptionsError(
        `Duplicate identity key "${String(id)}" in left array at path "${formatPath(context.path)}".`,
        { details: { path: formatPath(context.path), id } },
      );
    }

    leftById.set(id, { index, value });
  }

  for (let index = 0; index < b.length; index += 1) {
    const value = b[index];
    const id = resolveIdentity(value, [...context.path, index], identityKey);
    if (id === undefined) {
      rightNoId.push({ index, value });
      continue;
    }

    if (rightById.has(id)) {
      throw new InvalidOptionsError(
        `Duplicate identity key "${String(id)}" in right array at path "${formatPath(context.path)}".`,
        { details: { path: formatPath(context.path), id } },
      );
    }

    rightById.set(id, { index, value });
  }

  for (const [id, right] of rightById) {
    const left = leftById.get(id);
    const child = childContext(context, right.index);
    if (context.shouldVisit && !context.shouldVisit(child.path)) {
      continue;
    }

    if (!left) {
      const result = visitor(undefined, right.value, right.index, child);
      if (result === true) {
        return true;
      }
      continue;
    }

    const result = walkPairValue(left.value, right.value, child, visitor);
    if (result === true) {
      return true;
    }
  }

  for (const [id, left] of leftById) {
    if (rightById.has(id)) {
      continue;
    }

    const child = childContext(context, left.index);
    if (context.shouldVisit && !context.shouldVisit(child.path)) {
      continue;
    }

    const result = visitor(left.value, undefined, left.index, child);
    if (result === true) {
      return true;
    }
  }

  const leftover = Math.max(leftNoId.length, rightNoId.length);
  for (let i = 0; i < leftover; i += 1) {
    const left = leftNoId[i];
    const right = rightNoId[i];
    const index = right?.index ?? left?.index ?? i;
    const child = childContext(context, index);
    if (context.shouldVisit && !context.shouldVisit(child.path)) {
      continue;
    }

    const result = walkPairValue(left?.value, right?.value, child, visitor);
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
  let visitedChild = false;

  for (const key of keys) {
    const child = childContext(context, key);
    if (context.shouldVisit && !context.shouldVisit(child.path)) {
      continue;
    }

    visitedChild = true;

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

  if (!visitedChild && context.compareOptions && !compareValues(a, b, context.compareOptions)) {
    return visitor(a, b, undefined, context);
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
    if (context.shouldVisit && !context.shouldVisit(child.path)) {
      continue;
    }

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
    if (context.shouldVisit && !context.shouldVisit(child.path)) {
      continue;
    }

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
  options: CreateTraversalContextOptions = {},
): boolean | undefined {
  const context = createTraversalContext(maxDepth, circular, options);
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
