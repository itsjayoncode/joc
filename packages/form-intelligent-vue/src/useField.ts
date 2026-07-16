import type { FieldBinding, FieldPath } from "@jayoncode/form-intelligent";

import { useProvidedForm } from "./provideForm.js";

import type { FieldElementProps, UseFormReturn } from "./types.js";

export interface UseFieldReturn extends FieldElementProps {
  bind(): FieldBinding;
}

export function useField<TValues extends Record<string, unknown>>(
  path: FieldPath,
  form?: UseFormReturn<TValues>,
): UseFieldReturn {
  const resolvedForm = form ?? useProvidedForm<TValues>();

  return {
    name: path,
    bind: () => resolvedForm.instance.field(path).bind(),
  };
}
