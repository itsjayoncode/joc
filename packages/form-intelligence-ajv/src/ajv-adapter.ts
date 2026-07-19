import { Ajv, type AnySchema, type ErrorObject, type ValidateFunction } from "ajv";

import type { SchemaAdapter } from "@jayoncode/form-intelligence";

export interface AjvAdapterOptions {
  readonly ajv?: Ajv;
}

function formatAjvInstancePath(instancePath: string): string {
  const trimmed = instancePath.replace(/^\//, "");

  if (!trimmed) {
    return "";
  }

  return trimmed.replace(/\//g, ".");
}

/**
 * Map AJV errors to Form Intelligence field paths (dot notation).
 * `required` / `additionalProperties` attach the property name from `params`
 * because `instancePath` is often the parent (or empty for root required).
 */
export function formatAjvErrorPath(error: ErrorObject): string {
  const base = formatAjvInstancePath(error.instancePath);
  const params = error.params as Record<string, unknown> | undefined;

  if (error.keyword === "required" && typeof params?.missingProperty === "string") {
    return base ? `${base}.${params.missingProperty}` : params.missingProperty;
  }

  if (error.keyword === "additionalProperties" && typeof params?.additionalProperty === "string") {
    return base ? `${base}.${params.additionalProperty}` : params.additionalProperty;
  }

  return base || "_form";
}

function mapAjvErrors(errors: ErrorObject[] | null | undefined): Record<string, string> {
  const mapped: Record<string, string> = {};

  for (const error of errors ?? []) {
    const path = formatAjvErrorPath(error);
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
