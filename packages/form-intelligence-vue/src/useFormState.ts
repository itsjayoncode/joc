import { computed, onScopeDispose, shallowRef } from "vue";

import type { FormInstance, FormSelector } from "@jayoncode/form-intelligence";

import type { ComputedRef } from "vue";

export function useFormState<TValues extends Record<string, unknown>, TSelected>(
  form: FormInstance<TValues>,
  selector: FormSelector<TValues, TSelected>,
): ComputedRef<TSelected> {
  const revision = shallowRef(0);

  onScopeDispose(
    form.subscribe(() => {
      revision.value += 1;
    }),
  );

  return computed(() => {
    void revision.value;
    return selector(form.state);
  });
}
