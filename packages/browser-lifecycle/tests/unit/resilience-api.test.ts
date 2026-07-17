import { describe, expect, it, vi } from "vitest";

import { createResilienceApi, LifecycleError } from "@jayoncode/browser-lifecycle";

describe("createResilienceApi", () => {
  it("maps reconnect/wake/restore to catalog events", () => {
    const listeners = new Map<string, Set<(event: unknown) => void>>();
    const lifecycle = {
      on: (event: string, listener: (event: unknown) => void) => {
        const set = listeners.get(event) ?? new Set();
        set.add(listener);
        listeners.set(event, set);
        return () => set.delete(listener);
      },
    };

    const onReconnect = vi.fn();
    const onWake = vi.fn();
    const onRestore = vi.fn();
    const resilience = createResilienceApi(lifecycle as never);

    const offReconnect = resilience.onReconnect(onReconnect);
    resilience.onWake(onWake);
    resilience.onRestore(onRestore);

    for (const listener of listeners.get("connection:reconnect") ?? []) {
      listener({ type: "connection:reconnect" });
    }
    for (const listener of listeners.get("page:resume") ?? []) {
      listener({ type: "page:resume" });
    }
    for (const listener of listeners.get("session:restored") ?? []) {
      listener({ type: "session:restored" });
    }

    expect(onReconnect).toHaveBeenCalledTimes(1);
    expect(onWake).toHaveBeenCalledTimes(1);
    expect(onRestore).toHaveBeenCalledTimes(1);

    const onRecover = vi.fn();
    const offRecover = resilience.onRecover(onRecover);
    for (const listener of listeners.get("connection:reconnect") ?? []) {
      listener({ type: "connection:reconnect" });
    }
    expect(onRecover).toHaveBeenCalled();
    offRecover();

    offReconnect();
    expect(listeners.get("connection:reconnect")?.size ?? 0).toBe(0);

    resilience.dispose();
    expect(listeners.get("page:resume")?.size ?? 0).toBe(0);
    expect(listeners.get("session:restored")?.size ?? 0).toBe(0);
  });

  it("isolates handler errors", () => {
    const listeners = new Map<string, Set<(event: unknown) => void>>();
    const onHandlerError = vi.fn();
    const lifecycle = {
      on: (event: string, listener: (event: unknown) => void) => {
        const set = listeners.get(event) ?? new Set();
        set.add(listener);
        listeners.set(event, set);
        return () => set.delete(listener);
      },
    };

    const resilience = createResilienceApi(lifecycle as never, { onHandlerError });
    resilience.onReconnect(() => {
      throw new Error("flush failed");
    });

    expect(() => {
      for (const listener of listeners.get("connection:reconnect") ?? []) {
        listener({ type: "connection:reconnect" });
      }
    }).not.toThrow();
    expect(onHandlerError).toHaveBeenCalledTimes(1);
    resilience.dispose();
  });

  it("rejects registration after dispose", () => {
    const resilience = createResilienceApi({
      on: () => () => undefined,
    } as never);
    resilience.dispose();
    expect(() => resilience.onWake(() => undefined)).toThrow(LifecycleError);
  });
});
