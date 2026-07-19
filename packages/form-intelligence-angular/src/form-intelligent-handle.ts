import { signal, type DestroyRef } from "@angular/core";

import { createForm, createFormController } from "@jayoncode/form-intelligence";
import type { FieldPath } from "@jayoncode/form-intelligence";

import type { FormIntelligentHandle, UseFormConfig } from "./types.js";

export class FormIntelligentHandleImpl<
  TValues extends Record<string, unknown>,
> implements FormIntelligentHandle<TValues> {
  readonly instance;
  readonly controller;
  readonly state;
  readonly ref;

  private readonly unsubscribe: () => void;

  public constructor(config: UseFormConfig<TValues>, destroyRef?: DestroyRef) {
    this.instance = createForm(config);
    this.controller = createFormController(this.instance);
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
    const handle = this.instance.field(path);
    const attrs = handle.aria.attributes;
    const showError = handle.ui.showError;
    return {
      name: path,
      "aria-invalid": showError,
      "data-fi-status": handle.ui.status,
      ...(attrs["aria-required"] === undefined ? {} : { "aria-required": attrs["aria-required"] }),
      ...(showError && attrs["aria-describedby"] !== undefined
        ? { "aria-describedby": attrs["aria-describedby"] }
        : {}),
    };
  }

  public fieldController(path: FieldPath) {
    return this.instance.field(path);
  }

  public submit() {
    return this.submitButtonProps();
  }

  public submitButton() {
    return this.submitButtonProps();
  }

  public focusFirstInvalid() {
    return this.instance.focusFirstInvalid();
  }

  public destroy(): void {
    this.unsubscribe();
    this.instance.ref(null);
    this.instance.destroy();
  }

  private submitButtonProps() {
    const snapshot = this.state();
    const canSubmit = this.instance.ui.canSubmit;
    return {
      type: "submit" as const,
      ...(!canSubmit
        ? {
            disabled: true,
            ...(snapshot.isSubmitting ? { "aria-busy": true as const } : {}),
          }
        : {}),
    };
  }
}
