import type {
  FieldAriaIds,
  FieldBinding,
  FieldController,
  FieldPath,
} from "@jayoncode/form-intelligence";

import { useProvidedForm } from "./provideForm.js";

import type { FieldElementProps, UseFormReturn } from "./types.js";

export interface UseFieldReturn extends FieldElementProps {
  /** Full field controller (bind, aria, setAriaIds, ui, …). */
  readonly controller: FieldController;
  readonly aria: FieldController["aria"];
  bind(): FieldBinding;
  setAriaIds(ids: FieldAriaIds): void;
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
    controller: handle as FieldController,
    aria: handle.aria,
    bind: () => resolvedForm.instance.field(path).bind(),
    setAriaIds: (ids) => {
      resolvedForm.instance.field(path).setAriaIds(ids);
    },
  };
}
