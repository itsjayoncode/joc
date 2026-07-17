import { runAsyncValidatorOptions } from "../async/run-with-options.js";

import type { AsyncValidatorOptions } from "../../types/async-validation.js";
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

export type AsyncValidatorWithOptions<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> = AsyncValidator<TValues> & {
  readonly __asyncOptions: AsyncValidatorOptions<TValues>;
};

export function asyncValidator<TValues extends Record<string, unknown> = Record<string, unknown>>(
  validate: Validator<TValues>,
): AsyncValidator<TValues>;
export function asyncValidator<TValues extends Record<string, unknown> = Record<string, unknown>>(
  options: AsyncValidatorOptions<TValues>,
): AsyncValidatorWithOptions<TValues>;
export function asyncValidator<TValues extends Record<string, unknown> = Record<string, unknown>>(
  fnOrOptions: Validator<TValues> | AsyncValidatorOptions<TValues>,
): AsyncValidator<TValues> | AsyncValidatorWithOptions<TValues> {
  if (typeof fnOrOptions === "function") {
    const validator = fnOrOptions as AsyncValidator<TValues>;
    Object.defineProperty(validator, "__async", { value: true });
    return validator;
  }

  const options = fnOrOptions;
  const validator = ((value: unknown, context: ValidationContext<TValues>) => {
    // Pipeline prefers runValidator → runAsyncValidatorOptions; this path is a fallback.
    const signal = context.signal ?? new AbortController().signal;
    return options.validate(value, { ...context, signal });
  }) as AsyncValidatorWithOptions<TValues>;

  Object.defineProperty(validator, "__async", { value: true });
  Object.defineProperty(validator, "__asyncOptions", {
    value: options,
    enumerable: false,
    configurable: false,
  });
  return validator;
}

export function isAsyncValidator<TValues extends Record<string, unknown>>(
  validator: Validator<TValues>,
): validator is AsyncValidator<TValues> {
  return (validator as AsyncValidator<TValues>).__async;
}

export function getAsyncValidatorOptions<TValues extends Record<string, unknown>>(
  validator: Validator<TValues>,
): AsyncValidatorOptions<TValues> | undefined {
  return (validator as AsyncValidatorWithOptions<TValues>).__asyncOptions;
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

/** Per-validator cache owner so private caches do not collide across validators. */
const optionsCacheOwners = new WeakMap<object, object>();

function cacheOwnerFor(validator: object): object {
  let owner = optionsCacheOwners.get(validator);
  if (!owner) {
    owner = {};
    optionsCacheOwners.set(validator, owner);
  }
  return owner;
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

  const options = getAsyncValidatorOptions(validator);
  if (options) {
    const activeSignal = signal ?? context.signal ?? new AbortController().signal;
    return runAsyncValidatorOptions(
      options,
      value,
      context,
      activeSignal,
      cacheOwnerFor(validator),
    );
  }

  try {
    const result: ValidatorResult | Promise<ValidatorResult> = validator(value, context);
    const resolved = await Promise.resolve(result);

    if (signal?.aborted) {
      return undefined;
    }

    return normalizeValidatorResult(resolved);
  } catch (error) {
    if (signal?.aborted) {
      return undefined;
    }

    if (error instanceof Error && error.name === "AbortError") {
      return undefined;
    }

    return error instanceof Error && error.message ? error.message : "Validation failed.";
  }
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
