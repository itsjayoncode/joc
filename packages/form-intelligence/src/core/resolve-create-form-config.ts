import { isSchemaAdapter } from "../adapters/is-schema-adapter.js";
import { discoverFieldNames } from "../dom/discover-fields.js";
import { readNamedFieldValue } from "../dom/field-value.js";
import { resolveFormElement } from "../dom/resolve-form.js";
import { ConfigurationError } from "../errors/index.js";
import { compileSchema } from "../schema/compiler.js";
import { collectRequiredBaseline } from "../schema/required-baseline.js";

import type { FieldPath, FieldSchemaDefinition, FormConfig, Validator } from "../types/index.js";

export interface ResolvedCreateFormConfig<TValues extends Record<string, unknown>> {
  readonly formConfig: FormConfig<TValues> & { readonly initialValues: TValues };
  readonly domTarget: HTMLFormElement | null;
  readonly fieldPaths: readonly FieldPath[];
  /** Static schema/validator `required` paths seeded into Presentation (ADR-018). */
  readonly requiredBaseline: readonly FieldPath[];
}

function buildEmptyInitialValues(paths: readonly FieldPath[]): Record<string, unknown> {
  const initialValues: Record<string, unknown> = {};
  for (const path of paths) {
    initialValues[path] = "";
  }
  return initialValues;
}

function readDomValues(
  form: HTMLFormElement,
  paths: readonly FieldPath[],
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const path of paths) {
    values[path] = readNamedFieldValue(form, path);
  }
  return values;
}

function mergeValidators<TValues extends Record<string, unknown>>(
  schemaValidators: Partial<Record<FieldPath, readonly Validator<TValues>[]>>,
  configValidators: FormConfig<TValues>["validators"],
): FormConfig<TValues>["validators"] {
  const merged: Partial<Record<FieldPath, Validator<TValues> | readonly Validator<TValues>[]>> = {
    ...schemaValidators,
  };

  if (!configValidators) {
    return merged;
  }

  for (const [path, validators] of Object.entries(configValidators)) {
    const existing = merged[path];
    if (!existing) {
      merged[path] = validators;
      continue;
    }

    const next = Array.isArray(validators) ? [...validators] : [validators];
    const previous = Array.isArray(existing) ? [...existing] : [existing];
    merged[path] = [...previous, ...next];
  }

  return merged;
}

export function resolveCreateFormConfig<TValues extends Record<string, unknown>>(
  config: FormConfig<TValues>,
): ResolvedCreateFormConfig<TValues> {
  const target = config.target ?? config.form;
  const fieldSchema: Partial<Record<FieldPath, FieldSchemaDefinition>> | undefined =
    isSchemaAdapter(config.schema) ? undefined : config.schema;
  const hasFieldSchema = fieldSchema !== undefined && Object.keys(fieldSchema).length > 0;
  const hasSchema = hasFieldSchema || isSchemaAdapter(config.schema);

  let domTarget: HTMLFormElement | null = null;
  let discoveredPaths: FieldPath[] = [];

  if (target !== undefined) {
    domTarget = resolveFormElement(target);
    discoveredPaths = discoverFieldNames(domTarget);
  }

  const schemaPaths = hasFieldSchema ? Object.keys(fieldSchema ?? {}) : [];
  const fieldPaths = [...new Set([...schemaPaths, ...discoveredPaths])];

  if (
    config.initialValues === undefined &&
    !hasSchema &&
    fieldPaths.length === 0 &&
    target === undefined
  ) {
    throw new ConfigurationError(
      "createForm requires initialValues, schema, or target/form to discover fields.",
    );
  }

  const compiled = hasFieldSchema
    ? compileSchema(fieldSchema ?? {})
    : { initialValues: {}, validators: {} };

  const initialValues = {
    ...buildEmptyInitialValues(fieldPaths),
    ...compiled.initialValues,
    ...(config.initialValues ?? {}),
    ...(domTarget ? readDomValues(domTarget, fieldPaths) : {}),
  } as TValues;

  const validators = hasFieldSchema
    ? mergeValidators(compiled.validators, config.validators)
    : config.validators;

  const formConfig: ResolvedCreateFormConfig<TValues>["formConfig"] = {
    ...config,
    initialValues,
    ...(validators === undefined ? {} : { validators }),
  };

  return {
    formConfig,
    domTarget,
    fieldPaths,
    requiredBaseline: collectRequiredBaseline(validators),
  };
}
