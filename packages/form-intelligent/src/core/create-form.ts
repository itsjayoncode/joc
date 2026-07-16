import { FormEventBus } from "./events.js";
import { FormModuleHost } from "./form-module-host.js";
import {
  ensureAnalyticsService,
  ensureOfflineService,
  isNavigatorOffline,
  loadWorkflowEngine,
  readOfflineQueueState,
} from "./lazy-engines.js";
import { normalizeIncomingFormConfig } from "./normalize-form-config.js";
import { normalizeFormConfig } from "./options.js";
import {
  resolveCreateFormConfig,
  type ResolvedCreateFormConfig,
} from "./resolve-create-form-config.js";
import { isSchemaAdapter } from "../adapters/is-schema-adapter.js";
import { discoverFieldNames } from "../dom/discover-fields.js";
import { attachDomEnhancer } from "../dom/enhance-form.js";
import { readNamedFieldValue } from "../dom/field-value.js";
import { WhenRuleBuilder } from "../engines/workflow/when.js";
import { formatFieldValue as runFieldFormatPipeline } from "../format/pipeline.js";
import { registerConfiguredModules } from "../modules/register-configured.js";
import { resolveHookResult } from "../plugins/hooks.js";
import { PluginRegistry } from "../plugins/registry.js";
import { compileSchema } from "../schema/compiler.js";
import { FormStateStore } from "../state/store.js";
import { SubmissionOrchestrator } from "../submission/submit.js";
import { cloneValue, createId, getIn, setIn } from "../utils/index.js";
import { AsyncValidationManager } from "../validation/async-validator.js";
import {
  listAllPaths,
  mergePathValidationErrors,
  runValidationPipeline,
} from "../validation/pipeline.js";
import {
  AutosaveScheduler,
  buildWorkflowProgress,
  DraftManager,
  getStepFields,
  UndoRedoController,
  WizardNavigator,
} from "../workflow/index.js";

import type { ResolvedFormConfig } from "./options.js";
import type { CalculationDefinition } from "../engines/workflow/calculations.js";
import type {
  FieldUiMap,
  FormRuleDefinition,
  FormUiState,
  FieldOption,
} from "../engines/workflow/types.js";
import type { FormCoreState } from "../state/store.js";
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
  FormRef,
  FormSelector,
  FormState,
  ResetOptions,
  SetValueOptions,
  SubmitOptions,
  ValidateOptions,
  Validator,
  WorkflowState,
  CalculateOptions,
  SchemaAdapter,
} from "../types/index.js";

type ArrayFieldMutation =
  | { readonly type: "remove"; readonly index: number }
  | { readonly type: "insert"; readonly index: number };

const ARRAY_INDEX_PATTERN = /^(\d+)(?:\.(.*))?$/;

class FormInstanceImpl<TValues extends Record<string, unknown>> implements FormInstance<TValues> {
  public readonly id: string;
  private readonly config: ResolvedFormConfig<TValues>;
  private readonly events = new FormEventBus();
  private readonly fieldValidators = new Map<FieldPath, readonly Validator<TValues>[]>();
  private readonly fieldOptions = new Map<FieldPath, FieldOptions<TValues>>();
  private readonly store: FormStateStore<TValues>;
  private readonly moduleHost: FormModuleHost<TValues>;
  private readonly undoRedo = new UndoRedoController<TValues>();
  private offlineService: Awaited<ReturnType<typeof ensureOfflineService<TValues>>> | null = null;
  private analyticsService: Awaited<ReturnType<typeof ensureAnalyticsService>> | null = null;
  private readonly offlineStorageKey: string;
  private readonly draftManager: DraftManager<TValues>;
  private readonly autosave = new AutosaveScheduler<TValues>();
  private readonly wizardNavigator: WizardNavigator;
  private fieldUi: FieldUiMap = {};
  private formUi: FormUiState = { submitDisabled: false };
  private fieldOptionsState: Record<FieldPath, readonly FieldOption[]> = {};
  private readonly calculations: CalculationDefinition<TValues>[] = [];
  private readonly asyncValidation = new AsyncValidationManager(300);
  private readonly submission = new SubmissionOrchestrator<TValues>();
  private readonly pluginRegistry = new PluginRegistry<TValues>();
  private readonly runtimeRules: FormRuleDefinition<TValues>[] = [];
  private readonly baseRules: readonly FormRuleDefinition<TValues>[];
  private workflowEnginePromise: ReturnType<typeof loadWorkflowEngine> | null = null;
  private workflowEngine: Awaited<ReturnType<typeof loadWorkflowEngine>> | null = null;
  private domDetach: (() => void) | undefined;
  private submitInFlight = false;
  private readonly schemaAdapter: SchemaAdapter | undefined;
  private readonly schemaPaths: readonly FieldPath[];
  private cachedSnapshot: FormState<TValues>;

