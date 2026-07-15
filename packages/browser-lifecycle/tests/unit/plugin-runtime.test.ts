import { describe, expect, it, vi } from "vitest";

import { createBrowserLifecycleConfig } from "../../src/core/config/index.js";
import { PluginRuntime } from "../../src/plugins/plugin-runtime.js";

import type {
  BrowserLifecycleEventMap,
  BrowserLifecycleSnapshot,
} from "../../src/core/session/types.js";
import type { BrowserLifecyclePlugin } from "../../src/types/index.js";

function createSnapshot(): BrowserLifecycleSnapshot {
  return {
    activity: "unknown",
    attention: "unknown",
    capabilities: {
      abortController: true,
      broadcastChannel: false,
      connectivity: true,
      focus: true,
      idle: true,
      pageLifecycle: false,
      requestIdleCallback: false,
      visibility: true,
    },
    connectivity: "unknown",
    lifecycle: "active",
    phase: "created",
    tab: "unknown",
    timestamps: {
      createdAt: 0,
      updatedAt: 0,
    },
    visibility: "unknown",
  };
}

describe("PluginRuntime", () => {
  it("runs lifecycle hooks and emits plugin events", () => {
    const emitted: BrowserLifecycleEventMap[keyof BrowserLifecycleEventMap][] = [];
    let registerCalls = 0;
    let startCalls = 0;
    let eventCalls = 0;

    const plugin: BrowserLifecyclePlugin = {
      author: "Jay",
      description: "Test logger",
      id: "logger",
      name: "Logger",
      onEvent: () => {
        eventCalls += 1;
      },
      onRegister: () => {
        registerCalls += 1;
      },
      onStart: () => {
        startCalls += 1;
      },
      version: "1.0.0",
    };

    const runtime = new PluginRuntime(
      {
        capabilities: createSnapshot().capabilities,
        configuration: createBrowserLifecycleConfig({ plugins: [plugin] }),
        getSnapshot: createSnapshot,
      },
      (event, payload) => {
        emitted.push(payload);
      },
      () => 100,
    );

    runtime.register(plugin);
    runtime.initializeAll();
    runtime.startAll();

    expect(registerCalls).toBe(1);
    expect(startCalls).toBe(1);
    expect(runtime.getDiagnostics()[0]?.lifecycle).toBe("running");
    expect(emitted.some((event) => event.type === "plugin:registered")).toBe(true);

    runtime.dispatchEvent("session:started", {
      type: "session:started",
    });
    expect(eventCalls).toBe(1);
    expect(runtime.getHookLog().length).toBeGreaterThan(0);

    runtime.stopAll("manual-stop");
    expect(emitted.some((event) => event.type === "plugin:removed")).toBe(true);

    runtime.destroyAll();
    expect(runtime.getDiagnostics()[0]?.lifecycle).toBe("destroyed");
  });

  it("emits plugin:error when a hook throws", () => {
    const emitted: BrowserLifecycleEventMap[keyof BrowserLifecycleEventMap][] = [];
    const plugin: BrowserLifecyclePlugin = {
      id: "broken",
      onRegister: () => {
        throw new Error("boom");
      },
    };

    const runtime = new PluginRuntime(
      {
        capabilities: createSnapshot().capabilities,
        configuration: createBrowserLifecycleConfig({ plugins: [plugin] }),
        getSnapshot: createSnapshot,
      },
      (_event, payload) => {
        emitted.push(payload);
      },
      () => 200,
    );

    runtime.register(plugin);
    runtime.initializeAll();

    expect(emitted.some((event) => event.type === "plugin:error")).toBe(true);
  });

  it("skips onEvent hooks for disabled plugins", () => {
    const onEvent = vi.fn();
    const plugin: BrowserLifecyclePlugin = {
      id: "toggle",
      onEvent,
    };

    const runtime = new PluginRuntime(
      {
        capabilities: createSnapshot().capabilities,
        configuration: createBrowserLifecycleConfig({ plugins: [plugin] }),
        getSnapshot: createSnapshot,
      },
      () => undefined,
      () => 300,
    );

    runtime.register(plugin);
    runtime.initializeAll();
    runtime.startAll();
    runtime.setEnabled("toggle", false);
    runtime.dispatchEvent("page:visible", { type: "page:visible" });

    expect(onEvent).not.toHaveBeenCalled();
  });
});
