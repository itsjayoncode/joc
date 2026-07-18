import type { FieldPath, FieldState, FormSelector, FormState } from "../types/index.js";

export const selectValues = <TValues extends Record<string, unknown>>(
  state: FormState<TValues>,
): TValues => state.values;

export const selectErrors = <TValues extends Record<string, unknown>>(
  state: FormState<TValues>,
): Readonly<Record<FieldPath, string>> => state.errors;

export const selectIsDirty = <TValues extends Record<string, unknown>>(
  state: FormState<TValues>,
): boolean => state.isDirty;

export const selectIsChanged = <TValues extends Record<string, unknown>>(
  state: FormState<TValues>,
): boolean => state.isChanged;

export const selectIsSubmitting = <TValues extends Record<string, unknown>>(
  state: FormState<TValues>,
): boolean => state.isSubmitting;

export const selectIsValid = <TValues extends Record<string, unknown>>(
  state: FormState<TValues>,
): boolean => state.isValid;

export function selectFieldState<TValues extends Record<string, unknown>>(
  path: FieldPath,
): FormSelector<TValues, FieldState & { readonly changed: boolean }> {
  return (state) => ({
    touched: Boolean(state.touched[path]),
    dirty: Boolean(state.dirty[path]),
    visited: Boolean(state.visited[path]),
    changed: Boolean(state.changed[path]),
  });
}

export function selectFieldError<TValues extends Record<string, unknown>>(
  path: FieldPath,
): FormSelector<TValues, string | undefined> {
  return (state) => state.errors[path];
}

export function selectFieldValue<TValues extends Record<string, unknown>>(
  path: FieldPath,
): FormSelector<TValues, unknown> {
  return (state) => {
    const segments = path.split(".");
    let current: unknown = state.values;
    for (const segment of segments) {
      if (current === null || typeof current !== "object") {
        return undefined;
      }
      current = (current as Record<string, unknown>)[segment];
    }
    return current;
  };
}

export function createSelector<TValues extends Record<string, unknown>, TSelected>(
  selector: FormSelector<TValues, TSelected>,
): FormSelector<TValues, TSelected> {
  return selector;
}
