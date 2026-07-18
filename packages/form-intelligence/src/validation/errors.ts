import type { FieldPath, ValidatorResult } from "../types/index.js";

export interface NormalizedFieldError {
  readonly path: FieldPath;
  readonly message: string;
  readonly code?: string;
}

export function toNormalizedErrors(
  errors: Readonly<Record<FieldPath, string>>,
): readonly NormalizedFieldError[] {
  return Object.entries(errors).map(([path, message]) => ({ path, message }));
}

export function fromNormalizedErrors(
  errors: readonly NormalizedFieldError[],
): Record<FieldPath, string> {
  return Object.fromEntries(errors.map((error) => [error.path, error.message]));
}

export function mergeValidationErrors(
  current: Readonly<Record<FieldPath, string>>,
  incoming: Readonly<Record<FieldPath, string>>,
  validatedPaths?: readonly FieldPath[],
): Record<FieldPath, string> {
  const next = { ...current };

  if (validatedPaths) {
    for (const path of validatedPaths) {
      delete next[path];
    }
  }

  for (const [path, message] of Object.entries(incoming)) {
    if (message) {
      next[path] = message;
    }
  }

  return next;
}

export function normalizeCrossFieldResult(
  path: FieldPath,
  result: ValidatorResult | Readonly<Record<FieldPath, string>>,
): Record<FieldPath, string> {
  if (typeof result === "string") {
    return { [path]: result };
  }

  if (result && typeof result === "object") {
    const errors: Record<FieldPath, string> = {};
    for (const [fieldPath, message] of Object.entries(result)) {
      if (typeof message === "string" && message.length > 0) {
        errors[fieldPath] = message;
      }
    }
    return errors;
  }

  if (result === false) {
    return { [path]: "Invalid value." };
  }

  return {};
}
