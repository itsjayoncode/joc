import { compareValues } from "../comparison/compare-values.js";

import type { DiffRecord, ResolvedCompareOptions } from "../../types/index.js";

/**
 * Pair removed+added changes with equal values into `moved` records.
 * Greedy: first unused removed match wins for each added.
 */
export function coalesceMoves(
  changes: readonly DiffRecord[],
  compareOptions: ResolvedCompareOptions,
): DiffRecord[] {
  const removed: DiffRecord[] = [];
  const added: DiffRecord[] = [];
  const rest: DiffRecord[] = [];

  for (const change of changes) {
    if (change.type === "removed") {
      removed.push(change);
    } else if (change.type === "added") {
      added.push(change);
    } else {
      rest.push(change);
    }
  }

  if (removed.length === 0 || added.length === 0) {
    return [...changes];
  }

  const usedRemoved = new Set<number>();
  const usedAdded = new Set<number>();
  const moves: DiffRecord[] = [];

  for (let addedIndex = 0; addedIndex < added.length; addedIndex += 1) {
    const add = added[addedIndex];
    if (!add) {
      continue;
    }

    for (let removedIndex = 0; removedIndex < removed.length; removedIndex += 1) {
      if (usedRemoved.has(removedIndex)) {
        continue;
      }

      const rem = removed[removedIndex];
      if (!rem) {
        continue;
      }

      if (!compareValues(rem.previous, add.current, compareOptions)) {
        continue;
      }

      // Avoid treating identical path as a move
      if (rem.path === add.path) {
        continue;
      }

      usedRemoved.add(removedIndex);
      usedAdded.add(addedIndex);
      moves.push({
        type: "moved",
        path: add.path,
        from: rem.path,
        previous: rem.previous,
        current: add.current,
      });
      break;
    }
  }

  const leftoverRemoved = removed.filter((_, index) => !usedRemoved.has(index));
  const leftoverAdded = added.filter((_, index) => !usedAdded.has(index));

  return [...rest, ...moves, ...leftoverRemoved, ...leftoverAdded];
}
