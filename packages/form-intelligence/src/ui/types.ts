import type { FieldPath } from "../types/index.js";

/** Who contributed to an explanation (engines vs layers). */
export type UiExplainContributor =
  "validation" | "presentation" | "submission" | "security" | "workflow" | "policy" | "state";

export type UiErrorDisplay = "touched" | "submit" | "always" | "touchedOrSubmit";

export type UiDisableSubmitWhen = "submitting" | "validating" | "invalid" | "ruleDisabled";

export interface UiPolicyOptions {
  readonly errorDisplay?: UiErrorDisplay;
  readonly disableSubmitWhen?: readonly UiDisableSubmitWhen[];
}

export interface ResolvedUiPolicies {
  readonly errorDisplay: UiErrorDisplay;
  readonly disableSubmitWhen: readonly UiDisableSubmitWhen[];
}

export type UiSubmitBlockReason =
  | "submitting"
  | "validating"
  | "invalid"
  | "ruleDisabled"
  | "captchaLoading"
  | "captchaPending"
  | "captchaFailed"
  | "captchaExpired"
  | "captchaTimeout"
  | "captchaUnavailable";

export type UiShowErrorReason = "hasError" | "policyHidden" | "validating";

export type UiDisabledReason = "ruleDisabled" | "readOnly" | "formSubmitting" | "asyncValidating";

/**
 * Exactly one field UI status (Phase 3). Priority:
 * validating → error → success → idle.
 */
export type UiFieldStatus = "validating" | "error" | "success" | "idle";

export interface UiExplainResult<T = boolean> {
  readonly value: T;
  readonly reasons: readonly string[];
  readonly contributors: readonly UiExplainContributor[];
}

/** Reserved for post-v1 plugin explain providers — not registered in Phase 1. */
export interface UiExplainProvider {
  readonly topics: readonly string[];
  explain(input: {
    readonly topic: string;
    readonly path?: FieldPath;
    readonly result: UiExplainResult;
  }): UiExplainResult;
}

/** Derived keys composed onto presentation `field.ui`. */
export interface FieldUiDerived {
  readonly hasError: boolean;
  readonly errorMessage?: string;
  readonly showError: boolean;
  /** Exactly one status — see `projectFieldStatus` priority table. */
  readonly status: UiFieldStatus;
}

/** Full field.ui surface after projection composition (presentation + derived + explain sugar). */
export type FieldUiView = import("../engines/workflow/types.js").FieldUiState &
  FieldUiDerived & {
    readonly disabledReasons: readonly string[];
    explain(topic: "showError" | "disabled"): UiExplainResult;
  };
