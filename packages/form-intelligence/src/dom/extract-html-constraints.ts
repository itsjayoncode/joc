import { findFieldControls } from "./discover-fields.js";
import {
  email,
  maxLength,
  minLength,
  regex,
  required,
  url,
} from "../validation/validators/index.js";

import type { FieldPath, Validator } from "../types/index.js";

function parsePositiveInt(raw: string | null): number | undefined {
  if (raw === null || raw.trim() === "") {
    return undefined;
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    return undefined;
  }
  return Math.floor(value);
}

function isExtractableControl(
  element: HTMLElement,
): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
  );
}

/**
 * Phase 1 HTML → FI validators for one path (all controls sharing `name`).
 * Invalid `pattern` is skipped; attach must not throw.
 */
export function extractConstraintsFromControls<
  TValues extends Record<string, unknown> = Record<string, unknown>,
>(controls: readonly HTMLElement[]): Validator<TValues>[] {
  const validators: Validator<TValues>[] = [];
  let sawRequired = false;
  let minLen: number | undefined;
  let maxLen: number | undefined;
  let patternSource: string | undefined;
  let typeEmail = false;
  let typeUrl = false;

  for (const control of controls) {
    if (!isExtractableControl(control)) {
      continue;
    }

    if (control.required || control.hasAttribute("required")) {
      sawRequired = true;
    }

    const minAttr = parsePositiveInt(control.getAttribute("minlength"));
    if (minAttr !== undefined) {
      minLen = minLen === undefined ? minAttr : Math.max(minLen, minAttr);
    }

    const maxAttr = parsePositiveInt(control.getAttribute("maxlength"));
    if (maxAttr !== undefined) {
      maxLen = maxLen === undefined ? maxAttr : Math.min(maxLen, maxAttr);
    }

    const patternAttr = control.getAttribute("pattern");
    if (patternAttr !== null && patternAttr !== "" && patternSource === undefined) {
      patternSource = patternAttr;
    }

    if (control instanceof HTMLInputElement) {
      if (control.type === "email") {
        typeEmail = true;
      }
      if (control.type === "url") {
        typeUrl = true;
      }
    }
  }

  if (sawRequired) {
    validators.push(required as Validator<TValues>);
  }
  if (typeEmail) {
    validators.push(email as Validator<TValues>);
  }
  if (typeUrl) {
    validators.push(url as Validator<TValues>);
  }
  if (minLen !== undefined) {
    validators.push(minLength(minLen) as Validator<TValues>);
  }
  if (maxLen !== undefined) {
    validators.push(maxLength(maxLen) as Validator<TValues>);
  }
  if (patternSource !== undefined) {
    try {
      validators.push(regex(new RegExp(patternSource)) as Validator<TValues>);
    } catch {
      // Invalid pattern attribute — skip; do not fail attach.
    }
  }

  return validators;
}

/** Extract Phase 1 HTML constraints for discovered / known field paths. */
export function extractHtmlConstraints<
  TValues extends Record<string, unknown> = Record<string, unknown>,
>(
  form: HTMLFormElement,
  paths: readonly FieldPath[],
): Partial<Record<FieldPath, readonly Validator<TValues>[]>> {
  const result: Partial<Record<FieldPath, readonly Validator<TValues>[]>> = {};

  for (const path of paths) {
    const controls = findFieldControls(form, path);
    if (controls.length === 0) {
      continue;
    }
    const validators = extractConstraintsFromControls<TValues>(controls);
    if (validators.length > 0) {
      result[path] = validators;
    }
  }

  return result;
}
