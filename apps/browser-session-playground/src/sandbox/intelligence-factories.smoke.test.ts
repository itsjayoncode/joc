import { afterEach, describe, expect, it } from "vitest";

import {
  createActivityApi,
  createBrowserLifecycle,
  createMetricsApi,
  createPresenceApi,
  createReportsApi,
  createTimelineApi,
} from "@jayoncode/browser-lifecycle";

/**
 * Smoke: opt-in factories attach and produce dashboard-ready views
 * (mirrors sandbox Timeline/Metrics/Activity/Presence/Reports wiring).
 */
describe("sandbox intelligence factories smoke", () => {
  const sessions: Array<ReturnType<typeof createBrowserLifecycle>> = [];

  afterEach(() => {
    for (const session of sessions.splice(0)) {
      session.dispose();
    }
  });

  it("builds activity, presence, timeline, metrics, and reports views", () => {
    const lifecycle = createBrowserLifecycle({
      autoStart: true,
      idleTimeout: 60_000,
      emitInitialState: true,
    });
    sessions.push(lifecycle);

    const activity = createActivityApi(lifecycle);
    const presence = createPresenceApi(lifecycle);
    const timeline = createTimelineApi(lifecycle, { maxEvents: 40 });
    const metrics = createMetricsApi(lifecycle);
    const reports = createReportsApi({ metrics, timeline });

    const activityState = activity.state();
    expect(["active", "idle", "unknown"]).toContain(activityState.status);

    const presenceState = presence.state();
    expect(["present", "away", "unknown"]).toContain(presenceState.status);
    expect(["ACTIVE", "AWAY", "UNKNOWN"]).toContain(presence.label());

    expect(Array.isArray(timeline.events())).toBe(true);

    const metricsSnap = metrics.snapshot();
    expect(typeof metricsSnap.attentionScore).toBe("number");
    expect(metricsSnap.sessionMs).toBeGreaterThanOrEqual(0);

    const summary = reports.sessionSummary();
    expect(summary.sessionDuration).toBeGreaterThanOrEqual(0);
    expect(typeof summary.attention.score).toBe("number");
    expect(Array.isArray(summary.highlights)).toBe(true);

    activity.dispose();
    presence.dispose();
    timeline.dispose();
    metrics.dispose();
    reports.dispose();
  });
});
