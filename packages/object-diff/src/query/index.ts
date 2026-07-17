import { pathMatches } from "../utils/path-filter.js";

import type { DiffMetadata, DiffRecord, DiffResult, DiffType } from "../types/index.js";

export type DiffPredicate = (record: DiffRecord) => boolean;

export type ExcludeSpec = readonly string[] | DiffPredicate;

export interface QuerySummary {
  readonly total: number;
  readonly added: number;
  readonly removed: number;
  readonly changed: number;
  readonly unchanged: number;
  readonly moved: number;
}

function recount(changes: readonly DiffRecord[], durationMs: number): DiffMetadata {
  let addedCount = 0;
  let removedCount = 0;
  let changedCount = 0;
  let unchangedCount = 0;
  let movedCount = 0;

  for (const change of changes) {
    switch (change.type) {
      case "added":
        addedCount += 1;
        break;
      case "removed":
        removedCount += 1;
        break;
      case "changed":
        changedCount += 1;
        break;
      case "unchanged":
        unchangedCount += 1;
        break;
      case "moved":
        movedCount += 1;
        break;
    }
  }

  return {
    durationMs,
    changeCount: changes.length,
    addedCount,
    removedCount,
    changedCount,
    unchangedCount,
    movedCount,
  };
}

function withChanges(result: DiffResult, changes: readonly DiffRecord[]): DiffResult {
  return {
    changes,
    metadata: recount(changes, result.metadata.durationMs),
  };
}

function matchesExcludedPath(path: string, pattern: string): boolean {
  if (pathMatches(path, pattern)) {
    return true;
  }

  // Non-glob patterns also exclude descendants (`password` → `password.hash`)
  if (!pattern.includes("*")) {
    return path.startsWith(`${pattern}.`) || path.startsWith(`${pattern}[`);
  }

  return false;
}

/**
 * First change matching `predicate`, or `undefined`.
 */
export function find(result: DiffResult, predicate: DiffPredicate): DiffRecord | undefined {
  return result.changes.find(predicate);
}

/**
 * DiffResult containing only changes matching `predicate`.
 */
export function filter(result: DiffResult, predicate: DiffPredicate): DiffResult {
  return withChanges(result, result.changes.filter(predicate));
}

/**
 * Drop changes by path glob patterns or predicate.
 */
export function exclude(result: DiffResult, spec: ExcludeSpec): DiffResult {
  if (typeof spec === "function") {
    return filter(result, (record) => !spec(record));
  }

  return filter(
    result,
    (record) => !spec.some((pattern) => matchesExcludedPath(record.path, pattern)),
  );
}

/**
 * Display paths for all changes in the result.
 */
export function paths(result: DiffResult): string[] {
  return result.changes.map((change) => change.path);
}

/**
 * Count breakdown by change type (from the current change set).
 */
export function summary(result: DiffResult): QuerySummary {
  const meta = recount(result.changes, result.metadata.durationMs);

  return {
    total: meta.changeCount,
    added: meta.addedCount,
    removed: meta.removedCount,
    changed: meta.changedCount,
    unchanged: meta.unchangedCount,
    moved: meta.movedCount,
  };
}

/**
 * Filter to a single DiffType.
 */
export function ofType(result: DiffResult, type: DiffType): DiffResult {
  return filter(result, (record) => record.type === type);
}

export interface DiffQuery {
  filter(predicate: DiffPredicate): DiffQuery;
  find(predicate: DiffPredicate): DiffRecord | undefined;
  exclude(spec: ExcludeSpec): DiffQuery;
  ofType(type: DiffType): DiffQuery;
  added(): DiffQuery;
  removed(): DiffQuery;
  /** Alias for `ofType("changed")`. */
  updated(): DiffQuery;
  changed(): DiffQuery;
  unchanged(): DiffQuery;
  moved(): DiffQuery;
  paths(): string[];
  summary(): QuerySummary;
  changes(): readonly DiffRecord[];
  result(): DiffResult;
}

class DiffQueryView implements DiffQuery {
  public constructor(private readonly current: DiffResult) {}

  public filter(predicate: DiffPredicate): DiffQuery {
    return new DiffQueryView(filter(this.current, predicate));
  }

  public find(predicate: DiffPredicate): DiffRecord | undefined {
    return find(this.current, predicate);
  }

  public exclude(spec: ExcludeSpec): DiffQuery {
    return new DiffQueryView(exclude(this.current, spec));
  }

  public ofType(type: DiffType): DiffQuery {
    return new DiffQueryView(ofType(this.current, type));
  }

  public added(): DiffQuery {
    return this.ofType("added");
  }

  public removed(): DiffQuery {
    return this.ofType("removed");
  }

  public updated(): DiffQuery {
    return this.ofType("changed");
  }

  public changed(): DiffQuery {
    return this.ofType("changed");
  }

  public unchanged(): DiffQuery {
    return this.ofType("unchanged");
  }

  public moved(): DiffQuery {
    return this.ofType("moved");
  }

  public paths(): string[] {
    return paths(this.current);
  }

  public summary(): QuerySummary {
    return summary(this.current);
  }

  public changes(): readonly DiffRecord[] {
    return this.current.changes;
  }

  public result(): DiffResult {
    return this.current;
  }
}

/**
 * Fluent query sugar over a DiffResult. Pure — does not mutate the input.
 */
export function query(result: DiffResult): DiffQuery {
  return new DiffQueryView(result);
}
