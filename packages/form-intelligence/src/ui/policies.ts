import type { ResolvedUiPolicies, UiDisableSubmitWhen, UiPolicyOptions } from "./types.js";

export const DEFAULT_UI_POLICIES: ResolvedUiPolicies = {
  errorDisplay: "touched",
  disableSubmitWhen: ["submitting", "validating", "ruleDisabled"],
};

export function resolveUiPolicies(options: UiPolicyOptions = {}): ResolvedUiPolicies {
  return {
    errorDisplay: options.errorDisplay ?? DEFAULT_UI_POLICIES.errorDisplay,
    disableSubmitWhen: options.disableSubmitWhen
      ? Object.freeze([...options.disableSubmitWhen])
      : DEFAULT_UI_POLICIES.disableSubmitWhen,
  };
}

export function isDisableSubmitToken(token: string): token is UiDisableSubmitWhen {
  return (
    token === "submitting" ||
    token === "validating" ||
    token === "invalid" ||
    token === "ruleDisabled"
  );
}
