/**
 * SSR / Node smoke — must not touch `window` / `document` on import or createForm.
 * @vitest-environment node
 */
import { describe, expect, it } from "vitest";

describe("SSR smoke", () => {
  it("imports createForm without a DOM global", async () => {
    expect(typeof globalThis.window).toBe("undefined");
    expect(typeof globalThis.document).toBe("undefined");

    const { createForm, computeFieldAria, createFormController } =
      await import("../../src/index.js");

    const form = createForm({
      initialValues: { email: "" },
      onSubmit() {
        return undefined;
      },
    });

    form.setValue("email", "a@b.com");
    expect(form.values().email).toBe("a@b.com");
    expect(computeFieldAria({ error: undefined, required: false }).aria.ariaInvalid).toBe(false);

    const controller = createFormController(form);
    expect(controller.getSnapshot().values.email).toBe("a@b.com");

    // Draft/offline disabled paths are no-ops without storage.
    await expect(form.restoreDraft()).resolves.toBe(false);
    await expect(form.flushOfflineQueue()).resolves.toEqual({ flushed: 0, failed: 0 });

    form.destroy();
  });

  it("imports /devtools without requiring window", async () => {
    const { getFormDevTools, createDevToolsPlugin } = await import("../../src/devtools/index.js");
    expect(typeof getFormDevTools).toBe("function");
    expect(typeof createDevToolsPlugin).toBe("function");
  });
});
