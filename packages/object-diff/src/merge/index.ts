import { compare } from "../compare/compare.js";
import { diff } from "../compare/difference/diff.js";
import { InvalidOptionsError } from "../errors/index.js";
import { resolveIdentity } from "../utils/identity.js";
import { cloneValue, isPlainObject } from "../utils/index.js";

import type { DiffResult, IdentityKey, Path } from "../types/index.js";

/**
 * Why a merge conflict was raised — stable vocabulary for UIs and `resolve()`.
 */
export type MergeConflictReason =
  /** Both sides present and disagree (two-way leaf, or three-way both edited). */
  | "both-changed"
  /** One side deleted while the other edited away from base. */
  | "delete-edit"
  /** Same identity added on both sides with different values (no base item). */
  | "both-added";

/**
 * A path where left and right (and optionally base) disagree.
 */
export interface MergeConflict {
  readonly path: string;
  readonly base?: unknown;
  readonly left: unknown;
  readonly right: unknown;
  /** Structured cause for rendering / custom resolvers. */
  readonly reason: MergeConflictReason;
  /** Present when the conflict is tied to an `identityKey` match. */
  readonly identity?: string | number;
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
  /**
   * Match array items by identity (same contract as `diff` `identityKey`).
   * When set, arrays merge element-wise by id instead of as atomic leaves.
   */
  readonly identityKey?: IdentityKey;
}

export interface MergeResult {
  readonly value: unknown;
  readonly conflicts: readonly MergeConflict[];
  readonly applied?: DiffResult;
}

interface MergeState {
  readonly strategy: MergeStrategy;
  readonly resolve: ((conflict: MergeConflict) => unknown) | undefined;
  readonly identityKey: IdentityKey | undefined;
  readonly conflicts: MergeConflict[];
}

interface IndexedItem {
  readonly index: number;
  readonly value: unknown;
}

function joinSegment(path: string, segment: string | number): string {
  if (path === "") {
    return typeof segment === "number" ? `[${String(segment)}]` : segment;
  }

  return typeof segment === "number" ? `${path}[${String(segment)}]` : `${path}.${segment}`;
}

function pathSegments(path: string): Path {
  if (path === "") {
    return [];
  }

  const segments: Array<string | number> = [];
  const re = /([^.[\]]+)|\[(\d+)\]/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(path)) !== null) {
    if (match[1] !== undefined) {
      segments.push(match[1]);
    } else if (match[2] !== undefined) {
      segments.push(Number(match[2]));
    }
  }

  return segments;
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

function conflict(
  path: string,
  reason: MergeConflictReason,
  left: unknown,
  right: unknown,
  base?: unknown,
  identity?: string | number,
): MergeConflict {
  return {
    path,
    reason,
    left,
    right,
    ...(base !== undefined ? { base } : {}),
    ...(identity !== undefined ? { identity } : {}),
  };
}

function indexByIdentity(
  items: readonly unknown[],
  path: string,
  identityKey: IdentityKey,
): {
  byId: Map<string | number, IndexedItem>;
  noId: IndexedItem[];
} {
  const byId = new Map<string | number, IndexedItem>();
  const noId: IndexedItem[] = [];
  const basePath = pathSegments(path);

  for (let index = 0; index < items.length; index += 1) {
    const value = items[index];
    const id = resolveIdentity(value, [...basePath, index], identityKey);

    if (id === undefined) {
      noId.push({ index, value });
      continue;
    }

    if (byId.has(id)) {
      throw new InvalidOptionsError(
        `Duplicate identity key "${String(id)}" in array at path "${path === "" ? "(root)" : path}".`,
        { details: { path: path === "" ? "(root)" : path, id } },
      );
    }

    byId.set(id, { index, value });
  }

  return { byId, noId };
}

function mergeNoIdTwoWay(
  leftItems: readonly IndexedItem[],
  rightItems: readonly IndexedItem[],
  path: string,
  state: MergeState,
): unknown[] {
  const result: unknown[] = [];
  const max = Math.max(leftItems.length, rightItems.length);

  for (let i = 0; i < max; i += 1) {
    const left = leftItems[i];
    const right = rightItems[i];
    const childPath = joinSegment(path, right?.index ?? left?.index ?? i);

    if (left && !right) {
      result.push(cloneValue(left.value));
      continue;
    }

    if (!left && right) {
      result.push(cloneValue(right.value));
      continue;
    }

    if (left && right) {
      result.push(mergeTwoWay(left.value, right.value, childPath, state));
    }
  }

  return result;
}

