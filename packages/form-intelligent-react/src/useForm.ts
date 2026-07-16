import { useEffect, useRef, useSyncExternalStore } from "react";

import { createForm } from "@jayoncode/form-intelligent";
import type { FieldPath } from "@jayoncode/form-intelligent";

import type { UseFormConfig, UseFormReturn } from "./types.js";

export function useForm<TValues extends Record<string, unknown>>(
  config: UseFormConfig<TValues>,
): UseFormReturn<TValues> {
  const instanceRef = useRef<ReturnType<typeof createForm<TValues>> | null>(null);

  if (instanceRef.current === null) {
    instanceRef.current = createForm(config);
  }

  const instance = instanceRef.current;
  const state = useSyncExternalStore(
    (listener) => instance.subscribe(listener),
    () => instance.getSnapshot(),
    () => instance.getSnapshot(),
  );

  useEffect(() => {
    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, [instance]);

  return {
    instance,
    state,
    ref: instance.ref,
    form: () => ({
      ref: instance.ref,
      noValidate: true,
    }),
    field: (path: FieldPath) => ({
      name: path,
    }),
    submit: () => ({
      type: "submit",
      ...(state.isSubmitting || state.formUi.submitDisabled
        ? { disabled: true, ...(state.isSubmitting ? { "aria-busy": true } : {}) }
        : {}),
    }),
    submitButton: () => ({
      type: "submit",
      ...(state.isSubmitting || state.formUi.submitDisabled
        ? { disabled: true, ...(state.isSubmitting ? { "aria-busy": true } : {}) }
        : {}),
    }),
  };
}