  private get core(): FormCoreState<TValues> {
    return this.store.getSnapshot();
  }

  public readonly ref: FormRef = (element: HTMLFormElement | null): void => {
    if (element) {
      this.attachElement(element);
      return;
    }

    this.detachElement();
  };

  public constructor(
    config: ResolvedCreateFormConfig<TValues>["formConfig"],
    options: { domTarget: HTMLFormElement | null; fieldPaths: readonly FieldPath[] } = {
      domTarget: null,
      fieldPaths: [],
    },
  ) {
    this.id = createId("form");
    this.config = normalizeFormConfig(config);
    this.offlineStorageKey = this.config.workflow?.offlineQueue?.storageKey ?? `${this.id}:offline`;
    this.moduleHost = new FormModuleHost(this, this.config, this.events, this.pluginRegistry);
    this.baseRules = (config.rules ?? []).map((rule) =>
      rule instanceof WhenRuleBuilder ? (rule as WhenRuleBuilder<TValues>).build() : rule,
    );
    this.schemaAdapter = isSchemaAdapter(config.schema) ? config.schema : undefined;
    this.schemaPaths = this.schemaAdapter
      ? []
      : config.schema && !isSchemaAdapter(config.schema)
        ? Object.keys(config.schema)
        : options.fieldPaths;

    const draftKey = this.config.workflow?.draft?.storageKey ?? `${this.id}:draft`;
    const draftConfig = this.config.workflow?.draft;
    this.draftManager = new DraftManager(draftConfig, draftKey);
    const { values: initialValues, restored: draftRestored } =
      this.draftManager.resolveInitialValues(cloneValue(this.config.initialValues));

    this.store = new FormStateStore({
      values: initialValues,
      defaultValues: cloneValue(this.config.initialValues),
      currentStep: this.config.workflow?.wizard?.initialStep ?? 0,
    });

    this.wizardNavigator = new WizardNavigator({
      getWizard: () => this.config.workflow?.wizard,
      getCurrentStep: () => this.core.currentStep,
      setStep: (step) => {
        this.patchState({ currentStep: step });
      },
      validate: (options) => this.validate(options),
    });

    this.setupAutosave();
    this.recomputeFieldUi();
    this.applyCompiledFieldFormats(config);
    registerConfiguredModules(
      this.moduleHost,
      this.config,
      {
        history: this.undoRedo.history,
        ...(this.config.workflow?.offlineQueue?.enabled
          ? { offline: this.ensureOfflineService() }
          : {}),
        ...(this.config.workflow?.analytics?.enabled
          ? { analytics: this.ensureAnalyticsService() }
          : {}),
      },
      {
        formId: this.id,
        onReconnect: () => {
          void this.flushOfflineQueue();
        },
      },
    );
    this.moduleHost.start();
    if (draftRestored) {
      void this.pluginRegistry.hookBus.runOnDraftRestore({
        values: cloneValue(initialValues),
      });
    }
    this.asyncValidation.setOnValidatingChange(() => {
      this.notify();
    });
    this.cachedSnapshot = this.buildFormState();

    if (options.domTarget) {
      this.attachElement(options.domTarget, options.fieldPaths);
    }
  }

  private resolveFieldPaths(formElement: HTMLFormElement): FieldPath[] {
    const discovered = discoverFieldNames(formElement);
    return [...new Set([...this.schemaPaths, ...discovered])];
  }

  private syncValuesFromDom(formElement: HTMLFormElement, fieldPaths: readonly FieldPath[]): void {
    for (const path of fieldPaths) {
      const domValue = readNamedFieldValue(formElement, path);
      const formValue = getIn(this.core.values, path);

      const domIsEmpty = domValue === "" || domValue === undefined;
      const formHasValue = formValue !== "" && formValue !== undefined && formValue !== null;
      if (domIsEmpty && formHasValue) {
        continue;
      }

      if (formValue !== domValue) {
        this.patchValues(path, domValue);
      }
    }
  }

  private attachElement(
    formElement: HTMLFormElement,
    fieldPaths: readonly FieldPath[] = this.resolveFieldPaths(formElement),
  ): void {
    if (this.store.isDestroyed()) {
      return;
    }

    this.syncValuesFromDom(formElement, fieldPaths);
    this.detachElement();
    this.domDetach = attachDomEnhancer(this, formElement, fieldPaths, {
      validateOn: this.config.validateOn,
    });
  }

  private detachElement(): void {
    this.domDetach?.();
    this.domDetach = undefined;
  }

