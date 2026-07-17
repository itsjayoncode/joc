import type { MetricsSnapshot } from "../metrics/types.js";
import type { AttentionReport } from "../metrics/types.js";

export interface SessionSummaryReport {
  readonly generatedAt: number;
  readonly startedAt: number;
  readonly endedAt: number;
  readonly metrics: MetricsSnapshot;
  readonly attention: AttentionReport;
  readonly focusDuration: number;
  readonly hiddenDuration: number;
  readonly idleDuration: number;
  readonly offlineDuration: number;
  readonly activeDuration: number;
  readonly sleepDuration: number;
  readonly sessionDuration: number;
  readonly highlights: readonly string[];
  /** Optional Timeline entry ids when a timeline is provided. */
  readonly evidenceEventIds?: readonly string[];
}

export interface ReportsApi {
  /** Build a summary on demand (no per-event work). */
  sessionSummary(): SessionSummaryReport;
  /** Alias for `sessionSummary()` (ChatGPT `session.report()`). */
  report(): SessionSummaryReport;
  /**
   * No-op reserved for symmetry with other intelligence APIs.
   * Reports do not hold subscriptions.
   */
  dispose(): void;
}
