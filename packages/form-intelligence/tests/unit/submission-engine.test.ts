import { describe, expect, it, vi } from "vitest";

import { createForm } from "../../src/index.js";
import { SubmissionOrchestrator, mapSubmissionErrors } from "../../src/submission/index.js";
import { waitForRetry } from "../../src/submission/retry.js";

describe("submission engine", () => {
  it("prevents double submit by default", async () => {
    const onSubmit = vi.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 50)));
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit,
    });

    const first = form.submit();
    const second = form.submit();
    expect(await second).toBe(false);
    expect(await first).toBe(true);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    form.destroy();
  });

  it("retries failed submits when retry policy is configured", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValueOnce(new Error("temporary"))
      .mockResolvedValueOnce(undefined);

    const orchestrator = new SubmissionOrchestrator<{ email: string }>();
    const result = await orchestrator.execute({
      values: { email: "a@b.com" },
      submitCount: 0,
      onSubmit,
      options: { retry: { maxAttempts: 2, delayMs: 0 } },
    });

    expect(result.ok).toBe(true);
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it("cancels in-flight submit and returns to idle", async () => {
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit: async (_values, meta) => {
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(resolve, 100);
          meta?.signal?.addEventListener(
            "abort",
            () => {
              clearTimeout(timer);
              reject(new DOMException("Submit cancelled.", "AbortError"));
            },
            { once: true },
          );
        });
      },
    });

    const pending = form.submit();
    form.cancelSubmit();
    expect(await pending).toBe(false);
    expect(form.state.submitPhase).toBe("idle");
    form.destroy();
  });

  it("maps server field errors onto form state", async () => {
    const form = createForm({
      initialValues: { email: "", password: "" },
      onSubmit: async () => {
        throw {
          fieldErrors: {
            email: "Email already exists.",
          },
          formError: "Signup failed.",
        };
      },
    });

    const ok = await form.submit();
    expect(ok).toBe(false);
    expect(form.errors("email")).toBe("Email already exists.");
    expect(form.errors("_form")).toBe("Signup failed.");
    expect(form.state.submitPhase).toBe("error");
    form.destroy();
  });

  it("maps nested errors object shape", () => {
    const mapped = mapSubmissionErrors({
      errors: {
        username: "Taken",
      },
    });
    expect(mapped.fieldErrors.username).toBe("Taken");
  });
});

describe("retry helpers", () => {
  it("waits until delay elapses", async () => {
    const controller = new AbortController();
    const started = Date.now();
    await waitForRetry(20, controller.signal);
    expect(Date.now() - started).toBeGreaterThanOrEqual(15);
  });
});
