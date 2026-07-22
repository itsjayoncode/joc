import { compareValues } from "../comparison/compare-values.js";

import type { DiffRecord, ResolvedCompareOptions } from "../../types/index.js";

export interface ArrayIndexPair {
  readonly aIndex: number;
  readonly bIndex: number;
}

/**
 * Longest common subsequence of equal elements (by `equals`).
 * Returns index pairs (ai → bi) in increasing order on both sides.
 */
export function longestCommonSubsequencePairs(
  a: readonly unknown[],
  b: readonly unknown[],
  equals: (left: unknown, right: unknown) => boolean,
): ArrayIndexPair[] {
  const n = a.length;
  const m = b.length;
  if (n === 0 || m === 0) {
    return [];
  }

  // DP table of lengths; recover pairs via backtrack
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: m + 1 }, () => 0),
  );

  for (let i = 1; i <= n; i += 1) {
    const left = a[i - 1];
    const row = dp[i];
    const prevRow = dp[i - 1];
    if (!row || !prevRow) {
      continue;
    }
    for (let j = 1; j <= m; j += 1) {
      const right = b[j - 1];
      if (equals(left, right)) {
        row[j] = (prevRow[j - 1] ?? 0) + 1;
      } else {
        row[j] = Math.max(prevRow[j] ?? 0, row[j - 1] ?? 0);
      }
    }
  }

  const pairs: ArrayIndexPair[] = [];
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    const left = a[i - 1];
    const right = b[j - 1];
    if (equals(left, right) && (dp[i]?.[j] ?? 0) === (dp[i - 1]?.[j - 1] ?? 0) + 1) {
      pairs.push({ aIndex: i - 1, bIndex: j - 1 });
      i -= 1;
      j -= 1;
      continue;
    }

    if ((dp[i - 1]?.[j] ?? 0) >= (dp[i]?.[j - 1] ?? 0)) {
      i -= 1;
    } else {
      j -= 1;
    }
  }

  pairs.reverse();
  return pairs;
}

/**
 * Match remaining equal elements (not already paired) as candidate moves.
 * Greedy left-to-right on `b` for unused `a` indices.
 */
export function pairRemainingEquals(
  a: readonly unknown[],
  b: readonly unknown[],
  alreadyPairedA: ReadonlySet<number>,
  alreadyPairedB: ReadonlySet<number>,
  equals: (left: unknown, right: unknown) => boolean,
): ArrayIndexPair[] {
  const usedA = new Set(alreadyPairedA);
  const usedB = new Set(alreadyPairedB);
  const pairs: ArrayIndexPair[] = [];

  for (let bIndex = 0; bIndex < b.length; bIndex += 1) {
    if (usedB.has(bIndex)) {
      continue;
    }
    for (let aIndex = 0; aIndex < a.length; aIndex += 1) {
      if (usedA.has(aIndex)) {
        continue;
      }
      if (!equals(a[aIndex], b[bIndex])) {
        continue;
      }
      usedA.add(aIndex);
      usedB.add(bIndex);
      pairs.push({ aIndex, bIndex });
      break;
    }
  }

  return pairs;
}

/**
 * Pair removed+added changes with equal values into `moved` records.
 * Used for object-key reshapes; array reorders are handled during traversal when `detectMoves` is on.
 * Prefer LCS pairing when many candidates share equal values.
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

  const equals = (left: unknown, right: unknown) => compareValues(left, right, compareOptions);

  // LCS over removed/added sequences improves pairing vs pure greedy when order matters
  const removedValues = removed.map((entry) => entry.previous);
  const addedValues = added.map((entry) => entry.current);
  const lcs = longestCommonSubsequencePairs(removedValues, addedValues, equals);
  const usedRemoved = new Set(lcs.map((pair) => pair.aIndex));
  const usedAdded = new Set(lcs.map((pair) => pair.bIndex));

  const moves: DiffRecord[] = [];

  for (const pair of lcs) {
    const rem = removed[pair.aIndex];
    const add = added[pair.bIndex];
    if (!rem || !add || rem.path === add.path) {
      continue;
    }
    moves.push({
      type: "moved",
      path: add.path,
      from: rem.path,
      previous: rem.previous,
      current: add.current,
    });
  }

  const remaining = pairRemainingEquals(removedValues, addedValues, usedRemoved, usedAdded, equals);

  for (const pair of remaining) {
    const rem = removed[pair.aIndex];
    const add = added[pair.bIndex];
    if (!rem || !add || rem.path === add.path) {
      continue;
    }
    usedRemoved.add(pair.aIndex);
    usedAdded.add(pair.bIndex);
    moves.push({
      type: "moved",
      path: add.path,
      from: rem.path,
      previous: rem.previous,
      current: add.current,
    });
  }

  const leftoverRemoved = removed.filter((_, index) => !usedRemoved.has(index));
  const leftoverAdded = added.filter((_, index) => !usedAdded.has(index));

  return [...rest, ...moves, ...leftoverRemoved, ...leftoverAdded];
}
