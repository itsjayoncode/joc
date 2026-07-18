// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { createForm, required } from "../../src/index.js";

describe("integration: core flows", () => {
  it("runs validate → submit → onSubmit lifecycle", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "", password: "" },
      validators: {
        email: [required],
        password: [required],
      },
      onSubmit,
    });

    expect(await form.submit()).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();

    form.setValue("email", "user@example.com");
    form.setValue("password", "secret123");
    expect(await form.submit()).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith(
      { email: "user@example.com", password: "secret123" },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(form.state.submitCount).toBe(1);
    form.destroy();
  });

  it("navigates wizard steps with per-step validation", async () => {
    const form = createForm({
      initialValues: { step1: "", step2: "" },
      validators: {
        step1: [required],
        step2: [required],
      },
      workflow: {
        wizard: {
          initialStep: 0,
          steps: [{ fields: ["step1"] }, { fields: ["step2"] }],
        },
      },
    });

    expect(await form.workflow.next()).toBe(false);
    expect(form.state.workflow.currentStep).toBe(0);

    form.setValue("step1", "ok");
    expect(await form.workflow.next()).toBe(true);
    expect(form.state.workflow.currentStep).toBe(1);
    expect(form.state.workflow.progress).toBe(100);

    form.workflow.prev();
    expect(form.state.workflow.currentStep).toBe(0);
    form.destroy();
  });

  it("debounces autosave and persists draft when configured", async () => {
    const onSave = vi.fn();
    const storageKey = "integration-autosave-draft";
    localStorage.removeItem(storageKey);

    const form = createForm({
      initialValues: { note: "" },
      workflow: {
        autosave: {
          enabled: true,
          debounceMs: 80,
          onSave,
        },
        draft: {
          enabled: true,
          storageKey,
        },
      },
    });

    form.setValue("note", "one");
    form.setValue("note", "two");
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(onSave).toHaveBeenCalled();
    expect(onSave.mock.calls.at(-1)?.[0]).toEqual({ note: "two" });

    const restored = createForm({
      initialValues: { note: "" },
      workflow: {
        draft: { enabled: true, storageKey },
      },
    });
    expect(restored.get("note")).toBe("two");

    form.destroy();
    restored.destroy();
    localStorage.removeItem(storageKey);
  });
});
