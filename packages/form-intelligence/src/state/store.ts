import {
  clearMetaRecord,
  computeChangedFlag,
  computeDirtyFlag,
  hasTruthyPath,
  listTruthyPaths,
  patchFieldMetaRecord,
} from "./meta.js";
import { createValuesSnapshot } from "./snapshots.js";
import { cloneValue, getIn, setIn } from "../utils/index.js";

import type { FieldMetaPatch } from "./meta.js";
import type { FormCoreSnapshot } from "./snapshots.js";
import type { FieldPath, FieldState, FormSelector, ResetOptions } from "../types/index.js";

export type FormCoreState<TValues extends Record<string, unknown>> = FormCoreSnapshot<TValues>;

export interface FormStateStoreOptions<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly defaultValues: TValues;
  readonly currentStep?: number;
}

export class FormStateStore<TValues extends Record<string, unknown>> {
  private core: FormCoreState<TValues>;
  private readonly subscribers = new Set<() => void>();
  private readonly useCache = new Map<FormSelector<TValues, unknown>, unknown>();

  public constructor(options: FormStateStoreOptions<TValues>) {
    const defaultValues = createValuesSnapshot(options.defaultValues);
    this.core = {
      values: createValuesSnapshot(options.values),
      defaultValues,
      submittedValues: createValuesSnapshot(defaultValues),
      errors: {},
      touched: clearMetaRecord(),
      dirty: clearMetaRecord(),
      visited: clearMetaRecord(),
      changed: clearMetaRecord(),
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
      currentStep: options.currentStep ?? 0,
      isAutosaving: false,
      lastAutosaveAt: null,
      destroyed: false,
    };
  }

  public getSnapshot(): Readonly<FormCoreState<TValues>> {
    return this.core;
  }

  public getValues(): TValues {
    return cloneValue(this.core.values);
  }

  public getValue(path: FieldPath): unknown {
    return getIn(this.core.values, path);
  }

  public getErrors(path?: FieldPath): string | undefined | Readonly<Record<FieldPath, string>> {
    if (path === undefined) {
      return { ...this.core.errors };
    }

    return this.core.errors[path];
  }

  public patchCore(patch: Partial<FormCoreState<TValues>>): void {
    this.core = { ...this.core, ...patch };
  }

  public replaceValues(values: TValues): void {
    this.core = { ...this.core, values: createValuesSnapshot(values) };
  }

  public setValueAt(path: FieldPath, value: unknown): void {
    this.core = {
      ...this.core,
      values: setIn(this.core.values, path, value) as TValues,
    };
  }

  public updateValueMeta(
    path: FieldPath,
    nextValue: unknown,
    options: { readonly markDirty?: boolean; readonly markChanged?: boolean } = {},
  ): void {
    const markDirty = options.markDirty !== false;
    const markChanged = options.markChanged !== false;
    let dirty: boolean | undefined;
    let changed: boolean | undefined;

    if (markDirty) {
      dirty = computeDirtyFlag(this.core.defaultValues, path, nextValue);
    }

    if (markChanged) {
      changed = computeChangedFlag(this.core.submittedValues, path, nextValue);
    }

    if (dirty !== undefined) {
      this.core = {
        ...this.core,
        dirty: patchFieldMetaRecord(this.core.dirty, path, dirty),
      };
    }

    if (changed !== undefined) {
      this.core = {
        ...this.core,
        changed: patchFieldMetaRecord(this.core.changed, path, changed),
      };
    }
  }

  public patchMeta(path: FieldPath, patch: FieldMetaPatch): void {
    this.patchMetaSilent(path, patch);
    this.notify();
  }

  public patchMetaSilent(path: FieldPath, patch: FieldMetaPatch): void {
    this.core = {
      ...this.core,
      touched:
        patch.touched === undefined
          ? this.core.touched
          : patchFieldMetaRecord(this.core.touched, path, patch.touched),
      dirty:
        patch.dirty === undefined
          ? this.core.dirty
          : patchFieldMetaRecord(this.core.dirty, path, patch.dirty),
      visited:
        patch.visited === undefined
          ? this.core.visited
          : patchFieldMetaRecord(this.core.visited, path, patch.visited),
      changed:
        patch.changed === undefined
          ? this.core.changed
          : patchFieldMetaRecord(this.core.changed, path, patch.changed),
    };
  }

  public setError(path: FieldPath, message: string): void {
    this.patchCore({ errors: { ...this.core.errors, [path]: message } });
    this.notify();
  }

  public clearErrors(path?: FieldPath): void {
    if (path === undefined) {
      this.patchCore({ errors: {} });
      this.notify();
      return;
    }

    const { [path]: _removed, ...nextErrors } = this.core.errors;
    this.patchCore({ errors: nextErrors });
    this.notify();
  }

  public getFieldState(path: FieldPath): FieldState & { readonly changed: boolean } {
    return {
      touched: Boolean(this.core.touched[path]),
      dirty: Boolean(this.core.dirty[path]),
      visited: Boolean(this.core.visited[path]),
      changed: Boolean(this.core.changed[path]),
    };
  }

  public isDirty(): boolean {
    return hasTruthyPath(this.core.dirty);
  }

  public isChanged(): boolean {
    return hasTruthyPath(this.core.changed);
  }

  public dirtyFields(): readonly FieldPath[] {
    return listTruthyPaths(this.core.dirty);
  }

  public changedSinceSubmitFields(): readonly FieldPath[] {
    return listTruthyPaths(this.core.changed);
  }

  public reset(options: ResetOptions<TValues> = {}): void {
    const nextValues = options.values
      ? { ...this.core.defaultValues, ...options.values }
      : cloneValue(this.core.defaultValues);

    this.core = {
      ...this.core,
      values: nextValues,
      submittedValues: createValuesSnapshot(this.core.defaultValues),
      errors: {},
      touched: clearMetaRecord(),
      dirty: options.keepDirty ? this.core.dirty : clearMetaRecord(),
      visited: clearMetaRecord(),
      changed: clearMetaRecord(),
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
    };
  }

  public markSubmitted(): void {
    this.core = {
      ...this.core,
      submittedValues: createValuesSnapshot(this.core.values),
      changed: clearMetaRecord(),
    };
  }

  public destroy(): void {
    this.core = { ...this.core, destroyed: true };
    this.subscribers.clear();
    this.useCache.clear();
  }

  public isDestroyed(): boolean {
    return this.core.destroyed;
  }

  public subscribe(listener: () => void): () => void {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  }

  public cacheSelector<TSelected>(
    selector: FormSelector<TValues, TSelected>,
    selected: TSelected,
  ): void {
    this.useCache.set(selector, selected);
  }

  public readCachedSelector<TSelected>(
    selector: FormSelector<TValues, TSelected>,
  ): TSelected | undefined {
    return this.useCache.get(selector) as TSelected | undefined;
  }

  public clearSelectorCache(): void {
    this.useCache.clear();
  }

  public notify(): void {
    if (this.core.destroyed) {
      return;
    }

    for (const listener of this.subscribers) {
      listener();
    }
  }
}
