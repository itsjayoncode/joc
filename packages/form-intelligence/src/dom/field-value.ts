import {
  clearFileInput,
  coerceToCanonicalFileValue,
  emptyFileValue,
  isEmptyFileValue,
  isFileInputElement,
  readFileInputValue,
} from "../fields/file.js";

export function readControlValue(control: HTMLElement): unknown {
  if (control instanceof HTMLInputElement) {
    if (isFileInputElement(control)) {
      return readFileInputValue(control);
    }

    if (control.type === "checkbox") {
      return control.checked;
    }

    if (control.type === "number") {
      return control.value === "" ? "" : control.valueAsNumber;
    }

    return control.value;
  }

  if (control instanceof HTMLSelectElement) {
    if (control.multiple) {
      return Array.from(control.selectedOptions, (option) => option.value);
    }

    return control.value;
  }

  if (control instanceof HTMLTextAreaElement) {
    return control.value;
  }

  return undefined;
}

export function writeControlValue(control: HTMLElement, value: unknown): void {
  if (control instanceof HTMLInputElement) {
    if (isFileInputElement(control)) {
      // State → DOM: never restore a file selection; clear only.
      if (isEmptyFileValue(value)) {
        clearFileInput(control);
      }
      return;
    }

    if (control.type === "checkbox") {
      control.checked = Boolean(value);
      return;
    }

    control.value = value === null || value === undefined ? "" : String(value);
    return;
  }

  if (control instanceof HTMLSelectElement) {
    if (control.multiple && Array.isArray(value)) {
      const selected = new Set(value.map(String));
      for (const option of Array.from(control.options)) {
        option.selected = selected.has(option.value);
      }
      return;
    }

    control.value = value === null || value === undefined ? "" : String(value);
    return;
  }

  if (control instanceof HTMLTextAreaElement) {
    control.value = value === null || value === undefined ? "" : String(value);
  }
}

export function readNamedFieldValue(form: HTMLFormElement, name: string): unknown {
  const named = form.elements.namedItem(name);
  if (!named) {
    return "";
  }

  if (named instanceof RadioNodeList) {
    for (let index = 0; index < named.length; index += 1) {
      const item = named.item(index);
      if (item instanceof HTMLInputElement && item.checked) {
        return item.value;
      }
    }

    return "";
  }

  if (named instanceof HTMLElement) {
    return readControlValue(named);
  }

  return "";
}

export { coerceToCanonicalFileValue, emptyFileValue, isFileInputElement };
