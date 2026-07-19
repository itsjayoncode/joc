import type { FieldBinding, FieldPath } from "@jayoncode/form-intelligence";

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
  const handle = resolvedForm.instance.field(path);
  const attrs = handle.aria.attributes;
  const showError = handle.ui.showError;

  return {
    name: path,
    "aria-invalid": showError,
    "data-fi-status": handle.ui.status,
    ...(attrs["aria-required"] === undefined ? {} : { "aria-required": attrs["aria-required"] }),
    ...(showError && attrs["aria-describedby"] !== undefined
      ? { "aria-describedby": attrs["aria-describedby"] }
      : {}),
    bind: () => resolvedForm.instance.field(path).bind(),
  };
}
