import { useEffect, useRef, useSyncExternalStore } from "react";

import { createForm, createFormController } from "@jayoncode/form-intelligent";
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
  const controller = createFormController(instance);
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
    controller,
    state,
    ref: instance.ref,
    form: () => ({
      ref: instance.ref,
      noValidate: true,
    }),
    field: (path: FieldPath) => {
      const handle = instance.field(path);
      const attrs = handle.aria.attributes;
      return {
        name: path,
        "aria-invalid": attrs["aria-invalid"],
        ...(attrs["aria-required"] === undefined
          ? {}
          : { "aria-required": attrs["aria-required"] }),
        ...(attrs["aria-describedby"] === undefined
          ? {}
          : { "aria-describedby": attrs["aria-describedby"] }),
      };
    },
    fieldController: (path: FieldPath) => instance.field(path),
    submit: () => ({
      type: "submit" as const,
      ...(state.isSubmitting || state.formUi.submitDisabled
        ? { disabled: true, ...(state.isSubmitting ? { "aria-busy": true as const } : {}) }
        : {}),
    }),
    submitButton: () => ({
      type: "submit" as const,
      ...(state.isSubmitting || state.formUi.submitDisabled
        ? { disabled: true, ...(state.isSubmitting ? { "aria-busy": true as const } : {}) }
        : {}),
    }),
    focusFirstInvalid: () => instance.focusFirstInvalid(),
  };
}
