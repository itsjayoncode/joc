// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";

import { hcaptcha } from "../../src/captcha/hcaptcha.js";
import { mockCaptcha } from "../../src/captcha/mock.js";
import { captcha } from "../../src/captcha/plugin.js";
import { recaptcha } from "../../src/captcha/recaptcha.js";
import { turnstile } from "../../src/captcha/turnstile.js";
import { createForm } from "../../src/index.js";
import { ui } from "../../src/ui/index.js";

import type { HcaptchaSdk } from "../../src/captcha/hcaptcha.js";
import type { RecaptchaSdk } from "../../src/captcha/recaptcha.js";
import type { TurnstileSdk } from "../../src/captcha/turnstile.js";

describe("captcha Security Stage (ADR-CAP-001)", () => {
  it("injects meta.security.captcha and runs before onSubmit", async () => {
    const order: string[] = [];
    const onSubmit = vi.fn((_values, meta) => {
      order.push("onSubmit");
      expect(meta?.security?.captcha).toEqual({
        provider: "mock",
        token: "tok_ok",
      });
    });

    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [
        captcha(mockCaptcha({ token: "tok_ok" })),
        {
          name: "order-probe",
          setup(_form, api) {
            api.on("beforeSubmit", () => {
              order.push("beforeSubmit");
            });
          },
        },
      ],
      onSubmit,
    });

    await expect(form.submit()).resolves.toBe(true);
    expect(order).toEqual(["beforeSubmit", "onSubmit"]);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    form.destroy();
  });

  it("aborts submit without calling onSubmit when captcha fails", async () => {
    const onSubmit = vi.fn();
    const form = createForm({
      initialValues: { email: "a@b.com" },
      plugins: [ui(), captcha(mockCaptcha({ failWith: "captchaFailed" }))],
      onSubmit,
    });

    await expect(form.submit()).resolves.toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(form.ui.explain("submit").reasons).toContain("captchaFailed");
    expect(form.ui.explain("submit").contributors).toContain("security");
    expect(form.ui.canSubmit).toBe(false);
    form.destroy();
  });

  it("runs Security Stage after validation and before beforeSubmit", async () => {
    const order: string[] = [];
    const form = createForm({
      initialValues: { email: "" },
      schema: { email: { required: true } },
      plugins: [
        captcha(
          mockCaptcha({
            provider: "ordered",
            execute: async () => {
              order.push("captcha");
              return { provider: "ordered", token: "t" };
            },
          }),
        ),
        {
          name: "hook",
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

    form.field("email");
    await expect(form.submit()).resolves.toBe(false);
    expect(order).toEqual([]);

    form.setValue("email", "a@b.com");
    await expect(form.submit()).resolves.toBe(true);
    expect(order).toEqual(["captcha", "beforeSubmit", "onSubmit"]);
    form.destroy();
  });

  it("turnstile provider uses injected sdk and returns token on execute", async () => {
    let callback: ((token: string) => void) | undefined;
    const sdk: TurnstileSdk = {
      render(_host, options) {
        callback = options.callback;
        return "widget-1";
      },
      execute() {
        callback?.("cf-token");
      },
      remove() {},
    };

    const host = document.createElement("div");
    document.body.appendChild(host);

    const provider = turnstile({
      siteKey: "test-key",
      container: host,
      sdk,
    });

    await provider.load();
    await provider.render?.(host);
    const token = await provider.execute();
    expect(token).toEqual({ provider: "turnstile", token: "cf-token" });

    host.remove();
  });

  it("recaptcha v3 executes via injected sdk", async () => {
    const sdk: RecaptchaSdk = {
      ready(cb) {
        cb();
      },
      async execute(_siteKey, opts) {
        expect(opts?.action).toBe("contact");
        return "grecaptcha-v3";
      },
    };

    const provider = recaptcha({
      siteKey: "site",
      action: "contact",
      sdk,
    });

    expect(provider.kind).toBe("invisible");
    await provider.load();
    await expect(provider.execute()).resolves.toEqual({
      provider: "recaptcha",
      token: "grecaptcha-v3",
    });
  });

  it("recaptcha v2 renders and returns callback token", async () => {
    let callback: ((token: string) => void) | undefined;
    const sdk: RecaptchaSdk = {
      ready(cb) {
        cb();
      },
      render(_host, options) {
        callback = options.callback;
        return 7;
      },
      getResponse: () => "",
      reset() {},
    };

    const host = document.createElement("div");
    const provider = recaptcha({
      siteKey: "site",
      version: "v2",
      container: host,
      sdk,
    });

    expect(provider.kind).toBe("widget");
    await provider.load();
    await provider.render?.(host);
    const pending = provider.execute();
    callback?.("grecaptcha-v2");
    await expect(pending).resolves.toEqual({ provider: "recaptcha", token: "grecaptcha-v2" });
  });

  it("hcaptcha provider uses injected sdk", async () => {
    let callback: ((token: string) => void) | undefined;
    const sdk: HcaptchaSdk = {
      render(_host, options) {
        callback = options.callback;
        return "hc-1";
      },
      execute() {
        callback?.("h-token");
        return Promise.resolve({ response: "h-token" });
      },
      remove() {},
    };

    const host = document.createElement("div");
    const provider = hcaptcha({
      siteKey: "site",
      container: host,
      sdk,
    });

    await provider.load();
    await provider.render?.(host);
    await expect(provider.execute()).resolves.toEqual({
      provider: "hcaptcha",
      token: "h-token",
    });
  });

  it("auto-places widget host before submit button when container omitted", async () => {
    const formEl = document.createElement("form");
    formEl.id = "captcha-auto";
    const btn = document.createElement("button");
    btn.type = "submit";
    formEl.appendChild(btn);
    document.body.appendChild(formEl);

    let renderedHost: HTMLElement | undefined;
    const onSubmit = vi.fn();

    const form = createForm({
      target: formEl,
      initialValues: { name: "x" },
      plugins: [
        captcha({
          name: "widget-mock",
          kind: "widget",
          async load() {},
          async render(host) {
            renderedHost = host;
          },
          async execute() {
            return { provider: "widget-mock", token: "auto" };
          },
        }),
      ],
      onSubmit,
    });

    await expect(form.submit()).resolves.toBe(true);
    expect(renderedHost).toBeTruthy();
    expect(renderedHost?.getAttribute("data-fi-captcha")).toBe("auto");
    expect(btn.previousSibling).toBe(renderedHost);
    expect(onSubmit.mock.calls[0]?.[1]?.security?.captcha?.token).toBe("auto");

    form.destroy();
    formEl.remove();
  });
});
