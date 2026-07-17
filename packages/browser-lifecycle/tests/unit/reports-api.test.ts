import { describe, expect, it } from "vitest";

import {
  buildMetricHighlights,
  createMetricsApi,
  createReportsApi,
  createTimelineApi,
  emptyMetricsSnapshot,
} from "@jayoncode/browser-lifecycle";

describe("buildMetricHighlights", () => {
  it("returns a neutral message when metrics are empty", () => {
    expect(buildMetricHighlights(emptyMetricsSnapshot())).toEqual([
      "No notable lifecycle activity recorded yet.",
    ]);
  });

  it("summarizes non-zero metrics", () => {
    expect(
      buildMetricHighlights({
        ...emptyMetricsSnapshot(),
        attentionScore: 80,
        focusCount: 2,
        focusedMs: 5_000,
        hiddenCount: 2,
        idleCount: 1,
        idleMs: 1_500,
        reconnectCount: 3,
        sessionMs: 60_000,
        visibleMs: 12_000,
      }),
    ).toEqual([
      "Session 1.0m",
      "Attention 80%",
      "Hidden 2 time(s)",
      "Visible for 12.0s",
      "Focused for 5.0s",
      "Idle 1 time(s) (1.5s total)",
      "Reconnected 3 time(s)",
      "Focus changes 2",
    ]);
  });
});

describe("createReportsApi", () => {
  it("builds an on-demand summary from metrics only", () => {
    const metricsSnapshot = {
      ...emptyMetricsSnapshot(),
      hiddenCount: 1,
      sessionMs: 1_000,
      visibleMs: 500,
      focusedMs: 400,
      attentionScore: 80,
    };

    const reports = createReportsApi({
      metrics: {
        attention: () => ({
          blurredMs: 50,
          blurredRatio: 0.1,
          focusedMs: 400,
          focusedRatio: 0.8,
          hiddenMs: 50,
          hiddenRatio: 0.1,
          score: 80,
        }),
        snapshot: () => metricsSnapshot,
      },
      timeProvider: () => 99,
    });

    const summary = reports.report();
    expect(summary.generatedAt).toBe(99);
    expect(summary.endedAt).toBe(99);
    expect(summary.startedAt).toBe(-901);
    expect(summary.focusDuration).toBe(400);
    expect(summary.sessionDuration).toBe(1_000);
    expect(summary.attention.score).toBe(80);
    expect(summary.highlights).toContain("Attention 80%");
    expect(summary.metrics.visibleMs).toBe(500);

    reports.dispose();
  });

  it("can cite recent timeline evidence ids", () => {
    const listeners = new Set<(event: unknown) => void>();
    const lifecycle = {
      getSnapshot: () => ({
        activity: "unknown",
        attention: "unknown",
        capabilities: {
          abortController: true,
          broadcastChannel: false,
          connectivity: false,
          focus: false,
          idle: false,
          pageLifecycle: false,
          requestIdleCallback: false,
          visibility: true,
        },
        connectivity: "unknown",
        lifecycle: "unknown",
        phase: "running",
        tab: "single",
        timestamps: { createdAt: 1, updatedAt: 1 },
        visibility: "visible",
      }),
      subscribe: (listener: (event: unknown) => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    };

    const timeline = createTimelineApi(lifecycle as never, { maxEvents: 5 });
    const metrics = createMetricsApi(lifecycle as never, { timeProvider: () => 1 });

    for (const listener of listeners) {
      listener({
        snapshot: lifecycle.getSnapshot(),
        timestamp: 10,
        type: "page:hidden",
      });
      listener({
        snapshot: lifecycle.getSnapshot(),
        timestamp: 20,
        type: "page:visible",
      });
    }

    const reports = createReportsApi({
      evidenceLimit: 1,
      metrics,
      timeline,
      timeProvider: () => 123,
    });

    const summary = reports.sessionSummary();
    expect(summary.evidenceEventIds).toHaveLength(1);
    expect(summary.evidenceEventIds?.[0]).toContain("20-");
    expect(summary.metrics.hiddenCount).toBe(1);

    reports.dispose();
    metrics.dispose();
    timeline.dispose();
  });
});
