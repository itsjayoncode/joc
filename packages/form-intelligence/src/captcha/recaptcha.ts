import { CaptchaError } from "./errors.js";
import { loadCaptchaScript } from "./load-script.js";

import type { CaptchaContainer, CaptchaSetup, CaptchaToken } from "./types.js";

const DEFAULT_V2_SCRIPT = "https://www.google.com/recaptcha/api.js?render=explicit";
const DEFAULT_V3_SCRIPT = "https://www.google.com/recaptcha/api.js?render=";

/** Minimal grecaptcha surface used by this provider (injectable for tests). */
export interface RecaptchaSdk {
  ready(cb: () => void): void;
  render?(
    host: HTMLElement | string,
    options: {
      sitekey: string;
      theme?: "light" | "dark";
      size?: "normal" | "compact" | "invisible";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ): number;
  execute?(siteKeyOrWidgetId: string | number, options?: { action?: string }): Promise<string>;
  reset?(widgetId?: number): void;
  getResponse?(widgetId?: number): string;
}

export interface RecaptchaOptions {
  readonly siteKey: string;
  /**
   * `v3` is invisible (execute-only). `v2` is a checkbox/widget.
   * Default: `v3` when `action` is set, otherwise `v2`.
   */
  readonly version?: "v2" | "v3";
  /** Required for meaningful v3 scoring; ignored by v2. */
  readonly action?: string;
  readonly container?: CaptchaContainer;
  readonly theme?: "light" | "dark";
  readonly size?: "normal" | "compact" | "invisible";
  readonly timeoutMs?: number;
  readonly scriptUrl?: string;
  readonly sdk?: RecaptchaSdk;
}

declare global {
  interface Window {
    grecaptcha?: RecaptchaSdk;
  }
}

function resolveVersion(options: RecaptchaOptions): "v2" | "v3" {
  if (options.version) {
    return options.version;
  }
  return options.action ? "v3" : "v2";
}

/**
 * Google reCAPTCHA provider — `v2` widget or `v3` invisible (ADR-CAP-001).
 */
export function recaptcha(options: RecaptchaOptions): CaptchaSetup {
  const version = resolveVersion(options);
  let sdk: RecaptchaSdk | undefined = options.sdk;
  let widgetId: number | undefined;
  let token: string | undefined;
  let tokenWaiters: Array<{
    resolve: (value: CaptchaToken) => void;
    reject: (reason: unknown) => void;
  }> = [];
  let expired = false;

  const settle = (next: CaptchaToken | CaptchaError): void => {
    const waiters = tokenWaiters;
    tokenWaiters = [];
    for (const waiter of waiters) {
      if (next instanceof CaptchaError) {
        waiter.reject(next);
      } else {
        waiter.resolve(next);
      }
    }
  };

  const toToken = (value: string): CaptchaToken => ({
    provider: "recaptcha",
    token: value,
  });

  const ready = (api: RecaptchaSdk): Promise<void> =>
    new Promise((resolve) => {
      api.ready(() => {
        resolve();
      });
    });

  if (version === "v3") {
    return {
      name: "recaptcha",
      kind: "invisible",
      ...(options.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {}),
      // container allowed but unused for invisible (ADR)

      async load() {
        if (sdk) {
          await ready(sdk);
          return;
        }
        const scriptUrl =
          options.scriptUrl ?? `${DEFAULT_V3_SCRIPT}${encodeURIComponent(options.siteKey)}`;
        sdk = await loadCaptchaScript({
          scriptUrl,
          readGlobal: () => window.grecaptcha,
          unavailableMessage: "reCAPTCHA requires a browser environment.",
        });
        await ready(sdk);
      },

      async execute() {
        if (!sdk?.execute) {
          throw new CaptchaError("reCAPTCHA v3 SDK is not loaded.", "captchaUnavailable");
        }
        try {
          const value = await sdk.execute(options.siteKey, {
            ...(options.action ? { action: options.action } : {}),
          });
          if (!value) {
            throw new CaptchaError("reCAPTCHA v3 returned an empty token.", "captchaFailed");
          }
          return toToken(value);
        } catch (error) {
          if (error instanceof CaptchaError) {
            throw error;
          }
          throw new CaptchaError("reCAPTCHA v3 execute failed.", "captchaUnavailable", {
            cause: error,
          });
        }
      },

      destroy() {
        token = undefined;
        sdk = undefined;
      },
    };
  }

  return {
    name: "recaptcha",
    kind: "widget",
    ...(options.container !== undefined ? { container: options.container } : {}),
    ...(options.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {}),

    async load() {
      if (sdk) {
        await ready(sdk);
        return;
      }
      sdk = await loadCaptchaScript({
        scriptUrl: options.scriptUrl ?? DEFAULT_V2_SCRIPT,
        readGlobal: () => window.grecaptcha,
        unavailableMessage: "reCAPTCHA requires a browser environment.",
      });
      await ready(sdk);
    },

    async render(host: HTMLElement) {
      if (!sdk?.render) {
        throw new CaptchaError("reCAPTCHA v2 SDK is not loaded.", "captchaUnavailable");
      }
      if (widgetId !== undefined) {
        return;
      }

      widgetId = sdk.render(host, {
        sitekey: options.siteKey,
        ...(options.theme ? { theme: options.theme } : {}),
        ...(options.size ? { size: options.size } : {}),
        callback: (value) => {
          token = value;
          expired = false;
          settle(toToken(value));
        },
        "expired-callback": () => {
          token = undefined;
          expired = true;
          settle(new CaptchaError("reCAPTCHA token expired.", "captchaExpired"));
        },
        "error-callback": () => {
          token = undefined;
          settle(new CaptchaError("reCAPTCHA challenge failed.", "captchaFailed"));
        },
      });
    },

    execute() {
      if (token && !expired) {
        return Promise.resolve(toToken(token));
      }
      if (expired) {
        return Promise.reject(new CaptchaError("reCAPTCHA token expired.", "captchaExpired"));
      }

      const cached = sdk?.getResponse?.(widgetId);
      if (cached) {
        token = cached;
        return Promise.resolve(toToken(cached));
      }

      if (!sdk || widgetId === undefined) {
        return Promise.reject(
          new CaptchaError("reCAPTCHA widget is not rendered.", "captchaUnavailable"),
        );
      }

      // Invisible v2: trigger execute; checkbox v2: wait for user callback.
      if (options.size === "invisible" && sdk.execute) {
        return sdk
          .execute(widgetId)
          .then((value) => {
            token = value;
            return toToken(value);
          })
          .catch((error: unknown) => {
            throw error instanceof CaptchaError
              ? error
              : new CaptchaError("reCAPTCHA execute failed.", "captchaUnavailable", {
                  cause: error,
                });
          });
      }

      return new Promise<CaptchaToken>((resolve, reject) => {
        tokenWaiters.push({ resolve, reject });
      });
    },

    reset() {
      token = undefined;
      expired = false;
      if (sdk && widgetId !== undefined) {
        sdk.reset?.(widgetId);
      }
    },

    destroy() {
      settle(new CaptchaError("reCAPTCHA widget destroyed.", "captchaUnavailable"));
      if (sdk && widgetId !== undefined) {
        sdk.reset?.(widgetId);
      }
      widgetId = undefined;
      token = undefined;
    },
  };
}
