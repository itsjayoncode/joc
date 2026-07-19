import type { UiDisabledReason, UiExplainContributor, UiExplainResult } from "./types.js";

export type { UiDisabledReason };

export interface ExplainDisabledInput {
  readonly disabled: boolean;
  readonly readOnly: boolean;
  readonly isSubmitting: boolean;
  readonly isValidating: boolean;
}

/**
 * Composition: presentation + submission + validation → effective interaction lock.
 */
export function explainDisabled(input: ExplainDisabledInput): UiExplainResult {
  const reasons: UiDisabledReason[] = [];
  const contributors = new Set<UiExplainContributor>();

  if (input.disabled) {
    reasons.push("ruleDisabled");
    contributors.add("presentation");
  }

  if (input.readOnly) {
    reasons.push("readOnly");
    contributors.add("presentation");
  }

  if (input.isSubmitting) {
    reasons.push("formSubmitting");
    contributors.add("submission");
  }

  if (input.isValidating) {
    reasons.push("asyncValidating");
    contributors.add("validation");
  }

  return {
    value: reasons.length > 0,
    reasons,
    contributors: [...contributors],
  };
}
