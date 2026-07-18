import { Injectable, type DestroyRef } from "@angular/core";

import { FormIntelligentHandleImpl } from "./form-intelligent-handle.js";

import type { FormIntelligentHandle, UseFormConfig } from "./types.js";

@Injectable({ providedIn: "root" })
export class FormIntelligentService {
  public create<TValues extends Record<string, unknown>>(
    config: UseFormConfig<TValues>,
    destroyRef: DestroyRef,
  ): FormIntelligentHandle<TValues> {
    return new FormIntelligentHandleImpl(config, destroyRef);
  }
}

export { FormIntelligentService as FormService };
