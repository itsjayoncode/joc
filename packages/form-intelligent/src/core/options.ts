import type { FormConfig, ValidationMode, WorkflowConfig } from "../types/index.js";

export interface ResolvedFormConfig<TValues extends Record<string, unknown>> {
  readonly initialValues: TValues;
  readonly validateOn: ValidationMode;
  readonly workflow: WorkflowConfig | undefined;
  readonly onSubmit: FormConfig<TValues>["onSubmit"];
  readonly onSubmitError: FormConfig<TValues>["onSubmitError"];
  readonly validators: FormConfig<TValues>["validators"];
}

export function normalizeFormConfig<TValues extends Record<string, unknown>>(
  config: FormConfig<TValues>,
): ResolvedFormConfig<TValues> {
  return {
    initialValues: config.initialValues,
    validateOn: config.validateOn ?? "onSubmit",
    workflow: config.workflow,
    onSubmit: config.onSubmit,
    onSubmitError: config.onSubmitError,
    validators: config.validators,
  };
}
