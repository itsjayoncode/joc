import { joinFieldPath } from "./nested-fields.js";
import { getIn } from "../utils/index.js";

import type { FieldPath } from "../types/index.js";

export type ArrayFieldMutation =
  | { readonly type: "remove"; readonly index: number }
  | { readonly type: "insert"; readonly index: number };

const ARRAY_INDEX_PATTERN = /^(\d+)(?:\.(.*))?$/;

export function getArrayValue(values: Record<string, unknown>, arrayPath: FieldPath): unknown[] {
  const value = getIn(values, arrayPath);
  return Array.isArray(value) ? [...value] : [];
}

export function buildArrayItemPath(arrayPath: FieldPath, index: number): FieldPath {
  return joinFieldPath(arrayPath, index);
}

export function pushArrayItem<T>(array: readonly T[], item: T): T[] {
  return [...array, item];
}

export function removeArrayItem<T>(array: readonly T[], index: number): T[] {
  if (index < 0 || index >= array.length) {
    return [...array];
  }

  return array.filter((_, currentIndex) => currentIndex !== index);
}

export function insertArrayItem<T>(array: readonly T[], index: number, item: T): T[] {
  const next = [...array];
  const insertAt = Math.max(0, Math.min(index, next.length));
  next.splice(insertAt, 0, item);
  return next;
}

export function remapIndexedFieldRecord<T>(
  record: Readonly<Record<FieldPath, T>>,
  arrayPath: FieldPath,
  mutation: ArrayFieldMutation,
): Record<FieldPath, T> {
  const prefix = arrayPath.length > 0 ? `${arrayPath}.` : "";
  const next: Record<FieldPath, T> = {};

  for (const [key, value] of Object.entries(record)) {
    if (!key.startsWith(prefix)) {
      next[key] = value;
      continue;
    }

    const rest = key.slice(prefix.length);
    const match = ARRAY_INDEX_PATTERN.exec(rest);
    if (!match) {
      next[key] = value;
      continue;
    }

    const index = Number(match[1]);
    const suffix = match[2];

    if (mutation.type === "remove") {
      if (index === mutation.index) {
        continue;
      }

      const newIndex = index > mutation.index ? index - 1 : index;
      const newKey = suffix
        ? joinFieldPath(joinFieldPath(arrayPath, newIndex), suffix)
        : joinFieldPath(arrayPath, newIndex);
      next[newKey] = value;
      continue;
    }

    if (index >= mutation.index) {
      const newIndex = index + 1;
      const newKey = suffix
        ? joinFieldPath(joinFieldPath(arrayPath, newIndex), suffix)
        : joinFieldPath(arrayPath, newIndex);
      next[newKey] = value;
      continue;
    }

    next[key] = value;
  }

  return next;
}

export function remapIndexedFieldMap<T>(
  map: Map<FieldPath, T>,
  arrayPath: FieldPath,
  mutation: ArrayFieldMutation,
): void {
  const remapped = remapIndexedFieldRecord(Object.fromEntries(map), arrayPath, mutation);
  map.clear();

  for (const [path, value] of Object.entries(remapped)) {
    map.set(path, value);
  }
}