function mergeNoIdThreeWay(
  baseItems: readonly IndexedItem[],
  leftItems: readonly IndexedItem[],
  rightItems: readonly IndexedItem[],
  path: string,
  state: MergeState,
): unknown[] {
  const result: unknown[] = [];
  const max = Math.max(baseItems.length, leftItems.length, rightItems.length);

  for (let i = 0; i < max; i += 1) {
    const base = baseItems[i];
    const left = leftItems[i];
    const right = rightItems[i];
    const childPath = joinSegment(path, right?.index ?? left?.index ?? base?.index ?? i);

    result.push(mergeThreeWay(base?.value, left?.value, right?.value, childPath, state));
  }

  return result.filter((entry) => entry !== undefined);
}

function mergeArraysTwoWay(
  left: unknown[],
  right: unknown[],
  path: string,
  state: MergeState,
): unknown[] {
  const identityKey = state.identityKey;
  if (!identityKey) {
    return resolveConflict(state, conflict(path, "both-changed", left, right)) as unknown[];
  }

  const leftIndexed = indexByIdentity(left, path, identityKey);
  const rightIndexed = indexByIdentity(right, path, identityKey);
  const result: unknown[] = [];
  const seen = new Set<string | number>();

  for (const [id, rightItem] of rightIndexed.byId) {
    seen.add(id);
    const leftItem = leftIndexed.byId.get(id);
    const childPath = joinSegment(path, rightItem.index);

    if (!leftItem) {
      result.push(cloneValue(rightItem.value));
      continue;
    }

    result.push(mergeTwoWay(leftItem.value, rightItem.value, childPath, state, id));
  }

  for (const [id, leftItem] of leftIndexed.byId) {
    if (seen.has(id)) {
      continue;
    }
    result.push(cloneValue(leftItem.value));
  }

  result.push(...mergeNoIdTwoWay(leftIndexed.noId, rightIndexed.noId, path, state));
  return result;
}

function takeOrOmit(resolved: unknown): unknown {
  if (resolved === undefined) {
    return OMIT;
  }
  return resolved;
}

const OMIT = Symbol("merge.omit");

function mergeIdentityThreeWayItem(
  id: string | number,
  baseItem: IndexedItem | undefined,
  leftItem: IndexedItem | undefined,
  rightItem: IndexedItem | undefined,
  path: string,
  state: MergeState,
): unknown {
  const hasB = baseItem !== undefined;
  const hasL = leftItem !== undefined;
  const hasR = rightItem !== undefined;
  const childPath = joinSegment(path, rightItem?.index ?? leftItem?.index ?? baseItem?.index ?? 0);

  if (hasB && !hasL && !hasR) {
    return OMIT;
  }

  if (hasB && !hasL && hasR) {
    if (compare(rightItem.value, baseItem.value)) {
      return OMIT;
    }

    const resolved = resolveConflict(
      state,
      conflict(childPath, "delete-edit", undefined, rightItem.value, baseItem.value, id),
    );
    return takeOrOmit(resolved);
  }

  if (hasB && hasL && !hasR) {
    if (compare(leftItem.value, baseItem.value)) {
      return OMIT;
    }

    const resolved = resolveConflict(
      state,
      conflict(childPath, "delete-edit", leftItem.value, undefined, baseItem.value, id),
    );
    return takeOrOmit(resolved);
  }

  if (hasB && hasL && hasR) {
    return mergeThreeWay(baseItem.value, leftItem.value, rightItem.value, childPath, state, id);
  }

  if (!hasB && hasL && !hasR) {
    return cloneValue(leftItem.value);
  }

  if (!hasB && !hasL && hasR) {
    return cloneValue(rightItem.value);
  }

  if (!hasB && hasL && hasR) {
    if (compare(leftItem.value, rightItem.value)) {
      return cloneValue(leftItem.value);
    }

    if (isPlainObject(leftItem.value) && isPlainObject(rightItem.value)) {
      return mergeTwoWay(leftItem.value, rightItem.value, childPath, state, id);
    }

    const resolved = resolveConflict(
      state,
      conflict(childPath, "both-added", leftItem.value, rightItem.value, undefined, id),
    );
    return takeOrOmit(resolved);
  }

  return OMIT;
}

