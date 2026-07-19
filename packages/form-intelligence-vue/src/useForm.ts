import {
  getCurrentScope,
  onBeforeUnmount,
  onMounted,
  onScopeDispose,
  ref,
  shallowRef,
  watch,
} from "vue";

import { createForm } from "@jayoncode/form-intelligence";
import type { FieldPath } from "@jayoncode/form-intelligence";

import type { UseFormConfig, UseFormReturn } from "./types.js";

export function useForm<TValues extends Record<string, unknown>>(
  config: UseFormConfig<TValues>,
): UseFormReturn<TValues> {
  const instanceRef = shallowRef(createForm(config));
  const formElement = ref<HTMLFormElement | null>(null);
  const state = shallowRef(instanceRef.value.getSnapshot());

  const unsubscribe = instanceRef.value.subscribe(() => {
    state.value = instanceRef.value.getSnapshot();
  });

  const syncFormElement = (element: HTMLFormElement | null): void => {
    instanceRef.value.ref(element);
  };

  watch(formElement, syncFormElement, { flush: "post" });

  if (getCurrentScope()) {
    onMounted(() => {
      syncFormElement(formElement.value);
    });

    onBeforeUnmount(() => {
      syncFormElement(null);
    });
  }

  onScopeDispose(() => {
    unsubscribe();
    syncFormElement(null);
    instanceRef.value.destroy();
  });

  return {
    get instance() {
      return instanceRef.value;
    },
    state,
    ref: instanceRef.value.ref,
    form: () => ({
      ref: formElement,
      noValidate: true,
    }),
    field: (path: FieldPath) => {
      const handle = instanceRef.value.field(path);
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
    submit: () => {
      const instance = instanceRef.value;
      const canSubmit = instance.ui.canSubmit;
      return {
        type: "submit" as const,
        ...(!canSubmit
          ? {
              disabled: true,
              ...(state.value.isSubmitting ? { "aria-busy": true as const } : {}),
            }
          : {}),
      };
    },
    submitButton: () => {
      const instance = instanceRef.value;
      const canSubmit = instance.ui.canSubmit;
      return {
        type: "submit" as const,
        ...(!canSubmit
          ? {
              disabled: true,
              ...(state.value.isSubmitting ? { "aria-busy": true as const } : {}),
            }
          : {}),
      };
    },
  };
}
