import { inject, provide } from "vue";

import { FORM_CONTEXT_KEY } from "./keys.js";
import { useForm } from "./useForm.js";

import type { UseFormConfig, UseFormReturn } from "./types.js";

export function provideForm<TValues extends Record<string, unknown>>(
  config: UseFormConfig<TValues>,
): UseFormReturn<TValues> {
  const form = useForm(config);
  provide(FORM_CONTEXT_KEY, form as UseFormReturn<Record<string, unknown>>);
  return form;
}

export function useProvidedForm<
  TValues extends Record<string, unknown> = Record<string, unknown>,
>(): UseFormReturn<TValues> {
  const form = inject(FORM_CONTEXT_KEY);

  if (!form) {
    throw new Error("useProvidedForm() requires provideForm() in an ancestor component.");
  }

  return form as UseFormReturn<TValues>;
}
