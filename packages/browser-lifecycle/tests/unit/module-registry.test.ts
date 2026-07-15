import { describe, expect, it, vi } from "vitest";

import { ModuleRegistry } from "../../src/core/session/module-registry.js";
import { createSessionContext } from "../../src/core/session/session-context.js";
import { SessionStateStore } from "../../src/core/session/session-state.js";
import { TypedEventEmitter } from "../../src/events/index.js";
import { ModuleRegistryError } from "../../src/index.js";

import type { InternalSessionEventMap } from "../../src/core/session/types.js";

function createTestContext() {
  const store = new SessionStateStore(
    {
      abortController: true,
      broadcastChannel: false,
      connectivity: false,
      idle: false,
      focus: false,
      pageLifecycle: false,
      requestIdleCallback: false,
      visibility: true,
    },
    10,
  );

  return createSessionContext({
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
    updateSnapshot: (updater) => store.update(updater, 20),
  });
}

describe("ModuleRegistry", () => {
  it("registers modules in deterministic order", () => {
    const registry = new ModuleRegistry();
    const calls: string[] = [];
    const context = createTestContext();

    registry.register({
      id: "late",
      order: 10,
      initialize: () => {
        calls.push("late:init");
      },
      start: () => {
        calls.push("late:start");
      },
      stop: () => {
        calls.push("late:stop");
      },
      destroy: () => {
        calls.push("late:destroy");
      },
    });
    registry.register({
      id: "early",
      order: 1,
      initialize: () => {
        calls.push("early:init");
      },
      start: () => {
        calls.push("early:start");
      },
      stop: () => {
        calls.push("early:stop");
      },
      destroy: () => {
        calls.push("early:destroy");
      },
    });

    registry.initializeAll(context);
    registry.startAll(context);
    registry.stopAll(context);
    registry.destroyAll(context);

    expect(registry.list().map((module) => module.id)).toEqual(["early", "late"]);
    expect(calls).toEqual([
      "early:init",
      "late:init",
      "early:start",
      "late:start",
      "late:stop",
      "early:stop",
      "late:destroy",
      "early:destroy",
    ]);
  });

  it("preserves registration order when module order values match", () => {
    const registry = new ModuleRegistry();

    registry.register({ id: "first", order: 5 });
    registry.register({ id: "second", order: 5 });

    expect(registry.list().map((module) => module.id)).toEqual(["first", "second"]);
  });

  it("treats missing order values as zero during ordering", () => {
    const registry = new ModuleRegistry();

    registry.register({ id: "explicit-low", order: -1 });
    registry.register({ id: "implicit-zero" });
    registry.register({ id: "explicit-high", order: 1 });

    expect(registry.list().map((module) => module.id)).toEqual([
      "explicit-low",
      "implicit-zero",
      "explicit-high",
    ]);
  });

  it("rejects duplicate module ids and supports unregister", () => {
    const registry = new ModuleRegistry();
    const module = {
      id: "alpha",
      start: vi.fn(),
    };

    registry.register(module);

    expect(() => {
      registry.register(module);
    }).toThrow(ModuleRegistryError);
    expect(registry.has("alpha")).toBe(true);
    expect(registry.size()).toBe(1);
    expect(registry.unregister("alpha")).toBe(true);
    expect(registry.unregister("alpha")).toBe(false);
    expect(registry.has("alpha")).toBe(false);
  });
});