  public field(path: FieldPath, options: FieldOptions<TValues> = {}): FieldHandle<TValues> {
    this.fieldOptions.set(path, options);
    if (options.validators) {
      this.fieldValidators.set(path, options.validators);
    }

    if (getIn(this.core.values, path) === undefined && options.defaultValue !== undefined) {
      this.patchValues(path, options.defaultValue);
    }

    const readValue = (): unknown => this.values(path);
    const readError = (): string | undefined => this.errors(path) as string | undefined;
    const readTouched = (): boolean => Boolean(this.core.touched[path]);
    const readDirty = (): boolean => Boolean(this.core.dirty[path]);
    const readVisited = (): boolean => Boolean(this.core.visited[path]);
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

  public pushField(arrayPath: FieldPath, item: unknown = {}): FieldPath {
    const current = getIn(this.core.values, arrayPath);
    const array = Array.isArray(current) ? [...current] : [];
    const index = array.length;
    array.push(item);
    this.setArrayValue(arrayPath, array);
    return arrayPath ? `${arrayPath}.${index}` : String(index);
  }

  public removeField(arrayPath: FieldPath, index: number): void {
    const current = getIn(this.core.values, arrayPath);
    if (!Array.isArray(current) || index < 0 || index >= current.length) {
      return;
    }

    const nextArray = current.filter((_, currentIndex) => currentIndex !== index);
    this.setArrayValue(arrayPath, nextArray, { type: "remove", index });
  }

  public insertField(arrayPath: FieldPath, index: number, item: unknown = {}): FieldPath {
    const current = getIn(this.core.values, arrayPath);
    const array = Array.isArray(current) ? [...current] : [];
    const insertAt = Math.max(0, Math.min(index, array.length));
    const nextArray = [...array];
    nextArray.splice(insertAt, 0, item);
    this.setArrayValue(arrayPath, nextArray, { type: "insert", index: insertAt });
    return arrayPath ? `${arrayPath}.${insertAt}` : String(insertAt);
  }

  public async submit(options?: SubmitOptions): Promise<boolean> {
    const preventDoubleSubmit = options?.preventDoubleSubmit !== false;

    const valid = await this.validate({ mode: "onSubmit" });
    if (!valid) {
      for (const path of Object.keys(this.core.errors)) {
        this.patchMeta(path, { touched: true });
      }
      return false;
    }

    if (preventDoubleSubmit && (this.submitInFlight || this.submission.isActive)) {
      return false;
    }

    if (preventDoubleSubmit) {
      this.submitInFlight = true;
    }

    const releaseSubmitInFlight = (): void => {
      if (preventDoubleSubmit) {
        this.submitInFlight = false;
      }
    };

    const submitContext = {
      values: this.core.values,
      ...(options ? { options } : {}),
      success: false,
    };

    if (this.config.workflow?.offlineQueue?.enabled && isNavigatorOffline()) {
      const offline = await this.ensureOfflineService();
      offline.ensure().enqueue(cloneValue(this.core.values));
      this.notify();
      submitContext.success = true;
      await this.pluginRegistry.hookBus.runAfterSubmit(submitContext);
      releaseSubmitInFlight();
      return true;
    }

    if (!(await resolveHookResult(this.pluginRegistry.hookBus.runBeforeSubmit(submitContext)))) {
      releaseSubmitInFlight();
      return false;
    }

    this.patchState({ isSubmitting: true });

    const meta = options?.includeDiff
      ? {
          changedFields: this.changedFields(),
          diff: await this.diffFromDefaults(),
        }
      : undefined;

    this.events.emit("submit");

    try {
      const result = await this.submission.execute({
        values: this.core.values,
        submitCount: this.core.submitCount,
        ...(meta ? { meta } : {}),
        ...(this.config.onSubmit ? { onSubmit: this.config.onSubmit } : {}),
        ...(this.config.onSubmitError ? { onSubmitError: this.config.onSubmitError } : {}),
        ...(options ? { options } : {}),
      });

      if (result.cancelled) {
        this.patchState({ isSubmitting: false });
        releaseSubmitInFlight();
        return false;
      }

      if (result.fieldErrors) {
        for (const [path, message] of Object.entries(result.fieldErrors)) {
          this.setError(path, message);
        }
      }

      if (result.formError) {
        this.setError("_form", result.formError);
      }

      if (!result.ok) {
        this.patchState({ isSubmitting: false });
        releaseSubmitInFlight();
        return false;
      }

      if (this.config.workflow?.analytics?.enabled) {
        (await this.ensureAnalyticsService()).recordSubmitSuccess();
      }
      this.patchState({ submitCount: result.submitCount, isSubmitting: false });
      this.store.markSubmitted();
      submitContext.success = true;
      return true;
    } catch {
      this.patchState({ isSubmitting: false });
      releaseSubmitInFlight();
      return false;
    } finally {
      releaseSubmitInFlight();
      await this.pluginRegistry.hookBus.runAfterSubmit(submitContext);
    }
  }

  public cancelSubmit(): void {
    this.submission.cancel();
    this.patchState({ isSubmitting: false });
  }

  public reset(options: ResetOptions<TValues> = {}): void {
    this.store.reset(options);
    this.store.patchCore({
      currentStep: this.config.workflow?.wizard?.initialStep ?? 0,
    });

    this.notify();
    this.events.emit("reset");
  }

  public validate(options: ValidateOptions = {}): Promise<boolean> {
    const paths =
      options.paths ??
      (this.config.workflow?.wizard
        ? getStepFields(this.config.workflow.wizard.steps[this.core.currentStep])
        : listAllPaths(this.core.values));

    const targetPaths = paths.length > 0 ? paths : listAllPaths(this.core.values);
    const mode = options.mode ?? this.config.validateOn;
    const hookContext = {
      paths: targetPaths,
      mode,
      values: this.core.values,
      valid: false,
    };

    const before = this.pluginRegistry.hookBus.runBeforeValidate(hookContext);
    if (before === false) {
      return Promise.resolve(false);
    }

    if (before instanceof Promise) {
      return before.then((allowed) => {
        if (!allowed) {
          return false;
        }

        return this.finishValidate(targetPaths, mode, hookContext);
      });
    }

    return this.finishValidate(targetPaths, mode, hookContext);
  }

  private finishValidate(
    targetPaths: readonly FieldPath[],
    mode: import("../types/index.js").ValidationMode,
    hookContext: {
      paths: readonly FieldPath[];
      mode: import("../types/index.js").ValidationMode;
      values: TValues;
      valid: boolean;
    },
  ): Promise<boolean> {
    return this.runValidatePaths(targetPaths, mode).then(async (ok) => {
      await this.pluginRegistry.hookBus.runAfterValidate({ ...hookContext, valid: ok });
      return ok;
    });
  }

  private async runValidatePaths(
    targetPaths: readonly FieldPath[],
    mode: import("../types/index.js").ValidationMode,
  ): Promise<boolean> {
    const run = async (
      validatePathsInput: readonly FieldPath[],
      signal?: AbortSignal,
    ): Promise<boolean> => {
      return this.asyncValidation.track(validatePathsInput, async () => {
        this.patchState({ isValidating: true });
        this.events.emit("validate");

        const fieldErrors = await runValidationPipeline({
          values: this.core.values,
          paths: validatePathsInput,
          fieldValidators: this.fieldValidators,
          configValidators: this.config.validators ?? {},
          ...(this.config.crossFieldValidators
            ? { crossFieldRules: this.config.crossFieldValidators }
            : {}),
          ...(this.config.formValidators ? { formValidators: this.config.formValidators } : {}),
          ...(signal ? { signal } : {}),
        });

        const errors = { ...fieldErrors };

        if (this.schemaAdapter) {
          const adapterErrors = await this.schemaAdapter.validate(this.core.values);
          const includeAllAdapterErrors = validatePathsInput.length !== 1;

          for (const [path, message] of Object.entries(adapterErrors)) {
            if (includeAllAdapterErrors || validatePathsInput.includes(path) || path === "_form") {
              errors[path] = message;
            }
          }
        }

        if (signal?.aborted) {
          return false;
        }

        const mergedErrors = mergePathValidationErrors(
          this.core.errors,
          errors,
          validatePathsInput,
        );

        this.patchState({ errors: mergedErrors, isValidating: false });
        this.events.emit("validated");
        return Object.keys(mergedErrors).length === 0;
      });
    };

    if (targetPaths.length === 1) {
      const path = targetPaths[0];
      if (!path) {
        return run(targetPaths);
      }

      if (mode === "onChange") {
        return new Promise((resolve) => {
          this.asyncValidation.schedule(path, async (scheduledPaths, signal) => {
            if (signal.aborted) {
              return;
            }
            const ok = await run(scheduledPaths, signal);
            if (!signal.aborted) {
              resolve(ok);
            }
          });
        });
      }

      return run(targetPaths);
    }

    return run(targetPaths);
  }

  public values(): TValues;
  public values(path: FieldPath): unknown;
  public values(path?: FieldPath): unknown {
    if (path === undefined) {
      return cloneValue(this.core.values);
    }

    return getIn(this.core.values, path);
  }

  public get(path: FieldPath): unknown {
    return this.values(path);
  }

  public errors(path?: FieldPath): string | undefined | Readonly<Record<FieldPath, string>> {
    if (path === undefined) {
      return { ...this.core.errors };
    }

    return this.core.errors[path];
  }

  public setValue(path: FieldPath, value: unknown, options?: SetValueOptions): void {
    this.patchValues(path, value, options);
  }

  public setError(path: FieldPath, message: string): void {
    this.patchState({ errors: { ...this.core.errors, [path]: message } });
  }

  public clearErrors(path?: FieldPath): void {
    if (path === undefined) {
      this.patchState({ errors: {} });
      return;
    }

    const { [path]: _removed, ...nextErrors } = this.core.errors;
    this.patchState({ errors: nextErrors });
  }

  public getFieldState(path: FieldPath): FieldState {
    return this.store.getFieldState(path);
  }

  public getFieldMeta(path: FieldPath): {
    isValidating: boolean;
    label?: string;
    description?: string;
    hidden?: boolean;
  } {
    const options = this.fieldOptions.get(path);
    return {
      isValidating: this.asyncValidation.isFieldValidating(path),
      ...(options?.label === undefined ? {} : { label: options.label }),
      ...(options?.description === undefined ? {} : { description: options.description }),
      ...(options?.hidden === undefined ? {} : { hidden: options.hidden }),
    };
  }

  private buildFormState(): FormState<TValues> {
    const fieldMeta = Object.fromEntries(
      listAllPaths(this.core.values).map((path) => [
        path,
        { isValidating: this.asyncValidation.isFieldValidating(path) },
      ]),
    );

    return {
      values: cloneValue(this.core.values),
      errors: { ...this.core.errors },
      touched: { ...this.core.touched },
      dirty: { ...this.core.dirty },
      visited: { ...this.core.visited },
      changed: { ...this.core.changed },
      isSubmitting: this.core.isSubmitting,
      isValidating: this.core.isValidating,
      isValid: Object.keys(this.core.errors).length === 0,
      isDirty: this.store.isDirty(),
      isChanged: this.store.isChanged(),
      submitCount: this.core.submitCount,
      workflow: this.getWorkflowState(),
      fieldUi: this.fieldUi,
      formUi: this.formUi,
      fieldMeta,
      fieldOptions: { ...this.fieldOptionsState },
      submissionQueue: this.config.workflow?.offlineQueue?.enabled
        ? (this.offlineService?.getState() ?? readOfflineQueueState(this.offlineStorageKey))
        : { pending: 0, flushing: false },
    };
  }

  public getFormState(): FormState<TValues> {
    return this.buildFormState();
  }

  public get state(): FormState<TValues> {
    return this.cachedSnapshot;
  }

  public getSnapshot(): FormState<TValues> {
    return this.cachedSnapshot;
  }

  public getValues(): TValues {
    return this.values();
  }

  public getErrors(): Readonly<Record<FieldPath, string>> {
    return this.errors() as Readonly<Record<FieldPath, string>>;
  }

  public isValid(): boolean {
    return Object.keys(this.core.errors).length === 0;
  }

  public isSubmitting(): boolean {
    return this.core.isSubmitting;
  }

  public isDirty(): boolean {
    return this.store.isDirty();
  }

  public changedFields(): readonly FieldPath[] {
    return this.store.dirtyFields();
  }

  public changedSinceSubmitFields(): readonly FieldPath[] {
    return this.store.changedSinceSubmitFields();
  }

  public async diffFromDefaults(options?: import("../types/index.js").FormDiffOptions) {
    const { computeFormDiff } = await import("../integrations/object-diff.js");
    return computeFormDiff(
      cloneValue(this.core.defaultValues),
      cloneValue(this.core.values),
      options,
    );
  }

  public async diffFrom(
    baseline: Record<string, unknown>,
    options?: import("../types/index.js").FormDiffOptions,
  ) {
    const { computeFormDiff } = await import("../integrations/object-diff.js");
    return computeFormDiff(baseline, cloneValue(this.core.values), options);
  }

  public when(field: FieldPath): WhenRuleBuilder<TValues> {
    return new WhenRuleBuilder<TValues>(field)._attachCommitHook((rule) => {
      this.runtimeRules.push(rule);
      this.recomputeFieldUi();
      this.notify();
    });
  }

  public calculate(
    path: FieldPath,
    options: CalculateOptions<TValues> | ((context: { values: TValues }) => unknown),
  ): void {
    const resolved = typeof options === "function" ? { compute: options } : options;

    this.calculations.push({
      path,
      compute: resolved.compute,
      ...(resolved.deps === undefined ? {} : { deps: resolved.deps }),
      ...(resolved.markDirty === undefined ? {} : { markDirty: resolved.markDirty }),
    });
    const hadWorkflowEngine = this.workflowEngine !== null;
    this.applyCalculations(path);
    if (hadWorkflowEngine) {
      this.notify();
    }
  }

  public saveDraft(): void {
    this.draftManager.save(this.core.values);
    this.events.emit("draft");
  }

  public undo(): boolean {
    const previous = this.undoRedo.undo(this.core.values);
    if (!previous) {
      return false;
    }

    this.store.replaceValues(cloneValue(previous));
    this.recomputeFieldUi();
    this.notify();
    this.events.emit("change");
    return true;
  }

  public redo(): boolean {
    const next = this.undoRedo.redo(this.core.values);
    if (!next) {
      return false;
    }

    this.store.replaceValues(cloneValue(next));
    this.recomputeFieldUi();
    this.notify();
    this.events.emit("change");
    return true;
  }

  public getAnalytics() {
    if (!this.config.workflow?.analytics?.enabled || !this.analyticsService) {
      return {
        startedAt: 0,
        completedAt: null,
        errorCount: 0,
        errorsByField: {},
        abandonedAt: null,
        currentStep: 0,
        fieldViews: {},
        dropOffField: null,
      };
    }

    return this.analyticsService.getSnapshot(this.core.currentStep);
  }

  public async flushOfflineQueue(): Promise<{ flushed: number; failed: number }> {
    if (!this.config.workflow?.offlineQueue?.enabled || !this.config.onSubmit) {
      return { flushed: 0, failed: 0 };
    }

    const offline = await this.ensureOfflineService();
    const result = await offline.ensure().flush(async (values) => {
      try {
        await this.config.onSubmit?.(values);
        return true;
      } catch (error) {
        this.config.onSubmitError?.(error);
        return false;
      }
    });

    this.notify();
    return result;
  }

  public use(plugin: FormPlugin<TValues>): void;
  public use<TSelected>(selector: FormSelector<TValues, TSelected>): TSelected;
  public use<TSelected>(
    pluginOrSelector: FormPlugin<TValues> | FormSelector<TValues, TSelected>,
  ): TSelected | void {
    if (
      typeof pluginOrSelector === "object" &&
      pluginOrSelector !== null &&
      "name" in pluginOrSelector &&
      "setup" in pluginOrSelector
    ) {
      this.registerPlugin(pluginOrSelector);
      return;
    }

    const selector = pluginOrSelector;
    const snapshot = this.cachedSnapshot;
    const selected = selector(snapshot);
    this.store.cacheSelector(selector, selected);
    return selected;
  }

  public subscribe(listener: () => void): () => void {
    return this.store.subscribe(listener);
  }

  public on(event: FormEvent, listener: () => void): () => void {
    return this.events.on(event, listener);
  }

  public destroy(): void {
    if (this.store.isDestroyed()) {
      return;
    }

    this.detachElement();
    this.submission.cancel();
    this.autosave.destroy();
    this.undoRedo.destroy();
    this.asyncValidation.destroy();
    this.moduleHost.destroy();
    this.events.clear();
    this.store.destroy();
  }

  public readonly workflow = {
    next: () => this.wizardNavigator.next(),
    prev: () => {
      this.wizardNavigator.prev();
    },
    goTo: (step: number) => this.wizardNavigator.goTo(step),
  };

  public registerPlugin(plugin: FormPlugin<TValues>): void {
    this.moduleHost.registerPlugin(plugin);
  }

  private getWorkflowState(): WorkflowState {
    return buildWorkflowProgress({
      currentStep: this.core.currentStep,
      wizard: this.config.workflow?.wizard,
      isAutosaving: this.core.isAutosaving,
      lastAutosaveAt: this.core.lastAutosaveAt,
    });
  }

  private async ensureOfflineService(): Promise<
    Awaited<ReturnType<typeof ensureOfflineService<TValues>>>
  > {
    if (!this.offlineService) {
      this.offlineService = await ensureOfflineService<TValues>(this.offlineStorageKey);
    }

    return this.offlineService;
  }

  private async ensureAnalyticsService(): Promise<
    Awaited<ReturnType<typeof ensureAnalyticsService>>
  > {
    if (!this.analyticsService) {
      this.analyticsService = await ensureAnalyticsService();
    }

    return this.analyticsService;
  }

  private setupAutosave(): void {
    this.autosave.configure(this.config.workflow?.autosave, () => cloneValue(this.core.values), {
      onStart: () => {
        this.patchState({ isAutosaving: true });
        this.events.emit("autosave");
      },
      onSuccess: async (savedAt) => {
        this.patchState({ isAutosaving: false, lastAutosaveAt: savedAt });
        await this.pluginRegistry.hookBus.runOnAutosave({
          values: cloneValue(this.core.values),
          savedAt,
        });
      },
      onError: () => {
        this.patchState({ isAutosaving: false });
      },
      persistDraft: () => {
        if (this.config.workflow?.draft?.enabled) {
          this.draftManager.save(this.core.values);
          this.events.emit("draft");
        }
      },
    });
  }

  private scheduleAutosave(): void {
    this.autosave.schedule();
  }

  private recomputeFieldUi(): void {
    if (!this.hasWorkflowRules()) {
      return;
    }

    const shouldNotify = this.workflowEngine === null;
    this.runWithWorkflowEngine(
      (engine) => {
        const fieldPaths = listAllPaths(this.core.values);
        const evaluated = engine.evaluateFormRules({
          rules: [...this.baseRules, ...this.runtimeRules],
          values: this.core.values,
          fieldPaths,
          setValue: (path, value) => {
            this.patchValuesSilent(path, value);
          },
        });
        this.fieldUi = evaluated.fieldUi;
        this.formUi = evaluated.formUi;
      },
      { notify: shouldNotify },
    );
  }

  private applyCalculations(changedPath?: FieldPath): void {
    if (this.calculations.length === 0) {
      return;
    }

    this.runWithWorkflowEngine(
      (engine) => {
        const updates = engine.runCalculations({
          calculations: this.calculations,
          values: this.core.values,
          ...(changedPath === undefined ? {} : { changedPath }),
        });

        for (const [path, value] of Object.entries(updates)) {
          this.patchValuesSilent(path, value, { markDirty: false, recordHistory: false });
        }
      },
      { notify: false },
    );
  }

  private async runDependencyRules(changedPath: FieldPath): Promise<void> {
    if (!this.hasWorkflowRules()) {
      return;
    }

    const engine = this.workflowEngine ?? (await this.getWorkflowEngine());
    this.workflowEngine = engine;
    const updates = await engine.runDependencyRules({
      rules: [...this.baseRules, ...this.runtimeRules],
      changedPath,
      values: this.core.values,
    });

    for (const [path, options] of Object.entries(updates)) {
      if (!options) {
        continue;
      }

      this.fieldOptionsState[path] = options;
      this.patchValuesSilent(path, "", { markDirty: false, recordHistory: false });
    }

    if (Object.keys(updates).length > 0) {
      this.notify();
    }
  }

  private applyCompiledFieldFormats(config: FormConfig<TValues>): void {
    if (!config.schema || isSchemaAdapter(config.schema)) {
      return;
    }

    const compiled = compileSchema(config.schema);
    const pendingPresets = Object.entries(compiled.fieldFormats).filter(
      ([, format]) => format?.formatPreset,
    );

    for (const [path, format] of Object.entries(compiled.fieldFormats)) {
      if (format?.format || format?.parse) {
        this.fieldOptions.set(path, {
          ...(format.format ? { format: format.format } : {}),
          ...(format.parse ? { parse: format.parse } : {}),
        });
      }
    }

    if (pendingPresets.length === 0) {
      return;
    }

    void import("../format/presets.js").then(({ resolveFormatPreset }) => {
      if (this.store.isDestroyed()) {
        return;
      }

      for (const [path, format] of pendingPresets) {
        if (!format?.formatPreset) {
          continue;
        }

        const resolved = resolveFormatPreset(format.formatPreset);
        this.fieldOptions.set(path, {
          ...(resolved.format ? { format: resolved.format } : {}),
          ...(resolved.parse ? { parse: resolved.parse } : {}),
        });
      }
    });
  }

  private getWorkflowEngine(): ReturnType<typeof loadWorkflowEngine> {
    this.workflowEnginePromise ??= loadWorkflowEngine();
    return this.workflowEnginePromise;
  }

  private runWithWorkflowEngine(
    run: (engine: Awaited<ReturnType<typeof loadWorkflowEngine>>) => void,
    options: { notify?: boolean } = {},
  ): void {
    if (this.workflowEngine) {
      run(this.workflowEngine);
      return;
    }

    void this.getWorkflowEngine().then((engine) => {
      if (this.store.isDestroyed()) {
        return;
      }

      this.workflowEngine = engine;
      run(engine);
      if (options.notify !== false) {
        this.notify();
      }
    });
  }

  private hasWorkflowRules(): boolean {
    return this.baseRules.length > 0 || this.runtimeRules.length > 0;
  }

  private applyFieldFormatting(
    value: unknown,
    fieldOptions?: {
      readonly format?: import("../format/types.js").Formatter;
      readonly parse?: import("../format/types.js").Parser;
      readonly formatOnDisplay?: boolean;
      readonly parseOnInput?: boolean;
    },
  ): unknown {
    return runFieldFormatPipeline(value, fieldOptions);
  }

  private patchValuesSilent(path: FieldPath, value: unknown, options?: SetValueOptions): void {
    const fieldOptions = this.fieldOptions.get(path);
    const formatted = this.applyFieldFormatting(value, fieldOptions);
    const previous = getIn(this.core.values, path);
    if (previous === formatted) {
      return;
    }

    this.store.setValueAt(path, formatted);
    if (options?.markDirty !== false) {
      this.store.updateValueMeta(path, formatted);
    }
    this.events.emit("change");
  }

  private patchMetaSilent(
    path: FieldPath,
    patch: { touched?: boolean; dirty?: boolean; visited?: boolean; changed?: boolean },
  ): void {
    this.store.patchMetaSilent(path, patch);
  }

  private patchValues(path: FieldPath, value: unknown, options?: SetValueOptions): void {
    const fieldOpts = this.fieldOptions.get(path);
    const formatted = this.applyFieldFormatting(value, fieldOpts);
    const previous = getIn(this.core.values, path);
    if (previous === formatted) {
      return;
    }

    if (options?.recordHistory !== false) {
      this.undoRedo.record(cloneValue(this.core.values));
    }

    this.store.setValueAt(path, formatted);
    if (options?.markDirty !== false) {
      this.store.updateValueMeta(path, formatted);
    }
    this.events.emit("change");

    const mode = fieldOpts?.validateOn ?? this.config.validateOn;
    const dependentPaths = this.collectDependentFieldPaths(path);
    if (mode === "onChange") {
      void this.validate({ paths: [path, ...dependentPaths], mode: "onChange" });
    }

    this.scheduleAutosave();
    this.recomputeFieldUi();
    this.applyCalculations(path);
    void this.runDependencyRules(path);
    this.notify();
  }

  private patchMeta(
    path: FieldPath,
    patch: { touched?: boolean; dirty?: boolean; visited?: boolean; changed?: boolean },
  ): void {
    this.store.patchMeta(path, patch);
  }

  private collectDependentFieldPaths(changedPath: FieldPath): FieldPath[] {
    const targets: FieldPath[] = [];

    for (const [fieldPath, options] of this.fieldOptions) {
      if (options.dependsOn?.includes(changedPath)) {
        targets.push(fieldPath);
      }
    }

    return targets;
  }

  private remapIndexedFieldRecord<T>(
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
      const joinPath = (parent: FieldPath, segment: string | number): FieldPath => {
        const segmentText = String(segment);
        return parent ? `${parent}.${segmentText}` : segmentText;
      };

      if (mutation.type === "remove") {
        if (index === mutation.index) {
          continue;
        }

        const newIndex = index > mutation.index ? index - 1 : index;
        const newKey = suffix
          ? joinPath(joinPath(arrayPath, newIndex), suffix)
          : joinPath(arrayPath, newIndex);
        next[newKey] = value;
        continue;
      }

      if (index >= mutation.index) {
        const newIndex = index + 1;
        const newKey = suffix
          ? joinPath(joinPath(arrayPath, newIndex), suffix)
          : joinPath(arrayPath, newIndex);
        next[newKey] = value;
        continue;
      }

      next[key] = value;
    }

    return next;
  }

