import { useEffect, useState } from "react";

import type { FormInstance, FormState } from "@jayoncode/form-intelligent";

export function useFormSnapshot<TValues extends Record<string, unknown>>(
  form: FormInstance<TValues>,
): FormState<TValues> {
  const [snapshot, setSnapshot] = useState(() => form.getFormState());

  useEffect(() => {
    return form.subscribe(() => {
      setSnapshot(form.getFormState());
    });
  }, [form]);

  return snapshot;
}
