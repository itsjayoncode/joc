import { CaptchaError, captchaReasonFromUnknown, isCaptchaError } from "./errors.js";
import { resolveMountHost } from "./mount.js";

import type { CaptchaBlockReason, CaptchaSetup } from "./types.js";
import type { SecurityStageResult } from "../submission/security-stage.js";
import type { FormInstance, SubmitSecurityMeta } from "../types/index.js";

function withTimeout<T>(promise: Promise<T>, timeoutMs: number | undefined): Promise<T> {
  if (timeoutMs === undefined || timeoutMs <= 0) {
    return promise;
  }

  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new CaptchaError("CAPTCHA challenge timed out.", "captchaTimeout"));
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}

/**
 * Orchestrates load → render (when needed) → execute for one form.
 */
export class CaptchaRuntime {
  private mounted = false;
  private autoHost: HTMLElement | undefined;
  private lastFailure: CaptchaBlockReason | undefined;
  private pending = false;

  public constructor(
    private readonly form: FormInstance<Record<string, unknown>>,
    private readonly setup: CaptchaSetup,
  ) {}

  public explainReasons(): readonly CaptchaBlockReason[] {
    if (this.pending) {
      return ["captchaPending"];
    }
    if (this.lastFailure) {
      return [this.lastFailure];
    }
    return [];
  }

  public async prepare(): Promise<void> {
    try {
      await this.setup.load();
      await this.ensureRendered();
      this.lastFailure = undefined;
    } catch (error) {
      this.lastFailure = captchaReasonFromUnknown(error);
      throw error;
    }
  }

  public async run(signal: AbortSignal): Promise<SecurityStageResult> {
    if (signal.aborted) {
      return { ok: false, reasons: ["captchaFailed"] };
    }

    this.pending = true;
    this.lastFailure = undefined;

    try {
      await this.setup.load();
      if (signal.aborted) {
        return { ok: false, reasons: ["captchaFailed"] };
      }

      await this.ensureRendered();

      const token = await withTimeout(this.setup.execute(), this.setup.timeoutMs);
      if (signal.aborted) {
        return { ok: false, reasons: ["captchaFailed"] };
      }

      if (typeof token.token !== "string" || token.token.trim().length === 0) {
        this.lastFailure = "captchaFailed";
        return { ok: false, reasons: ["captchaFailed"] };
      }

      if (token.expiresAt !== undefined && token.expiresAt <= Date.now()) {
        this.lastFailure = "captchaExpired";
        return { ok: false, reasons: ["captchaExpired"] };
      }

      this.pending = false;
      this.lastFailure = undefined;

      const security: SubmitSecurityMeta = {
        captcha: {
          provider: token.provider,
          token: token.token,
          ...(token.expiresAt !== undefined ? { expiresAt: token.expiresAt } : {}),
        },
      };

      return { ok: true, security };
    } catch (error) {
      const reason = isCaptchaError(error) ? error.reason : captchaReasonFromUnknown(error);
      this.lastFailure = reason;
      this.pending = false;
      return { ok: false, reasons: [reason] };
    } finally {
      this.pending = false;
    }
  }

  public async destroy(): Promise<void> {
    try {
      await this.setup.destroy?.();
    } catch {
      // Teardown must not throw.
    }
    if (this.autoHost?.parentNode) {
      this.autoHost.parentNode.removeChild(this.autoHost);
    }
    this.autoHost = undefined;
    this.mounted = false;
  }

  private async ensureRendered(): Promise<void> {
    if (this.setup.kind === "invisible") {
      return;
    }
    if (this.mounted) {
      return;
    }
    if (typeof this.setup.render !== "function") {
      throw new CaptchaError(
        `CAPTCHA provider "${this.setup.name}" (${this.setup.kind}) must implement render(host).`,
        "captchaUnavailable",
      );
    }

    const { host, autoCreated } = resolveMountHost(this.form, this.setup.container);
    if (autoCreated) {
      this.autoHost = host;
    }
    await this.setup.render(host);
    this.mounted = true;
  }
}
