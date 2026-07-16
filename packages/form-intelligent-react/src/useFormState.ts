import { useRef, useSyncExternalStore } from "react";

import type { FormInstance, FormSelector } from "@jayoncode/form-intelligent";

export function useFormState<TValues extends Record<string, unknown>, TSelected>(
  form: FormInstance<TValues>,
  selector: FormSelector<TValues, TSelected>,
): TSelected {
  const snapshotRef = useRef(selector(form.state));

  return useSyncExternalStore(
    (listener) =>
      form.subscribe(() => {
        snapshotRef.current = selector(form.state);
        listener();
      }),
    () => snapshotRef.current,
    () => snapshotRef.current,
  );
}
