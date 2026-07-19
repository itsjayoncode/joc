import { describe, expect, it, vi } from "vitest";

import { createForm, required, when } from "../../src/index.js";
import {
  canSubmit,
  createUiProjection,
  explainDisabled,
  explainSubmit,
  projectFieldUi,
  shouldShowError,
  snapshotUiProjection,
  ui,
  DEFAULT_UI_POLICIES,
  hasUiPoliciesRegistered,
} from "../../src/ui/index.js";

describe("ui projection — showError policy", () => {
  it("touched policy matches legacy DOM (error + touched)", () => {
    expect(
      shouldShowError({
        error: "Required",
        touched: false,
        submitCount: 0,
        errorDisplay: "touched",
      }),
    ).toBe(false);

    expect(
      shouldShowError({
        error: "Required",
        touched: true,
        submitCount: 0,
        errorDisplay: "touched",
      }),
    ).toBe(true);
  });

  it("submit / touchedOrSubmit / always policies", () => {
    expect(
      shouldShowError({
        error: "Required",
        touched: false,
        submitCount: 1,
        errorDisplay: "submit",
      }),
    ).toBe(true);

    expect(
      shouldShowError({
        error: "Required",
        touched: true,
        submitCount: 0,
        errorDisplay: "touchedOrSubmit",
      }),
    ).toBe(true);

    expect(
      shouldShowError({
        error: "Required",
        touched: false,
        submitCount: 0,
        errorDisplay: "always",
      }),
    ).toBe(true);
  });

  it("hides errors while validating", () => {
    expect(
      shouldShowError({
        error: "Required",
        touched: true,
        submitCount: 0,
        isValidating: true,
        errorDisplay: "touched",
      }),
    ).toBe(false);
  });
});

describe("ui projection — canSubmit", () => {
  it("defaults block submitting, validating, and ruleDisabled — not invalid", () => {
    expect(
      canSubmit({
        isValidating: false,
        isValid: false,
        policies: DEFAULT_UI_POLICIES,
      }),
    ).toBe(true);

    expect(
      canSubmit({
        guard: { allowed: false, reasons: ["alreadySubmitting"] },
        isValidating: false,
        isValid: true,
        policies: DEFAULT_UI_POLICIES,
      }),
    ).toBe(false);

    const ruleBlocked = explainSubmit({
      guard: { allowed: false, reasons: ["ruleDisabled"] },
      isValidating: false,
      isValid: true,
      policies: {
        errorDisplay: "touched",
        disableSubmitWhen: ["submitting"],
      },
    });
    expect(ruleBlocked.value).toBe(false);
    expect(ruleBlocked.reasons).toContain("ruleDisabled");
  });

  it("invalid only blocks when policy includes invalid", () => {
    expect(
      canSubmit({
        isValidating: false,
        isValid: false,
        policies: {
          errorDisplay: "touched",
          disableSubmitWhen: ["invalid"],
        },
      }),
    ).toBe(false);
  });
});

