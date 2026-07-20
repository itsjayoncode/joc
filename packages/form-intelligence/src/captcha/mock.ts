import { CaptchaError } from "./errors.js";

import type { CaptchaBlockReason, CaptchaSetup, CaptchaToken } from "./types.js";

export interface MockCaptchaOptions {
  readonly provider?: string;
  readonly token?: string;
  readonly kind?: CaptchaSetup["kind"];
  readonly failWith?: CaptchaBlockReason;
  /** Artificial latency inside `execute()` (submit-time pending). */
  readonly delayMs?: number;
  /** Artificial latency inside `load()` (prepare-time `captchaLoading`). */
  readonly loadDelayMs?: number;
  /** Fail during `load()` / prepare (e.g. `captchaUnavailable`). */
  readonly failLoadWith?: CaptchaBlockReason;
  readonly expiresAt?: number;
  readonly execute?: () => Promise<CaptchaToken>;
}

/**
 * Deterministic provider for tests and the playground lab (no vendor SDK).
 */
export function mockCaptcha(options: MockCaptchaOptions = {}): CaptchaSetup {
  const provider = options.provider ?? "mock";
  const kind = options.kind ?? "invisible";

  return {
    name: provider,
    kind,
    async load() {
      if (options.loadDelayMs && options.loadDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, options.loadDelayMs));
      }
      if (options.failLoadWith) {
        throw new CaptchaError(`Mock CAPTCHA load: ${options.failLoadWith}`, options.failLoadWith);
      }
    },
    ...(kind === "invisible"
      ? {}
      : {
          async render(_host: HTMLElement) {},
        }),
    execute:
      options.execute ??
      (async () => {
        if (options.delayMs && options.delayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, options.delayMs));
        }
        if (options.failWith) {
          throw new CaptchaError(`Mock CAPTCHA: ${options.failWith}`, options.failWith);
        }
        return {
          provider,
          token: options.token ?? "mock-token",
          ...(options.expiresAt !== undefined ? { expiresAt: options.expiresAt } : {}),
        };
      }),
  };
}
