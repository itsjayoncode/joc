import type { FormInstance, SubmitSecurityMeta } from "../types/index.js";

/**
 * Security Stage — pipeline slot after validation, before beforeSubmit / onSubmit.
 * CAPTCHA is the first registrant; later CSRF / OTP can compose here (ADR-CAP-001).
 */

export type SecurityStageResult =
  | { readonly ok: true; readonly security?: SubmitSecurityMeta }
  | { readonly ok: false; readonly reasons: readonly string[] };

export type SecurityStageHandler = (input: {
  readonly signal: AbortSignal;
}) => Promise<SecurityStageResult>;

interface SecurityStageRegistration {
  readonly run: SecurityStageHandler;
  /** Soft explain reasons (e.g. captchaLoading / captchaPending) observed outside submit. */
  explainReasons: () => readonly string[];
  lastBlockReasons: readonly string[];
}

const registrations = new WeakMap<
  FormInstance<Record<string, unknown>>,
  SecurityStageRegistration
>();

/** Form → subscriber notify (bound by createForm so Security Stage can refresh UI). */
const notifyHooks = new WeakMap<FormInstance<Record<string, unknown>>, () => void>();

/**
 * Wire form subscriber notify for Security Stage explain changes.
 * Called by `createForm` before plugins so CAPTCHA prepare can refresh `canSubmit`.
 */
export function bindSecurityStageNotify(
  form: FormInstance<Record<string, unknown>>,
  notify: () => void,
): () => void {
  notifyHooks.set(form, notify);
  return () => {
    if (notifyHooks.get(form) === notify) {
      notifyHooks.delete(form);
    }
  };
}

/** Notify form subscribers after a Security Stage explain-relevant state transition. */
export function notifySecurityStageChange(form: FormInstance<Record<string, unknown>>): void {
  notifyHooks.get(form)?.();
}

export function registerSecurityStage(
  form: FormInstance<Record<string, unknown>>,
  handler: SecurityStageHandler,
  options: {
    readonly explainReasons?: () => readonly string[];
  } = {},
): () => void {
  const registration: SecurityStageRegistration = {
    run: handler,
    explainReasons: options.explainReasons ?? (() => []),
    lastBlockReasons: [],
  };
  registrations.set(form, registration);
  return () => {
    if (registrations.get(form) === registration) {
      registrations.delete(form);
    }
  };
}

export function getSecurityStageExplainReasons(
  form: FormInstance<Record<string, unknown>>,
): readonly string[] {
  const registration = registrations.get(form);
  if (!registration) {
    return [];
  }
  const live = registration.explainReasons();
  if (live.length > 0) {
    return live;
  }
  return registration.lastBlockReasons;
}

export async function runSecurityStage(
  form: FormInstance<Record<string, unknown>>,
  input: { readonly signal: AbortSignal },
): Promise<SecurityStageResult> {
  const registration = registrations.get(form);
  if (!registration) {
    return { ok: true };
  }

  const result = await registration.run(input);
  if (result.ok) {
    registration.lastBlockReasons = [];
    return result;
  }

  registration.lastBlockReasons = [...result.reasons];
  return result;
}
