import type { UiFieldStatus } from "./types.js";

export interface ProjectFieldStatusInput {
  readonly showError: boolean;
  readonly hasError: boolean;
  readonly touched: boolean;
  readonly isValidating: boolean;
  readonly busy?: boolean;
}

/**
 * Exactly one status. Priority (first match wins):
 * 1. validating — async validation or busy
 * 2. error — showError (policy-gated display)
 * 3. success — touched and no raw error
 * 4. idle — default
 *
 * Never returns validating and error together.
 */
export function projectFieldStatus(input: ProjectFieldStatusInput): UiFieldStatus {
  if (input.isValidating || input.busy === true) {
    return "validating";
  }

  if (input.showError) {
    return "error";
  }

  if (input.touched && !input.hasError) {
    return "success";
  }

  return "idle";
}