  private remapIndexedFieldMap<T>(
    map: Map<FieldPath, T>,
    arrayPath: FieldPath,
    mutation: ArrayFieldMutation,
  ): void {
    const remapped = this.remapIndexedFieldRecord(Object.fromEntries(map), arrayPath, mutation);
    map.clear();

    for (const [path, value] of Object.entries(remapped)) {
      map.set(path, value);
    }
  }

  private setArrayValue(
    arrayPath: FieldPath,
    nextArray: unknown[],
    mutation?: ArrayFieldMutation,
  ): void {
    this.undoRedo.record(cloneValue(this.core.values));

    if (mutation) {
      this.store.patchCore({
        values: setIn(this.core.values, arrayPath, nextArray) as TValues,
        errors: this.remapIndexedFieldRecord(this.core.errors, arrayPath, mutation),
        touched: this.remapIndexedFieldRecord(this.core.touched, arrayPath, mutation),
        dirty: this.remapIndexedFieldRecord(this.core.dirty, arrayPath, mutation),
        visited: this.remapIndexedFieldRecord(this.core.visited, arrayPath, mutation),
        changed: this.remapIndexedFieldRecord(this.core.changed, arrayPath, mutation),
      });
      this.remapIndexedFieldMap(this.fieldOptions, arrayPath, mutation);
      this.remapIndexedFieldMap(this.fieldValidators, arrayPath, mutation);
      this.fieldOptionsState = this.remapIndexedFieldRecord(
        this.fieldOptionsState,
        arrayPath,
        mutation,
      );
      this.fieldUi = this.remapIndexedFieldRecord(this.fieldUi, arrayPath, mutation);
    } else {
      this.store.patchCore({
        values: setIn(this.core.values, arrayPath, nextArray) as TValues,
      });
    }

    this.events.emit("change");
    this.scheduleAutosave();
    this.recomputeFieldUi();
    this.applyCalculations(arrayPath);
    void this.runDependencyRules(arrayPath);
    this.notify();
  }

  private patchState(patch: Partial<FormCoreState<TValues>>): void {
    this.store.patchCore(patch);
    this.notify();
  }

  private notify(): void {
    if (this.store.isDestroyed()) {
      return;
    }

    this.cachedSnapshot = this.buildFormState();

    this.store.notify();
  }
}

/**
 * Create a form workflow instance. Pass `target` + `schema` to enhance native HTML,
 * or `initialValues` for headless usage.
 */
export function createForm<TValues extends Record<string, unknown>>(
  config: FormConfig<TValues>,
): FormInstance<TValues> {
  const normalized = normalizeIncomingFormConfig(config);
  const resolved = resolveCreateFormConfig(normalized);
  return new FormInstanceImpl(resolved.formConfig, {
    domTarget: resolved.domTarget,
    fieldPaths: resolved.fieldPaths,
  });
}
