/**
 * CAPTCHA capability — Security Stage integration (ADR-CAP-001).
 *
 * @packageDocumentation
 */

export { captcha } from "./plugin.js";
export { turnstile } from "./turnstile.js";
export type { TurnstileOptions, TurnstileSdk } from "./turnstile.js";
export { recaptcha } from "./recaptcha.js";
export type { RecaptchaOptions, RecaptchaSdk } from "./recaptcha.js";
export { hcaptcha } from "./hcaptcha.js";
export type { HcaptchaOptions, HcaptchaSdk } from "./hcaptcha.js";
export { mockCaptcha } from "./mock.js";
export type { MockCaptchaOptions } from "./mock.js";
export { CaptchaError, isCaptchaError, captchaReasonFromUnknown } from "./errors.js";
export { resolveMountHost } from "./mount.js";
export type { ResolvedMountHost } from "./mount.js";
export type {
  CaptchaBlockReason,
  CaptchaContainer,
  CaptchaProvider,
  CaptchaSetup,
  CaptchaToken,
} from "./types.js";
