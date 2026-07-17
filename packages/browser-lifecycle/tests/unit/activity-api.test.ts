import { describe, expect, it, vi } from "vitest";

import {
  createActivityApi,
  createBrowserLifecycle,
  projectActivityView,
} from "@jayoncode/browser-lifecycle";

import type { BrowserLifecycleSnapshot } from "../../src/core/session/types.js";

function baseSnapshot(overrides: Partial<BrowserLifecycleSnapshot> = {}): BrowserLifecycleSnapshot {
  return {
    activity: "unknown",
    attention: "unknown",
    capabilities: {
      abortController: true,
      broadcastChannel: false,
      connectivity: false,
      focus: false,
      idle: true,
      pageLifecycle: false,
      requestIdleCallback: false,
      visibility: false,
    },
    connectivity: "unknown",
    lifecycle: "unknown",
    phase: "created",
    tab: "single",
    timestamps: {
      createdAt: 1,
      updatedAt: 1,
    },
    visibility: "unknown",
    ...overrides,
  };
}

describe("projectActivityView", () => {
  it("maps snapshot.activity and clears lastActiveAt when unknown", () => {
    expect(projectActivityView(baseSnapshot({ activity: "unknown" }))).toEqual({
      lastActiveAt: undefined,
      status: "unknown",
    });
  });

  it("prefers tracked lastActiveAt over snapshot timestamps", () => {
    expect(
      projectActivityView(
        baseSnapshot({
          activity: "active",
          timestamps: { createdAt: 1, lastEventAt: 50, updatedAt: 50 },
        }),
        99,
      ),
    ).toEqual({ lastActiveAt: 99, status: "active" });
  });

  it("falls back to lastEventAt when active and no tracked time", () => {
    expect(
      projectActivityView(
        baseSnapshot({
          activity: "active",
          timestamps: { createdAt: 1, lastEventAt: 50, updatedAt: 50 },
        }),
      ),
    ).toEqual({ lastActiveAt: 50, status: "active" });
  });
});

describe("createActivityApi", () => {
  it("reports unknown when idleTimeout is disabled (default)", () => {
    const session = createBrowserLifecycle({ autoStart: false });
    const activity = createActivityApi(session, { trackLastActiveAt: false });

    expect(activity.isUnknown()).toBe(true);
    expect(activity.isActive()).toBe(false);
    expect(activity.isIdle()).toBe(false);
    expect(activity.state().status).toBe("unknown");
    expect(activity.lastActiveAt()).toBeUndefined();

    activity.dispose();
    session.dispose();
  });

  it("does not change default session activity without idleTimeout", () => {
    const session = createBrowserLifecycle({ autoStart: true });
    expect(session.getSnapshot().activity).toBe("unknown");
    expect(session.getRuntimeDiagnostics().pluginCount).toBe(0);
    session.dispose();
  });

  it("updates lastActiveAt through public activity events and unsubscribes on dispose", () => {
    let snapshot = baseSnapshot({
      activity: "active",
      timestamps: { createdAt: 1, updatedAt: 10 },
    });
    const listeners = new Map<string, Set<(event: { timestamp: number }) => void>>();

    const lifecycle = {
      getSnapshot: () => snapshot,
      on: (event: string, listener: (event: { timestamp: number }) => void) => {
        const set = listeners.get(event) ?? new Set();
        set.add(listener);
        listeners.set(event, set);
        return () => {
          set.delete(listener);
        };
      },
    };

    const activity = createActivityApi(lifecycle as never);
    expect(activity.isActive()).toBe(true);

    for (const listener of listeners.get("activity:detected") ?? []) {
      listener({ timestamp: 42 });
    }
    expect(activity.lastActiveAt()).toBe(42);
    expect(activity.lastInteraction()).toBe(42);

    snapshot = baseSnapshot({
      activity: "idle",
      timestamps: { createdAt: 1, updatedAt: 50 },
    });
    expect(activity.isIdle()).toBe(true);
    expect(activity.lastActiveAt()).toBe(42);
    expect(activity.idleTime(100)).toBe(58);

    activity.dispose();
    expect(listeners.get("activity:detected")?.size ?? 0).toBe(0);
    expect(listeners.get("session:active")?.size ?? 0).toBe(0);
    expect(listeners.get("session:idle")?.size ?? 0).toBe(0);
  });

  it("supports trackLastActiveAt:false with zero subscriptions", () => {
    const on = vi.fn();
    const lifecycle = {
      getSnapshot: () => baseSnapshot({ activity: "idle" }),
      on,
    };

    const activity = createActivityApi(lifecycle as never, { trackLastActiveAt: false });
    expect(on).not.toHaveBeenCalled();
    expect(activity.isIdle()).toBe(true);
    activity.dispose();
  });
});
