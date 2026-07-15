import { describe, expect, it } from "vitest";

import { createSessionContext } from "../../src/core/session/session-context.js";
import { SessionStateStore } from "../../src/core/session/session-state.js";
import { TypedEventEmitter } from "../../src/events/index.js";
import { LifecycleError } from "../../src/index.js";
import { createVisibilityModule } from "../../src/modules/visibility/index.js";

import type { InternalSessionEventMap, SessionLogger } from "../../src/core/session/types.js";
import type {
  VisibilityAdapter,
  VisibilityAdapterSnapshot,
} from "../../src/modules/visibility/index.js";

class MockVisibilityAdapter implements VisibilityAdapter {
  public supported = true;
  private snapshot: VisibilityAdapterSnapshot | undefined;
  private readonly listeners = new Set<() => void>();

  public constructor(state: "hidden" | "visible" = "visible") {
    this.snapshot = {
      hidden: state === "hidden",
      visibilityState: state,
    };
  }

  public isSupported(): boolean {
    return this.supported;
  }

  public read(): VisibilityAdapterSnapshot | undefined {
    return this.snapshot;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);

    return (): void => {
      this.listeners.delete(listener);
    };
  }

  public dispatch(state?: "hidden" | "visible"): void {
    if (state) {
      this.snapshot = {
        hidden: state === "hidden",
        visibilityState: state,
      };
    }

    for (const listener of this.listeners) {
      listener();
    }
  }

  public setSnapshot(snapshot: VisibilityAdapterSnapshot | undefined): void {
    this.snapshot = snapshot;
  }

  public listenerCount(): number {
    return this.listeners.size;
  }
}

function createTestContext(
  options: {
    readonly emitInitialState?: boolean;
    readonly logger?: SessionLogger;
    readonly visibilityCapability?: boolean;
  } = {},
) {
  let now = 100;
  const nextTime = (): number => {
    now += 50;
    return now;
  };
  const store = new SessionStateStore(
    {
      abortController: true,
      broadcastChannel: false,
      connectivity: false,
      idle: false,
      focus: false,
      pageLifecycle: false,
      requestIdleCallback: false,
      visibility: options.visibilityCapability ?? true,
    },
    nextTime(),
  );
  const events = new TypedEventEmitter<InternalSessionEventMap>();
  const visibilityEvents: InternalSessionEventMap["internal:visibility-changed"][] = [];

  events.on("internal:visibility-changed", (event) => {
    visibilityEvents.push(event);
  });

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
      emitInitialState: options.emitInitialState ?? false,
      eventBufferSize: 0,
      idleTimeout: false,
      plugins: [],
    },
    events,
    getSnapshot: () => store.getSnapshot(),
    ...(options.logger ? { logger: options.logger } : {}),
    updateSnapshot: (updater) => store.update(updater, nextTime()),
  });

  return {
    context,
    nextTime,
    store,
    visibilityEvents,
  };
}