function mergeArraysThreeWay(
  base: unknown[],
  left: unknown[],
  right: unknown[],
  path: string,
  state: MergeState,
): unknown[] {
  const identityKey = state.identityKey;
  if (!identityKey) {
    return resolveConflict(state, conflict(path, "both-changed", left, right, base)) as unknown[];
  }

  const baseIndexed = indexByIdentity(base, path, identityKey);
  const leftIndexed = indexByIdentity(left, path, identityKey);
  const rightIndexed = indexByIdentity(right, path, identityKey);
  const result: unknown[] = [];
  const seen = new Set<string | number>();

  for (const [id, rightItem] of rightIndexed.byId) {
    seen.add(id);
    const merged = mergeIdentityThreeWayItem(
      id,
      baseIndexed.byId.get(id),
      leftIndexed.byId.get(id),
      rightItem,
      path,
      state,
    );
    if (merged !== OMIT) {
      result.push(merged);
    }
  }

  for (const [id, leftItem] of leftIndexed.byId) {
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);
    const merged = mergeIdentityThreeWayItem(
      id,
      baseIndexed.byId.get(id),
      leftItem,
      rightIndexed.byId.get(id),
      path,
      state,
    );
    if (merged !== OMIT) {
      result.push(merged);
    }
  }

  for (const [id, baseItem] of baseIndexed.byId) {
    if (seen.has(id)) {
      continue;
    }
    const merged = mergeIdentityThreeWayItem(
      id,
      baseItem,
      leftIndexed.byId.get(id),
      rightIndexed.byId.get(id),
      path,
      state,
    );
    if (merged !== OMIT) {
      result.push(merged);
    }
  }

  result.push(
    ...mergeNoIdThreeWay(baseIndexed.noId, leftIndexed.noId, rightIndexed.noId, path, state),
  );

  return result;
}

function mergeTwoWay(
  left: unknown,
  right: unknown,
  path: string,
  state: MergeState,
  identity?: string | number,
): unknown {
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

      result[key] = mergeTwoWay(left[key], right[key], childPath, state, identity);
    }

    return result;
  }

  if (Array.isArray(left) && Array.isArray(right) && state.identityKey) {
    return mergeArraysTwoWay(left, right, path, state);
  }

  return resolveConflict(state, conflict(path, "both-changed", left, right, undefined, identity));
}

function mergeThreeWay(
  base: unknown,
  left: unknown,
  right: unknown,
  path: string,
  state: MergeState,
  identity?: string | number,
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

      result[key] = mergeThreeWay(baseValue, leftValue, rightValue, childPath, state, identity);
    }

    return result;
  }

  if (Array.isArray(base) && Array.isArray(left) && Array.isArray(right) && state.identityKey) {
    return mergeArraysThreeWay(base, left, right, path, state);
  }

  return resolveConflict(state, conflict(path, "both-changed", left, right, base, identity));
}

/**
 * Merge two snapshots (optionally three-way with `base`).
 *
 * Conflicts are returned in `conflicts` — never dropped silently.
 * Strategies: `latest-wins` (default), `manual` (keep left + list conflicts), `custom` (resolve fn).
 * Pass `identityKey` to merge arrays by item identity (same option as `diff`).
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
    identityKey: options.identityKey,
    conflicts: [],
  };

  const value =
    options.base !== undefined
      ? mergeThreeWay(options.base, left, right, "", state)
      : mergeTwoWay(left, right, "", state);

  const includeApplied = options.includeApplied !== false;
  const diffOptions = options.identityKey ? { identityKey: options.identityKey } : undefined;

  return {
    value,
    conflicts: state.conflicts,
    ...(includeApplied ? { applied: diff(left, value, diffOptions) } : {}),
  };
}
