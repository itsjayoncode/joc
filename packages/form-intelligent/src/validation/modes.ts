import type { ValidationMode } from "../types/index.js";

export function resolveFieldValidationMode(
  formMode: ValidationMode,
  fieldMode?: ValidationMode,
): ValidationMode {
  return fieldMode ?? formMode;
}

export function shouldValidateForTrigger(input: {
  readonly mode: ValidationMode;
  readonly trigger: ValidationMode;
  readonly touched?: boolean;
  readonly visited?: boolean;
}): boolean {
  if (input.mode === "all" || input.trigger === "all") {
    return true;
  }

  if (input.mode === input.trigger) {
    return true;
  }

  if (input.mode === "onTouched" && (input.touched || input.visited)) {
    return true;
  }

  return false;
}

export function shouldDebounceValidation(mode: ValidationMode): boolean {
  return mode === "onChange";
}
