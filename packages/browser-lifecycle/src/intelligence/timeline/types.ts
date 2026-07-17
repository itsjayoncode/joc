import type {
  BrowserLifecycleEventName,
  BrowserLifecycleSnapshot,
} from "../../core/session/types.js";

export interface TimelineEntry {
  readonly id: string;
  readonly type: BrowserLifecycleEventName;
  readonly timestamp: number;
  /** Slim subset of snapshot at emission time (omitted when includeSnapshot is false). */
  readonly snapshot?: Readonly<Partial<BrowserLifecycleSnapshot>>;
}

export interface TimelineApi {
  /** Oldest → newest copy of retained entries. */
  events(): readonly TimelineEntry[];
  /** Alias for `events()` (ChatGPT event timeline / `session.record()`). */
  record(): readonly TimelineEntry[];
  /**
   * Human-readable lines for debugging / audit logs.
   * Example: `10:05:42 page:hidden`
   */
  format(options?: FormatTimelineOptions): readonly string[];
  clear(): void;
  size(): number;
  /** Maximum retained entries. */
  maxEvents(): number;
  /**
   * Stop recording and release the buffer.
   * Does not dispose the underlying session.
   */
  dispose(): void;
}

export interface FormatTimelineOptions {
  /** Defaults to locale time string from each entry timestamp. */
  readonly timeZone?: string;
  readonly locale?: string;
}

/** Slim fields kept on each entry when snapshot capture is enabled. */
export type TimelineSnapshotFields = Pick<
  BrowserLifecycleSnapshot,
  | "activity"
  | "attention"
  | "connectivity"
  | "lifecycle"
  | "phase"
  | "tab"
  | "visibility"
>;
