import { describe, expect, it } from "vitest";

import { createSessionContext } from "../../src/core/session/session-context.js";
import { SessionStateStore } from "../../src/core/session/session-state.js";
import { TypedEventEmitter } from "../../src/events/index.js";
import { createConnectivityModule } from "../../src/modules/connectivity/index.js";

import type { InternalSessionEventMap } from "../../src/core/session/types.js";
import type { ConnectivityAdapter } from "../../src/modules/connectivity/index.js";

class MockConnectivityAdapter implements ConnectivityAdapter {
  public supported = true;
  private state: "offline" | "online" = "online";
  private readonly listeners = new Set<() => void>();

  public isSupported(): boolean {
    return this.supported;
  }

  public read(): "offline" | "online" | undefined {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);

    return (): void => {
      this.listeners.delete(listener);
    };
  }

  public dispatch(state: "offline" | "online"): void {
    this.state = state;

    for (const listener of this.listeners) {
      listener();
    }
  }

  public listenerCount(): number {
    return this.listeners.size;
  }
}

function createTestContext(options: { readonly connectivityCapability?: boolean } = {}) {
  const store = new SessionStateStore(
    {
      abortController: true,
      broadcastChannel: false,
      connectivity: options.connectivityCapability ?? true,
      focus: false,
      pageLifecycle: false,
      requestIdleCallback: false,
      visibility: false,
    },
    100,
  );
  const events = new TypedEventEmitter<InternalSessionEventMap>();
  const connectivityEvents: InternalSessionEventMap["internal:connectivity-changed"][] = [];

  events.on("internal:connectivity-changed", (event) => {
    connectivityEvents.push(event);
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

  return { context, connectivityEvents, store };
}

describe("connectivity module", () => {
  it("emits internal connectivity transitions", () => {
    const adapter = new MockConnectivityAdapter();
    const module = createConnectivityModule({ adapter, timeProvider: () => 200 });
    const { context, connectivityEvents } = createTestContext();

    module.initialize(context);
    module.start(context);
    adapter.dispatch("offline");

    expect(connectivityEvents).toHaveLength(2);
    expect(connectivityEvents[1]?.type).toBe("connection:offline");
    expect(adapter.listenerCount()).toBe(1);

    module.destroy();
    expect(adapter.listenerCount()).toBe(0);
  });

  it("degrades when connectivity capability is unavailable", () => {
    const module = createConnectivityModule({ adapter: new MockConnectivityAdapter() });
    const { context } = createTestContext({ connectivityCapability: false });

    module.initialize(context);

    expect(context.getSnapshot().connectivity).toBe("unknown");
  });
});
