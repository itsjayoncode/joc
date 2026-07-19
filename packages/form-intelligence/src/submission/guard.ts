/**
 * Hard submission eligibility (ADR-SUB-001).
 * Distinct from `form.ui.canSubmit` (UX policy projection).
 */

export type SubmissionGuardReason = "alreadySubmitting" | "ruleDisabled";

export interface SubmissionGuardResult {
  readonly allowed: boolean;
  readonly reasons: readonly SubmissionGuardReason[];
}

export interface EvaluateSubmissionGuardInput {
  /** True when an in-flight submit must block a new start (respects preventDoubleSubmit). */
  readonly alreadySubmitting: boolean;
  /** Presentation / rules intent: formUi.submitDisabled. */
  readonly ruleSubmitDisabled: boolean;
}

/**
 * Authoritative hard guards for whether the submission pipeline may start.
 * Does not apply UX-only tokens (validating / invalid).
 */
export function evaluateSubmissionGuard(
  input: EvaluateSubmissionGuardInput,
): SubmissionGuardResult {
  const reasons: SubmissionGuardReason[] = [];

  if (input.alreadySubmitting) {
    reasons.push("alreadySubmitting");
  }

  if (input.ruleSubmitDisabled) {
    reasons.push("ruleDisabled");
  }

  return {
    allowed: reasons.length === 0,
    reasons,
  };
}
