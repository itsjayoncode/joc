// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import type { BrowserLifecycle } from "@jayoncode/browser-lifecycle";

import { createForm } from "../../src/index.js";
import {
  createBrowserLifecyclePlugin,
  createKeyboardPlugin,
  keyboard,
} from "../../src/plugins/index.js";

function createTestLifecycle(): BrowserLifecycle & { trigger(event: string): void } {
  const handlers = new Map<string, Set<() => void>>();

  return {
    on(event, handler) {
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
    trigger(event) {
      for (const handler of handlers.get(event) ?? []) {
        handler();
      }
    },
  };
}

describe("integrations", () => {
  it("saves draft when tab becomes hidden", async () => {
    const lifecycle = createTestLifecycle();
    const form = createForm({
      initialValues: { notes: "draft me" },
      workflow: { draft: { enabled: true, storageKey: "integration-hidden-draft" } },
    });

    form.use(
      createBrowserLifecyclePlugin({
        lifecycle,
        saveDraftOnHidden: true,
        flushOfflineQueueOnOnline: false,
      }),
    );
    form.setValue("notes", "draft me");
    lifecycle.trigger("page:hidden");

    const restored = createForm({
      initialValues: { notes: "" },
      workflow: { draft: { enabled: true, storageKey: "integration-hidden-draft" } },
    });

    expect(restored.get("notes")).toBe("draft me");
    form.destroy();
    restored.destroy();
  });

  it("flushes offline queue when connection is restored", async () => {
    const lifecycle = createTestLifecycle();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const form = createForm({
      initialValues: { notes: "queued" },
      workflow: {
        offlineQueue: { enabled: true, storageKey: "integration-online-flush" },
      },
      onSubmit,
    });

    form.use(
      createBrowserLifecyclePlugin({
        lifecycle,
        saveDraftOnHidden: false,
        flushOfflineQueueOnOnline: true,
      }),
    );

    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: false,
    });

    await form.submit();
    expect(onSubmit).not.toHaveBeenCalled();

    Object.defineProperty(navigator, "onLine", {
      configurable: true,
      value: true,
    });
    lifecycle.trigger("connection:online");

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    form.destroy();
  });

  it("binds keyboard shortcuts", () => {
    const form = createForm({
      initialValues: { notes: "" },
      onSubmit: vi.fn(),
      validators: { notes: [(value) => (value ? true : "Required")] },
    });

    form.use(
      createKeyboardPlugin([
        keyboard.shortcut("Ctrl+S", (target) => {
          target.saveDraft();
        }),
      ]),
    );

    form.setValue("notes", "saved");
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "s", ctrlKey: true, bubbles: true }));

    form.destroy();
  });
});
