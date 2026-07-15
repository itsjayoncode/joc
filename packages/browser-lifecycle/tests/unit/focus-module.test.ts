import { describe, expect, it } from "vitest";

import { createSessionContext } from "../../src/core/session/session-context.js";
import { SessionStateStore } from "../../src/core/session/session-state.js";
import { TypedEventEmitter } from "../../src/events/index.js";
import { createFocusModule } from "../../src/modules/focus/index.js";

import type { InternalSessionEventMap } from "../../src/core/session/types.js";
import type { FocusAdapter } from "../../src/modules/focus/index.js";

class MockFocusAdapter implements FocusAdapter {
  public supported = true;
  private state: "focused" | "unfocused" = "focused";
  private readonly listeners = new Set<() => void>();

  public isSupported(): boolean {
    return this.supported;
  }

  public read(): "focused" | "unfocused" | undefined {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);

    return (): void => {
      this.listeners.delete(listener);
    };
  }

  public dispatch(state: "focused" | "unfocused"): void {
    this.state = state;

    for (const listener of this.listeners) {
      listener();
    }
  }

  public listenerCount(): number {
    return this.listeners.size;
  }
}

function createTestContext(options: { readonly focusCapability?: boolean } = {}) {
  const store = new SessionStateStore(
    {
      abortController: true,
      broadcastChannel: false,
      connectivity: false,
      idle: false,
      focus: options.focusCapability ?? true,
      pageLifecycle: false,
      requestIdleCallback: false,
      visibility: false,
    },
    100,
  );
  const events = new TypedEventEmitter<InternalSessionEventMap>();
  const focusEvents: InternalSessionEventMap["internal:focus-changed"][] = [];

  events.on("internal:focus-changed", (event) => {
    focusEvents.push(event);
  });

  const context = createSessionContext({
    capabilities: store.getSnapshot().capabilities,
    configuration: {
      activityDebounce: 250,
      activityEvents: ["focus", "keydown"],
      autoStart: false,
      crossTab: {
        channelName: "joc",
        enabled: false,
        heartbeatInterval: 1000,
        leaderTimeout: 3000,
      },
      debug: false,
      emitInitialState: true,
      eventBufferSize: 100,
      idleTimeout: false,
      plugins: [],
    },
    events,
    getSnapshot: () => store.getSnapshot(),
    updateSnapshot: (updater) => store.update(updater, 150),
  });

  return { context, focusEvents, store };
}

describe("focus module", () => {
  it("emits internal focus transitions", () => {
    const adapter = new MockFocusAdapter();
    const module = createFocusModule({ adapter, timeProvider: () => 200 });
    const { context, focusEvents } = createTestContext();

    module.initialize(context);
    module.start(context);
    adapter.dispatch("unfocused");

    expect(focusEvents).toHaveLength(2);
    expect(focusEvents[1]?.type).toBe("window:blur");
    expect(adapter.listenerCount()).toBe(1);

    module.destroy();
    expect(adapter.listenerCount()).toBe(0);
  });

  it("degrades when focus capability is unavailable", () => {
    const module = createFocusModule({ adapter: new MockFocusAdapter() });
    const { context } = createTestContext({ focusCapability: false });

    module.initialize(context);

    expect(context.getSnapshot().attention).toBe("unknown");
  });
});
