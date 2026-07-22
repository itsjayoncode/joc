import {
  explainDiff,
  formatExplainHuman,
  type DiffExplanation,
  type ExplainOptions,
} from "./explain.js";
import { patch as corePatch } from "../patch/index.js";
import {
  exclude,
  filter,
  find,
  ofType,
  paths,
  summary,
  type DiffPredicate,
  type DiffQuery,
  type ExcludeSpec,
  type QuerySummary,
} from "../query/index.js";
import { serialize } from "../serialize/index.js";
import { statistics } from "../stats/index.js";

import type { DiffStatistics, StatisticsOptions } from "../stats/index.js";
import type {
  DiffRecord,
  DiffResult,
  DiffType,
  Patch,
  PatchOptions,
  SerializeFormat,
  SerializeOptions,
} from "../types/index.js";

/**
 * Fluent DiffResult wrapper (ADR 0006).
 * Prefer this over attaching methods onto objects returned by `diff()`.
 */
export interface DiffView extends DiffQuery {
  filter(predicate: DiffPredicate): DiffView;
  exclude(spec: ExcludeSpec): DiffView;
  ofType(type: DiffType): DiffView;
  added(): DiffView;
  removed(): DiffView;
  updated(): DiffView;
  changed(): DiffView;
  unchanged(): DiffView;
  moved(): DiffView;
  serialize(format: SerializeFormat, options?: SerializeOptions): string;
  patch(options?: PatchOptions): Patch;
  statistics(patchOps?: Patch, options?: StatisticsOptions): DiffStatistics;
  /**
   * Explain each change for reviews / UIs.
   * Default: structured `DiffExplanation[]`. Pass `{ format: "human" }` for review text.
   */
  explain(options?: ExplainOptions): DiffExplanation[] | string;
}

class DiffResultView implements DiffView {
  public constructor(private readonly current: DiffResult) {}

  public filter(predicate: DiffPredicate): DiffView {
    return new DiffResultView(filter(this.current, predicate));
  }

  public find(predicate: DiffPredicate): DiffRecord | undefined {
    return find(this.current, predicate);
  }

  public exclude(spec: ExcludeSpec): DiffView {
    return new DiffResultView(exclude(this.current, spec));
  }

  public ofType(type: DiffType): DiffView {
    return new DiffResultView(ofType(this.current, type));
  }

  public added(): DiffView {
    return this.ofType("added");
  }

  public removed(): DiffView {
    return this.ofType("removed");
  }

  public updated(): DiffView {
    return this.ofType("changed");
  }

  public changed(): DiffView {
    return this.ofType("changed");
  }

  public unchanged(): DiffView {
    return this.ofType("unchanged");
  }

  public moved(): DiffView {
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

  public serialize(format: SerializeFormat, options?: SerializeOptions): string {
    return serialize(this.current, format, options);
  }

  public patch(options?: PatchOptions): Patch {
    return corePatch(this.current, options);
  }

  public statistics(patchOps?: Patch, options?: StatisticsOptions): DiffStatistics {
    return statistics(this.current, patchOps, options);
  }

  public explain(options?: ExplainOptions): DiffExplanation[] | string {
    if (options?.format === "human") {
      return formatExplainHuman(this.current, options);
    }

    return explainDiff(this.current, options);
  }
}

/**
 * Create a fluent view over a DiffResult without mutating it or the core `diff()` return type.
 *
 * Heavy engines (merge/plugins) stay on their own subpaths — this view only wires
 * query + serialize + patch + stats + explain for discoverability.
 */
export function createDiffView(result: DiffResult): DiffView {
  return new DiffResultView(result);
}

export type {
  DiffPredicate,
  DiffQuery,
  ExcludeSpec,
  QuerySummary,
  DiffStatistics,
  DiffExplanation,
  ExplainOptions,
};

export type { ExplainConfidence } from "./explain.js";
