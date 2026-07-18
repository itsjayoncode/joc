import type { FieldPath } from "../types/index.js";

const SKIPPED_INPUT_TYPES = new Set(["submit", "button", "reset", "image"]);

function isFieldControl(
  element: Element,
): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  if (element instanceof HTMLInputElement) {
    return !SKIPPED_INPUT_TYPES.has(element.type);
  }

  return element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement;
}

export function discoverFieldNames(form: HTMLFormElement): FieldPath[] {
  const names = new Set<FieldPath>();

  for (const element of Array.from(form.elements)) {
    if (!(element instanceof Element) || !isFieldControl(element)) {
      continue;
    }

    const name = element.getAttribute("name")?.trim();
    if (name) {
      names.add(name);
    }
  }

  return [...names];
}

export function findFieldControl(form: HTMLFormElement, name: FieldPath): HTMLElement | null {
  const controls = findFieldControls(form, name);
  return controls[0] ?? null;
}

export function findFieldControls(form: HTMLFormElement, name: FieldPath): HTMLElement[] {
  const named = form.elements.namedItem(name);
  if (!named) {
    return [];
  }

  if (named instanceof RadioNodeList) {
    const controls: HTMLElement[] = [];
    for (let index = 0; index < named.length; index += 1) {
      const item = named.item(index);
      if (item instanceof HTMLElement) {
        controls.push(item);
      }
    }
    return controls;
  }

  return named instanceof HTMLElement ? [named] : [];
}

export function findFieldContainer(form: HTMLFormElement, name: FieldPath): HTMLElement | null {
  const explicit = form.querySelector(`[data-form-intelligent-field="${name}"]`);
  if (explicit instanceof HTMLElement) {
    return explicit;
  }

  const control = findFieldControl(form, name);
  if (!control) {
    return null;
  }

  const labelled = control.closest("label");
  if (labelled?.parentElement instanceof HTMLElement) {
    return labelled.parentElement;
  }

  return control;
}