describe("BrowserVisibilityModule", () => {
  it("detects initial visibility during initialization", () => {
    const adapter = new MockVisibilityAdapter("hidden");
    const { context } = createTestContext();
    const module = createVisibilityModule({
      adapter,
    });

    module.initialize?.(context);

    expect(context.getSnapshot().visibility).toBe("hidden");
  });

  it("emits hidden and visible transitions while suppressing duplicates", () => {
    const adapter = new MockVisibilityAdapter("visible");
    const { context, nextTime, visibilityEvents } = createTestContext();
    const module = createVisibilityModule({
      adapter,
      timeProvider: nextTime,
    });

    module.initialize?.(context);
    module.start?.(context);

    adapter.dispatch("hidden");
    adapter.dispatch("hidden");
    adapter.dispatch("visible");

    expect(visibilityEvents).toEqual([
      {
        current: "hidden",
        metadata: {
          likelyLastSignal: true,
          reason: "visibilitychange",
        },
        previous: "visible",
        timestamp: 250,
        type: "page:hidden",
      },
      {
        current: "visible",
        metadata: {
          reason: "visibilitychange",
        },
        previous: "hidden",
        timestamp: 300,
        type: "page:visible",
      },
    ]);
  });

  it("emits initial state only when configured", () => {
    const adapter = new MockVisibilityAdapter("visible");
    const { context, nextTime, visibilityEvents } = createTestContext({
      emitInitialState: true,
    });
    const module = createVisibilityModule({
      adapter,
      timeProvider: nextTime,
    });

    module.start?.(context);

    expect(visibilityEvents).toEqual([
      {
        current: "visible",
        metadata: {
          reason: "initial",
        },
        previous: "unknown",
        timestamp: 250,
        type: "page:visible",
      },
    ]);
  });

  it("gracefully disables itself when visibility support is unavailable", () => {
    const adapter = new MockVisibilityAdapter("visible");
    const { context, visibilityEvents } = createTestContext({
      visibilityCapability: false,
    });
    const module = createVisibilityModule({
      adapter,
    });

    expect(() => {
      module.initialize?.(context);
      module.start?.(context);
      module.stop?.(context);
      module.destroy?.(context);
    }).not.toThrow();
    expect(context.getSnapshot().visibility).toBe("unknown");
    expect(visibilityEvents).toEqual([]);
  });

  it("cleans up listeners on stop and destroy and can restart cleanly", () => {
    const adapter = new MockVisibilityAdapter("visible");
    const { context, nextTime, visibilityEvents } = createTestContext();
    const module = createVisibilityModule({
      adapter,
      timeProvider: nextTime,
    });

    module.initialize?.(context);
    module.start?.(context);
    expect(adapter.listenerCount()).toBe(1);

    module.initialize?.(context);
    expect(adapter.listenerCount()).toBe(0);

    module.start?.(context);
    expect(adapter.listenerCount()).toBe(1);

    module.stop?.(context);
    expect(adapter.listenerCount()).toBe(0);

    adapter.dispatch("hidden");
    module.start?.(context);
    expect(adapter.listenerCount()).toBe(1);

    expect(visibilityEvents).toEqual([
      {
        current: "hidden",
        metadata: {
          likelyLastSignal: true,
          reason: "visibilitychange",
        },
        previous: "visible",
        timestamp: 300,
        type: "page:hidden",
      },
    ]);

    module.destroy?.(context);
    expect(adapter.listenerCount()).toBe(0);
  });

  it("constructs safely in SSR-style environments", () => {
    expect(() => {
      createVisibilityModule();
    }).not.toThrow();
  });

  it("uses typed errors for unsupported adapter snapshots", () => {
    const adapter = new MockVisibilityAdapter("visible");
    const { context } = createTestContext();
    const module = createVisibilityModule({
      adapter,
    });

    adapter.setSnapshot({
      hidden: undefined,
      visibilityState: "prerender",
    });

    expect(() => {
      module.initialize?.(context);
    }).toThrow(LifecycleError);
  });

  it("logs unexpected runtime visibility errors without throwing from the listener", () => {
    const adapter = new MockVisibilityAdapter("visible");
    const loggerCalls: string[] = [];
    const logger: SessionLogger = {
      debug: () => undefined,
      error: (message) => {
        loggerCalls.push(message);
      },
      warn: () => undefined,
    };
    const { context, nextTime, visibilityEvents } = createTestContext({
      logger,
    });
    const module = createVisibilityModule({
      adapter,
      timeProvider: nextTime,
    });

    module.initialize?.(context);
    module.start?.(context);
    adapter.setSnapshot(undefined);

    expect(() => {
      adapter.dispatch();
    }).not.toThrow();
    expect(loggerCalls).toEqual(["Visibility change handling failed."]);
    expect(visibilityEvents).toEqual([]);
  });
});
