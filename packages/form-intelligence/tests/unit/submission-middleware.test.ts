import { describe, expect, it, vi } from "vitest";

import { createForm, MIDDLEWARE_HOOK_MAP } from "../../src/index.js";
import { SubmissionOrchestrator } from "../../src/submission/index.js";

describe("submit phase machine", () => {
  it("tracks idle → validating → submitting → success", async () => {
    const phases: string[] = [];
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit: async () => {
        phases.push(form.state.submitPhase);
      },
    });

    expect(form.state.submitPhase).toBe("idle");
    const pending = form.submit();
    await vi.waitFor(() => {
      expect(["validating", "submitting", "success"]).toContain(form.state.submitPhase);
    });
    await pending;
    expect(phases).toEqual(["submitting"]);
    expect(form.state.submitPhase).toBe("success");
    form.destroy();
  });

  it("settles to error when onSubmit fails", async () => {
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit: async () => {
        throw new Error("boom");
      },
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(form.state.submitPhase).toBe("error");
    form.destroy();
  });
});

describe("submission middleware", () => {
  it("documents middleware ↔ hook mapping", () => {
    expect(MIDDLEWARE_HOOK_MAP.beforeSubmit).toBe("beforeSubmit");
    expect(MIDDLEWARE_HOOK_MAP.afterSubmit).toBe("afterSubmit");
  });

  it("runs middleware before plugin hooks and respects order", async () => {
    const calls: string[] = [];
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit: vi.fn(),
    });

    form.useMiddleware({
      name: "mw-outer",
      order: 0,
      phases: ["beforeSubmit"],
      run: async (_ctx, next) => {
        calls.push("mw-outer");
        await next();
      },
    });

    form.useMiddleware({
      name: "mw-inner",
      order: 10,
      phases: ["beforeSubmit"],
      run: async (_ctx, next) => {
        calls.push("mw-inner");
        await next();
      },
    });

    form.use({
      name: "hook",
      setup(_form, api) {
        api.on("beforeSubmit", () => {
          calls.push("hook");
        });
      },
    });

    await form.submit();
    expect(calls).toEqual(["mw-outer", "mw-inner", "hook"]);
    form.destroy();
  });

  it("cancels submit when middleware calls halt", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit,
    });

    form.useMiddleware({
      name: "block",
      phases: ["beforeSubmit"],
      run: (ctx) => {
        ctx.halt("blocked");
      },
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(form.state.submitPhase).toBe("idle");
    form.destroy();
  });

  it("invokes submitError middleware on handler failure", async () => {
    const onError = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit: async () => {
        throw new Error("fail");
      },
    });

    form.useMiddleware({
      name: "errors",
      phases: ["submitError"],
      run: async (ctx, next) => {
        onError(ctx.meta.error ?? ctx.meta.formError);
        await next();
      },
    });

    await form.submit();
    expect(onError).toHaveBeenCalled();
    form.destroy();
  });

  it("isolates throwing beforeSubmit middleware without bricking the form", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit,
    });

    form.useMiddleware({
      name: "boom",
      phases: ["beforeSubmit"],
      run: async () => {
        throw new Error("mw boom");
      },
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    form.setValue("email", "ok@x.com");
    expect(form.values().email).toBe("ok@x.com");
    form.destroy();
  });
});

describe("submission engine form-level", () => {
  it("retries via form.submit retry option", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValueOnce(new Error("temporary"))
      .mockResolvedValueOnce(undefined);

    const form = createForm({
      initialValues: { email: "a@b.com" },
      onSubmit,
    });

    await expect(form.submit({ retry: { maxAttempts: 2, delayMs: 0 } })).resolves.toBe(true);
    expect(onSubmit).toHaveBeenCalledTimes(2);
    form.destroy();
  });

  it("prevents double submit before validate completes", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });

    const form = createForm({
      initialValues: { email: "a@b.com" },
      validators: {
        email: [
          async () => {
            await gate;
            return true;
          },
        ],
      },
      onSubmit: vi.fn(),
    });

    const first = form.submit();
    const second = form.submit();
    expect(await second).toBe(false);
    release();
    expect(await first).toBe(true);
    form.destroy();
  });
});

describe("orchestrator begin reuse", () => {
  it("reuses active abort signal across begin + execute", async () => {
    const orchestrator = new SubmissionOrchestrator<{ email: string }>();
    const signal = orchestrator.begin();
    const onSubmit = vi.fn(async (_values, meta) => {
      expect(meta?.signal).toBe(signal);
    });

    const result = await orchestrator.execute({
      values: { email: "a@b.com" },
      submitCount: 0,
      onSubmit,
    });

    expect(result.ok).toBe(true);
  });
});
