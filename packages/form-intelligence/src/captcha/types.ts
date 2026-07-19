/** Opaque token payload returned by a provider after a successful challenge. */
export interface CaptchaToken {
  readonly provider: string;
  readonly token: string;
  readonly expiresAt?: number;
}

/**
 * Extension point for CAPTCHA vendors.
 * The framework decides whether to call `render` based on `kind`.
 * Invisible providers omit `render` — they never receive a host element.
 */
export interface CaptchaProvider {
  readonly name: string;
  readonly kind: "widget" | "invisible" | "hybrid";

  load(): Promise<void>;

  /** Present only for widget / hybrid providers. */
  render?(host: HTMLElement): Promise<void>;

  /** Run / complete the challenge and return a token. */
  execute(): Promise<CaptchaToken>;

  reset?(): void | Promise<void>;

  destroy?(): void | Promise<void>;
}

/** Mount host for widget / hybrid providers (SDK-familiar name). */
export type CaptchaContainer = string | HTMLElement | (() => HTMLElement | null | undefined);

export type CaptchaBlockReason =
  "captchaPending" | "captchaFailed" | "captchaExpired" | "captchaTimeout" | "captchaUnavailable";

/**
 * Provider plus optional mount options (factories such as `turnstile()` return this).
 */
export interface CaptchaSetup extends CaptchaProvider {
  readonly container?: CaptchaContainer;
  /** Abort execute() after this many ms (default: no timeout). */
  readonly timeoutMs?: number;
}
