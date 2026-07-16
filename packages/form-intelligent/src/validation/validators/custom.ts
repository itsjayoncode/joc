import type {
  CustomFieldValidator,
  FieldPath,
  Validator,
  ValidationContext,
  ValidatorResult,
} from "../../types/index.js";

export function custom<TValues extends Record<string, unknown>>(
  fn: CustomFieldValidator<TValues>,
): Validator<TValues> {
  return (value, context) => fn({ value, path: context.path, form: context.form });
}

export type AsyncValidator<TValues extends Record<string, unknown> = Record<string, unknown>> =
  Validator<TValues> & { readonly __async: true };

export function asyncValidator<TValues extends Record<string, unknown>>(
  fn: Validator<TValues>,
): AsyncValidator<TValues> {
  const validator = fn as AsyncValidator<TValues>;
  Object.defineProperty(validator, "__async", { value: true });
  return validator;
}

export function isAsyncValidator<TValues extends Record<string, unknown>>(
  validator: Validator<TValues>,
): validator is AsyncValidator<TValues> {
  return (validator as AsyncValidator<TValues>).__async;
}

export function normalizeValidatorResult(result: ValidatorResult): string | undefined {
  if (result === true || result === undefined) {
    return undefined;
  }

  if (result === false) {
    return "Invalid value.";
  }

  return result;
}

export async function runValidator<TValues extends Record<string, unknown>>(
  validator: Validator<TValues>,
  value: unknown,
  context: ValidationContext<TValues>,
  signal?: AbortSignal,
): Promise<string | undefined> {
  if (signal?.aborted) {
    return undefined;
  }

  const result: ValidatorResult | Promise<ValidatorResult> = validator(value, context);
  const resolved = await Promise.resolve(result);

  if (signal?.aborted) {
    return undefined;
  }

  return normalizeValidatorResult(resolved);
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
      collected.push(...configValidators);
    } else {
      collected.push(configValidators as Validator<TValues>);
    }
  }

  void path;
  return collected;
}

export async function runFieldValidators<TValues extends Record<string, unknown>>(
  validators: readonly Validator<TValues>[],
  value: unknown,
  context: ValidationContext<TValues>,
  signal?: AbortSignal,
): Promise<string | undefined> {
  const syncValidators: Validator<TValues>[] = [];
  const asyncValidators: Validator<TValues>[] = [];

  for (const validator of validators) {
    if (isAsyncValidator(validator)) {
      asyncValidators.push(validator);
    } else {
      syncValidators.push(validator);
    }
  }

  for (const validator of syncValidators) {
    const message = await runValidator(validator, value, context, signal);
    if (message) {
      return message;
    }
  }

  for (const validator of asyncValidators) {
    const message = await runValidator(validator, value, context, signal);
    if (message) {
      return message;
    }
  }

  return undefined;
}
