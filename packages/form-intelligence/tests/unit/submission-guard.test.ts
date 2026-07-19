import { describe, expect, it, vi } from "vitest";

import { createForm, when } from "../../src/index.js";
import { evaluateSubmissionGuard } from "../../src/submission/guard.js";
import { ui } from "../../src/ui/index.js";

describe("submission guards (ADR-SUB-001)", () => {
  it("evaluateSubmissionGuard blocks alreadySubmitting and ruleDisabled", () => {
    expect(
      evaluateSubmissionGuard({
        alreadySubmitting: true,
        ruleSubmitDisabled: false,
      }),
    ).toEqual({ allowed: false, reasons: ["alreadySubmitting"] });

    expect(
      evaluateSubmissionGuard({
        alreadySubmitting: false,
        ruleSubmitDisabled: true,
      }),
    ).toEqual({ allowed: false, reasons: ["ruleDisabled"] });

    expect(
      evaluateSubmissionGuard({
        alreadySubmitting: false,
        ruleSubmitDisabled: false,
      }),
    ).toEqual({ allowed: true, reasons: [] });
  });

  it("ruleDisabled hard-blocks form.submit without calling onSubmit", async () => {
    const onSubmit = vi.fn();
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
      onSubmit,
    });

    form.field("plan");
    await form.validate();
    form.setValue("plan", "free");
    await Promise.resolve();

    expect(form.getPresentation().formUi.submitDisabled).toBe(true);
    expect(form.submissionGuard().allowed).toBe(false);
    expect(form.submissionGuard().reasons).toContain("ruleDisabled");
    expect(form.ui.canSubmit).toBe(false);

    const ok = await form.submit();
    expect(ok).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();

    form.destroy();
  });

  it("invalid form is not a hard guard — submit still runs validation UX", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "" },
      plugins: [ui()],
      schema: { email: { required: true } },
      onSubmit,
    });

    form.field("email");
    expect(form.submissionGuard().allowed).toBe(true);
    // Default disableSubmitWhen omits invalid → button may stay enabled.
    expect(form.ui.canSubmit).toBe(true);

    const ok = await form.submit();
    expect(ok).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(form.errors("email")).toBeTruthy();
    expect(form.field("email").touched).toBe(true);

    form.destroy();
  });

  it("validating is UX-only — does not appear as a hard guard reason", () => {
    expect(
      evaluateSubmissionGuard({
        alreadySubmitting: false,
        ruleSubmitDisabled: false,
      }).reasons,
    ).not.toContain("validating");
  });

  it("submissionGuard stays aligned with submit entry (in-flight)", async () => {
    let release: (() => void) | undefined;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    );
    const form = createForm({
      initialValues: { email: "a@b.com" },
      schema: { email: "email" },
      onSubmit,
    });

    const first = form.submit();
    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
    expect(form.submissionGuard().allowed).toBe(false);
    expect(form.submissionGuard().reasons).toContain("alreadySubmitting");
    expect(form.ui.canSubmit).toBe(false);
    expect(await form.submit()).toBe(false);

    release?.();
    await first;
    form.destroy();
  });
});
