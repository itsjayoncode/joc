import { cloneValue } from "../utils/index.js";

import type { FieldPath } from "../types/index.js";

export interface FormCoreSnapshot<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly defaultValues: TValues;
  readonly submittedValues: TValues;
  readonly errors: Readonly<Record<FieldPath, string>>;
  readonly touched: Readonly<Record<FieldPath, boolean>>;
  readonly dirty: Readonly<Record<FieldPath, boolean>>;
  readonly visited: Readonly<Record<FieldPath, boolean>>;
  readonly changed: Readonly<Record<FieldPath, boolean>>;
  readonly isSubmitting: boolean;
  readonly isValidating: boolean;
  readonly submitCount: number;
  readonly currentStep: number;
  readonly isAutosaving: boolean;
  readonly lastAutosaveAt: number | null;
  readonly destroyed: boolean;
}

export function createCoreSnapshot<TValues extends Record<string, unknown>>(
  snapshot: FormCoreSnapshot<TValues>,
): FormCoreSnapshot<TValues> {
  return {
    values: cloneValue(snapshot.values),
    defaultValues: cloneValue(snapshot.defaultValues),
    submittedValues: cloneValue(snapshot.submittedValues),
    errors: { ...snapshot.errors },
    touched: { ...snapshot.touched },
    dirty: { ...snapshot.dirty },
    visited: { ...snapshot.visited },
    changed: { ...snapshot.changed },
    isSubmitting: snapshot.isSubmitting,
    isValidating: snapshot.isValidating,
    submitCount: snapshot.submitCount,
    currentStep: snapshot.currentStep,
    isAutosaving: snapshot.isAutosaving,
    lastAutosaveAt: snapshot.lastAutosaveAt,
    destroyed: snapshot.destroyed,
  };
}

export function createValuesSnapshot<TValues extends Record<string, unknown>>(
  values: TValues,
): TValues {
  return cloneValue(values);
}
