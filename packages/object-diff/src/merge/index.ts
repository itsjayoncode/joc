import { compare } from "../compare/compare.js";
import { diff } from "../compare/difference/diff.js";
import { InvalidOptionsError } from "../errors/index.js";
import { cloneValue, isPlainObject } from "../utils/index.js";

import type { DiffResult } from "../types/index.js";

/**
 * A path where left and right (and optionally base) disagree.
 */
export interface MergeConflict {
  readonly path: string;
  readonly base?: unknown;
  readonly left: unknown;
  readonly right: unknown;
}

export type MergeStrategy = "latest-wins" | "manual" | "custom";

export interface MergeOptions {
  /** When set, perform a three-way merge against this common ancestor. */
  readonly base?: unknown;
  /** Default: `latest-wins`. */
  readonly strategy?: MergeStrategy;
  /** Required when strategy is `custom`. */
  readonly resolve?: (conflict: MergeConflict) => unknown;
  /** Attach DiffResult of left → merged value for audit. Default true. */
  readonly includeApplied?: boolean;
}

export interface MergeResult {
  readonly value: unknown;
  readonly conflicts: readonly MergeConflict[];
  readonly applied?: DiffResult;
}

interface MergeState {
  readonly strategy: MergeStrategy;
  readonly resolve: ((conflict: MergeConflict) => unknown) | undefined;
  readonly conflicts: MergeConflict[];
}

function joinSegment(path: string, segment: string | number): string {
  if (path === "") {
    return typeof segment === "number" ? `[${String(segment)}]` : segment;
  }

  return typeof segment === "number" ? `${path}[${String(segment)}]` : `${path}.${segment}`;
}

function resolveConflict(state: MergeState, conflict: MergeConflict): unknown {
  state.conflicts.push(conflict);

  switch (state.strategy) {
    case "latest-wins":
      return cloneValue(conflict.right);
    case "manual":
      return cloneValue(conflict.left);
    case "custom": {
      if (!state.resolve) {
        throw new InvalidOptionsError(
          'Merge strategy "custom" requires a resolve(conflict) function.',
          { details: { strategy: "custom" } },
        );
      }

      return state.resolve(conflict);
    }
    default:
      throw new InvalidOptionsError(`Unknown merge strategy "${state.strategy as string}".`);
  }
}

function mergeTwoWay(left: unknown, right: unknown, path: string, state: MergeState): unknown {
  if (compare(left, right)) {
    return cloneValue(left);
  }

  if (isPlainObject(left) && isPlainObject(right)) {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
    const result: Record<string, unknown> = {};

    for (const key of keys) {
      const leftHas = Object.prototype.hasOwnProperty.call(left, key);
      const rightHas = Object.prototype.hasOwnProperty.call(right, key);
      const childPath = joinSegment(path, key);

      if (leftHas && !rightHas) {
        result[key] = cloneValue(left[key]);
        continue;
      }

      if (!leftHas && rightHas) {
        result[key] = cloneValue(right[key]);
        continue;
      }

      result[key] = mergeTwoWay(left[key], right[key], childPath, state);
    }

    return result;
  }

  return resolveConflict(state, {
    path,
    left,
    right,
  });
}

function mergeThreeWay(
  base: unknown,
  left: unknown,
  right: unknown,
  path: string,
  state: MergeState,
): unknown {
  const leftEqualsBase = compare(left, base);
  const rightEqualsBase = compare(right, base);

  if (leftEqualsBase && rightEqualsBase) {
    return cloneValue(base);
  }

  if (leftEqualsBase && !rightEqualsBase) {
    return cloneValue(right);
  }

  if (!leftEqualsBase && rightEqualsBase) {
    return cloneValue(left);
  }

  if (compare(left, right)) {
    return cloneValue(left);
  }

  if (isPlainObject(base) && isPlainObject(left) && isPlainObject(right)) {
    const keys = new Set([...Object.keys(base), ...Object.keys(left), ...Object.keys(right)]);
    const result: Record<string, unknown> = {};

    for (const key of keys) {
      const childPath = joinSegment(path, key);
      const baseHas = Object.prototype.hasOwnProperty.call(base, key);
      const leftHas = Object.prototype.hasOwnProperty.call(left, key);
      const rightHas = Object.prototype.hasOwnProperty.call(right, key);

      const baseValue = baseHas ? base[key] : undefined;
      const leftValue = leftHas ? left[key] : undefined;
      const rightValue = rightHas ? right[key] : undefined;

      // Deleted on one side only
      if (baseHas && !leftHas && rightHas && compare(rightValue, baseValue)) {
        continue;
      }

      if (baseHas && leftHas && !rightHas && compare(leftValue, baseValue)) {
        continue;
      }

      if (baseHas && !leftHas && !rightHas) {
        continue;
      }

      if (!baseHas && leftHas && !rightHas) {
        result[key] = cloneValue(leftValue);
        continue;
      }

      if (!baseHas && !leftHas && rightHas) {
        result[key] = cloneValue(rightValue);
        continue;
      }

      result[key] = mergeThreeWay(baseValue, leftValue, rightValue, childPath, state);
    }

    return result;
  }

  return resolveConflict(state, {
    path,
    base,
    left,
    right,
  });
}

/**
 * Merge two snapshots (optionally three-way with `base`).
 *
 * Conflicts are returned in `conflicts` — never dropped silently.
 * Strategies: `latest-wins` (default), `manual` (keep left + list conflicts), `custom` (resolve fn).
 */
export function merge(left: unknown, right: unknown, options: MergeOptions = {}): MergeResult {
  const strategy = options.strategy ?? "latest-wins";

  if (strategy === "custom" && typeof options.resolve !== "function") {
    throw new InvalidOptionsError(
      'Merge strategy "custom" requires a resolve(conflict) function.',
      { details: { strategy: "custom" } },
    );
  }

  const state: MergeState = {
    strategy,
    resolve: options.resolve,
    conflicts: [],
  };

  const value =
    options.base !== undefined
      ? mergeThreeWay(options.base, left, right, "", state)
      : mergeTwoWay(left, right, "", state);

  const includeApplied = options.includeApplied !== false;

  return {
    value,
    conflicts: state.conflicts,
    ...(includeApplied ? { applied: diff(left, value) } : {}),
  };
}
