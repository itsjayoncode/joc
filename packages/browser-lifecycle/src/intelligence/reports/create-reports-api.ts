import { buildMetricHighlights } from "./build-highlights.js";

import type { ReportsApi, SessionSummaryReport } from "./types.js";
import type { MetricsApi } from "../metrics/types.js";
import type { TimelineApi } from "../timeline/types.js";

export interface CreateReportsApiOptions {
  /** Required metrics source. */
  readonly metrics: Pick<MetricsApi, "snapshot" | "attention">;
  /** Optional timeline for evidence event ids. */
  readonly timeline?: Pick<TimelineApi, "events">;
  /** Max timeline ids to cite. Default 10. */
  readonly evidenceLimit?: number;
  readonly timeProvider?: () => number;
}

/**
 * Creates an on-demand Reports facade.
 *
 * - Consumes Metrics (required).
 * - May cite Timeline ids (optional).
 * - Never talks to browser APIs.
 * - No subscriptions — generation happens only when `sessionSummary()` / `report()` is called.
 */
export function createReportsApi(options: CreateReportsApiOptions): ReportsApi {
  const timeProvider = options.timeProvider ?? Date.now;
  const evidenceLimit =
    options.evidenceLimit === undefined ? 10 : Math.max(0, Math.floor(options.evidenceLimit));

  const build = (): SessionSummaryReport => {
    const metrics = options.metrics.snapshot();
    const attention = options.metrics.attention();
    const highlights = buildMetricHighlights(metrics);
    const endedAt = timeProvider();
    const startedAt = endedAt - metrics.sessionMs;

    const timelineEvents = options.timeline?.events();
    const evidenceEventIds =
      timelineEvents === undefined || evidenceLimit === 0
        ? undefined
        : timelineEvents.slice(-evidenceLimit).map((entry) => entry.id);

    return {
      activeDuration: metrics.activeMs,
      attention,
      endedAt,
      focusDuration: metrics.focusedMs,
      generatedAt: endedAt,
      hiddenDuration: metrics.hiddenMs,
      highlights,
      idleDuration: metrics.idleMs,
      metrics: { ...metrics },
      offlineDuration: metrics.offlineMs,
      sessionDuration: metrics.sessionMs,
      sleepDuration: metrics.sleepMs,
      startedAt,
      ...(evidenceEventIds === undefined || evidenceEventIds.length === 0
        ? {}
        : { evidenceEventIds }),
    };
  };

  return {
    dispose(): void {
      // No subscriptions to release.
    },
    report(): SessionSummaryReport {
      return build();
    },
    sessionSummary(): SessionSummaryReport {
      return build();
    },
  };
}
