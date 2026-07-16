import { cloneValue, getIn } from "../utils/index.js";

import type { FieldPath } from "../types/index.js";

export interface FieldMetaPatch {
  readonly touched?: boolean;
  readonly dirty?: boolean;
  readonly visited?: boolean;
  readonly changed?: boolean;
}

export function computeDirtyFlag(
  defaultValues: Record<string, unknown>,
  path: FieldPath,
  nextValue: unknown,
): boolean {
  return getIn(defaultValues, path) !== nextValue;
}

export function computeChangedFlag(
  submittedValues: Record<string, unknown>,
  path: FieldPath,
  nextValue: unknown,
): boolean {
  return getIn(submittedValues, path) !== nextValue;
}

export function patchFieldMetaRecord(
  record: Readonly<Record<FieldPath, boolean>>,
  path: FieldPath,
  value: boolean,
): Record<FieldPath, boolean> {
  return { ...record, [path]: value };
}

export function listTruthyPaths(record: Readonly<Record<FieldPath, boolean>>): FieldPath[] {
  return Object.entries(record)
    .filter(([, flag]) => flag)
    .map(([path]) => path);
}

export function hasTruthyPath(record: Readonly<Record<FieldPath, boolean>>): boolean {
  return Object.values(record).some(Boolean);
}

export function clearMetaRecord(): Record<FieldPath, boolean> {
  return {};
}

export function cloneValuesSnapshot<TValues extends Record<string, unknown>>(
  values: TValues,
): TValues {
  return cloneValue(values);
}
