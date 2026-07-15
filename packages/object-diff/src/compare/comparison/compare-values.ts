import {
  getValueKind,
  isDate,
  isMap,
  isRegExp,
  isSet,
  isTypedArray,
  valuesEqualPrimitives,
} from "../../utils/index.js";
import { walkPair } from "../traversal/walk-pair.js";

import type { ComparisonOutcome, Path, ResolvedCompareOptions } from "../../types/index.js";

function comparePrimitives(a: unknown, b: unknown): ComparisonOutcome {
  return valuesEqualPrimitives(a, b) ? "equal" : "unequal";
}

function compareDates(a: Date, b: Date): ComparisonOutcome {
  const aTime = a.getTime();
  const bTime = b.getTime();

  if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
    return "equal";
  }

  return aTime === bTime ? "equal" : "unequal";
}

function compareRegExps(a: RegExp, b: RegExp): ComparisonOutcome {
  return a.source === b.source && a.flags === b.flags ? "equal" : "unequal";
}

function compareTypedArrays(a: ArrayBufferView, b: ArrayBufferView): ComparisonOutcome {
  if (a.byteLength !== b.byteLength) {
    return "unequal";
  }

  const viewA = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  const viewB = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);

  for (let index = 0; index < viewA.length; index += 1) {
    if (viewA[index] !== viewB[index]) {
      return "unequal";
    }
  }

  return "equal";
}

function compareSets(
  a: Set<unknown>,
  b: Set<unknown>,
  options: ResolvedCompareOptions,
): ComparisonOutcome {
  if (a.size !== b.size) {
    return "unequal";
  }

  for (const value of a) {
    if (!b.has(value) && !hasEquivalentValue(b, value, options)) {
      return "unequal";
    }
  }

  return "equal";
}

function compareMaps(
  a: Map<unknown, unknown>,
  b: Map<unknown, unknown>,
  options: ResolvedCompareOptions,
): ComparisonOutcome {
  if (a.size !== b.size) {
    return "unequal";
  }

  for (const [key, value] of a) {
    if (!b.has(key)) {
      return "unequal";
    }

    if (!compareValues(value, b.get(key), options)) {
      return "unequal";
    }
  }

  return "equal";
}

function hasEquivalentValue(
  set: Set<unknown>,
  target: unknown,
  options: ResolvedCompareOptions,
): boolean {
  for (const value of set) {
    if (compareValues(value, target, options)) {
      return true;
    }
  }

  return false;
}

export function compareValues(a: unknown, b: unknown, options: ResolvedCompareOptions): boolean {
  if (options.customComparator) {
    const custom = options.customComparator(a, b, []);
    if (custom !== undefined) {
      return custom;
    }
  }

  if (valuesEqualPrimitives(a, b)) {
    return true;
  }

  const kindA = getValueKind(a);
  const kindB = getValueKind(b);

  if (kindA !== kindB) {
    return false;
  }

  switch (kindA) {
    case "primitive":
      return comparePrimitives(a, b) === "equal";
    case "function":
      return a === b;
    case "date":
      return compareDates(a as Date, b as Date) === "equal";
    case "regexp":
      return compareRegExps(a as RegExp, b as RegExp) === "equal";
    case "typed-array":
      return compareTypedArrays(a as ArrayBufferView, b as ArrayBufferView) === "equal";
    case "set":
      return compareSets(a as Set<unknown>, b as Set<unknown>, options) === "equal";
    case "map":
      return (
        compareMaps(a as Map<unknown, unknown>, b as Map<unknown, unknown>, options) === "equal"
      );
    case "array":
    case "object":
      return deepCompare(a, b, options);
    default:
      return false;
  }
}

function deepCompare(a: unknown, b: unknown, options: ResolvedCompareOptions): boolean {
  let equal = true;

  walkPair(
    a,
    b,
    (left, right, _key, context) => {
      if (options.customComparator) {
        const custom = options.customComparator(left, right, context.path);
        if (custom !== undefined) {
          if (!custom) {
            equal = false;
            return true;
          }

          return undefined;
        }
      }

      const kind = getValueKind(left);
      const otherKind = getValueKind(right);

      if (kind !== otherKind) {
        equal = false;
        return true;
      }

      if (kind === "primitive" || kind === "function" || kind === "date" || kind === "regexp") {
        if (!leafEqual(left, right)) {
          equal = false;
          return true;
        }

        return undefined;
      }

      return undefined;
    },
    options.maxDepth,
    options.circular,
  );

  return equal;
}

function leafEqual(a: unknown, b: unknown): boolean {
  if (isDate(a) && isDate(b)) {
    return compareDates(a, b) === "equal";
  }

  if (isRegExp(a) && isRegExp(b)) {
    return compareRegExps(a, b) === "equal";
  }

  return (
    valuesEqualPrimitives(a, b) || (typeof a === "function" && typeof b === "function" && a === b)
  );
}

export function compareAtPath(
  a: unknown,
  b: unknown,
  path: Path,
  options: ResolvedCompareOptions,
): ComparisonOutcome {
  return compareValues(a, b, options) ? "equal" : "unequal";
}

export { isMap, isSet, isTypedArray };