describe("ui projection — form.ui + field.ui", () => {
  it("exposes derived keys on field.ui with defaults", () => {
    const form = createForm({
      initialValues: { email: "" },
      schema: { email: { required: true } },
    });
    form.field("email");
    form.setError("email", "Required");

    const uiState = form.field("email").ui;
    expect(uiState.hasError).toBe(true);
    expect(uiState.errorMessage).toBe("Required");
    expect(uiState.showError).toBe(false);

    form.field("email").setTouched(true);
    expect(form.field("email").ui.showError).toBe(true);

    form.destroy();
  });

  it("form.ui.canSubmit and explain(submit)", () => {
    const form = createForm({
      initialValues: { email: "" },
      plugins: [ui()],
    });

    expect(hasUiPoliciesRegistered(form)).toBe(true);
    expect(form.ui.canSubmit).toBe(true);

    const projection = createUiProjection(form);
    expect(projection.explain("submit").value).toBe(true);

    form.destroy();
  });

  it("ui plugin + rules disableSubmit blocks canSubmit", async () => {
    const form = createForm({
      initialValues: { plan: "free" },
      plugins: [ui()],
      rules: [
        when("plan")
          .equals("free")
          .then((ctx) => {
            ctx.disableSubmit();
          }),
      ],
    });

    form.field("plan");
    await form.validate();
    // rules recompute on value changes
    form.setValue("plan", "free");
    await Promise.resolve();

    expect(form.getPresentation().formUi.submitDisabled).toBe(true);
    expect(form.ui.canSubmit).toBe(false);
    expect(form.ui.submitBlockedReasons).toContain("ruleDisabled");
    expect(form.ui.explain("submit").contributors).toContain("presentation");

    form.destroy();
  });

  it("projectFieldUi separates hasError from showError", () => {
    const derived = projectFieldUi({
      error: "Nope",
      touched: false,
      submitCount: 0,
      isValidating: false,
      policies: DEFAULT_UI_POLICIES,
    });
    expect(derived.hasError).toBe(true);
    expect(derived.showError).toBe(false);
    expect(derived.status).toBe("idle");
  });

  it("status priority: validating > error > success > idle", () => {
    expect(
      projectFieldUi({
        error: "Nope",
        touched: true,
        submitCount: 0,
        isValidating: true,
        policies: DEFAULT_UI_POLICIES,
      }).status,
    ).toBe("validating");

    expect(
      projectFieldUi({
        error: "Nope",
        touched: true,
        submitCount: 0,
        isValidating: false,
        policies: DEFAULT_UI_POLICIES,
      }).status,
    ).toBe("error");

    expect(
      projectFieldUi({
        error: undefined,
        touched: true,
        submitCount: 0,
        isValidating: false,
        policies: DEFAULT_UI_POLICIES,
      }).status,
    ).toBe("success");

    expect(
      projectFieldUi({
        error: undefined,
        touched: false,
        submitCount: 0,
        isValidating: false,
        policies: DEFAULT_UI_POLICIES,
      }).status,
    ).toBe("idle");
  });

  it("invalidFields lists errored paths", () => {
    const form = createForm({ initialValues: { a: "", b: "" }, plugins: [ui()] });
    form.field("a");
    form.field("b");
    form.setError("b", "bad");
    form.setError("a", "bad");
    expect(form.ui.invalidFields).toEqual(["a", "b"]);
    form.destroy();
  });

  it("collections: visible / required / validating in registration order", async () => {
    const form = createForm({
      initialValues: { a: "", b: "", c: "" },
      plugins: [ui()],
      rules: [
        when("a")
          .equals("")
          .then((ctx) => {
            ctx.hide("b");
            ctx.require("c");
          }),
      ],
    });

    form.field("a");
    form.field("b");
    form.field("c");
    form.setValue("a", "");
    await Promise.resolve();

    expect(form.ui.visibleFields).toEqual(["a", "c"]);
    expect(form.ui.requiredFields).toEqual(["c"]);
    expect(form.ui.validatingFields).toEqual([]);

    form.destroy();
  });

  it("explain(disabled) composes presentation + submission + validation", async () => {
    const form = createForm({
      initialValues: { email: "" },
      plugins: [ui()],
      rules: [
        when("email")
          .equals("x")
          .then((ctx) => {
            ctx.disable("email");
          }),
      ],
    });

    form.field("email");
    expect(form.ui.explain("disabled", "email").value).toBe(false);
    expect(form.field("email").ui.disabledReasons).toEqual([]);

    form.setValue("email", "x");
    await Promise.resolve();

    const disabled = form.ui.explain("disabled", "email");
    expect(disabled.value).toBe(true);
    expect(disabled.reasons).toContain("ruleDisabled");
    expect(disabled.contributors).toContain("presentation");
    expect(form.field("email").ui.disabledReasons).toContain("ruleDisabled");
    expect(form.field("email").ui.explain("disabled").reasons).toContain("ruleDisabled");

    form.destroy();
  });

  it("explainDisabled unit: formSubmitting and asyncValidating", () => {
    expect(
      explainDisabled({
        disabled: false,
        readOnly: true,
        isSubmitting: true,
        isValidating: true,
      }),
    ).toMatchObject({
      value: true,
      reasons: ["readOnly", "formSubmitting", "asyncValidating"],
    });
  });
});

describe("ui projection — snapshot + cost smoke", () => {
  it("includes submissionGuard and presentation required flags", async () => {
    const form = createForm({
      initialValues: { email: "" },
      validators: { email: [required] },
      plugins: [ui()],
      rules: [when("email").equals("block").disableSubmit()],
    });
    form.field("email");

    await vi.waitFor(() => {
      const snap = snapshotUiProjection(form);
      expect(snap.submissionGuard.allowed).toBe(true);
      expect(snap.formUi.submitDisabled).toBe(false);
      expect(snap.requiredFields).toEqual(["email"]);
      expect(snap.fields[0]?.required).toBe(true);
      expect(snap.fields[0]?.status).toBeDefined();
    });

    form.setValue("email", "block");
    await vi.waitFor(() => {
      const blocked = snapshotUiProjection(form);
      expect(blocked.submissionGuard.allowed).toBe(false);
      expect(blocked.submissionGuard.reasons).toContain("ruleDisabled");
      expect(blocked.canSubmit).toBe(false);
      expect(blocked.submitExplain.reasons).toContain("ruleDisabled");
    });

    form.destroy();
  });

  it("snapshotUiProjection is stable and cheap on a mid-size form", () => {
    const initialValues: Record<string, string> = {};
    for (let index = 0; index < 40; index += 1) {
      initialValues[`f${String(index)}`] = "";
    }

    const form = createForm({
      initialValues,
      plugins: [ui()],
    });
    for (const path of Object.keys(initialValues)) {
      form.field(path);
    }

    const first = snapshotUiProjection(form);
    expect(first.fields).toHaveLength(40);
    expect(first.canSubmit).toBe(true);

    const started = performance.now();
    for (let index = 0; index < 25; index += 1) {
      snapshotUiProjection(form);
    }
    const elapsed = performance.now() - started;
    // Soft budget: 25 full snapshots of 40 fields should stay well under 100ms in CI.
    expect(elapsed).toBeLessThan(100);

    form.destroy();
  });
});
