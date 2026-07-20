import { evaluateSubmissionGuard } from "../submission/guard.js";

import type {
  ResolvedUiPolicies,
  UiDisableSubmitWhen,
  UiExplainContributor,
  UiExplainResult,
  UiSubmitBlockReason,
} from "./types.js";
import type { SubmissionGuardResult } from "../submission/guard.js";

export interface CanSubmitInput {
  /**
   * Hard eligibility from `evaluateSubmissionGuard` / `form.submissionGuard()`.
   * When omitted, treated as an allowed guard (no hard blocks).
   */
  readonly guard?: SubmissionGuardResult;
  readonly isValidating: boolean;
  readonly isValid: boolean;
  readonly policies: ResolvedUiPolicies;
  /**
   * Security Stage explain reasons (CAPTCHA — ADR-CAP-001).
   * Always hard-block `canSubmit` when present (not policy-gated).
   */
  readonly securityReasons?: readonly string[];
}

function tokensInclude(policies: ResolvedUiPolicies, token: UiDisableSubmitWhen): boolean {
  return policies.disableSubmitWhen.includes(token);
}

const CAPTCHA_REASONS = new Set<string>([
  "captchaLoading",
  "captchaPending",
  "captchaFailed",
  "captchaExpired",
  "captchaTimeout",
  "captchaUnavailable",
]);

/**
 * Compose hard submission guards + UX `disableSubmitWhen` policy → button eligibility.
 *
 * Hard guards (`alreadySubmitting`, `ruleDisabled`) always block and always appear in reasons.
 * Security Stage captcha reasons always block (ADR-CAP-001).
 * `validating` / `invalid` are UX-only and policy-gated — they never change engine submit behavior.
 *
 * @see ADR-SUB-001
 * @see ADR-CAP-001
 */
export function explainSubmit(input: CanSubmitInput): UiExplainResult {
  const reasons: UiSubmitBlockReason[] = [];
  const contributors = new Set<UiExplainContributor>();

  const guard =
    input.guard ??
    evaluateSubmissionGuard({
      alreadySubmitting: false,
      ruleSubmitDisabled: false,
    });

  for (const reason of guard.reasons) {
    if (reason === "alreadySubmitting") {
      reasons.push("submitting");
      contributors.add("submission");
    } else if (reason === "ruleDisabled") {
      reasons.push("ruleDisabled");
      contributors.add("presentation");
    }
  }

  for (const reason of input.securityReasons ?? []) {
    if (CAPTCHA_REASONS.has(reason)) {
      reasons.push(reason as UiSubmitBlockReason);
      contributors.add("security");
    }
  }

  // UX-only tokens — never enforced by form.submit().
  if (input.isValidating && tokensInclude(input.policies, "validating")) {
    reasons.push("validating");
    contributors.add("validation");
  }

  if (!input.isValid && tokensInclude(input.policies, "invalid")) {
    reasons.push("invalid");
    contributors.add("validation");
  }

  return {
    value: reasons.length === 0,
    reasons,
    contributors: [...contributors],
  };
}

export function canSubmit(input: CanSubmitInput): boolean {
  return explainSubmit(input).value;
}
