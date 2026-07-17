import { describe, expect, it, vi } from "vitest";

import { createWaitApi, LifecycleError } from "@jayoncode/browser-lifecycle";

import type { BrowserLifecycleSnapshot } from "../../src/core/session/types.js";

function snapshot(partial: Partial<BrowserLifecycleSnapshot> = {}): BrowserLifecycleSnapshot {
  return {
    activity: "unknown",
    attention: "unknown",
    capabilities: {
      abortController: true,
      broadcastChannel: false,
      connectivity: true,
      focus: true,
      idle: false,
      pageLifecycle: false,
      requestIdleCallback: false,
      visibility: true,
    },
    connectivity: "unknown",
    lifecycle: "unknown",
    phase: "running",
    tab: "single",
    timestamps: { createdAt: 1, updatedAt: 1 },
    visibility: "hidden",
    ...partial,
  };
}

describe("createWaitApi", () => {
  it("resolves immediately when the snapshot already matches", async () => {
    const on = vi.fn();
    const wait = createWaitApi({
      getSnapshot: () => snapshot({ visibility: "visible" }),
      on,
    });

    await expect(wait.untilVisible()).resolves.toBeUndefined();
    expect(on).not.toHaveBeenCalled();
    wait.dispose();
  });

  it("resolves on the matching public event and unsubscribes", async () => {
    let current = snapshot({ visibility: "hidden" });
    const listeners = new Map<string, Set<() => void>>();

    const wait = createWaitApi({
      getSnapshot: () => current,
      on: (event, listener) => {
        const set = listeners.get(event) ?? new Set();
        set.add(listener as () => void);
        listeners.set(event, set);
        return () => set.delete(listener as () => void);
      },
    });

    const pending = wait.untilVisible();
    expect(listeners.get("page:visible")?.size).toBe(1);

    current = snapshot({ visibility: "visible" });
    for (const listener of listeners.get("page:visible") ?? []) {
      listener();
    }

    await expect(pending).resolves.toBeUndefined();
    expect(listeners.get("page:visible")?.size ?? 0).toBe(0);
    wait.dispose();
  });

  it("rejects on timeout", async () => {
    vi.useFakeTimers();
    const wait = createWaitApi({
      getSnapshot: () => snapshot({ visibility: "hidden" }),
      on: () => () => undefined,
    });

    const pending = wait.untilVisible({ timeoutMs: 50 });
    vi.advanceTimersByTime(50);
    await expect(pending).rejects.toBeInstanceOf(LifecycleError);
    wait.dispose();
    vi.useRealTimers();
  });

  it("rejects when aborted", async () => {
    const controller = new AbortController();
    const wait = createWaitApi({
      getSnapshot: () => snapshot({ visibility: "hidden" }),
      on: () => () => undefined,
    });

    const pending = wait.untilVisible({ signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
    wait.dispose();
  });

  it("rejects pending waits when the wait API is disposed", async () => {
    const wait = createWaitApi({
      getSnapshot: () => snapshot({ visibility: "hidden" }),
      on: () => () => undefined,
    });

    const pending = wait.untilVisible();
    wait.dispose();
    await expect(pending).rejects.toBeInstanceOf(LifecycleError);
  });
});
