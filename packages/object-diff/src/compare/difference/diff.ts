import { coalesceMoves } from "./detect-moves.js";
import { normalizeDiffOptions, normalizeCompareOptions } from "../../core/options.js";
import { joinPath } from "../../utils/index.js";
import { isChangePathAllowed, shouldVisitPath } from "../../utils/path-filter.js";
import { compareValues } from "../comparison/compare-values.js";
import { walkPair } from "../traversal/walk-pair.js";

import type { DiffOptions, DiffRecord, DiffResult, DiffType, Path } from "../../types/index.js";

interface CollectState {
  readonly changes: DiffRecord[];
  readonly includeUnchanged: boolean;
  readonly treatUndefinedAsMissing: boolean;
  readonly ignore: readonly string[] | undefined;
  readonly include: readonly string[] | undefined;
  readonly compareOptions: ReturnType<typeof normalizeCompareOptions>;
  addedCount: number;
  removedCount: number;
  changedCount: number;
  unchangedCount: number;
  movedCount: number;
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
  from?: string,
): void {
  const displayPath = joinPath(path);

  if (type !== "unchanged" && !isChangePathAllowed(displayPath, state.ignore, state.include)) {
    return;
  }

  if (type === "unchanged" && !state.includeUnchanged) {
    state.unchangedCount += 1;
    return;
  }

  state.changes.push({
    path: displayPath,
    type,
    ...(previous !== undefined ? { previous } : {}),
    ...(current !== undefined ? { current } : {}),
    ...(from !== undefined ? { from } : {}),
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
    case "moved":
      state.movedCount += 1;
      break;
    default:
      break;
  }
}

function walkOptionsFrom(
  options: ReturnType<typeof normalizeDiffOptions>,
  compareOptions: ReturnType<typeof normalizeCompareOptions>,
  onMove?: (from: Path, to: Path, previous: unknown, current: unknown) => boolean | undefined,
) {
  return {
    ...(options.identityKey ? { identityKey: options.identityKey } : {}),
    shouldVisit: (path: Path) => shouldVisitPath(path, options.ignore, options.include),
    detectMoves: options.detectMoves,
    compareOptions,
    ...(onMove ? { onMove } : {}),
  };
}

function collectDiff(
  a: unknown,
  b: unknown,
  options: ReturnType<typeof normalizeDiffOptions>,
): DiffResult {
  const started = performance.now();
  const compareOptions = normalizeCompareOptions({
    maxDepth: options.maxDepth,
    circular: options.circular,
    ...(options.customComparator ? { customComparator: options.customComparator } : {}),
  });
  const state: CollectState = {
    changes: [],
    includeUnchanged: options.includeUnchanged,
    treatUndefinedAsMissing: options.treatUndefinedAsMissing,
    ignore: options.ignore,
    include: options.include,
    compareOptions,
    addedCount: 0,
    removedCount: 0,
    changedCount: 0,
    unchangedCount: 0,
    movedCount: 0,
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

      // Walker only surfaces containers here when children were skipped (e.g. ignore `prefix.**`).
      pushChange(state, context.path, "changed", left, right);
      return undefined;
    },
    options.maxDepth,
    options.circular,
    walkOptionsFrom(options, compareOptions, (from, to, previous, current) => {
      pushChange(state, to, "moved", previous, current, joinPath(from));
      return undefined;
    }),
  );

  if (
    state.changes.length === 0 &&
    !(options.ignore && options.ignore.length > 0) &&
    !(options.include && options.include.length > 0)
  ) {
    pushChange(state, [], "changed", a, b);
  }

  if (options.detectMoves) {
    const coalesced = coalesceMoves(state.changes, state.compareOptions);
    state.changes.length = 0;
    state.addedCount = 0;
    state.removedCount = 0;
    state.changedCount = 0;
    state.unchangedCount = 0;
    state.movedCount = 0;

    for (const change of coalesced) {
      state.changes.push(change);
      switch (change.type) {
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
        case "moved":
          state.movedCount += 1;
          break;
        default:
          break;
      }
    }
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
      movedCount: state.movedCount,
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
 * Early-exits on the first allowed change; does not allocate a DiffResult.
 */
export function hasChanges(a: unknown, b: unknown, options?: DiffOptions): boolean {
  const resolved = normalizeDiffOptions(options);

  const compareOptions = normalizeCompareOptions({
    maxDepth: resolved.maxDepth,
    circular: resolved.circular,
    ...(resolved.customComparator ? { customComparator: resolved.customComparator } : {}),
  });

  if (
    !resolved.ignore?.length &&
    !resolved.include?.length &&
    !resolved.identityKey &&
    !resolved.detectMoves
  ) {
    return !compareValues(a, b, compareOptions);
  }

  let found = false;

  walkPair(
    a,
    b,
    (left, right, _key, context) => {
      if (resolved.customComparator) {
        const custom = resolved.customComparator(left, right, context.path);

        if (custom !== undefined) {
          if (!custom) {
            found = true;
            return true;
          }

          return undefined;
        }
      }

      if (!compareValues(left, right, compareOptions)) {
        if (isChangePathAllowed(joinPath(context.path), resolved.ignore, resolved.include)) {
          found = true;
          return true;
        }
      }

      return undefined;
    },
    resolved.maxDepth,
    resolved.circular,
    walkOptionsFrom(resolved, compareOptions, () => {
      found = true;
      return true;
    }),
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
