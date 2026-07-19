import { useEffect, useRef, useSyncExternalStore } from "react";

import { createForm, createFormController } from "@jayoncode/form-intelligence";
import type { FieldPath } from "@jayoncode/form-intelligence";

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
      const showError = handle.ui.showError;
      return {
        name: path,
        "aria-invalid": showError,
        "data-fi-status": handle.ui.status,
        ...(attrs["aria-required"] === undefined
          ? {}
          : { "aria-required": attrs["aria-required"] }),
        ...(showError && attrs["aria-describedby"] !== undefined
          ? { "aria-describedby": attrs["aria-describedby"] }
          : {}),
      };
    },
    fieldController: (path: FieldPath) => instance.field(path),
    submit: () => {
      const canSubmit = instance.ui.canSubmit;
      return {
        type: "submit" as const,
        ...(!canSubmit
          ? {
              disabled: true,
              ...(state.isSubmitting ? { "aria-busy": true as const } : {}),
            }
          : {}),
      };
    },
    submitButton: () => {
      const canSubmit = instance.ui.canSubmit;
      return {
        type: "submit" as const,
        ...(!canSubmit
          ? {
              disabled: true,
              ...(state.isSubmitting ? { "aria-busy": true as const } : {}),
            }
          : {}),
      };
    },
    focusFirstInvalid: () => instance.focusFirstInvalid(),
  };
}
