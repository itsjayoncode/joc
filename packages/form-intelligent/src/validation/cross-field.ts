import { getIn } from "../utils/index.js";
import { normalizeValidatorResult } from "./validators/custom.js";

import type { FieldPath, ValidationContext, Validator, ValidatorResult } from "../types/index.js";

export type CrossFieldValidator<TValues extends Record<string, unknown> = Record<string, unknown>> =
  (context: ValidationContext<TValues>) => ValidatorResult | Promise<ValidatorResult>;

export type CrossFieldResult<_TValues extends Record<string, unknown>> =
  ValidatorResult | Promise<ValidatorResult> | Readonly<Partial<Record<FieldPath, string>>>;

export type CrossFieldRule<TValues extends Record<string, unknown> = Record<string, unknown>> = {
  readonly paths?: readonly FieldPath[];
  readonly validate: (context: ValidationContext<TValues>) => CrossFieldResult<TValues>;
};

export function matchesField<TValues extends Record<string, unknown>>(
  targetPath: FieldPath,
  message = "Values must match.",
): Validator<TValues> {
  return (value, context) => {
    const target = getIn(context.values, targetPath);
    return value === target ? true : message;
  };
}

export function requiredWhen<TValues extends Record<string, unknown>>(
  sourcePath: FieldPath,
  predicate: (value: unknown, context: ValidationContext<TValues>) => boolean,
  message = "This field is required.",
): Validator<TValues> {
  return (value, context) => {
    const sourceValue = getIn(context.values, sourcePath);
    if (!predicate(sourceValue, context)) {
      return true;
    }

    if (value === null || value === undefined || value === "") {
      return message;
    }

    return true;
  };
}

export async function runCrossFieldRules<TValues extends Record<string, unknown>>(input: {
  readonly rules: readonly CrossFieldRule<TValues>[];
  readonly values: TValues;
  readonly paths: readonly FieldPath[];
  readonly signal?: AbortSignal;
}): Promise<Record<FieldPath, string>> {
  const errors: Record<FieldPath, string> = {};

  for (const rule of input.rules) {
    if (input.signal?.aborted) {
      return errors;
    }

    if (rule.paths && !rule.paths.some((path) => input.paths.includes(path))) {
      continue;
    }

    const context: ValidationContext<TValues> = {
      values: input.values,
      path: rule.paths?.[0] ?? "_form",
      form: {
        get: (fieldPath) => getIn(input.values, fieldPath),
        values: () => input.values,
      },
    };

    const result = await Promise.resolve(rule.validate(context));
    if (input.signal?.aborted) {
      return errors;
    }

    if (typeof result === "object" && result !== null && !Array.isArray(result)) {
      for (const [path, message] of Object.entries(result)) {
        if (typeof message === "string" && message.length > 0) {
          errors[path] = message;
        }
      }
      continue;
    }

    const message = normalizeValidatorResult(result as ValidatorResult);
    if (message) {
      errors[context.path] = message;
    }
  }

  return errors;
}

export async function runFormValidators<TValues extends Record<string, unknown>>(input: {
  readonly validators: readonly CrossFieldValidator<TValues>[];
  readonly values: TValues;
  readonly signal?: AbortSignal;
}): Promise<Record<FieldPath, string>> {
  const errors: Record<FieldPath, string> = {};
  const context: ValidationContext<TValues> = {
    values: input.values,
    path: "_form",
    form: {
      get: (fieldPath) => getIn(input.values, fieldPath),
      values: () => input.values,
    },
  };

  for (const validator of input.validators) {
    if (input.signal?.aborted) {
      return errors;
    }

    const result = await Promise.resolve(validator(context));
    if (input.signal?.aborted) {
      return errors;
    }

    const message = normalizeValidatorResult(result);
    if (message) {
      errors._form = message;
      break;
    }
  }

  return errors;
}
