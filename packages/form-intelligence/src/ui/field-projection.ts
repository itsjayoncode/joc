import { shouldShowError } from "./show-error.js";
import { projectFieldStatus } from "./status.js";

import type { FieldUiDerived } from "./types.js";
import type { ResolvedUiPolicies } from "./types.js";
import type { UiExplainResult } from "./types.js";

export interface FieldProjectionInput {
  readonly error: string | undefined;
  readonly touched: boolean;
  readonly submitCount: number;
  readonly isValidating: boolean;
  readonly busy?: boolean;
  readonly policies: ResolvedUiPolicies;
}

export function projectFieldUi(input: FieldProjectionInput): FieldUiDerived {
  const errorMessage = input.error?.trim() ? input.error : undefined;
  const hasError = Boolean(errorMessage);
  const showError = shouldShowError({
    error: errorMessage,
    touched: input.touched,
    submitCount: input.submitCount,
    isValidating: input.isValidating,
    errorDisplay: input.policies.errorDisplay,
  });
  const status = projectFieldStatus({
    showError,
    hasError,
    touched: input.touched,
    isValidating: input.isValidating,
    ...(input.busy === undefined ? {} : { busy: input.busy }),
  });

  return {
    hasError,
    showError,
    status,
    ...(errorMessage === undefined ? {} : { errorMessage }),
  };
}

export function explainShowError(input: FieldProjectionInput): UiExplainResult {
  const derived = projectFieldUi(input);
  if (!derived.hasError) {
    return { value: false, reasons: [], contributors: [] };
  }

  if (input.isValidating) {
    return {
      value: false,
      reasons: ["validating"],
      contributors: ["validation"],
    };
  }

  if (derived.showError) {
    return {
      value: true,
      reasons: ["hasError"],
      contributors: ["validation", "policy"],
    };
  }

  return {
    value: false,
    reasons: ["policyHidden"],
    contributors: ["policy"],
  };
}
