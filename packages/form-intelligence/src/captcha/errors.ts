import { FormIntelligentError } from "../errors/index.js";

import type { CaptchaBlockReason } from "./types.js";

export class CaptchaError extends FormIntelligentError {
  public readonly reason: CaptchaBlockReason;

  public constructor(
    message: string,
    reason: CaptchaBlockReason,
    options: { cause?: unknown } = {},
  ) {
    super(message, "submit_error", { cause: options.cause, details: { reason } });
    this.name = "CaptchaError";
    this.reason = reason;
  }
}

export function isCaptchaError(error: unknown): error is CaptchaError {
  return error instanceof CaptchaError;
}

export function captchaReasonFromUnknown(error: unknown): CaptchaBlockReason {
  if (isCaptchaError(error)) {
    return error.reason;
  }
  if (error instanceof Error && error.name === "TimeoutError") {
    return "captchaTimeout";
  }
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return "captchaTimeout";
  }
  return "captchaUnavailable";
}
