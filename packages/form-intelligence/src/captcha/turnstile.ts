import { CaptchaError } from "./errors.js";
import { loadCaptchaScript } from "./load-script.js";

import type { CaptchaContainer, CaptchaSetup, CaptchaToken } from "./types.js";

const DEFAULT_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const DEFAULT_MOUNT_TIMEOUT_MS = 12_000;

/** Wait until Turnstile has injected an iframe / response field into the host. */
function waitForWidgetMount(host: HTMLElement, timeoutMs: number): Promise<void> {
  const isMounted = () =>
    Boolean(host.querySelector('iframe, textarea[name="cf-turnstile-response"]'));

  if (isMounted()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const finish = () => {
      window.clearTimeout(timer);
      observer.disconnect();
      resolve();
    };

    const observer = new MutationObserver(() => {
      if (isMounted()) {
        finish();
      }
    });
    observer.observe(host, { childList: true, subtree: true });

    const timer = window.setTimeout(finish, timeoutMs);
  });
}

/** Minimal Turnstile SDK surface used by this provider (injectable for tests). */
export interface TurnstileSdk {
  render(
    host: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      size?: "normal" | "compact" | "flexible";
      action?: string;
      callback?: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
      "timeout-callback"?: () => void;
    },
  ): string;
  execute?(widgetId: string): void;
  reset?(widgetId: string): void;
  remove?(widgetId: string): void;
}

export interface TurnstileOptions {
  readonly siteKey: string;
  readonly container?: CaptchaContainer;
  readonly theme?: "light" | "dark" | "auto";
  readonly size?: "normal" | "compact" | "flexible";
  readonly action?: string;
  readonly timeoutMs?: number;
  /** Override script URL (tests / mirrors). */
  readonly scriptUrl?: string;
  /** Inject SDK (skip script load — tests). */
  readonly sdk?: TurnstileSdk;
}

declare global {
  interface Window {
    turnstile?: TurnstileSdk;
  }
}

/**
 * Cloudflare Turnstile provider (`kind: "widget"`).
 * Pass `container` for manual placement; omit for auto-placement before the submit button.
 */
export function turnstile(options: TurnstileOptions): CaptchaSetup {
  let sdk: TurnstileSdk | undefined = options.sdk;
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
    provider: "turnstile",
    token: value,
  });

  return {
    name: "turnstile",
    kind: "widget",
    ...(options.container !== undefined ? { container: options.container } : {}),
    ...(options.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {}),

    async load() {
      if (sdk) {
        return;
      }
      sdk = await loadCaptchaScript({
        scriptUrl: options.scriptUrl ?? DEFAULT_SCRIPT_URL,
        readGlobal: () => window.turnstile,
        unavailableMessage: "Turnstile requires a browser environment.",
      });
    },

    async render(host: HTMLElement) {
      if (!sdk) {
        throw new CaptchaError("Turnstile SDK is not loaded.", "captchaUnavailable");
      }
      if (widgetId !== undefined) {
        return;
      }

      widgetId = sdk.render(host, {
        sitekey: options.siteKey,
        ...(options.theme ? { theme: options.theme } : {}),
        ...(options.size ? { size: options.size } : {}),
        ...(options.action ? { action: options.action } : {}),
        callback: (value) => {
          token = value;
          expired = false;
          settle(toToken(value));
        },
        "error-callback": () => {
          token = undefined;
          settle(new CaptchaError("Turnstile challenge failed.", "captchaFailed"));
        },
        "expired-callback": () => {
          token = undefined;
          expired = true;
          settle(new CaptchaError("Turnstile token expired.", "captchaExpired"));
        },
        "timeout-callback": () => {
          token = undefined;
          settle(new CaptchaError("Turnstile challenge timed out.", "captchaTimeout"));
        },
      });

      // Keep CaptchaRuntime in `preparing` / captchaLoading until the iframe exists.
      // Injected `sdk` (tests) skips the wait — mocks do not mount a real widget.
      if (!options.sdk) {
        await waitForWidgetMount(host, DEFAULT_MOUNT_TIMEOUT_MS);
      }
    },

    execute() {
      if (token && !expired) {
        return Promise.resolve(toToken(token));
      }

      if (expired) {
        return Promise.reject(new CaptchaError("Turnstile token expired.", "captchaExpired"));
      }

      if (!sdk || widgetId === undefined) {
        return Promise.reject(
          new CaptchaError("Turnstile widget is not rendered.", "captchaUnavailable"),
        );
      }

      return new Promise<CaptchaToken>((resolve, reject) => {
        tokenWaiters.push({ resolve, reject });
        try {
          sdk?.execute?.(widgetId!);
        } catch (error) {
          tokenWaiters = tokenWaiters.filter((w) => w.resolve !== resolve);
          reject(
            error instanceof CaptchaError
              ? error
              : new CaptchaError("Turnstile execute failed.", "captchaUnavailable", {
                  cause: error,
                }),
          );
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
      settle(new CaptchaError("Turnstile widget destroyed.", "captchaUnavailable"));
      if (sdk && widgetId !== undefined) {
        sdk.remove?.(widgetId);
      }
      widgetId = undefined;
      token = undefined;
    },
  };
}
