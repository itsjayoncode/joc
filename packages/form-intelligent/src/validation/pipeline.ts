import { collectValidators, runValidator } from "./validators.js";
import { getIn } from "../utils/index.js";

import type { FieldPath, ValidationContext, Validator } from "../types/index.js";

export async function validatePaths<TValues extends Record<string, unknown>>(input: {
  values: TValues;
  paths: readonly FieldPath[];
  fieldValidators: Readonly<Map<FieldPath, readonly Validator<TValues>[]>>;
  configValidators: Partial<Record<FieldPath, Validator<TValues> | readonly Validator<TValues>[]>>;
}): Promise<Record<FieldPath, string>> {
  const errors: Record<FieldPath, string> = {};

  for (const path of input.paths) {
    const validators = collectValidators(
      path,
      input.fieldValidators.get(path),
      input.configValidators[path],
    );

    const context: ValidationContext<TValues> = {
      values: input.values,
      path,
    };

    const value = getIn(input.values, path);

    for (const validator of validators) {
      const message = await runValidator(validator, value, context);
      if (message) {
        errors[path] = message;
        break;
      }
    }
  }

  return errors;
}

export function listAllPaths(values: Record<string, unknown>, prefix = ""): FieldPath[] {
  const paths: FieldPath[] = [];

  for (const [key, value] of Object.entries(values)) {
    const path = prefix ? `${prefix}.${key}` : key;
    paths.push(path);

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      paths.push(...listAllPaths(value as Record<string, unknown>, path));
    }
  }

  return paths;
}
