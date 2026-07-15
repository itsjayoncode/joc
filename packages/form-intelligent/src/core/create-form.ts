import { FormEventBus } from "./events.js";
import { normalizeFormConfig } from "./options.js";
import { applyFormatter, applyParser } from "../format/formatters.js";
import { PluginRegistry } from "../plugins/registry.js";
import { executeSubmit } from "../submission/submit.js";
import { cloneValue, createId, debounce, getIn, setIn } from "../utils/index.js";
import { listAllPaths, validatePaths } from "../validation/pipeline.js";
import {
  assertStepIndex,
  clearDraft,
  getStepFields,
  loadDraft,
  resolveWizardState,
  saveDraft,
} from "../workflow/engine.js";

import type { ResolvedFormConfig } from "./options.js";
import type {
  FieldBinding,
  FieldHandle,
  FieldOptions,
  FieldPath,
  FieldState,
  FormConfig,
  FormEvent,
  FormInstance,
  FormPlugin,
  FormSelector,
  FormState,
  ResetOptions,
  SubmitOptions,
  ValidateOptions,
  Validator,
  WorkflowState,
} from "../types/index.js";

interface InternalState<TValues extends Record<string, unknown>> {
  values: TValues;
  defaultValues: TValues;
  errors: Record<FieldPath, string>;
  touched: Record<FieldPath, boolean>;
  dirty: Record<FieldPath, boolean>;
  visited: Record<FieldPath, boolean>;
  isSubmitting: boolean;
  isValidating: boolean;
  submitCount: number;
  currentStep: number;
  isAutosaving: boolean;
  lastAutosaveAt: number | null;
  destroyed: boolean;
}

class FormInstanceImpl<TValues extends Record<string, unknown>> implements FormInstance<TValues> {
  public readonly id: string;
  private readonly config: ResolvedFormConfig<TValues>;
  private readonly events = new FormEventBus();
  private readonly plugins = new PluginRegistry<TValues>();
  private readonly fieldValidators = new Map<FieldPath, readonly Validator<TValues>[]>();
  private readonly fieldOptions = new Map<FieldPath, FieldOptions<TValues>>();
  private readonly subscribers = new Set<() => void>();
  private readonly useCache = new Map<FormSelector<TValues, unknown>, unknown>();
  private state: InternalState<TValues>;
  private autosaveTimer: (() => void) | undefined;

  public constructor(config: FormConfig<TValues>) {
    this.id = createId("form");
    this.config = normalizeFormConfig(config);

    const draftKey = this.config.workflow?.draft?.storageKey ?? `${this.id}:draft`;
    const restored = this.config.workflow?.draft?.enabled === true ? loadDraft(draftKey) : null;

    const initialValues = restored
      ? { ...this.config.initialValues, ...restored }
      : cloneValue(this.config.initialValues);

    if (restored) {
      this.config.workflow?.draft?.onRestore?.(restored);
    }

    this.state = {
      values: initialValues,
      defaultValues: cloneValue(this.config.initialValues),
      errors: {},
      touched: {},
      dirty: {},
      visited: {},
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
      currentStep: this.config.workflow?.wizard?.initialStep ?? 0,
      isAutosaving: false,
      lastAutosaveAt: null,
      destroyed: false,
    };

    this.setupAutosave();
  }

  public field(path: FieldPath, options: FieldOptions<TValues> = {}): FieldHandle<TValues> {
    this.fieldOptions.set(path, options);
    if (options.validators) {
      this.fieldValidators.set(path, options.validators);
    }

    if (getIn(this.state.values, path) === undefined && options.defaultValue !== undefined) {
      this.patchValues(path, options.defaultValue);
    }

    const readValue = (): unknown => this.values(path);
    const readError = (): string | undefined => this.errors(path) as string | undefined;
    const readTouched = (): boolean => Boolean(this.state.touched[path]);
    const readDirty = (): boolean => Boolean(this.state.dirty[path]);
    const readVisited = (): boolean => Boolean(this.state.visited[path]);
    const writeValue = (value: unknown): void => {
      this.setValue(path, value);
    };
    const writeTouched = (touched = true): void => {
      this.patchMeta(path, { touched });
    };
    const writeVisited = (visited = true): void => {
      this.patchMeta(path, { visited });
    };
    const validateField = async (): Promise<boolean> => this.validate({ paths: [path] });
    const emitBlur = (): void => {
      this.events.emit("blur");
    };
    const emitFocus = (): void => {
      this.events.emit("focus");
    };
    const validateOnBlur = (): void => {
      void this.validate({ paths: [path], mode: "onBlur" });
    };

    return {
      path,
      get value() {
        return readValue();
      },
      get error() {
        return readError();
      },
      get touched() {
        return readTouched();
      },
      get dirty() {
        return readDirty();
      },
      get visited() {
        return readVisited();
      },
      setValue(value: unknown) {
        writeValue(value);
      },
      setTouched(touched = true) {
        writeTouched(touched);
      },
      setVisited(visited = true) {
        writeVisited(visited);
      },
      async validate() {
        return validateField();
      },
      bind(): FieldBinding {
        return {
          name: path,
          get value() {
            return readValue();
          },
          onChange: (value: unknown) => {
            writeValue(value);
          },
          onBlur: () => {
            writeTouched(true);
            writeVisited(true);
            emitBlur();
            validateOnBlur();
          },
          onFocus: () => {
            writeVisited(true);
            emitFocus();
          },
        };
      },
    };
  }

