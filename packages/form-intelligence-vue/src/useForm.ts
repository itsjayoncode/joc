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
    field: (path: FieldPath) => ({
      name: path,
    }),
    submit: () => {
      const snapshot = state.value;
      return {
        type: "submit",
        ...(snapshot.isSubmitting || snapshot.formUi.submitDisabled
          ? { disabled: true, ...(snapshot.isSubmitting ? { "aria-busy": true } : {}) }
          : {}),
      };
    },
    submitButton: () => {
      const snapshot = state.value;
      return {
        type: "submit",
        ...(snapshot.isSubmitting || snapshot.formUi.submitDisabled
          ? { disabled: true, ...(snapshot.isSubmitting ? { "aria-busy": true } : {}) }
          : {}),
      };
    },
  };
}
