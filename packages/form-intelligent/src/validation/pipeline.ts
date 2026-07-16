import { runCrossFieldRules, runFormValidators } from "./cross-field.js";
import { mergeValidationErrors } from "./errors.js";
import { isPlainObject } from "../utils/index.js";
import { getIn } from "../utils/index.js";
import { collectValidators, runFieldValidators } from "./validators/custom.js";

import type { CrossFieldRule, CrossFieldValidator } from "./cross-field.js";
import type { FieldPath, ValidationContext, Validator } from "../types/index.js";

export interface ValidationPipelineInput<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly paths: readonly FieldPath[];
  readonly fieldValidators: Readonly<Map<FieldPath, readonly Validator<TValues>[]>>;
  readonly configValidators: Partial<
    Record<FieldPath, Validator<TValues> | readonly Validator<TValues>[]>
  >;
  readonly crossFieldRules?: readonly CrossFieldRule<TValues>[];
  readonly formValidators?: readonly CrossFieldValidator<TValues>[];
  readonly signal?: AbortSignal;
}

export async function runValidationPipeline<TValues extends Record<string, unknown>>(
  input: ValidationPipelineInput<TValues>,
): Promise<Record<FieldPath, string>> {
  const errors: Record<FieldPath, string> = {};

  for (const path of input.paths) {
    if (input.signal?.aborted) {
      return errors;
    }

    const validators = collectValidators(
      path,
      input.fieldValidators.get(path),
      input.configValidators[path],
    );

    const context: ValidationContext<TValues> = {
      values: input.values,
      path,
      form: {
        get: (fieldPath) => getIn(input.values, fieldPath),
        values: () => input.values,
      },
    };

    const value = getIn(input.values, path);
    const message = await runFieldValidators(validators, value, context, input.signal);
    if (message) {
      errors[path] = message;
    }
  }

  if (input.crossFieldRules && input.crossFieldRules.length > 0) {
    const crossFieldErrors = await runCrossFieldRules({
      rules: input.crossFieldRules,
      values: input.values,
      paths: input.paths,
      ...(input.signal ? { signal: input.signal } : {}),
    });
    Object.assign(errors, crossFieldErrors);
  }

  if (input.formValidators && input.formValidators.length > 0) {
    const formErrors = await runFormValidators({
      validators: input.formValidators,
      values: input.values,
      ...(input.signal ? { signal: input.signal } : {}),
    });
    Object.assign(errors, formErrors);
  }

  return errors;
}

export async function validatePaths<TValues extends Record<string, unknown>>(
  input: Omit<ValidationPipelineInput<TValues>, "crossFieldRules" | "formValidators" | "signal">,
): Promise<Record<FieldPath, string>> {
  return runValidationPipeline(input);
}

export function mergePathValidationErrors(
  current: Readonly<Record<FieldPath, string>>,
  incoming: Readonly<Record<FieldPath, string>>,
  validatedPaths: readonly FieldPath[],
): Record<FieldPath, string> {
  return mergeValidationErrors(current, incoming, validatedPaths);
}

export function listAllPaths(values: Record<string, unknown>, prefix = ""): FieldPath[] {
  const paths: FieldPath[] = [];

  for (const [key, value] of Object.entries(values)) {
    const path = prefix ? `${prefix}.${key}` : key;
    paths.push(path);

    if (Array.isArray(value)) {
      for (let index = 0; index < value.length; index += 1) {
        const item = value[index];
        const itemPath = `${path}.${index}`;
        paths.push(itemPath);

        if (isPlainObject(item)) {
          paths.push(...listAllPaths(item, itemPath));
        }
      }
      continue;
    }

    if (isPlainObject(value)) {
      paths.push(...listAllPaths(value, path));
    }
  }

  return paths;
}
