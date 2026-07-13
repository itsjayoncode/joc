import { describe, expect, it, vi } from "vitest";

import { EventRegistry } from "../../../src/events/event-registry.js";
import { SubscriptionManager } from "../../../src/events/subscription-manager.js";

interface SubscriptionEventMap {
  "alpha:ready": { readonly value: number };
}

describe("SubscriptionManager", () => {
  it("registers subscriptions and supports manager-driven unsubscribe", () => {
    const registry = new EventRegistry<SubscriptionEventMap>();
    const manager = new SubscriptionManager<SubscriptionEventMap>(registry);
    const listener = vi.fn();

    const subscription = manager.on("alpha:ready", listener);

    expect(subscription.active).toBe(true);
    expect(registry.listenerCount("alpha:ready")).toBe(1);

    manager.unsubscribe(subscription);
    manager.unsubscribe(subscription);

    expect(subscription.active).toBe(false);
    expect(registry.listenerCount("alpha:ready")).toBe(0);
  });

  it("registers once subscriptions and off removes the first matching listener", () => {
    const registry = new EventRegistry<SubscriptionEventMap>();
    const manager = new SubscriptionManager<SubscriptionEventMap>(registry);
    const listener = vi.fn();

    manager.once("alpha:ready", listener);
    manager.on("alpha:ready", listener);

    expect(registry.getListenerEntries("alpha:ready")[0]?.once).toBe(true);
    manager.off("alpha:ready", listener);
    expect(registry.listenerCount("alpha:ready")).toBe(1);
  });
});
