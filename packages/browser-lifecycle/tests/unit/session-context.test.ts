import { describe, expect, it } from "vitest";

import { createSessionContext, createSessionLogger } from "../../src/core/session/session-context.js";
import { SessionStateStore } from "../../src/core/session/session-state.js";
import { TypedEventEmitter } from "../../src/events/index.js";

import type {
  BrowserLifecycleSnapshot,
  InternalSessionEventMap,
} from "../../src/core/session/types.js";

describe("session context", () => {
  it("creates a no-op logger placeholder", () => {
    const logger = createSessionLogger();

    expect(() => {
      logger.debug("debug");
      logger.warn("warn");
      logger.error("error");
    }).not.toThrow();
  });

  it("creates context accessors around snapshot and update functions", () => {
    const store = new SessionStateStore(
      {
        abortController: true,
        broadcastChannel: false,
        pageLifecycle: false,
        requestIdleCallback: false,
        visibility: true,
      },
      100,
    );
    let updateCallCount = 0;
    const updateSnapshot = (
      updater: (snapshot: Readonly<BrowserLifecycleSnapshot>) => BrowserLifecycleSnapshot,
    ): Readonly<BrowserLifecycleSnapshot> => {
      updateCallCount += 1;

      return store.update(updater, 200);
    };
    const context = createSessionContext({
      capabilities: store.getSnapshot().capabilities,
      configuration: {
        activityDebounce: 250,
        activityEvents: ["pointerdown", "keydown", "touchstart", "visibilitychange", "focus"],
        autoStart: false,
        crossTab: {
          channelName: "jayoncode:browser-lifecycle",
          enabled: false,
          heartbeatInterval: 1_000,
          leaderTimeout: 3_000,
        },
        debug: false,
        emitInitialState: false,
        eventBufferSize: 0,
        idleTimeout: false,
        plugins: [],
      },
      events: new TypedEventEmitter<InternalSessionEventMap>(),
      getSnapshot: () => store.getSnapshot(),
      updateSnapshot,
    });

    expect(context.getSnapshot().phase).toBe("created");

    const snapshot = context.updateSnapshot((current) => ({
      ...current,
      activity: "active",
      timestamps: {
        ...current.timestamps,
        lastEventAt: 150,
      },
    }));

    expect(updateCallCount).toBe(1);
    expect(snapshot.activity).toBe("active");
    expect(snapshot.timestamps.lastEventAt).toBe(150);
  });
});
