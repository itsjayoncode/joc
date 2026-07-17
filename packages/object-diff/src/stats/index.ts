import type { DiffRecord, DiffResult, Patch } from "../types/index.js";

export interface HotPrefix {
  readonly prefix: string;
  readonly count: number;
}

/**
 * Rich metrics derived from a DiffResult (and optional Patch).
 */
export interface DiffStatistics {
  readonly totalChanges: number;
  /** Ratio of meaningful changes among all records in the result (0–1). */
  readonly changedRatio: number;
  readonly objectChangeCount: number;
  readonly arrayChangeCount: number;
  readonly deepestPath: string | null;
  readonly maxDepth: number;
  readonly moveCount: number;
  /** Byte length of JSON-serialized patch (provided or estimated from changes). */
  readonly estimatedPatchSize: number;
  readonly hotPrefixes: readonly HotPrefix[];
}

export interface StatisticsOptions {
  /** How many hot path prefixes to return. Default 5. */
  readonly hotPrefixLimit?: number;
}

function isArrayPath(path: string): boolean {
  return /\[\d+\]/.test(path);
}

/**
 * Depth of a display path (`user.name` → 2, `items[0].id` → 3).
 */
export function pathDepth(path: string): number {
  if (!path) {
    return 0;
  }

  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter((segment) => segment.length > 0).length;
}

function firstPrefix(path: string): string {
  if (!path) {
    return "";
  }

  const bracket = path.indexOf("[");
  const dot = path.indexOf(".");

  if (bracket === -1 && dot === -1) {
    return path;
  }

  if (bracket === -1) {
    return path.slice(0, dot);
  }

  if (dot === -1) {
    return path.slice(0, bracket);
  }

  return path.slice(0, Math.min(bracket, dot));
}

function isMeaningful(change: DiffRecord): boolean {
  return change.type !== "unchanged";
}

function estimatePatchFromChanges(changes: readonly DiffRecord[]): Patch {
  const ops: { op: "add" | "remove" | "replace"; path: string; value?: unknown }[] = [];

  for (const change of changes) {
    if (!isMeaningful(change)) {
      continue;
    }

    const jsonPath = `/${change.path.replace(/\./g, "/").replace(/\[(\d+)\]/g, "/$1")}`;

    if (change.type === "added") {
      ops.push({ op: "add", path: jsonPath, value: change.current });
    } else if (change.type === "removed") {
      ops.push({ op: "remove", path: jsonPath });
    } else if (change.type === "changed") {
      ops.push({ op: "replace", path: jsonPath, value: change.current });
    }
  }

  return ops;
}

function byteSize(value: unknown): number {
  try {
    return JSON.stringify(value).length;
  } catch {
    return 0;
  }
}

function computeHotPrefixes(changes: readonly DiffRecord[], limit: number): readonly HotPrefix[] {
  const counts = new Map<string, number>();

  for (const change of changes) {
    if (!isMeaningful(change)) {
      continue;
    }

    const prefix = firstPrefix(change.path);

    if (!prefix) {
      continue;
    }

    counts.set(prefix, (counts.get(prefix) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([prefix, count]) => ({ prefix, count }))
    .sort((a, b) => b.count - a.count || a.prefix.localeCompare(b.prefix))
    .slice(0, Math.max(0, limit));
}

/**
 * Compute richer statistics for a DiffResult.
 * Optional `patch` improves `estimatedPatchSize` accuracy.
 */
export function statistics(
  result: DiffResult,
  patch?: Patch,
  options: StatisticsOptions = {},
): DiffStatistics {
  const hotPrefixLimit = options.hotPrefixLimit ?? 5;
  const changes = result.changes;

  let meaningful = 0;
  let unchanged = 0;
  let objectChangeCount = 0;
  let arrayChangeCount = 0;
  let deepestPath: string | null = null;
  let maxDepth = 0;
  let moveCount = 0;

  for (const change of changes) {
    if (change.type === "unchanged") {
      unchanged += 1;
      continue;
    }

    meaningful += 1;

    if (change.type === "moved") {
      moveCount += 1;
    }

    if (isArrayPath(change.path)) {
      arrayChangeCount += 1;
    } else {
      objectChangeCount += 1;
    }

    const depth = pathDepth(change.path);

    if (depth > maxDepth) {
      maxDepth = depth;
      deepestPath = change.path;
    }
  }

  const total = meaningful + unchanged;
  const changedRatio = total === 0 ? 0 : meaningful / total;

  const estimatedPatchSize = patch ? byteSize(patch) : byteSize(estimatePatchFromChanges(changes));

  return {
    totalChanges: meaningful,
    changedRatio,
    objectChangeCount,
    arrayChangeCount,
    deepestPath,
    maxDepth,
    moveCount,
    estimatedPatchSize,
    hotPrefixes: computeHotPrefixes(changes, hotPrefixLimit),
  };
}
