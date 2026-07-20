import type { Validator } from "../types/index.js";

/** Phase 1 kind registry for HTML / schema / field merge (ADR-VAL-002). */
export type ValidatorKind =
  | "required"
  | "email"
  | "url"
  | "minLength"
  | "maxLength"
  | "regex";

export const VALIDATOR_KIND_ORDER: readonly ValidatorKind[] = [
  "required",
  "email",
  "url",
  "minLength",
  "maxLength",
  "regex",
] as const;

const VALIDATOR_KIND = Symbol.for("@jayoncode/form-intelligence/validatorKind");

export function tagValidator<TValues extends Record<string, unknown> = Record<string, unknown>>(
  validator: Validator<TValues>,
  kind: ValidatorKind,
): Validator<TValues> {
  Object.defineProperty(validator, VALIDATOR_KIND, {
    value: kind,
    enumerable: false,
    configurable: true,
  });
  return validator;
}

export function getValidatorKind<TValues extends Record<string, unknown> = Record<string, unknown>>(
  validator: Validator<TValues>,
): ValidatorKind | undefined {
  return (validator as Validator<TValues> & { readonly [VALIDATOR_KIND]?: ValidatorKind })[
    VALIDATOR_KIND
  ];
}
