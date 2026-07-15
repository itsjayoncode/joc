import { describe, expect, it, vi } from "vitest";

import { TypedEventEmitter } from "@jayoncode/browser-lifecycle";
import type { EventDefinition } from "@jayoncode/browser-lifecycle";

interface TestEventMap {
  "alpha:ready": { readonly value: number };
  "beta:done": { readonly label: string };
}

describe("TypedEventEmitter", () => {
  it("registers listeners and emits synchronously in registration order", () => {
    const emitter = new TypedEventEmitter<TestEventMap>({
      timeProvider: () => 123,
    });
    const calls: string[] = [];

    emitter.on("alpha:ready", (payload, metadata) => {
      calls.push(`first:${String(payload.value)}:${String(metadata.timestamp)}:${metadata.source}`);
    });
    emitter.on("alpha:ready", (payload, metadata) => {
      calls.push(
        `second:${String(payload.value)}:${String(metadata.dispatchId)}:${String(metadata.listenerCount)}`,
      );
    });

    const metadata = emitter.emit(
      "alpha:ready",
      { value: 7 },
      { internal: { trace: true }, source: "unit" },
    );

    expect(metadata).toEqual({
      dispatchId: 1,
      internal: { trace: true },
      listenerCount: 2,
      source: "unit",
      timestamp: 123,
      type: "alpha:ready",
    });
    expect(calls).toEqual(["first:7:123:unit", "second:7:1:2"]);
  });

  it("supports once subscriptions and exact subscription cleanup", () => {
    const emitter = new TypedEventEmitter<TestEventMap>();
    const listener = vi.fn();
    const persistent = vi.fn();

    const onceSubscription = emitter.once("alpha:ready", listener);
    const persistentSubscription = emitter.on("alpha:ready", persistent);

    emitter.emit("alpha:ready", { value: 1 });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(onceSubscription.active).toBe(false);
    expect(persistentSubscription.active).toBe(true);

    persistentSubscription.unsubscribe();
    emitter.emit("alpha:ready", { value: 2 });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(persistent).toHaveBeenCalledTimes(1);
    expect(persistentSubscription.active).toBe(false);
  });

  it("allows duplicate listeners and removes one registration at a time", () => {
    const emitter = new TypedEventEmitter<TestEventMap>();
    const listener = vi.fn();

    emitter.on("alpha:ready", listener);
    emitter.on("alpha:ready", listener);

    emitter.emit("alpha:ready", { value: 1 });
    expect(listener).toHaveBeenCalledTimes(2);

    emitter.off("alpha:ready", listener);
    emitter.emit("alpha:ready", { value: 2 });

    expect(listener).toHaveBeenCalledTimes(3);
    expect(emitter.listenerCount("alpha:ready")).toBe(1);
  });

  it("supports listener inspection removal and total counts", () => {
    const emitter = new TypedEventEmitter<TestEventMap>();
    const first = vi.fn();
    const second = vi.fn();

    emitter.on("alpha:ready", first);
    emitter.on("beta:done", second);

    expect(emitter.listeners("alpha:ready")).toEqual([first]);
    expect(emitter.listenerCount("alpha:ready")).toBe(1);
    expect(emitter.listenerCount()).toBe(2);
    expect(emitter.hasListeners("beta:done")).toBe(true);
    expect(emitter.hasListeners()).toBe(true);

    emitter.removeAll("alpha:ready");
    expect(emitter.listeners("alpha:ready")).toEqual([]);
    expect(emitter.listenerCount()).toBe(1);

    emitter.removeAll();
    expect(emitter.listenerCount()).toBe(0);
    expect(emitter.hasListeners()).toBe(false);
  });

  it("isolates listener errors and records stats and definitions", () => {
    const capturedErrors: string[] = [];
    const definitions: readonly EventDefinition<"alpha:ready">[] = [
      {
        description: "Alpha ready event",
        name: "alpha:ready",
        public: true,
      },
    ];
    const emitter = new TypedEventEmitter<TestEventMap>({
      definitions,
      onListenerError: (error, context) => {
        capturedErrors.push(`${context.metadata.type}:${(error as Error).message}`);
      },
      timeProvider: () => 456,
    });
    const trailingListener = vi.fn();

    emitter.on("alpha:ready", () => {
      throw new Error("boom");
    });
    emitter.on("alpha:ready", trailingListener);

    const metadata = emitter.emit("alpha:ready", { value: 9 }, { source: "test" });

    expect(metadata.timestamp).toBe(456);
    expect(trailingListener).toHaveBeenCalledTimes(1);
    expect(capturedErrors).toEqual(["alpha:ready:boom"]);
    expect(emitter.definitions()).toEqual(definitions);
    expect(emitter.stats("alpha:ready")).toEqual({
      definition: definitions[0],
      emissionCount: 1,
      errorCount: 1,
      lastDispatchedAt: 456,
      lastDispatchSource: "test",
      listenerCount: 2,
    });
  });

  it("skips listeners that are unsubscribed earlier in the same dispatch", () => {
    const emitter = new TypedEventEmitter<TestEventMap>();
    const second = vi.fn();
    const secondSubscriptionRef: {
      current?: {
        unsubscribe(): void;
      };
    } = {};

    emitter.on("alpha:ready", () => {
      secondSubscriptionRef.current?.unsubscribe();
    });

    secondSubscriptionRef.current = emitter.on("alpha:ready", second);
    emitter.emit("alpha:ready", { value: 4 });

    expect(second).not.toHaveBeenCalled();
  });

  it("destroys the emitter and prevents future registration or dispatch", () => {
    const emitter = new TypedEventEmitter<TestEventMap>();
    const listener = vi.fn();

    emitter.on("alpha:ready", listener);
    emitter.destroy();

    expect(emitter.listenerCount()).toBe(0);
    expect(emitter.hasListeners()).toBe(false);
    expect(emitter.listeners("alpha:ready")).toEqual([]);
    expect(() => {
      emitter.on("alpha:ready", listener);
    }).toThrow("Cannot use a destroyed typed event emitter.");
    expect(() => {
      emitter.once("alpha:ready", listener);
    }).toThrow("Cannot use a destroyed typed event emitter.");
    expect(() => {
      emitter.emit("alpha:ready", { value: 1 });
    }).toThrow("Cannot use a destroyed typed event emitter.");
    expect(() => {
      emitter.destroy();
      emitter.off("alpha:ready", listener);
      emitter.removeAll();
    }).not.toThrow();
  });
});
