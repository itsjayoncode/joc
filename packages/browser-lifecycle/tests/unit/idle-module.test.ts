import { describe, expect, it, vi } from "vitest";

import { createSessionContext } from "../../src/core/session/session-context.js";
import { SessionStateStore } from "../../src/core/session/session-state.js";
import { TypedEventEmitter } from "../../src/events/index.js";
import { createIdleModule } from "../../src/modules/idle/index.js";

import type { InternalSessionEventMap } from "../../src/core/session/types.js";
import type { IdleActivitySource, IdleAdapter } from "../../src/modules/idle/index.js";

class MockIdleAdapter implements IdleAdapter {
  private readonly listeners = new Set<(source: IdleActivitySource) => void>();

  public isSupported(): boolean {
    return true;
  }

  public subscribe(
    _events: readonly IdleActivitySource[],
    listener: (source: IdleActivitySource) => void,
  ): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public dispatch(source: IdleActivitySource): void {
    for (const listener of this.listeners) listener(source);
  }
}

describe("idle module", () => {
  it("emits activity detection events", () => {
    vi.useFakeTimers();
    const adapter = new MockIdleAdapter();
    const module = createIdleModule({ adapter, timeProvider: () => 100 });
    const store = new SessionStateStore(
      {
        abortController: true,
        broadcastChannel: false,
        connectivity: false,
        focus: false,
        idle: true,
        pageLifecycle: false,
        requestIdleCallback: false,
        visibility: false,
      },
      100,
    );
    const events = new TypedEventEmitter<InternalSessionEventMap>();
    const detected: string[] = [];
    events.on("internal:activity-detected", () => detected.push("detected"));
    const context = createSessionContext({
      capabilities: store.getSnapshot().capabilities,
      configuration: {
        activityDebounce: 0,
        activityEvents: ["keydown"],
        autoStart: false,
        crossTab: {
          channelName: "joc",
          enabled: false,
          heartbeatInterval: 1000,
          leaderTimeout: 3000,
        },
        debug: false,
        emitInitialState: false,
        eventBufferSize: 100,
        idleTimeout: 5_000,
        plugins: [],
      },
      events,
      getSnapshot: () => store.getSnapshot(),
      updateSnapshot: (updater) => store.update(updater, 100),
    });

    module.initialize(context);
    module.start(context);
    adapter.dispatch("keydown");
    vi.runAllTimers();

    expect(detected).toHaveLength(1);
    module.destroy();
    vi.useRealTimers();
  });
});
