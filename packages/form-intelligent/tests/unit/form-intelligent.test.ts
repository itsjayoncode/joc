import { describe, expect, it, vi } from "vitest";

import { createForm, email, FormIntelligentError, required } from "../../src/index.js";

describe("createForm", () => {
  it("tracks values and field meta", () => {
    const form = createForm({
      initialValues: { email: "" },
    });

    const field = form.field("email", { validators: [required, email] });
    field.setValue("invalid");
    field.setTouched();

    expect(form.values("email")).toBe("invalid");
    expect(form.getFieldState("email").touched).toBe(true);
  });

  it("validates required fields", async () => {
    const form = createForm({
      initialValues: { name: "" },
      validators: {
        name: [required],
      },
    });

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.errors("name")).toBe("This field is required.");
  });

  it("submits when valid", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { name: "Jay" },
      onSubmit,
    });

    const ok = await form.submit();
    expect(ok).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith(
      { name: "Jay" },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("prevents double submit while in flight", async () => {
    let resolveSubmit: (() => void) | undefined;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    const form = createForm({
      initialValues: { name: "Jay" },
      onSubmit,
    });

    const first = form.submit();
    const second = await form.submit();
    expect(second).toBe(false);

    resolveSubmit?.();
    await first;
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("supports wizard navigation with step validation", async () => {
    const form = createForm({
      initialValues: { step1: "", step2: "" },
      validators: {
        step1: [required],
        step2: [required],
      },
      workflow: {
        wizard: {
          steps: [
            { id: "one", fields: ["step1"] },
            { id: "two", fields: ["step2"] },
          ],
        },
      },
    });

    const blocked = await form.workflow.next();
    expect(blocked).toBe(false);

    form.setValue("step1", "done");
    const advanced = await form.workflow.next();
    expect(advanced).toBe(true);
    expect(form.state.workflow.currentStep).toBe(1);
  });

  it("runs autosave workflow", async () => {
    vi.useFakeTimers();
    const onSave = vi.fn();

    const form = createForm({
      initialValues: { note: "" },
      workflow: {
        autosave: {
          enabled: true,
          debounceMs: 200,
          onSave,
        },
      },
    });

    form.setValue("note", "draft");
    vi.advanceTimersByTime(250);
    await Promise.resolve();

    expect(onSave).toHaveBeenCalledWith({ note: "draft" });
    vi.useRealTimers();
  });

  it("exposes field bindings for headless HTML integration", () => {
    const form = createForm({ initialValues: { email: "a@b.com" } });
    const binding = form.field("email").bind();

    expect(binding.name).toBe("email");
    expect(binding.value).toBe("a@b.com");
  });

  it("reads state imperatively without subscribe", async () => {
    const form = createForm({
      initialValues: { email: "" },
      validators: { email: [required] },
    });

    expect(form.state.values).toEqual({ email: "" });
    expect(form.getValues()).toEqual({ email: "" });
    expect(form.isValid()).toBe(true);
    expect(form.isSubmitting()).toBe(false);

    const valid = await form.validate();
    expect(valid).toBe(false);
    expect(form.isValid()).toBe(false);
    expect(form.getErrors().email).toBe("This field is required.");
    expect(form.state.errors.email).toBe("This field is required.");
  });

  it("exposes getSnapshot for external store integrations", () => {
    const form = createForm({ initialValues: { name: "Jay" } });
    expect(form.getSnapshot().values).toEqual({ name: "Jay" });
    expect(form.state).toEqual(form.getFormState());
  });
});

describe("errors", () => {
  it("returns false when submit handler is missing", async () => {
    const form = createForm({ initialValues: { ok: true } });
    await expect(form.submit()).resolves.toBe(false);
  });

  it("exports typed error hierarchy", () => {
    expect(new FormIntelligentError("x", "configuration_error").code).toBe("configuration_error");
  });
});
