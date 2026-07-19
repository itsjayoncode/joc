import type { ResolvedUiPolicies, UiErrorDisplay } from "./types.js";

export interface ShowErrorInput {
  readonly error: string | undefined;
  readonly touched: boolean;
  readonly submitCount: number;
  readonly isValidating?: boolean;
  readonly errorDisplay: UiErrorDisplay;
}

/**
 * Composition: error + touch/submit meta + policy → whether UI should show the error.
 */
export function shouldShowError(input: ShowErrorInput): boolean {
  const message = input.error?.trim() ? input.error : undefined;
  if (!message) {
    return false;
  }

  // While validating, prefer not flashing stale errors (matches common UX).
  if (input.isValidating) {
    return false;
  }

  switch (input.errorDisplay) {
    case "always":
      return true;
    case "submit":
      return input.submitCount > 0;
    case "touchedOrSubmit":
      return input.touched || input.submitCount > 0;
    case "touched":
    default:
      return input.touched;
  }
}

export function shouldShowErrorWithPolicies(
  input: Omit<ShowErrorInput, "errorDisplay">,
  policies: ResolvedUiPolicies,
): boolean {
  return shouldShowError({ ...input, errorDisplay: policies.errorDisplay });
}
