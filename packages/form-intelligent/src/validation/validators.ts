import type { FieldPath, Validator, ValidationContext } from "../types/index.js";

export const required: Validator = (value) => {
  if (value === null || value === undefined || value === "") {
    return "This field is required.";
  }

  if (Array.isArray(value) && value.length === 0) {
    return "This field is required.";
  }

  return true;
};

export const email: Validator = (value) => {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return "Enter a valid email address.";
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : "Enter a valid email address.";
};

export const url: Validator = (value) => {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (typeof value !== "string") {
    return "Enter a valid URL.";
  }

  try {
    new URL(value);
    return true;
  } catch {
    return "Enter a valid URL.";
  }
};

export const minLength =
  (min: number): Validator =>
  (value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }

    if (typeof value === "string" && value.length < min) {
      return `Must be at least ${String(min)} characters.`;
    }

    return true;
  };

export const regex =
  (pattern: RegExp, message = "Invalid format."): Validator =>
  (value) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }

    return typeof value === "string" && pattern.test(value) ? true : message;
  };

export async function runValidator<TValues extends Record<string, unknown>>(
  validator: Validator<TValues>,
  value: unknown,
  context: ValidationContext<TValues>,
): Promise<string | undefined> {
  const result = await validator(value, context);
  if (result === true || result === undefined) {
    return undefined;
  }

  return result;
}

export function collectValidators<TValues extends Record<string, unknown>>(
  path: FieldPath,
  fieldValidators: readonly Validator<TValues>[] | undefined,
  configValidators: Validator<TValues> | readonly Validator<TValues>[] | undefined,
): Validator<TValues>[] {
  const collected: Validator<TValues>[] = [];

  if (fieldValidators) {
    collected.push(...fieldValidators);
  }

  if (configValidators) {
    if (Array.isArray(configValidators)) {
      const validators = configValidators as readonly Validator<TValues>[];
      for (const validator of validators) {
        collected.push(validator);
      }
    } else {
      collected.push(configValidators as Validator<TValues>);
    }
  }

  if (collected.length === 0 && path) {
    return collected;
  }

  return collected;
}
