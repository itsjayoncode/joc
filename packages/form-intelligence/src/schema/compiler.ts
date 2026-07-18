import { email, minLength, password, required, url } from "../validation/validators/index.js";

import type { FormatPreset } from "../format/presets.js";
import type { Formatter, Parser } from "../format/types.js";
import type {
  BuiltInFieldType,
  CustomFieldValidator,
  FieldPath,
  FieldSchemaConfig,
  FieldSchemaDefinition,
  FieldValidateRules,
  Validator,
} from "../types/index.js";

export interface CompiledFieldFormat {
  readonly format?: Formatter;
  readonly parse?: Parser;
  readonly formatPreset?: FormatPreset;
}

export interface CompiledSchema {
  readonly initialValues: Record<string, unknown>;
  readonly validators: Partial<Record<FieldPath, readonly Validator[]>>;
  readonly fieldFormats: Partial<Record<FieldPath, CompiledFieldFormat>>;
}

function compileFieldFormat(config: FieldSchemaConfig): CompiledFieldFormat | undefined {
  const formatValue = (config as FieldSchemaConfig & { format?: Formatter | FormatPreset }).format;
  if (!formatValue) {
    return undefined;
  }

  if (typeof formatValue === "string") {
    return { formatPreset: formatValue };
  }

  return { format: formatValue };
}

function wrapCustomValidator<TValues extends Record<string, unknown>>(
  custom: CustomFieldValidator<TValues>,
): Validator<TValues> {
  return (value, context) => custom({ value, path: context.path, form: context.form });
}

function validatorsForBuiltinType(type: BuiltInFieldType): Validator[] {
  switch (type) {
    case "email":
      return [required, email];
    case "password":
      return [required, password()];
    case "url":
      return [required, url];
    case "text":
    default:
      return [];
  }
}

function normalizeFieldRules(config: FieldSchemaConfig): FieldValidateRules {
  return {
    ...(config.required !== undefined ? { required: config.required } : {}),
    ...(config.email !== undefined ? { email: config.email } : {}),
    ...(config.password !== undefined ? { password: config.password } : {}),
    ...(config.url !== undefined ? { url: config.url } : {}),
    ...(config.minLength !== undefined ? { minLength: config.minLength } : {}),
    ...config.validate,
  };
}

function compileFieldSchema(definition: FieldSchemaDefinition): readonly Validator[] {
  if (typeof definition === "string") {
    return validatorsForBuiltinType(definition);
  }

  const config = definition;
  const validators: Validator[] = [];
  const rules = normalizeFieldRules(config);

  if (rules.required) {
    validators.push(required);
  }

  const type = config.type;

  if (type === "email" || rules.email) {
    validators.push(email);
  }

  if (type === "password" || rules.password) {
    validators.push(password({ minLength: rules.minLength ?? 8 }));
  } else if (rules.minLength !== undefined) {
    validators.push(minLength(rules.minLength));
  }

  if (type === "url" || rules.url) {
    validators.push(url);
  }

  if (rules.custom) {
    const customs = Array.isArray(rules.custom) ? rules.custom : [rules.custom];
    for (const custom of customs) {
      validators.push(wrapCustomValidator(custom));
    }
  }

  if (config.validators) {
    for (const custom of config.validators) {
      validators.push(wrapCustomValidator(custom));
    }
  }

  return validators;
}

export function compileSchema(
  schema: Partial<Record<FieldPath, FieldSchemaDefinition>>,
): CompiledSchema {
  const initialValues: Record<string, unknown> = {};
  const validators: Partial<Record<FieldPath, readonly Validator[]>> = {};
  const fieldFormats: Partial<Record<FieldPath, CompiledFieldFormat>> = {};

  for (const [path, definition] of Object.entries(schema)) {
    if (definition === undefined) {
      continue;
    }

    initialValues[path] = "";
    const compiled = compileFieldSchema(definition);
    if (compiled.length > 0) {
      validators[path] = compiled;
    }

    if (typeof definition !== "string") {
      const format = compileFieldFormat(definition);
      if (format) {
        fieldFormats[path] = format;
      }
    }
  }

  return {
    initialValues,
    validators,
    fieldFormats,
  };
}
