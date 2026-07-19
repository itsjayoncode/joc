import { CaptchaError } from "./errors.js";

import type { CaptchaBlockReason, CaptchaSetup, CaptchaToken } from "./types.js";

export interface MockCaptchaOptions {
  readonly provider?: string;
  readonly token?: string;
  readonly kind?: CaptchaSetup["kind"];
  readonly failWith?: CaptchaBlockReason;
  readonly delayMs?: number;
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
    async load() {},
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
