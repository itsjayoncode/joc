import { computed, type Signal } from "@angular/core";

import type { FormIntelligentHandle, FormStateSelector } from "./types.js";

export function selectFormState<TValues extends Record<string, unknown>, TSelected>(
  form: FormIntelligentHandle<TValues>,
  selector: FormStateSelector<TValues, TSelected>,
): Signal<TSelected> {
  return computed(() => selector(form.state()));
}
