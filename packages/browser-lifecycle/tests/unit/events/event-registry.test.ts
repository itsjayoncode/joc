import { describe, expect, it, vi } from "vitest";

import { EventRegistry } from "../../../src/events/event-registry.js";

import type { EventDispatchMetadata } from "../../../src/events/types.js";

interface RegistryEventMap {
  "alpha:ready": { readonly value: number };
  "beta:done": { readonly label: string };
}

describe("EventRegistry", () => {
  it("stores definitions listeners and dispatch statistics", () => {
    const registry = new EventRegistry<RegistryEventMap>([
      {
        description: "Alpha ready",
        name: "alpha:ready",
      },
    ]);
    const first = vi.fn();
    const second = vi.fn();

    const firstEntry = registry.addListener("alpha:ready", first, false);
    const secondEntry = registry.addListener("alpha:ready", second, true);
    const metadata: EventDispatchMetadata<"alpha:ready"> = {
      dispatchId: 1,
      internal: undefined,
      listenerCount: 2,
      source: "test",
      timestamp: 100,
      type: "alpha:ready",
    };

    registry.recordDispatch("alpha:ready", metadata);
    registry.recordListenerError("alpha:ready");

    expect(firstEntry.id).not.toBe(secondEntry.id);
    expect(secondEntry.once).toBe(true);
    expect(registry.getDefinitions()).toEqual([
      {
        description: "Alpha ready",
        name: "alpha:ready",
      },
    ]);
    expect(registry.getListeners("alpha:ready")).toEqual([first, second]);
    expect(registry.getListenerEntries("alpha:ready")).toHaveLength(2);
    expect(registry.listenerCount("alpha:ready")).toBe(2);
    expect(registry.listenerCount()).toBe(2);
    expect(registry.hasListeners("alpha:ready")).toBe(true);
    expect(registry.getStats("alpha:ready")).toEqual({
      definition: {
        description: "Alpha ready",
        name: "alpha:ready",
      },
      emissionCount: 1,
      errorCount: 1,
      lastDispatchedAt: 100,
      lastDispatchSource: "test",
      listenerCount: 2,
    });
  });

  it("removes listeners by reference id and event scope", () => {
    const registry = new EventRegistry<RegistryEventMap>();
    const alpha = vi.fn();
    const beta = vi.fn();

    const entry = registry.addListener("alpha:ready", alpha, false);
    registry.addListener("beta:done", beta, false);

    expect(registry.removeListenerById("alpha:ready", entry.id)).toBe(true);
    expect(registry.removeListenerById("alpha:ready", entry.id)).toBe(false);
    expect(registry.removeListener("beta:done", beta)).toBe(true);
    expect(registry.removeListener("beta:done", beta)).toBe(false);
    expect(registry.listenerCount()).toBe(0);
    expect(registry.hasListeners()).toBe(false);
  });

  it("returns empty snapshots and zero counts for unknown events", () => {
    const registry = new EventRegistry<RegistryEventMap>();
    const listener = vi.fn();

    expect(registry.getListeners("alpha:ready")).toEqual([]);
    expect(registry.getListenerEntries("alpha:ready")).toEqual([]);
    expect(registry.listenerCount("alpha:ready")).toBe(0);
    expect(registry.hasListeners("alpha:ready")).toBe(false);
    expect(registry.removeListener("alpha:ready", listener)).toBe(false);
    expect(registry.removeListenerById("alpha:ready", 1)).toBe(false);
    expect(registry.removeAll("alpha:ready")).toBe(0);
  });

  it("removes all listeners for one event or the entire registry and destroys cleanly", () => {
    const registry = new EventRegistry<RegistryEventMap>();
    const alpha = vi.fn();
    const beta = vi.fn();

    registry.addListener("alpha:ready", alpha, false);
    registry.addListener("alpha:ready", alpha, false);
    registry.addListener("beta:done", beta, false);

    expect(registry.removeAll("alpha:ready")).toBe(2);
    expect(registry.getListeners("alpha:ready")).toEqual([]);
    expect(registry.removeAll()).toBe(1);
    expect(registry.listenerCount()).toBe(0);

    registry.addListener("alpha:ready", alpha, false);
    registry.destroy();

    expect(registry.listenerCount()).toBe(0);
    expect(registry.getListeners("alpha:ready")).toEqual([]);
  });
});
