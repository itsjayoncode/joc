import { isCanonicalFileValue } from "./file.js";
import { asFileList } from "../validation/validators/file-utils.js";

import type { FieldPath } from "../types/index.js";

export type FormPayloadKind = "json" | "multipart";

export interface JsonFormPayload<TValues extends Record<string, unknown>> {
  readonly kind: "json";
  readonly values: TValues;
}

export interface MultipartFormPayload {
  readonly kind: "multipart";
  readonly formData: FormData;
}

export type FormPayload<TValues extends Record<string, unknown>> =
  JsonFormPayload<TValues> | MultipartFormPayload;

export interface ToFormDataOptions {
  /** Skip empty strings, empty file arrays, null, and undefined. Default true. */
  readonly omitEmpty?: boolean;
}

function hasFilePayload(values: Record<string, unknown>): boolean {
  for (const value of Object.values(values)) {
    if (typeof File !== "undefined" && value instanceof File) {
      return true;
    }
    if (isCanonicalFileValue(value) && value.length > 0) {
      return true;
    }
    if (typeof FileList !== "undefined" && value instanceof FileList && value.length > 0) {
      return true;
    }
  }
  return false;
}

function appendValue(formData: FormData, key: string, value: unknown, omitEmpty: boolean): void {
  if (value === null || value === undefined) {
    return;
  }

  if (typeof File !== "undefined" && value instanceof File) {
    formData.append(key, value);
    return;
  }

  if (
    isCanonicalFileValue(value) ||
    (typeof FileList !== "undefined" && value instanceof FileList)
  ) {
    const files = asFileList(value);
    if (files.length === 0) {
      if (!omitEmpty) {
        formData.append(key, "");
      }
      return;
    }
    for (const file of files) {
      formData.append(key, file);
    }
    return;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      if (!omitEmpty) {
        formData.append(key, "");
      }
      return;
    }
    for (const entry of value) {
      appendValue(formData, key, entry, omitEmpty);
    }
    return;
  }

  if (typeof value === "boolean" || typeof value === "number") {
    formData.append(key, String(value));
    return;
  }

  if (typeof value === "string") {
    if (omitEmpty && value === "") {
      return;
    }
    formData.append(key, value);
    return;
  }

  if (typeof value === "object") {
    formData.append(key, JSON.stringify(value));
  }
}

/** Build `FormData` from form values (top-level keys). Files append as binary parts. */
export function valuesToFormData(
  values: Record<string, unknown>,
  options: ToFormDataOptions = {},
): FormData {
  const omitEmpty = options.omitEmpty !== false;
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) {
    appendValue(formData, key, value, omitEmpty);
  }
  return formData;
}

export function buildFormPayload<TValues extends Record<string, unknown>>(
  values: TValues,
  options?: ToFormDataOptions,
): FormPayload<TValues> {
  if (hasFilePayload(values)) {
    return { kind: "multipart", formData: valuesToFormData(values, options) };
  }
  return { kind: "json", values };
}

export type { FieldPath };
