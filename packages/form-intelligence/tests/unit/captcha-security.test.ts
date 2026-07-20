// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";

import { captcha, mockCaptcha } from "../../src/captcha/index.js";
import { createForm } from "../../src/index.js";
import { ui } from "../../src/ui/index.js";

/**
 * Security / validation / performance invariants for CAPTCHA Security Stage (ADR-CAP-001).
 */
describe("captcha security & validation invariants", () => {
  afterEach(() => {
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });
  });

  it("never calls onSubmit when validation fails (Security Stage skipped)", async () => {
    const execute = vi.fn(async () => ({ provider: "mock", token: "t" }));
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "" },
      schema: { email: { required: true } },
      plugins: [captcha(mockCaptcha({ execute }))],
      onSubmit,
    });

    form.field("email");
    await expect(form.submit()).resolves.toBe(false);
    expect(execute).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    form.destroy();
  });

  it("never calls onSubmit when Security Stage fails", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [ui(), captcha(mockCaptcha({ failWith: "captchaUnavailable" }))],
      onSubmit,
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(form.ui.explain("submit").reasons).toContain("captchaUnavailable");
    form.destroy();
  });

  it("rejects empty or whitespace-only tokens (no forged empty proof)", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [
        ui(),
        captcha(
          mockCaptcha({
            execute: async () => ({ provider: "mock", token: "   " }),
          }),
        ),
      ],
      onSubmit,
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(form.ui.explain("submit").reasons).toContain("captchaFailed");
    form.destroy();
  });

  it("rejects already-expired tokens before onSubmit", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [
        ui(),
        captcha(
          mockCaptcha({
            token: "stale",
            expiresAt: Date.now() - 1_000,
          }),
        ),
      ],
      onSubmit,
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(form.ui.explain("submit").reasons).toContain("captchaExpired");
    form.destroy();
  });

  it("does not treat form field values as captcha tokens", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: {
        email: "a@b.com",
        "g-recaptcha-response": "attacker-forged",
        captcha: "attacker-forged",
      },
      plugins: [captcha(mockCaptcha({ failWith: "captchaFailed" }))],
      onSubmit,
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    form.destroy();
  });

  it("times out hanging execute and aborts without onSubmit", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [
        ui(),
        captcha({
          name: "hang",
          kind: "invisible",
          timeoutMs: 40,
          async load() {},
          execute: () => new Promise(() => {}),
        }),
      ],
      onSubmit,
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(form.ui.explain("submit").reasons).toContain("captchaTimeout");
    form.destroy();
  });

  it("blocks concurrent submit while captcha is in flight", async () => {
    let release!: (token: { provider: string; token: string }) => void;
    const gate = new Promise<{ provider: string; token: string }>((resolve) => {
      release = resolve;
    });

    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [
        captcha(
          mockCaptcha({
            execute: () => gate,
          }),
        ),
      ],
      onSubmit,
    });

    const first = form.submit();
    await Promise.resolve();
    const second = await form.submit();
    expect(second).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();

    release({ provider: "mock", token: "ok" });
    await expect(first).resolves.toBe(true);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    form.destroy();
  });

  it("cancelSubmit during captcha prevents onSubmit", async () => {
    let release!: (token: { provider: string; token: string }) => void;
    const gate = new Promise<{ provider: string; token: string }>((resolve) => {
      release = resolve;
    });

    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [
        captcha(
          mockCaptcha({
            execute: () => gate,
          }),
        ),
      ],
      onSubmit,
    });

    const pending = form.submit();
    await Promise.resolve();
    form.cancelSubmit();
    release({ provider: "mock", token: "late" });
    await expect(pending).resolves.toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    form.destroy();
  });

  it("ordering: validation → captcha → beforeSubmit → onSubmit", async () => {
    const order: string[] = [];
    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [
        captcha(
          mockCaptcha({
            execute: async () => {
              order.push("captcha");
              return { provider: "mock", token: "t" };
            },
          }),
        ),
        {
          name: "probe",
          setup(_form, api) {
            api.on("beforeSubmit", () => {
              order.push("beforeSubmit");
            });
          },
        },
      ],
      onSubmit: () => {
        order.push("onSubmit");
      },
    });

    await form.submit();
    expect(order).toEqual(["captcha", "beforeSubmit", "onSubmit"]);
    form.destroy();
  });

  it("runs Security Stage before offline enqueue and again on flush with meta.security", async () => {
    let challenge = 0;
    const execute = vi.fn(async () => {
      challenge += 1;
      return { provider: "mock", token: `tok-${String(challenge)}` };
    });
    const onSubmit = vi.fn();
    const storageKey = `fi-captcha-offline-${String(Math.random())}`;

    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [captcha(mockCaptcha({ execute }))],
      workflow: {
        offlineQueue: { enabled: true, storageKey },
      },
      onSubmit,
    });

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
    });

    await expect(form.submit()).resolves.toBe(true);
    expect(execute).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });

    const flushed = await form.flushOfflineQueue();
    expect(flushed.flushed).toBe(1);
    expect(flushed.failed).toBe(0);
    expect(execute).toHaveBeenCalledTimes(2);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0]?.[1]?.security?.captcha).toEqual({
      provider: "mock",
      token: "tok-2",
    });

    form.destroy();
  });

  it("does not enqueue offline when Security Stage fails", async () => {
    const onSubmit = vi.fn();
    const storageKey = `fi-captcha-offline-fail-${String(Math.random())}`;

    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [ui(), captcha(mockCaptcha({ failWith: "captchaFailed" }))],
      workflow: {
        offlineQueue: { enabled: true, storageKey },
      },
      onSubmit,
    });

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(form.state.submissionQueue.pending).toBe(0);
    expect(onSubmit).not.toHaveBeenCalled();

    form.destroy();
  });

  it("keeps queued item when flush Security Stage fails", async () => {
    let failFlush = false;
    const execute = vi.fn(async () => {
      if (failFlush) {
        throw new Error("flush captcha down");
      }
      return { provider: "mock", token: "ok" };
    });
    const onSubmit = vi.fn();
    const storageKey = `fi-captcha-offline-flush-fail-${String(Math.random())}`;

    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [captcha(mockCaptcha({ execute }))],
      workflow: {
        offlineQueue: { enabled: true, storageKey },
      },
      onSubmit,
    });

    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false,
    });
    await expect(form.submit()).resolves.toBe(true);
    expect(form.state.submissionQueue.pending).toBe(1);

    failFlush = true;
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });

    const flushed = await form.flushOfflineQueue();
    expect(flushed.flushed).toBe(0);
    expect(flushed.failed).toBe(1);
    expect(form.state.submissionQueue.pending).toBe(1);
    expect(onSubmit).not.toHaveBeenCalled();

    form.destroy();
  });
  it("surfaces captchaLoading until prepare finishes and notifies subscribers", async () => {
    let releaseLoad!: () => void;
    const loadGate = new Promise<void>((resolve) => {
      releaseLoad = resolve;
    });

    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [
        ui(),
        captcha({
          name: "slow-load",
          kind: "invisible",
          async load() {
            await loadGate;
          },
          async execute() {
            return { provider: "slow-load", token: "tok" };
          },
        }),
      ],
      onSubmit,
    });

    expect(form.ui.canSubmit).toBe(false);
    expect(form.ui.explain("submit").reasons).toContain("captchaLoading");
    expect(form.ui.explain("submit").contributors).toContain("security");

    const listener = vi.fn();
    form.subscribe(listener);

    releaseLoad();
    await vi.waitFor(() => {
      expect(form.ui.explain("submit").reasons).not.toContain("captchaLoading");
    });
    expect(form.ui.canSubmit).toBe(true);
    expect(listener).toHaveBeenCalled();

    await expect(form.submit()).resolves.toBe(true);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    form.destroy();
  });

  it("transitions prepare failure to captchaUnavailable (not stuck loading)", async () => {
    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [
        ui(),
        captcha({
          name: "broken-load",
          kind: "invisible",
          async load() {
            throw new Error("sdk down");
          },
          async execute() {
            return { provider: "broken-load", token: "tok" };
          },
        }),
      ],
      onSubmit: vi.fn(),
    });

    await vi.waitFor(() => {
      expect(form.ui.explain("submit").reasons).toContain("captchaUnavailable");
    });
    expect(form.ui.explain("submit").reasons).not.toContain("captchaLoading");
    expect(form.ui.canSubmit).toBe(false);
    form.destroy();
  });

  it("surfaces captchaPending while execute is in flight", async () => {
    let release!: (token: { provider: string; token: string }) => void;
    const gate = new Promise<{ provider: string; token: string }>((resolve) => {
      release = resolve;
    });

    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [
        ui(),
        captcha(
          mockCaptcha({
            execute: () => gate,
          }),
        ),
      ],
      onSubmit: vi.fn(),
    });

    await vi.waitFor(() => {
      expect(form.ui.explain("submit").reasons).not.toContain("captchaLoading");
    });

    const pending = form.submit();
    await vi.waitFor(() => {
      expect(form.ui.explain("submit").reasons).toContain("captchaPending");
    });
    expect(form.ui.canSubmit).toBe(false);

    release({ provider: "mock", token: "ok" });
    await expect(pending).resolves.toBe(true);
    expect(form.ui.explain("submit").reasons).not.toContain("captchaPending");
    form.destroy();
  });
});

describe("captcha performance", () => {
  const CI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
  const HEADROOM = CI ? 3 : 1.5;

  it("100 successful submits with mockCaptcha stay under budget", async () => {
    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [captcha(mockCaptcha({ token: "perf" }))],
      onSubmit: () => undefined,
    });

    // warm
    await form.submit();

    const started = performance.now();
    for (let index = 0; index < 100; index += 1) {
      await form.submit();
    }
    const elapsed = performance.now() - started;

    expect(elapsed).toBeLessThan(250 * HEADROOM);
    form.destroy();
  });
});
