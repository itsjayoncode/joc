import { normalizeDiffOptions, normalizeCompareOptions } from "../../core/options.js";
import { joinPath } from "../../utils/index.js";
import { compareValues } from "../comparison/compare-values.js";
import { walkPair } from "../traversal/walk-pair.js";

import type { DiffOptions, DiffRecord, DiffResult, DiffType } from "../../types/index.js";

interface CollectState {
  readonly changes: DiffRecord[];
  readonly includeUnchanged: boolean;
  readonly treatUndefinedAsMissing: boolean;
  readonly compareOptions: ReturnType<typeof normalizeCompareOptions>;
  addedCount: number;
  removedCount: number;
  changedCount: number;
  unchangedCount: number;
}

function isMissing(value: unknown, treatUndefinedAsMissing: boolean): boolean {
  return treatUndefinedAsMissing && value === undefined;
}

function pushChange(
  state: CollectState,
  path: readonly (string | number)[],
  type: DiffType,
  previous?: unknown,
  current?: unknown,
): void {
  if (type === "unchanged" && !state.includeUnchanged) {
    state.unchangedCount += 1;
    return;
  }

  state.changes.push({
    path: joinPath(path),
    type,
    ...(previous !== undefined ? { previous } : {}),
    ...(current !== undefined ? { current } : {}),
  });

  switch (type) {
    case "added":
      state.addedCount += 1;
      break;
    case "removed":
      state.removedCount += 1;
      break;
    case "changed":
      state.changedCount += 1;
      break;
    case "unchanged":
      state.unchangedCount += 1;
      break;
    default:
      break;
  }
}

function isLeafChange(a: unknown, b: unknown): boolean {
  if (typeof a !== typeof b) {
    return true;
  }

  if (a === null || b === null) {
    return a !== b;
  }

  if (typeof a !== "object") {
    return true;
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return true;
  }

  return false;
}

function collectDiff(
  a: unknown,
  b: unknown,
  options: ReturnType<typeof normalizeDiffOptions>,
): DiffResult {
  const started = performance.now();
  const state: CollectState = {
    changes: [],
    includeUnchanged: options.includeUnchanged,
    treatUndefinedAsMissing: options.treatUndefinedAsMissing,
    compareOptions: normalizeCompareOptions({
      maxDepth: options.maxDepth,
      circular: options.circular,
      ...(options.customComparator ? { customComparator: options.customComparator } : {}),
    }),
    addedCount: 0,
    removedCount: 0,
    changedCount: 0,
    unchangedCount: 0,
  };

  if (compareValues(a, b, state.compareOptions)) {
    if (options.includeUnchanged) {
      pushChange(state, [], "unchanged", a, b);
    }

    return buildResult(state, started);
  }

  walkPair(
    a,
    b,
    (left, right, _key, context) => {
      const leftMissing = left === undefined && right !== undefined && context.path.length > 0;
      const rightMissing = right === undefined && left !== undefined && context.path.length > 0;

      if (leftMissing && !rightMissing) {
        pushChange(state, context.path, "added", undefined, right);
        return undefined;
      }

      if (!leftMissing && rightMissing) {
        pushChange(state, context.path, "removed", left, undefined);
        return undefined;
      }

      if (
        isMissing(left, state.treatUndefinedAsMissing) &&
        !isMissing(right, state.treatUndefinedAsMissing)
      ) {
        pushChange(state, context.path, "added", undefined, right);
        return undefined;
      }

      if (
        !isMissing(left, state.treatUndefinedAsMissing) &&
        isMissing(right, state.treatUndefinedAsMissing)
      ) {
        pushChange(state, context.path, "removed", left, undefined);
        return undefined;
      }

      if (compareValues(left, right, state.compareOptions)) {
        if (state.includeUnchanged) {
          pushChange(state, context.path, "unchanged", left, right);
        } else {
          state.unchangedCount += 1;
        }

        return undefined;
      }

      if (isLeafChange(left, right)) {
        pushChange(state, context.path, "changed", left, right);
        return undefined;
      }

      return undefined;
    },
    options.maxDepth,
    options.circular,
  );

  if (state.changes.length === 0) {
    pushChange(state, [], "changed", a, b);
  }

  return buildResult(state, started);
}

function buildResult(state: CollectState, started: number): DiffResult {
  const filtered = state.includeUnchanged
    ? state.changes
    : state.changes.filter((change) => change.type !== "unchanged");

  return {
    changes: filtered,
    metadata: {
      durationMs: performance.now() - started,
      changeCount: filtered.length,
      addedCount: state.addedCount,
      removedCount: state.removedCount,
      changedCount: state.changedCount,
      unchangedCount: state.unchangedCount,
    },
  };
}

/**
 * Compare two values and return structured change records.
 */
export function diff(a: unknown, b: unknown, options?: DiffOptions): DiffResult {
  return collectDiff(a, b, normalizeDiffOptions(options));
}

/**
 * Fast boolean check for whether two values differ.
 */
export function hasChanges(a: unknown, b: unknown, options?: DiffOptions): boolean {
  const resolved = normalizeDiffOptions(options);
  const compareOptions = normalizeCompareOptions({
    maxDepth: resolved.maxDepth,
    circular: resolved.circular,
    ...(resolved.customComparator ? { customComparator: resolved.customComparator } : {}),
  });

  if (compareValues(a, b, compareOptions)) {
    return false;
  }

  let found = false;

  walkPair(
    a,
    b,
    (left, right) => {
      if (!compareValues(left, right, compareOptions)) {
        found = true;
        return true;
      }

      return undefined;
    },
    resolved.maxDepth,
    resolved.circular,
  );

  return found;
}

function filterByType(a: unknown, b: unknown, type: DiffType, options?: DiffOptions): DiffRecord[] {
  return diff(a, b, options).changes.filter((change) => change.type === type);
}

export function added(a: unknown, b: unknown, options?: DiffOptions): DiffRecord[] {
  return filterByType(a, b, "added", options);
}

export function removed(a: unknown, b: unknown, options?: DiffOptions): DiffRecord[] {
  return filterByType(a, b, "removed", options);
}

export function updated(a: unknown, b: unknown, options?: DiffOptions): DiffRecord[] {
  return filterByType(a, b, "changed", options);
}

export function unchanged(a: unknown, b: unknown, options?: DiffOptions): DiffRecord[] {
  return diff(a, b, { ...options, includeUnchanged: true }).changes.filter(
    (change) => change.type === "unchanged",
  );
}
