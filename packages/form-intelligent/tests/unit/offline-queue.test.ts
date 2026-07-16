// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";

describe("offline submit queue", () => {
  it("queues payloads while offline and flushes on reconnect", async () => {
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
  });
});
