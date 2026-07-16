import { signal, type DestroyRef } from "@angular/core";

import { createForm } from "@jayoncode/form-intelligent";
import type { FieldPath } from "@jayoncode/form-intelligent";

import type { FormIntelligentHandle, UseFormConfig } from "./types.js";

export class FormIntelligentHandleImpl<
  TValues extends Record<string, unknown>,
> implements FormIntelligentHandle<TValues> {
  readonly instance;
  readonly state;
  readonly ref;

  private readonly unsubscribe: () => void;

  public constructor(config: UseFormConfig<TValues>, destroyRef?: DestroyRef) {
    this.instance = createForm(config);
    this.ref = this.instance.ref;
    this.state = signal(this.instance.getSnapshot());

    this.unsubscribe = this.instance.subscribe(() => {
      this.state.set(this.instance.getSnapshot());
    });

    destroyRef?.onDestroy(() => {
      this.destroy();
    });
  }

  public form() {
    return {
      noValidate: true as const,
    };
  }

  public field(path: FieldPath) {
    return {
      name: path,
    };
  }

  public submit() {
    return this.submitButtonProps();
  }

  public submitButton() {
    return this.submitButtonProps();
  }

  public destroy(): void {
    this.unsubscribe();
    this.instance.ref(null);
    this.instance.destroy();
  }

  private submitButtonProps() {
    const snapshot = this.state();
    return {
      type: "submit" as const,
      ...(snapshot.isSubmitting || snapshot.formUi.submitDisabled
        ? { disabled: true, ...(snapshot.isSubmitting ? { "aria-busy": true } : {}) }
        : {}),
    };
  }
}
