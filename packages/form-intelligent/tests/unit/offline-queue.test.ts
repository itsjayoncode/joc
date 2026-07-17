// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { createForm, OfflineQueueError } from "../../src/index.js";
import { clearOfflineQueue, OfflineSubmitQueue } from "../../src/offline/index.js";
import { createBrowserLifecyclePlugin } from "../../src/plugins/index.js";

describe("offline submit queue", () => {
  it("queues payloads while offline and flushes on reconnect", async () => {
    clearOfflineQueue("offline-queue-test");
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      workflow: { offlineQueue: { enabled: true, storageKey: "offline-queue-test" } },
      validators: { email: [(value) => (value ? true : "Required")] },
      onSubmit,
    });

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
    });

    await form.submit();
    expect(form.state.submissionQueue.pending).toBe(1);
    expect(onSubmit).not.toHaveBeenCalled();

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });

    const result = await form.flushOfflineQueue();
    expect(result.flushed).toBe(1);
    expect(onSubmit).toHaveBeenCalledWith({ email: "a@b.com" });
    expect(form.state.submissionQueue.pending).toBe(0);
    form.destroy();
    clearOfflineQueue("offline-queue-test");
  });

  it("guards against double flush", async () => {
    clearOfflineQueue("offline-double-flush");
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const onSubmit = vi.fn(async () => {
      await gate;
    });

    const form = createForm({
      initialValues: { email: "a@b.com" },
      workflow: { offlineQueue: { enabled: true, storageKey: "offline-double-flush" } },
      onSubmit,
    });

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
    });
    await form.submit();

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });

    const first = form.flushOfflineQueue();
    const second = await form.flushOfflineQueue();
    expect(second).toEqual({ flushed: 0, failed: 0 });
    release();
    await expect(first).resolves.toEqual({ flushed: 1, failed: 0 });
    form.destroy();
    clearOfflineQueue("offline-double-flush");
  });

  it("drops oldest items when maxItems overflow policy applies", () => {
    clearOfflineQueue("offline-overflow");
    const dropped: string[] = [];
    const queue = new OfflineSubmitQueue<{ n: number }>("offline-overflow", {
      maxItems: 2,
      overflow: "drop-oldest",
      onOverflow: (item) => {
        dropped.push(String(item.values.n));
      },
    });

    expect(queue.enqueue({ n: 1 })).toBe(true);
    expect(queue.enqueue({ n: 2 })).toBe(true);
    expect(queue.enqueue({ n: 3 })).toBe(true);
    expect(queue.getState().pending).toBe(2);
    expect(dropped).toEqual(["1"]);
    clearOfflineQueue("offline-overflow");
  });

  it("rejects enqueue when overflow policy is reject", () => {
    clearOfflineQueue("offline-reject");
    const queue = new OfflineSubmitQueue<{ n: number }>("offline-reject", {
      maxItems: 1,
      overflow: "reject",
    });

    expect(queue.enqueue({ n: 1 })).toBe(true);
    expect(() => queue.enqueue({ n: 2 })).toThrow(OfflineQueueError);
    clearOfflineQueue("offline-reject");
  });

  it("dedupes by idempotency key", () => {
    clearOfflineQueue("offline-idem");
    const queue = new OfflineSubmitQueue<{ email: string }>("offline-idem", {
      idempotencyKey: (values) => values.email,
    });

    expect(queue.enqueue({ email: "a@b.com" })).toBe(true);
    expect(queue.enqueue({ email: "a@b.com" })).toBe(false);
    expect(queue.getState().pending).toBe(1);
    clearOfflineQueue("offline-idem");
  });

  it("honors onConflict drop during flush", async () => {
    clearOfflineQueue("offline-conflict");
    const onConflict = vi.fn(() => "drop" as const);
    const queue = new OfflineSubmitQueue<{ email: string }>("offline-conflict", {
      onConflict,
    });
    queue.enqueue({ email: "bad@x.com" });
    queue.enqueue({ email: "good@x.com" });

    const result = await queue.flush(async (values) => values.email.startsWith("good"));
    expect(result).toEqual({ flushed: 1, failed: 1 });
    expect(onConflict).toHaveBeenCalled();
    expect(queue.getState().pending).toBe(0);
    clearOfflineQueue("offline-conflict");
  });

  it("flushes on window online event", async () => {
    clearOfflineQueue("offline-online-event");
    const queue = new OfflineSubmitQueue<{ email: string }>("offline-online-event");
    queue.enqueue({ email: "a@b.com" });

    const flush = vi.fn(async () => {
      await queue.flush(async () => true);
    });
    queue.listenOnline(flush);

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });
    window.dispatchEvent(new Event("online"));

    await vi.waitFor(() => {
      expect(flush).toHaveBeenCalled();
    });
    expect(queue.getState().pending).toBe(0);
    queue.destroy();
    clearOfflineQueue("offline-online-event");
  });
});

describe("offline lifecycle integration", () => {
  it("flushes via browser lifecycle connection:online", async () => {
    clearOfflineQueue("offline-lifecycle");
    const handlers = new Map<string, Set<() => void>>();
    const lifecycle = {
      on(event: string, handler: () => void) {
        const set = handlers.get(event) ?? new Set();
        set.add(handler);
        handlers.set(event, set);
        return () => {
          set.delete(handler);
        };
      },
      start() {},
      dispose() {},
      isRunning() {
        return true;
      },
      trigger(event: string) {
        for (const handler of handlers.get(event) ?? []) {
          handler();
        }
      },
    };

    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const form = createForm({
      initialValues: { notes: "queued" },
      workflow: {
        offlineQueue: { enabled: true, storageKey: "offline-lifecycle" },
      },
      onSubmit,
    });

    form.use(
      createBrowserLifecyclePlugin({
        lifecycle: lifecycle as never,
        saveDraftOnHidden: false,
        flushOfflineQueueOnOnline: true,
      }),
    );

    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: false,
    });
    await form.submit();

    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: true,
    });
    lifecycle.trigger("connection:online");

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
    form.destroy();
    clearOfflineQueue("offline-lifecycle");
  });
});
