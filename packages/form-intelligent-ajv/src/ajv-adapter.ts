import { Ajv, type AnySchema, type ErrorObject, type ValidateFunction } from "ajv";

import type { SchemaAdapter } from "@jayoncode/form-intelligent";

export interface AjvAdapterOptions {
  readonly ajv?: Ajv;
}

function formatAjvPath(instancePath: string): string {
  const trimmed = instancePath.replace(/^\//, "");

  if (!trimmed) {
    return "_form";
  }

  return trimmed.replace(/\//g, ".");
}

function mapAjvErrors(errors: ErrorObject[] | null | undefined): Record<string, string> {
  const mapped: Record<string, string> = {};

  for (const error of errors ?? []) {
    const path = formatAjvPath(error.instancePath);
    if (!mapped[path]) {
      mapped[path] = error.message ?? "Invalid value";
    }
  }

  return mapped;
}

function isValidateFunction(value: AnySchema | ValidateFunction): value is ValidateFunction {
  return typeof value === "function";
}

export function ajvAdapter(
  schemaOrValidate: AnySchema | ValidateFunction,
  options: AjvAdapterOptions = {},
): SchemaAdapter {
  const validate = isValidateFunction(schemaOrValidate)
    ? schemaOrValidate
    : (options.ajv ?? new Ajv({ allErrors: true })).compile(schemaOrValidate);

  return {
    async validate(values) {
      const valid = await validate(values);

      if (valid) {
        return {};
      }

      return mapAjvErrors(validate.errors);
    },
  };
}
