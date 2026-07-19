import { required } from "../validation/validators/index.js";

import type { FieldPath, FormConfig, Validator } from "../types/index.js";

/**
 * Paths whose static validator list includes the built-in `required` identity.
 * Used to seed Presentation `fieldUi.required` (Q10 / ADR-018).
 * Does not treat `requiredWhen` as baseline.
 */
export function collectRequiredBaseline<TValues extends Record<string, unknown>>(
  validators: FormConfig<TValues>["validators"] | undefined,
): readonly FieldPath[] {
  if (!validators) {
    return [];
  }

  const paths: FieldPath[] = [];
  for (const [path, entry] of Object.entries(validators)) {
    if (validatorsIncludeRequired(entry as Validator<TValues> | readonly Validator<TValues>[])) {
      paths.push(path);
    }
  }
  return paths;
}

export function validatorsIncludeRequired<
  TValues extends Record<string, unknown> = Record<string, unknown>,
>(entry: Validator<TValues> | readonly Validator<TValues>[] | undefined): boolean {
  if (!entry) {
    return false;
  }
  const list = Array.isArray(entry) ? entry : [entry];
  return list.some((validator) => validator === required);
}
