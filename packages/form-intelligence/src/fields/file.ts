import { getIn, parsePath, setIn } from "../utils/index.js";

import type { FieldPath } from "../types/index.js";

/** Canonical in-memory representation for file fields (ADR-FILE-001 Phase A). */
export type CanonicalFileValue = File[];

export function isFileInputElement(
  control: HTMLElement,
): control is HTMLInputElement & { type: "file" } {
  return control instanceof HTMLInputElement && control.type === "file";
}

export function emptyFileValue(): CanonicalFileValue {
  return [];
}

export function isCanonicalFileValue(value: unknown): value is CanonicalFileValue {
  if (!Array.isArray(value)) {
    return false;
  }
  if (value.length === 0) {
    return true;
  }
  if (typeof File === "undefined") {
    return false;
  }
  return value.every((entry) => entry instanceof File);
}

export function isEmptyFileValue(value: unknown): boolean {
  if (value === null || value === undefined || value === "") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof FileList !== "undefined" && value instanceof FileList) {
    return value.length === 0;
  }
  return false;
}

/**
 * Coerce DOM / bind payloads into the canonical `File[]` representation.
 * Returns `null` when the value is not file-shaped.
 */
export function coerceToCanonicalFileValue(value: unknown): CanonicalFileValue | null {
  if (typeof FileList !== "undefined" && value instanceof FileList) {
    return Array.from(value);
  }
  if (typeof File !== "undefined" && value instanceof File) {
    return [value];
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [];
    }
    if (typeof File !== "undefined" && value.every((entry) => entry instanceof File)) {
      return value as File[];
    }
  }
  return null;
}

export function readFileInputValue(control: HTMLInputElement): CanonicalFileValue {
  return control.files ? Array.from(control.files) : [];
}

/** Clear selection only — never restore files from state (ADR-FILE-001). */
export function clearFileInput(control: HTMLInputElement): void {
  control.value = "";
}

function deleteIn(values: Record<string, unknown>, path: FieldPath): Record<string, unknown> {
  const segments = parsePath(path);
  if (segments.length === 0) {
    return values;
  }

  if (segments.length === 1) {
    const key = segments[0];
    if (key === undefined) {
      return values;
    }
    const { [key]: _removed, ...rest } = values;
    return rest;
  }

  const parentPath = segments.slice(0, -1).join(".");
  const last = segments[segments.length - 1];
  if (last === undefined) {
    return values;
  }
  const parent = getIn(values, parentPath);
  if (!parent || typeof parent !== "object" || Array.isArray(parent)) {
    return values;
  }
  const { [last]: _removed, ...rest } = parent as Record<string, unknown>;
  return setIn(values, parentPath, rest);
}

/** Drop non-persistent paths from a values snapshot (drafts / offline / history). */
export function omitPaths<TValues extends Record<string, unknown>>(
  values: TValues,
  paths: ReadonlySet<FieldPath>,
): TValues {
  if (paths.size === 0) {
    return values;
  }

  let next: Record<string, unknown> = { ...values };
  for (const path of paths) {
    next = deleteIn(next, path);
  }
  return next as TValues;
}

/**
 * Apply a persistence/history snapshot while keeping current browser-owned
 * ephemeral values for registered non-persistent paths.
 */
export function mergePreservingNonPersistent<TValues extends Record<string, unknown>>(
  snapshot: TValues,
  current: TValues,
  nonPersistentPaths: ReadonlySet<FieldPath>,
): TValues {
  if (nonPersistentPaths.size === 0) {
    return snapshot;
  }

  let next: Record<string, unknown> = { ...snapshot };
  for (const path of nonPersistentPaths) {
    next = setIn(next, path, getIn(current, path));
  }
  return next as TValues;
}
