import { findFieldContainer, findFieldControl, findFieldControls } from "./discover-fields.js";
import { readControlValue, writeControlValue } from "./field-value.js";

import type { FieldPath, FieldUiState, FormInstance, ValidationMode } from "../types/index.js";

const ERROR_SELECTOR = "[data-form-intelligent-error]";

function errorElementId(formId: string, path: FieldPath): string {
  return `${formId}-error-${path.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function ensureErrorElement(form: HTMLFormElement, formId: string, path: FieldPath): HTMLElement {
  const id = errorElementId(formId, path);
  const existing = document.getElementById(id);
  if (existing instanceof HTMLElement && form.contains(existing)) {
    return existing;
  }

  const control = findFieldControl(form, path);
  const error = document.createElement("span");
  error.id = id;
  error.setAttribute("data-form-intelligent-error", path);
  error.setAttribute("role", "alert");
  error.className = "fi-field-error";
  error.hidden = true;

  if (control?.parentElement) {
    control.parentElement.insertBefore(error, control.nextSibling);
  } else {
    form.appendChild(error);
  }

  return error;
}

function renderFieldError(
  form: HTMLFormElement,
  formId: string,
  path: FieldPath,
  message: string | undefined,
  touched: boolean,
): void {
  const control = findFieldControl(form, path);
  const errorElement = ensureErrorElement(form, formId, path);
  const showError = Boolean(message) && touched;

  if (control) {
    if (showError) {
      control.setAttribute("aria-invalid", "true");
      control.setAttribute("aria-describedby", errorElement.id);
    } else {
      control.removeAttribute("aria-invalid");
      control.removeAttribute("aria-describedby");
    }
  }

  if (showError && message) {
    errorElement.textContent = message;
    errorElement.hidden = false;
    return;
  }

  errorElement.textContent = "";
  errorElement.hidden = true;
}

function shouldValidateOnBlur(mode: ValidationMode): boolean {
  return mode === "onBlur" || mode === "onChange" || mode === "onTouched";
}

function syncSubmitButtons(
  formElement: HTMLFormElement,
  isSubmitting: boolean,
  submitDisabled: boolean,
): void {
  const buttons = formElement.querySelectorAll('button[type="submit"], input[type="submit"]');

  for (const button of Array.from(buttons)) {
    if (!(button instanceof HTMLButtonElement || button instanceof HTMLInputElement)) {
      continue;
    }

    button.disabled = isSubmitting || submitDisabled;
    if (isSubmitting) {
      button.setAttribute("aria-busy", "true");
    } else {
      button.removeAttribute("aria-busy");
    }
  }
}

function syncFieldOptions(
  formElement: HTMLFormElement,
  path: FieldPath,
  options: readonly { label: string; value: string }[] | undefined,
): void {
  const control = findFieldControl(formElement, path);
  if (!(control instanceof HTMLSelectElement) || !options) {
    return;
  }

  const currentValue = control.value;
  control.innerHTML = "";
  for (const option of options) {
    const element = document.createElement("option");
    element.value = option.value;
    element.textContent = option.label;
    control.appendChild(element);
  }
  control.value = currentValue;
}

function syncValidatingState<TValues extends Record<string, unknown>>(
  form: FormInstance<TValues>,
  formElement: HTMLFormElement,
  path: FieldPath,
): void {
  const control = findFieldControl(formElement, path);
  if (!control) {
    return;
  }

  const { isValidating } = form.getFieldMeta(path);
  if (isValidating) {
    control.setAttribute("aria-busy", "true");
    control.setAttribute("data-form-intelligent-validating", "true");
  } else {
    control.removeAttribute("aria-busy");
    control.removeAttribute("data-form-intelligent-validating");
  }
}

function applyFieldUi(
  formElement: HTMLFormElement,
  path: FieldPath,
  ui: FieldUiState | undefined,
): void {
  const container = findFieldContainer(formElement, path);
  const controls = findFieldControls(formElement, path);

  if (container) {
    const visible = ui?.visible ?? true;
    container.hidden = !visible;
    container.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  for (const control of controls) {
    const disabled = ui?.disabled ?? false;
    if (
      control instanceof HTMLInputElement ||
      control instanceof HTMLSelectElement ||
      control instanceof HTMLTextAreaElement ||
      control instanceof HTMLButtonElement
    ) {
      control.disabled = disabled;
    }

    const required = ui?.required;
    if (required === true) {
      control.setAttribute("required", "");
      control.setAttribute("aria-required", "true");
    } else if (required === false) {
      control.removeAttribute("required");
      control.setAttribute("aria-required", "false");
    } else {
      control.removeAttribute("aria-required");
    }
  }
}

function syncFieldUi<TValues extends Record<string, unknown>>(
  form: FormInstance<TValues>,
  formElement: HTMLFormElement,
  fieldPaths: readonly FieldPath[],
): void {
  const { fieldUi } = form.state;

  for (const path of fieldPaths) {
    applyFieldUi(formElement, path, fieldUi[path]);
  }
}

export function attachDomEnhancer<TValues extends Record<string, unknown>>(
  form: FormInstance<TValues>,
  formElement: HTMLFormElement,
  fieldPaths: readonly FieldPath[],
  options: { readonly validateOn: ValidationMode },
): () => void {
  formElement.setAttribute("data-form-intelligent", form.id);
  formElement.noValidate = true;

  const listeners: Array<{ target: EventTarget; type: string; listener: EventListener }> = [];

  const addListener = (target: EventTarget, type: string, listener: EventListener): void => {
    target.addEventListener(type, listener);
    listeners.push({ target, type, listener });
  };

  const syncControlValues = (): void => {
    for (const path of fieldPaths) {
      const control = findFieldControl(formElement, path);
      if (!control) {
        continue;
      }

      const nextValue = form.get(path);
      const currentValue = readControlValue(control);
      if (currentValue !== nextValue) {
        writeControlValue(control, nextValue);
      }
    }
  };

  const syncErrors = (): void => {
    for (const path of fieldPaths) {
      const message = form.errors(path) as string | undefined;
      const { touched } = form.getFieldState(path);
      renderFieldError(formElement, form.id, path, message, touched);
    }
  };

  for (const path of fieldPaths) {
    const control = findFieldControl(formElement, path);
    if (!control) {
      continue;
    }

    form.field(path);

    const handleInput = (): void => {
      form.setValue(path, readControlValue(control));
    };

    const handleBlur = (): void => {
      const field = form.field(path);
      field.setTouched(true);
      field.setVisited(true);

      if (shouldValidateOnBlur(options.validateOn)) {
        void form.validate({ paths: [path], mode: "onBlur" }).then(() => {
          syncErrors();
        });
        return;
      }

      syncErrors();
    };

    addListener(control, "input", handleInput);
    addListener(control, "change", handleInput);
    addListener(control, "blur", handleBlur);
  }

  const handleSubmit = (event: Event): void => {
    event.preventDefault();
    void form.submit().then(() => {
      syncErrors();
    });
  };

  addListener(formElement, "submit", handleSubmit);

  const unsubscribe = form.subscribe(() => {
    syncControlValues();
    syncErrors();
    syncFieldUi(form, formElement, fieldPaths);
    for (const path of fieldPaths) {
      syncFieldOptions(formElement, path, form.state.fieldOptions[path]);
      syncValidatingState(form, formElement, path);
    }
    syncSubmitButtons(
      formElement,
      form.getFormState().isSubmitting,
      form.state.formUi.submitDisabled,
    );
  });

  syncControlValues();
  syncErrors();
  syncFieldUi(form, formElement, fieldPaths);
  for (const path of fieldPaths) {
    syncFieldOptions(formElement, path, form.state.fieldOptions[path]);
    syncValidatingState(form, formElement, path);
  }
  syncSubmitButtons(
    formElement,
    form.getFormState().isSubmitting,
    form.state.formUi.submitDisabled,
  );

  return () => {
    unsubscribe();
    for (const { target, type, listener } of listeners) {
      target.removeEventListener(type, listener);
    }

    formElement.removeAttribute("data-form-intelligent");

    for (const path of fieldPaths) {
      const control = findFieldControl(formElement, path);
      control?.removeAttribute("aria-invalid");
      control?.removeAttribute("aria-describedby");
      control?.removeAttribute("aria-required");

      const container = findFieldContainer(formElement, path);
      container?.removeAttribute("hidden");
      container?.removeAttribute("aria-hidden");

      const error = formElement.querySelector(
        `${ERROR_SELECTOR}[data-form-intelligent-error="${path}"]`,
      );
      error?.remove();
    }

    syncSubmitButtons(formElement, false, false);
  };
}
