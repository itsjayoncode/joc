import type { ValidationMode } from "../types/index.js";

export function resolveFieldValidationMode(
  formMode: ValidationMode,
  fieldMode?: ValidationMode,
): ValidationMode {
  return fieldMode ?? formMode;
}

export function shouldValidateForTrigger(input: {
  readonly mode: ValidationMode;
  readonly trigger: "onChange" | "onBlur" | "onSubmit";
  readonly touched?: boolean;
  readonly visited?: boolean;
}): boolean {
  if (input.mode === "all") {
    return true;
  }

  if (input.mode === input.trigger) {
    return true;
  }

  // After first interaction, validate on later change/blur (not onSubmit-only paths).
  if (
    input.mode === "onTouched" &&
    (input.touched || input.visited) &&
    (input.trigger === "onChange" || input.trigger === "onBlur")
  ) {
    return true;
  }

  return false;
}

/** Blur may validate for onBlur / onTouched / all — never for onChange or onSubmit. */
export function shouldValidateOnBlur(
  mode: ValidationMode,
  meta?: { readonly touched?: boolean; readonly visited?: boolean },
): boolean {
  return shouldValidateForTrigger({
    mode,
    trigger: "onBlur",
    ...(meta?.touched !== undefined ? { touched: meta.touched } : {}),
    ...(meta?.visited !== undefined ? { visited: meta.visited } : {}),
  });
}

/** Value-change may validate for onChange / onTouched (once interacted) / all. */
export function shouldValidateOnChange(
  mode: ValidationMode,
  meta?: { readonly touched?: boolean; readonly visited?: boolean },
): boolean {
  return shouldValidateForTrigger({
    mode,
    trigger: "onChange",
    ...(meta?.touched !== undefined ? { touched: meta.touched } : {}),
    ...(meta?.visited !== undefined ? { visited: meta.visited } : {}),
  });
}

export function shouldDebounceValidation(mode: ValidationMode): boolean {
  return mode === "onChange" || mode === "all";
}
