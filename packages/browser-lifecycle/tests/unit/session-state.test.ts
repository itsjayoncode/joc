import { describe, expect, it } from "vitest";

import { SessionStateStore } from "../../src/core/session/session-state.js";
import { LifecycleError } from "../../src/index.js";

describe("SessionStateStore", () => {
  it("creates the initial snapshot", () => {
    const store = new SessionStateStore(
      {
        abortController: true,
        broadcastChannel: false,
        focus: false,
        pageLifecycle: false,
        requestIdleCallback: false,
        visibility: true,
      },
      100,
    );

    expect(store.getPhase()).toBe("created");
    expect(store.getSnapshot()).toEqual({
      activity: "unknown",
      attention: "unknown",
      capabilities: {
        abortController: true,
        broadcastChannel: false,
        focus: false,
        pageLifecycle: false,
        requestIdleCallback: false,
        visibility: true,
      },
      connectivity: "unknown",
      lifecycle: "unknown",
      phase: "created",
      tab: "unknown",
      timestamps: {
        createdAt: 100,
        updatedAt: 100,
      },
      visibility: "unknown",
    });
  });

  it("transitions between valid phases and updates timestamps", () => {
    const store = new SessionStateStore(
      {
        abortController: true,
        broadcastChannel: true,
        focus: false,
        pageLifecycle: true,
        requestIdleCallback: true,
        visibility: true,
      },
      100,
    );

    expect(store.transitionPhase("running", 200)).toEqual({
      previousPhase: "created",
      snapshot: {
        ...store.getSnapshot(),
      },
    });
    expect(store.getSnapshot().timestamps.startedAt).toBe(200);

    expect(store.transitionPhase("stopped", 300).previousPhase).toBe("running");
    expect(store.getSnapshot().timestamps.stoppedAt).toBe(300);

    expect(store.transitionPhase("disposed", 400).previousPhase).toBe("stopped");
    expect(store.getSnapshot().timestamps.disposedAt).toBe(400);
  });

  it("returns the same snapshot for idempotent phase transitions", () => {
    const store = new SessionStateStore(
      {
        abortController: false,
        broadcastChannel: false,
        focus: false,
        pageLifecycle: false,
        requestIdleCallback: false,
        visibility: false,
      },
      100,
    );

    const first = store.getSnapshot();
    const result = store.transitionPhase("created", 200);

    expect(result.previousPhase).toBe("created");
    expect(result.snapshot).toBe(first);
  });

  it("rejects invalid lifecycle transitions", () => {
    const store = new SessionStateStore(
      {
        abortController: false,
        broadcastChannel: false,
        focus: false,
        pageLifecycle: false,
        requestIdleCallback: false,
        visibility: false,
      },
      100,
    );

    expect(() => {
      store.transitionPhase("stopped", 200);
    }).toThrow(LifecycleError);
  });

  it("applies controlled snapshot updates", () => {
    const store = new SessionStateStore(
      {
        abortController: true,
        broadcastChannel: false,
        focus: false,
        pageLifecycle: false,
        requestIdleCallback: false,
        visibility: true,
      },
      100,
    );

    const snapshot = store.update(
      (current) => ({
        ...current,
        visibility: "visible",
        timestamps: {
          ...current.timestamps,
          lastEventAt: 150,
        },
      }),
      200,
    );

    expect(snapshot.visibility).toBe("visible");
    expect(snapshot.timestamps.createdAt).toBe(100);
    expect(snapshot.timestamps.lastEventAt).toBe(150);
    expect(snapshot.timestamps.updatedAt).toBe(200);
  });
});