  public async submit(options?: SubmitOptions): Promise<boolean> {
    const valid = await this.validate({ mode: "onSubmit" });
    if (!valid) {
      return false;
    }

    if (options?.preventDoubleSubmit !== false && this.state.isSubmitting) {
      return false;
    }

    this.patchState({ isSubmitting: true });
    this.events.emit("submit");

    try {
      const result = await executeSubmit({
        values: this.state.values,
        submitCount: this.state.submitCount,
        ...(this.config.onSubmit ? { onSubmit: this.config.onSubmit } : {}),
        ...(this.config.onSubmitError ? { onSubmitError: this.config.onSubmitError } : {}),
        ...(options ? { options } : {}),
      });

      this.patchState({ submitCount: result.submitCount, isSubmitting: false });
      return result.ok;
    } catch {
      this.patchState({ isSubmitting: false });
      return false;
    }
  }

  public reset(options: ResetOptions<TValues> = {}): void {
    const nextValues = options.values
      ? { ...this.state.defaultValues, ...options.values }
      : cloneValue(this.state.defaultValues);

    this.state = {
      ...this.state,
      values: nextValues,
      errors: {},
      touched: {},
      dirty: options.keepDirty ? this.state.dirty : {},
      visited: {},
      isSubmitting: false,
      isValidating: false,
      submitCount: 0,
      currentStep: this.config.workflow?.wizard?.initialStep ?? 0,
    };

    this.notify();
    this.events.emit("reset");
  }

  public async validate(options: ValidateOptions = {}): Promise<boolean> {
    const paths =
      options.paths ??
      (this.config.workflow?.wizard
        ? getStepFields(this.config.workflow.wizard.steps[this.state.currentStep])
        : listAllPaths(this.state.values));

    const targetPaths = paths.length > 0 ? paths : listAllPaths(this.state.values);

    this.patchState({ isValidating: true });
    this.events.emit("validate");

    const errors = await validatePaths({
      values: this.state.values,
      paths: targetPaths,
      fieldValidators: this.fieldValidators,
      configValidators: this.config.validators ?? {},
    });

    this.patchState({ errors, isValidating: false });
    return Object.keys(errors).length === 0;
  }

  public values(): TValues;
  public values(path: FieldPath): unknown;
  public values(path?: FieldPath): unknown {
    if (path === undefined) {
      return cloneValue(this.state.values);
    }

    return getIn(this.state.values, path);
  }

  public errors(path?: FieldPath): string | undefined | Readonly<Record<FieldPath, string>> {
    if (path === undefined) {
      return { ...this.state.errors };
    }

    return this.state.errors[path];
  }

  public setValue(path: FieldPath, value: unknown): void {
    const options = this.fieldOptions.get(path);
    const parsed = applyParser(value, options?.parse);
    const formatted = applyFormatter(parsed, options?.format);
    const previous = getIn(this.state.values, path);
    if (previous === formatted) {
      return;
    }

    this.patchValues(path, formatted);
    this.patchMeta(path, { dirty: getIn(this.state.defaultValues, path) !== formatted });
    this.events.emit("change");

    const mode = options?.validateOn ?? this.config.validateOn;
    if (mode === "onChange") {
      void this.validate({ paths: [path], mode });
    }

    this.scheduleAutosave();
  }

  public setError(path: FieldPath, message: string): void {
    this.patchState({ errors: { ...this.state.errors, [path]: message } });
  }

  public clearErrors(path?: FieldPath): void {
    if (path === undefined) {
      this.patchState({ errors: {} });
      return;
    }

    const { [path]: _removed, ...nextErrors } = this.state.errors;
    this.patchState({ errors: nextErrors });
  }

  public getFieldState(path: FieldPath): FieldState {
    return {
      touched: Boolean(this.state.touched[path]),
      dirty: Boolean(this.state.dirty[path]),
      visited: Boolean(this.state.visited[path]),
    };
  }

