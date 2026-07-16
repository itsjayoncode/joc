import { inject, DestroyRef, type Provider } from "@angular/core";

import { FormIntelligentHandleImpl } from "./form-intelligent-handle.js";
import { FORM_INTELLIGENT_FORM } from "./tokens.js";

import type { FormIntelligentHandle, UseFormConfig } from "./types.js";

export function provideFormIntelligent<TValues extends Record<string, unknown>>(
  config: UseFormConfig<TValues>,
): Provider {
  return {
    provide: FORM_INTELLIGENT_FORM,
    useFactory: (destroyRef: DestroyRef) => new FormIntelligentHandleImpl(config, destroyRef),
    deps: [DestroyRef],
  };
}

export function injectForm<
  TValues extends Record<string, unknown> = Record<string, unknown>,
>(): FormIntelligentHandle<TValues> {
  const form = inject(FORM_INTELLIGENT_FORM, { optional: true });

  if (!form) {
    throw new Error("injectForm() requires provideFormIntelligent() in the component providers.");
  }

  return form as FormIntelligentHandle<TValues>;
}
