import { describe, expect, it, vi } from "vitest";

import { createConditionsApi, LifecycleError } from "@jayoncode/browser-lifecycle";

describe("createConditionsApi", () => {
  it("invokes handlers on matching public events", () => {
    const listeners = new Map<string, Set<() => void>>();
    const lifecycle = {
      on: (event: string, listener: () => void) => {
        const set = listeners.get(event) ?? new Set();
        set.add(listener);
        listeners.set(event, set);
        return () => set.delete(listener);
      },
    };

    const visible = vi.fn();
    const conditions = createConditionsApi(lifecycle as never);
    const handle = conditions.visible(visible);

    for (const listener of listeners.get("page:visible") ?? []) {
      listener();
    }
    expect(visible).toHaveBeenCalledTimes(1);

    handle.unsubscribe();
    expect(listeners.get("page:visible")?.size ?? 0).toBe(0);
    conditions.dispose();
  });

  it("isolates handler errors so the session subscription survives", () => {
    const listeners = new Map<string, Set<() => void>>();
    const onHandlerError = vi.fn();
    const lifecycle = {
      on: (event: string, listener: () => void) => {
        const set = listeners.get(event) ?? new Set();
        set.add(listener);
        listeners.set(event, set);
        return () => set.delete(listener);
      },
    };

    const conditions = createConditionsApi(lifecycle as never, { onHandlerError });
    conditions.hidden(() => {
      throw new Error("boom");
    });

    expect(() => {
      for (const listener of listeners.get("page:hidden") ?? []) {
        listener();
      }
    }).not.toThrow();
    expect(onHandlerError).toHaveBeenCalledTimes(1);

    conditions.dispose();
  });

  it("dispose unsubscribes all active handles", () => {
    const listeners = new Map<string, Set<() => void>>();
    const lifecycle = {
      on: (event: string, listener: () => void) => {
        const set = listeners.get(event) ?? new Set();
        set.add(listener);
        listeners.set(event, set);
        return () => set.delete(listener);
      },
    };

    const conditions = createConditionsApi(lifecycle as never);
    conditions.visible(() => undefined);
    conditions.online(() => undefined);
    conditions.dispose();

    expect(listeners.get("page:visible")?.size ?? 0).toBe(0);
    expect(listeners.get("connection:online")?.size ?? 0).toBe(0);
    expect(() => conditions.visible(() => undefined)).toThrow(LifecycleError);
  });
});
