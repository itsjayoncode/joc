import { isSchemaAdapter } from "../adapters/is-schema-adapter.js";
import { discoverFieldNames } from "../dom/discover-fields.js";
import { readNamedFieldValue } from "../dom/field-value.js";
import { resolveFormElement } from "../dom/resolve-form.js";
import { ConfigurationError } from "../errors/index.js";
import { compileSchema } from "../schema/compiler.js";
import { collectRequiredBaseline } from "../schema/required-baseline.js";
import { mergeValidatorsByKind } from "../validation/merge-validators-by-kind.js";

import type { FieldPath, FieldSchemaDefinition, FormConfig, Validator } from "../types/index.js";

export interface ResolvedCreateFormConfig<TValues extends Record<string, unknown>> {
  readonly formConfig: FormConfig<TValues> & { readonly initialValues: TValues };
  readonly domTarget: HTMLFormElement | null;
  readonly fieldPaths: readonly FieldPath[];
  /** Static schema/validator `required` paths seeded into Presentation (ADR-018). */
  readonly requiredBaseline: readonly FieldPath[];
  /** Compiled field-schema validators (separate from config for kind merge). */
  readonly schemaValidators: Partial<Record<FieldPath, readonly Validator<TValues>[]>>;
  /** `createForm({ validators })` only — excludes schema and HTML. */
  readonly fieldConfigValidators: FormConfig<TValues>["validators"];
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

  const schemaValidators = compiled.validators as Partial<
    Record<FieldPath, readonly Validator<TValues>[]>
  >;
  const fieldConfigValidators = config.validators;

  const initialValues = {
    ...buildEmptyInitialValues(fieldPaths),
    ...compiled.initialValues,
    ...(config.initialValues ?? {}),
    ...(domTarget ? readDomValues(domTarget, fieldPaths) : {}),
  } as TValues;

  const validators = mergeValidatorsByKind<TValues>({
    schema: schemaValidators,
    ...(fieldConfigValidators ? { field: fieldConfigValidators } : {}),
  });

  const hasMergedValidators = Object.keys(validators).length > 0;

  const formConfig: ResolvedCreateFormConfig<TValues>["formConfig"] = {
    ...config,
    initialValues,
    ...(hasMergedValidators ? { validators } : {}),
  };

  return {
    formConfig,
    domTarget,
    fieldPaths,
    requiredBaseline: collectRequiredBaseline(hasMergedValidators ? validators : undefined),
    schemaValidators,
    fieldConfigValidators,
  };
}