  public getFormState(): FormState<TValues> {
    return {
      values: cloneValue(this.state.values),
      errors: { ...this.state.errors },
      touched: { ...this.state.touched },
      dirty: { ...this.state.dirty },
      visited: { ...this.state.visited },
      isSubmitting: this.state.isSubmitting,
      isValidating: this.state.isValidating,
      isValid: Object.keys(this.state.errors).length === 0,
      submitCount: this.state.submitCount,
      workflow: this.getWorkflowState(),
    };
  }

  public use<TSelected>(selector: FormSelector<TValues, TSelected>): TSelected {
    const snapshot = this.getFormState();
    const selected = selector(snapshot);
    this.useCache.set(selector, selected);
    return selected;
  }

  public subscribe(listener: () => void): () => void {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  }

  public on(event: FormEvent, listener: () => void): () => void {
    return this.events.on(event, listener);
  }

  public destroy(): void {
    if (this.state.destroyed) {
      return;
    }

    this.state.destroyed = true;
    this.plugins.destroy();
    this.events.clear();
    this.subscribers.clear();
    this.useCache.clear();
  }

  public readonly workflow = {
    next: async (): Promise<boolean> => {
      const wizard = this.config.workflow?.wizard;
      if (!wizard) {
        return false;
      }

      const valid = await this.validate({
        paths: getStepFields(wizard.steps[this.state.currentStep]),
        mode: "onSubmit",
      });

      if (!valid) {
        return false;
      }

      const nextStep = this.state.currentStep + 1;
      if (nextStep >= wizard.steps.length) {
        return false;
      }

      this.patchState({ currentStep: nextStep });
      return true;
    },
    prev: (): void => {
      if (this.state.currentStep > 0) {
        this.patchState({ currentStep: this.state.currentStep - 1 });
      }
    },
    goTo: async (step: number): Promise<boolean> => {
      assertStepIndex(step, this.config.workflow?.wizard);
      const valid = await this.validate({ mode: "onSubmit" });
      if (!valid) {
        return false;
      }

      this.patchState({ currentStep: step });
      return true;
    },
  };

  public registerPlugin(plugin: FormPlugin<TValues>): void {
    this.plugins.register(this, plugin);
  }

  private getWorkflowState(): WorkflowState {
    const wizard = resolveWizardState(this.state.currentStep, this.config.workflow?.wizard);
    return {
      currentStep: wizard.currentStep,
      totalSteps: wizard.totalSteps,
      canGoNext: wizard.canGoNext,
      canGoPrev: wizard.canGoPrev,
      progress: wizard.progress,
      isAutosaving: this.state.isAutosaving,
      lastAutosaveAt: this.state.lastAutosaveAt,
    };
  }

  private setupAutosave(): void {
    const autosave = this.config.workflow?.autosave;
    if (!autosave?.enabled) {
      return;
    }

    this.autosaveTimer = debounce(() => {
      void this.runAutosave();
    }, autosave.debounceMs ?? 400);
  }

  private scheduleAutosave(): void {
    this.autosaveTimer?.();
  }

  private async runAutosave(): Promise<void> {
    const autosave = this.config.workflow?.autosave;
    if (!autosave?.enabled) {
      return;
    }

    this.patchState({ isAutosaving: true });
    this.events.emit("autosave");

    try {
      await autosave.onSave(cloneValue(this.state.values));
      this.patchState({ isAutosaving: false, lastAutosaveAt: Date.now() });

      const draft = this.config.workflow?.draft;
      if (draft?.enabled) {
        saveDraft(draft.storageKey ?? `${this.id}:draft`, this.state.values);
        this.events.emit("draft");
      }
    } catch {
      this.patchState({ isAutosaving: false });
    }
  }

  private patchValues(path: FieldPath, value: unknown): void {
    this.state = {
      ...this.state,
      values: setIn(this.state.values, path, value) as TValues,
    };
    this.notify();
  }

  private patchMeta(
    path: FieldPath,
    patch: { touched?: boolean; dirty?: boolean; visited?: boolean },
  ): void {
    this.state = {
      ...this.state,
      touched:
        patch.touched === undefined
          ? this.state.touched
          : { ...this.state.touched, [path]: patch.touched },
      dirty:
        patch.dirty === undefined ? this.state.dirty : { ...this.state.dirty, [path]: patch.dirty },
      visited:
        patch.visited === undefined
          ? this.state.visited
          : { ...this.state.visited, [path]: patch.visited },
    };
    this.notify();
  }

  private patchState(patch: Partial<InternalState<TValues>>): void {
    this.state = { ...this.state, ...patch };
    this.notify();
  }

  private notify(): void {
    if (this.state.destroyed) {
      return;
    }

    for (const listener of this.subscribers) {
      listener();
    }
  }
}

/**
 * Create a headless form workflow instance.
 */
export function createForm<TValues extends Record<string, unknown>>(
  config: FormConfig<TValues>,
): FormInstance<TValues> {
  return new FormInstanceImpl(config);
}

export { clearDraft };
