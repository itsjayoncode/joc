import { CaptchaError } from "./errors.js";
import { loadCaptchaScript } from "./load-script.js";

import type { CaptchaContainer, CaptchaSetup, CaptchaToken } from "./types.js";

const DEFAULT_SCRIPT_URL = "https://js.hcaptcha.com/1/api.js?render=explicit";

/** Minimal hCaptcha SDK surface used by this provider (injectable for tests). */
export interface HcaptchaSdk {
  render(
    host: HTMLElement | string,
    options: {
      sitekey: string;
      theme?: "light" | "dark";
      size?: "normal" | "compact" | "invisible";
      callback?: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
      "chalexpired-callback"?: () => void;
    },
  ): string;
  execute?(widgetId: string, options?: { async: boolean }): Promise<{ response: string }>;
  reset?(widgetId: string): void;
  remove?(widgetId: string): void;
  getResponse?(widgetId: string): string;
}

export interface HcaptchaOptions {
  readonly siteKey: string;
  readonly container?: CaptchaContainer;
  readonly theme?: "light" | "dark";
  readonly size?: "normal" | "compact" | "invisible";
  readonly timeoutMs?: number;
  readonly scriptUrl?: string;
  readonly sdk?: HcaptchaSdk;
}

declare global {
  interface Window {
    hcaptcha?: HcaptchaSdk;
  }
}

/**
 * hCaptcha provider (`kind: "widget"` / hybrid when `size: "invisible"`).
 */
export function hcaptcha(options: HcaptchaOptions): CaptchaSetup {
  let sdk: HcaptchaSdk | undefined = options.sdk;
  let widgetId: string | undefined;
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
    provider: "hcaptcha",
    token: value,
  });

  const kind = options.size === "invisible" ? "hybrid" : "widget";

  return {
    name: "hcaptcha",
    kind,
    ...(options.container !== undefined ? { container: options.container } : {}),
    ...(options.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {}),

    async load() {
      if (sdk) {
        return;
      }
      sdk = await loadCaptchaScript({
        scriptUrl: options.scriptUrl ?? DEFAULT_SCRIPT_URL,
        readGlobal: () => window.hcaptcha,
        unavailableMessage: "hCaptcha requires a browser environment.",
      });
    },

    async render(host: HTMLElement) {
      if (!sdk) {
        throw new CaptchaError("hCaptcha SDK is not loaded.", "captchaUnavailable");
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
        "error-callback": () => {
          token = undefined;
          settle(new CaptchaError("hCaptcha challenge failed.", "captchaFailed"));
        },
        "expired-callback": () => {
          token = undefined;
          expired = true;
          settle(new CaptchaError("hCaptcha token expired.", "captchaExpired"));
        },
        "chalexpired-callback": () => {
          token = undefined;
          settle(new CaptchaError("hCaptcha challenge timed out.", "captchaTimeout"));
        },
      });
    },

    execute() {
      if (token && !expired) {
        return Promise.resolve(toToken(token));
      }
      if (expired) {
        return Promise.reject(new CaptchaError("hCaptcha token expired.", "captchaExpired"));
      }

      const cached = widgetId && sdk?.getResponse?.(widgetId);
      if (cached) {
        token = cached;
        return Promise.resolve(toToken(cached));
      }

      if (!sdk || widgetId === undefined) {
        return Promise.reject(
          new CaptchaError("hCaptcha widget is not rendered.", "captchaUnavailable"),
        );
      }

      if (options.size === "invisible" && sdk.execute) {
        return sdk
          .execute(widgetId, { async: true })
          .then((result) => {
            token = result.response;
            return toToken(result.response);
          })
          .catch((error: unknown) => {
            throw error instanceof CaptchaError
              ? error
              : new CaptchaError("hCaptcha execute failed.", "captchaUnavailable", {
                  cause: error,
                });
          });
      }

      return new Promise<CaptchaToken>((resolve, reject) => {
        tokenWaiters.push({ resolve, reject });
        try {
          // Some embeds need execute to surface the challenge UI.
          void sdk?.execute?.(widgetId!, { async: true });
        } catch {
          // Wait for callback only.
        }
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
      settle(new CaptchaError("hCaptcha widget destroyed.", "captchaUnavailable"));
      if (sdk && widgetId !== undefined) {
        sdk.remove?.(widgetId);
      }
      widgetId = undefined;
      token = undefined;
    },
  };
}
