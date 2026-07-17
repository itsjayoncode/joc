import { describe, expect, it, vi } from "vitest";

import { createBrowserLifecycle, createTimelineApi } from "@jayoncode/browser-lifecycle";

import { TimelineRingBuffer } from "../../src/intelligence/timeline/ring-buffer.js";

import type { BrowserLifecycleSnapshot } from "../../src/core/session/types.js";
import type { TimelineEntry } from "../../src/intelligence/timeline/types.js";

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
    visibility: "visible",
    ...partial,
  };
}

describe("TimelineRingBuffer", () => {
  it("rejects non-positive capacity", () => {
    expect(() => new TimelineRingBuffer(0)).toThrow(/positive integer/);
    expect(() => new TimelineRingBuffer(-1)).toThrow(/positive integer/);
  });

  it("drops oldest on overflow in O(1) capacity", () => {
    const buffer = new TimelineRingBuffer(2);
    const dropped: TimelineEntry[] = [];

    const push = (id: string): void => {
      const maybe = buffer.push({
        id,
        timestamp: Number(id),
        type: "page:visible",
      });
      if (maybe) dropped.push(maybe);
    };

    push("1");
    push("2");
    push("3");

    expect(dropped.map((entry) => entry.id)).toEqual(["1"]);
    expect(buffer.toArray().map((entry) => entry.id)).toEqual(["2", "3"]);
    expect(buffer.size).toBe(2);
  });
});

describe("createTimelineApi", () => {
  it("records public events with a hard cap and clears on dispose", () => {
    const listeners = new Set<
      (event: {
        type: "page:visible" | "page:hidden";
        timestamp: number;
        snapshot: BrowserLifecycleSnapshot;
      }) => void
    >();

    const lifecycle = {
      subscribe: (
        listener: (event: {
          type: "page:visible" | "page:hidden";
          timestamp: number;
          snapshot: BrowserLifecycleSnapshot;
        }) => void,
      ) => {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
    };

    const onOverflow = vi.fn();
    const timeline = createTimelineApi(lifecycle as never, {
      maxEvents: 2,
      onOverflow,
    });

    const emit = (type: "page:visible" | "page:hidden", timestamp: number): void => {
      for (const listener of listeners) {
        listener({
          snapshot: snapshot({
            visibility: type === "page:visible" ? "visible" : "hidden",
          }),
          timestamp,
          type,
        });
      }
    };

    emit("page:visible", 10);
    emit("page:hidden", 20);
    emit("page:visible", 30);

    expect(onOverflow).toHaveBeenCalledTimes(1);
    expect(timeline.size()).toBe(2);
    expect(timeline.events().map((entry) => entry.type)).toEqual(["page:hidden", "page:visible"]);
    expect(timeline.record()).toEqual(timeline.events());
    expect(timeline.format()[0]).toMatch(/page:hidden$/);
    expect(timeline.events()[0]?.snapshot?.visibility).toBe("hidden");

    timeline.clear();
    expect(timeline.size()).toBe(0);

    timeline.dispose();
    expect(listeners.size).toBe(0);
    expect(timeline.size()).toBe(0);
  });

  it("can omit snapshots for lower memory", () => {
    const listeners = new Set<(event: unknown) => void>();
    const lifecycle = {
      subscribe: (listener: (event: unknown) => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    };

    const timeline = createTimelineApi(lifecycle as never, {
      includeSnapshot: false,
      maxEvents: 5,
    });

    for (const listener of listeners) {
      listener({
        snapshot: snapshot(),
        timestamp: 1,
        type: "session:started",
      });
    }

    expect(timeline.events()[0]?.snapshot).toBeUndefined();
    timeline.dispose();
  });

  it("does not run until createTimelineApi is called on a real session", () => {
    const session = createBrowserLifecycle({ autoStart: true });
    expect(session.getRuntimeDiagnostics().subscriberCount).toBe(0);

    const timeline = createTimelineApi(session, { maxEvents: 10 });
    expect(session.getRuntimeDiagnostics().subscriberCount).toBe(1);

    timeline.dispose();
    expect(session.getRuntimeDiagnostics().subscriberCount).toBe(0);
    session.dispose();
  });
});
