import { describe, expect, it } from "vitest";

import { createBrowserLifecycle, createMetricsApi } from "@jayoncode/browser-lifecycle";

import type { BrowserLifecycleSnapshot } from "../../src/core/session/types.js";

function snapshot(partial: Partial<BrowserLifecycleSnapshot> = {}): BrowserLifecycleSnapshot {
  return {
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
    visibility: "hidden",
    ...partial,
  };
}

describe("createMetricsApi", () => {
  it("reduces durations, counts, attention, and stats without Timeline", () => {
    let current = snapshot({ visibility: "visible", attention: "focused", activity: "active" });
    let now = 1_000;
    const listeners = new Set<(event: unknown) => void>();

    const lifecycle = {
      getSnapshot: () => current,
      subscribe: (listener: (event: unknown) => void) => {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
    };

    const emit = (event: Record<string, unknown>): void => {
      for (const listener of listeners) {
        listener(event);
      }
    };

    const metrics = createMetricsApi(lifecycle as never, {
      timeProvider: () => now,
    });

    emit({
      snapshot: snapshot({ visibility: "hidden", attention: "focused" }),
      timestamp: 1_500,
      type: "page:hidden",
    });
    current = snapshot({ visibility: "hidden", attention: "unfocused" });

    emit({
      snapshot: current,
      timestamp: 1_600,
      type: "window:blur",
    });

    emit({
      snapshot: snapshot({ visibility: "visible", attention: "unfocused" }),
      timestamp: 2_000,
      type: "page:visible",
    });
    current = snapshot({ visibility: "visible", attention: "focused", activity: "active" });

    emit({
      snapshot: current,
      timestamp: 2_050,
      type: "window:focus",
    });

    emit({
      snapshot: snapshot({ activity: "idle", visibility: "visible", attention: "focused" }),
      timestamp: 2_100,
      type: "session:idle",
    });
    current = snapshot({ activity: "idle", visibility: "visible", attention: "focused" });

    emit({
      snapshot: snapshot({ activity: "active", visibility: "visible", attention: "focused" }),
      timestamp: 2_400,
      type: "session:active",
    });

    emit({
      snapshot: snapshot({ connectivity: "offline" }),
      timestamp: 2_450,
      type: "connection:offline",
    });
    emit({
      snapshot: snapshot({ connectivity: "online" }),
      timestamp: 2_500,
      type: "connection:online",
    });
    emit({
      snapshot: snapshot({ connectivity: "online" }),
      timestamp: 2_500,
      type: "connection:reconnect",
    });

    emit({
      snapshot: snapshot({ lifecycle: "frozen" }),
      timestamp: 2_600,
      type: "page:suspend",
    });
    emit({
      snapshot: snapshot({ lifecycle: "active" }),
      timestamp: 2_800,
      type: "page:resume",
    });

    emit({
      snapshot: snapshot({ tab: "primary" }),
      timestamp: 2_900,
      type: "tab:primary",
    });

    now = 3_000;
    const view = metrics.snapshot();

    expect(view.hiddenCount).toBe(1);
    expect(view.visibilityChangeCount).toBe(2);
    expect(view.focusCount).toBe(1);
    expect(view.blurCount).toBe(1);
    expect(view.idleCount).toBe(1);
    expect(view.reconnectCount).toBe(1);
    expect(view.sleepCount).toBe(1);
    expect(view.primaryTabSwitchCount).toBe(1);
    expect(view.sleepMs).toBe(200);
    expect(view.idleMs).toBe(300);
    expect(view.visibleMs).toBeGreaterThan(0);
    expect(view.hiddenMs).toBeGreaterThan(0);
    expect(view.attentionScore).toBeGreaterThanOrEqual(0);
    expect(metrics.stats().reconnectCount).toBe(1);
    expect(metrics.attention().score).toBe(view.attentionScore);
    expect(metrics.sessionDuration()).toBe(2_000);
    expect(metrics.sleepDuration()).toBe(200);

    metrics.reset();
    const reset = metrics.snapshot();
    expect(reset.hiddenCount).toBe(0);
    expect(reset.reconnectCount).toBe(0);
    expect(reset.sleepCount).toBe(0);

    metrics.dispose();
    expect(listeners.size).toBe(0);
  });

  it("does not subscribe until createMetricsApi is called", () => {
    const session = createBrowserLifecycle({ autoStart: true });
    expect(session.getRuntimeDiagnostics().subscriberCount).toBe(0);

    const metrics = createMetricsApi(session);
    expect(session.getRuntimeDiagnostics().subscriberCount).toBe(1);

    metrics.dispose();
    expect(session.getRuntimeDiagnostics().subscriberCount).toBe(0);
    session.dispose();
  });
});
