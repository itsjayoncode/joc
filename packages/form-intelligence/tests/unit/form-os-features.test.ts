// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { formatPhilippinePhone, resolveFormatPreset } from "../../src/format/index.js";
import { createForm } from "../../src/index.js";
import { when } from "../../src/rules/index.js";

describe("form OS features", () => {
  it("exposes form.state.isDirty", () => {
    const form = createForm({ initialValues: { email: "" } });
    expect(form.state.isDirty).toBe(false);
    form.setValue("email", "a@b.com");
    expect(form.state.isDirty).toBe(true);
  });

  it("supports autoSave.every shorthand", async () => {
    const onSave = vi.fn();
    const form = createForm({
      initialValues: { note: "" },
      autoSave: {
        every: "200ms",
        onSave,
      },
    });

    form.setValue("note", "hello");
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(onSave).toHaveBeenCalledWith({ note: "hello" });
    form.destroy();
  });

  it("supports validate(value) schema shorthand", async () => {
    const form = createForm({
      initialValues: { username: "" },
      schema: {
        username: {
          validate(value: unknown) {
            return value !== "admin" || "Username already taken";
          },
        },
      },
    });

    form.setValue("username", "admin");
    await form.validate();
    expect(form.errors("username")).toBe("Username already taken");
  });

  it("formats philippine-phone preset", () => {
    expect(formatPhilippinePhone("09171234567")).toBe("0917 123 4567");
    const preset = resolveFormatPreset("credit-card");
    expect(preset.format("4111111111111111")).toBe("4111 1111 1111 1111");
  });

  it("disables submit through business rules", async () => {
    const form = createForm({
      initialValues: { loanAmount: 600_000, managerApproval: "" },
      rules: [
        when("loanAmount")
          .greaterThan(500_000)
          .then((ctx) => {
            ctx.disableSubmit();
            ctx.require("managerApproval");
          }),
      ],
    });

    await vi.waitFor(() => {
      expect(form.state.formUi.submitDisabled).toBe(true);
      expect(form.state.fieldUi.managerApproval?.required).toBe(true);
    });
    form.destroy();
  });

  it("calculates derived fields", async () => {
    const form = createForm({
      initialValues: { price: 100, quantity: 5, total: 0 },
    });

    form.calculate("total", ({ values }) => Number(values.price) * Number(values.quantity));
    await vi.waitFor(() => {
      expect(form.get("total")).toBe(500);
    });

    form.setValue("quantity", 2);
    await vi.waitFor(() => {
      expect(form.get("total")).toBe(200);
    });
    form.destroy();
  });

  it("supports undo and redo", () => {
    const form = createForm({ initialValues: { email: "a@b.com" } });
    form.setValue("email", "c@d.com");
    expect(form.get("email")).toBe("c@d.com");
    expect(form.undo()).toBe(true);
    expect(form.get("email")).toBe("a@b.com");
    expect(form.redo()).toBe(true);
    expect(form.get("email")).toBe("c@d.com");
  });

  it("saveDraft persists without autosave", () => {
    const form = createForm({
      initialValues: { name: "" },
      workflow: {
        draft: { enabled: true, storageKey: "test-draft-standalone" },
      },
    });

    form.setValue("name", "Jay");
    form.saveDraft();

    const restored = createForm({
      initialValues: { name: "" },
      workflow: {
        draft: { enabled: true, storageKey: "test-draft-standalone" },
      },
    });

    expect(restored.get("name")).toBe("Jay");
    form.destroy();
    restored.destroy();
  });

  it("populates dependent field options", async () => {
    const form = createForm({
      initialValues: { country: "", province: "" },
      rules: [
        when("country")
          .changes(async (country) => {
            if (country === "Philippines") {
              return [
                { label: "Laguna", value: "Laguna" },
                { label: "Batangas", value: "Batangas" },
              ];
            }
            return [];
          })
          .populate("province"),
      ],
    });

    form.setValue("country", "Philippines");
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(form.state.fieldOptions.province?.length).toBe(2);
    form.destroy();
  });

  it("queues offline submissions", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      workflow: { offlineQueue: { enabled: true, storageKey: "offline-test" } },
      onSubmit,
      validators: { email: [(value) => (value ? true : "Required")] },
    });

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
    });

    const queued = await form.submit();
    expect(queued).toBe(true);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(form.state.submissionQueue.pending).toBe(1);
    form.destroy();
  });

  it("registers plugins via form.use", () => {
    const setup = vi.fn(() => undefined);
    const form = createForm({ initialValues: { x: "" } });
    form.use({ name: "test-plugin", setup });
    expect(setup).toHaveBeenCalled();
    form.destroy();
  });

  it("tracks analytics snapshot", async () => {
    const form = createForm({
      initialValues: { email: "" },
      workflow: { analytics: { enabled: true } },
      validators: {
        email: [(value) => (value ? true : "Required")],
      },
    });

    form.setValue("email", "");
    await form.validate();

    await vi.waitFor(() => {
      expect(form.getAnalytics().startedAt).toBeGreaterThan(0);
    });

    const analytics = form.getAnalytics();
    expect(analytics.errorCount).toBeGreaterThanOrEqual(0);
    expect(analytics.startedAt).toBeGreaterThan(0);
    form.destroy();
  });
});
