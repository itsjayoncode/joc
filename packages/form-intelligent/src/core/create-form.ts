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
import {
  CalculationBuilderImpl,
  detectCalculationCycles,
  MAX_CALCULATION_PASSES,
  runCalculations as runCalculationPass,
  type CalculationDefinition,
} from "../engines/calculation/index.js";
import {
  createDependencyRegistrar,
  DependencyEngine,
  type DependencyMap,
  type DependencyRegistrar,
} from "../engines/dependency/index.js";
import {
  buildPresentationState,
  resolveFieldUi,
  type PresentationSnapshot,
  type PresentationState,
} from "../engines/presentation/index.js";
import {
  runTransformInbound,
  TransformEngine,
  type TransformFn,
  type TransformPipelineHandle,
} from "../engines/transform/index.js";
import { WhenRuleBuilder } from "../engines/workflow/when.js";
import { ConfigurationError } from "../errors/index.js";
import { createFieldHandle } from "../fields/field-handle.js";
import { formatFieldValue as runFieldFormatPipeline } from "../format/pipeline.js";
import { registerConfiguredModules } from "../modules/register-configured.js";
import { resolveHookResult } from "../plugins/hooks.js";
import { MiddlewarePipeline } from "../plugins/middleware.js";
import { PluginRegistry } from "../plugins/registry.js";
import { compileSchema } from "../schema/compiler.js";
import { FormStateStore } from "../state/store.js";
import { SubmissionOrchestrator } from "../submission/submit.js";
import { ASYNC_VALIDATOR_OPTION_DEFAULTS } from "../types/async-validation.js";
import { cloneValue, createId, getIn, setIn } from "../utils/index.js";
import { resolveAsyncDebounceMs } from "../validation/async/run-with-options.js";
import { AsyncValidationManager } from "../validation/async-validator.js";
import {
  listAllPaths,
  mergePathValidationErrors,
  runValidationPipeline,
} from "../validation/pipeline.js";
import { getAsyncValidatorOptions } from "../validation/validators/custom.js";
import {
  AutosaveScheduler,
  buildWorkflowProgress,
  DraftManager,
  getStepFields,
  UndoRedoController,
  WizardNavigator,
} from "../workflow/index.js";

import type { ResolvedFormConfig } from "./options.js";
import type {
  FieldUiMap,
  FormRuleDefinition,
  FormUiState,
  FieldOption,
} from "../engines/workflow/types.js";
import type { MiddlewareInput } from "../plugins/middleware.js";
import type { FormCoreState } from "../state/store.js";
import type {
  CreateCheckpointOptions,
  FieldHandle,
  FieldOptions,
  FieldPath,
  FieldState,
  FormCheckpoint,
  FormConfig,
  FormEvent,
  FormInstance,
  FormPlugin,
  FormRef,
  FormSelector,
  FormState,
  ResetOptions,
  RestoreCheckpointOptions,
  SetValueOptions,
  SubmitOptions,
  SubmitPhase,
  RestoreDraftOptions,
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
  private readonly calculationMemo = new Map<FieldPath, string>();
  private readonly transformEngine = new TransformEngine();
  private readonly asyncValidation = new AsyncValidationManager(300);
  private readonly dependencyEngine = new DependencyEngine();
  private readonly populateGenerations = new Map<FieldPath, number>();
  private readonly submission = new SubmissionOrchestrator<TValues>();
  private readonly pluginRegistry: PluginRegistry<TValues>;
  private readonly middleware = new MiddlewarePipeline<TValues>();
  private readonly ariaIds = new Map<
    FieldPath,
    import("../engines/accessibility/types.js").FieldAriaIds
  >();
  private submitPhase: SubmitPhase = "idle";
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
    this.pluginRegistry = new PluginRegistry<TValues>(
      this.config.onPluginError ? { onPluginError: this.config.onPluginError } : {},
    );
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
    this.draftManager = new DraftManager(draftConfig, draftKey, { formId: this.id });
    const {
      values: initialValues,
      restored: draftRestored,
      workflow: draftWorkflow,
    } = this.draftManager.resolveInitialValues(cloneValue(this.config.initialValues));

    this.store = new FormStateStore({
      values: initialValues,
      defaultValues: cloneValue(this.config.initialValues),
      currentStep: draftWorkflow?.currentStep ?? this.config.workflow?.wizard?.initialStep ?? 0,
    });

    this.wizardNavigator = new WizardNavigator({
      getWizard: () => this.config.workflow?.wizard,
      getCurrentStep: () => this.core.currentStep,
      setStep: (step) => {
        this.patchState({ currentStep: step });
      },
      getValues: () => this.core.values,
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
    for (const plugin of config.plugins ?? []) {
      this.registerPlugin(plugin);
    }
    if (draftRestored) {
      void this.pluginRegistry.hookBus.runOnDraftRestore({
        values: cloneValue(initialValues),
      });
    }
    this.asyncValidation.setOnValidatingChange(() => {
      this.notify();
    });
    this.syncAsyncValidatorPathPolicies();
    if (this.config.dependencies) {
      this.dependencyEngine.registerMap(this.config.dependencies, {
        ...(this.config.dependencyActions ? { actionsByChild: this.config.dependencyActions } : {}),
      });
    }
    this.dependencyEngine.syncInferredFromFields(this.fieldOptions);
    this.cachedSnapshot = this.buildFormState();

    if (options.domTarget) {
      this.attachElement(options.domTarget, options.fieldPaths);
    }

    this.registerConfigSubscribe(config.subscribe);
  }

  /** Register `createForm({ subscribe })` listeners and fire once after init. */
  private registerConfigSubscribe(subscribe: FormConfig<TValues>["subscribe"]): void {
    if (!subscribe) {
      return;
    }

    const listeners = Array.isArray(subscribe) ? subscribe : [subscribe];
    for (const listener of listeners) {
      this.subscribe(() => {
        listener(this);
      });
    }
    for (const listener of listeners) {
      listener(this);
    }
  }

  /** Apply per-path debounce / abortPrevious from `asyncValidator({ … })` options. */
  private syncAsyncValidatorPathPolicies(): void {
    const paths = new Set<FieldPath>([
      ...this.fieldValidators.keys(),
      ...Object.keys(this.config.validators ?? {}),
    ]);

    for (const path of paths) {
      const configValidator = this.config.validators?.[path];
      const fromConfig = configValidator
        ? Array.isArray(configValidator)
          ? [...configValidator]
          : [configValidator]
        : [];
      const validators = [...(this.fieldValidators.get(path) ?? []), ...fromConfig];

      let debounceMs: number | undefined;
      let abortPrevious: boolean = ASYNC_VALIDATOR_OPTION_DEFAULTS.abortPrevious;
      let sawOptions = false;

      for (const validator of validators) {
        const asyncOptions = getAsyncValidatorOptions(validator);
        if (!asyncOptions) {
          continue;
        }
        sawOptions = true;
        const resolved = resolveAsyncDebounceMs(asyncOptions);
        debounceMs = debounceMs === undefined ? resolved : Math.max(debounceMs, resolved);
        if (asyncOptions.abortPrevious === false) {
          abortPrevious = false;
        }
      }

      if (sawOptions) {
        this.asyncValidation.setPathDebounceMs(
          path,
          debounceMs ?? ASYNC_VALIDATOR_OPTION_DEFAULTS.debounce,
        );
        this.asyncValidation.setPathAbortPrevious(path, abortPrevious);
      }
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
      this.syncAsyncValidatorPathPolicies();
    }
    this.dependencyEngine.syncInferredFromFields(this.fieldOptions);

    if (getIn(this.core.values, path) === undefined && options.defaultValue !== undefined) {
      this.patchValues(path, options.defaultValue);
    }

    return createFieldHandle({
      path,
      getValue: () => this.values(path),
      getError: () => this.errors(path) as string | undefined,
      getTouched: () => Boolean(this.core.touched[path]),
      getDirty: () => Boolean(this.core.dirty[path]),
      getVisited: () => Boolean(this.core.visited[path]),
      getUi: () =>
        resolveFieldUi(path, this.fieldUi, {
          ...(this.asyncValidation.isFieldValidating(path) ? { busy: true } : {}),
        }),
      getMeta: () => this.getFieldMeta(path),
      getFieldState: () => this.getFieldState(path),
      getAriaIds: () => this.ariaIds.get(path),
      setAriaIds: (ids) => {
        this.ariaIds.set(path, ids);
      },
      setValue: (value) => {
        this.setValue(path, value);
      },
      setTouched: (touched = true) => {
        this.patchMeta(path, { touched });
      },
      setVisited: (visited = true) => {
        this.patchMeta(path, { visited });
      },
      validateField: async () => this.validate({ paths: [path] }),
      emitBlur: () => {
        this.events.emit("blur");
      },
      emitFocus: () => {
        this.events.emit("focus");
      },
      validateOnBlur: () => {
        void this.validate({ paths: [path], mode: "onBlur" });
      },
    });
  }

  public firstInvalidPath(): FieldPath | undefined {
    const errors = this.core.errors;
    for (const path of Object.keys(errors)) {
      if (errors[path]) {
        return path;
      }
    }
    return undefined;
  }

  public focusFirstInvalid(): FieldPath | undefined {
    const path = this.firstInvalidPath();
    if (!path || typeof document === "undefined") {
      return path;
    }

    const escaped =
      typeof CSS !== "undefined" && typeof CSS.escape === "function"
        ? CSS.escape(path)
        : path.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const control = document.querySelector<HTMLElement>(`[name="${escaped}"]`);
    control?.focus?.();
    return path;
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
    // Pending autosave must not race with submit persistence.
    this.autosave.cancel();

    const preventDoubleSubmit = options?.preventDoubleSubmit !== false;

    if (preventDoubleSubmit && (this.submitInFlight || this.submission.isActive)) {
      return false;
    }

    if (preventDoubleSubmit) {
      this.submitInFlight = true;
    }

    const submitContext = {
      values: this.core.values,
      ...(options ? { options } : {}),
      success: false,
    };

    this.setSubmitPhase("validating");
    const signal = this.submission.begin();

    try {
      const valid = await this.validate({ mode: "onSubmit" });
      if (!valid) {
        for (const path of Object.keys(this.core.errors)) {
          this.patchMeta(path, { touched: true });
        }
        this.setSubmitPhase("idle");
        return false;
      }

      if (signal.aborted) {
        this.setSubmitPhase("idle");
        return false;
      }

      if (this.config.workflow?.offlineQueue?.enabled && isNavigatorOffline()) {
        const offline = await this.ensureOfflineService();
        try {
          offline.ensure().enqueue(cloneValue(this.core.values));
        } catch (error) {
          this.config.onSubmitError?.(error);
          this.setSubmitPhase("error");
          return false;
        }
        this.notify();
        submitContext.success = true;
        await this.runAfterSubmitPipeline(submitContext, signal);
        this.setSubmitPhase("success");
        return true;
      }

      const beforeMw = await this.middleware.run({
        form: this,
        phase: "beforeSubmit",
        signal,
        meta: options ? { options } : {},
      });
      if (beforeMw.halted || signal.aborted) {
        this.setSubmitPhase("idle");
        return false;
      }

      if (!(await resolveHookResult(this.pluginRegistry.hookBus.runBeforeSubmit(submitContext)))) {
        this.setSubmitPhase("idle");
        return false;
      }

      this.setSubmitPhase("submitting");
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
          this.setSubmitPhase("idle");
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
          this.setSubmitPhase("error");
          await this.middleware.run({
            form: this,
            phase: "submitError",
            signal,
            meta: { fieldErrors: result.fieldErrors, formError: result.formError },
          });
          return false;
        }

        if (this.config.workflow?.analytics?.enabled) {
          (await this.ensureAnalyticsService()).recordSubmitSuccess();
        }
        this.patchState({ submitCount: result.submitCount, isSubmitting: false });
        this.store.markSubmitted();
        this.draftManager.clear();
        submitContext.success = true;
        this.setSubmitPhase("success");
        return true;
      } catch (error) {
        this.patchState({ isSubmitting: false });
        this.setSubmitPhase("error");
        await this.middleware.run({
          form: this,
          phase: "submitError",
          signal,
          meta: { error },
        });
        return false;
      } finally {
        await this.runAfterSubmitPipeline(submitContext, signal);
      }
    } catch {
      this.patchState({ isSubmitting: false });
      this.setSubmitPhase("error");
      return false;
    } finally {
      this.submission.end();
      if (preventDoubleSubmit) {
        this.submitInFlight = false;
      }
    }
  }

  public cancelSubmit(): void {
    this.submission.cancel();
    this.patchState({ isSubmitting: false });
    this.setSubmitPhase("idle");
  }

  public useMiddleware(middleware: MiddlewareInput<TValues>): () => void {
    return this.middleware.use(middleware);
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

    const signal = this.submission.isActive ? this.submission.signal : new AbortController().signal;
    const usesDebouncedSchedule = targetPaths.length === 1 && mode === "onChange";

    // UX: flip per-field isValidating before middleware/hook microtasks (ADR-005).
    if (!usesDebouncedSchedule && targetPaths.length > 0) {
      this.asyncValidation.setFieldsValidating(targetPaths, true);
      this.patchState({ isValidating: true });
    }

    const clearPrefetch = (): void => {
      if (!usesDebouncedSchedule && targetPaths.length > 0) {
        this.asyncValidation.setFieldsValidating(targetPaths, false);
        this.patchState({ isValidating: false });
      }
    };

    return this.middleware
      .run({
        form: this,
        phase: "beforeValidate",
        signal,
        meta: { paths: targetPaths, mode },
      })
      .then(async (beforeMw) => {
        if (beforeMw.halted) {
          clearPrefetch();
          return false;
        }

        const before = await resolveHookResult(
          this.pluginRegistry.hookBus.runBeforeValidate(hookContext),
        );
        if (!before) {
          clearPrefetch();
          return false;
        }

        return this.finishValidate(targetPaths, mode, hookContext, signal);
      })
      .catch((error: unknown) => {
        clearPrefetch();
        if (
          (error instanceof DOMException || error instanceof Error) &&
          error.name === "AbortError"
        ) {
          return false;
        }
        throw error;
      });
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
    signal: AbortSignal = new AbortController().signal,
  ): Promise<boolean> {
    return this.runValidatePaths(targetPaths, mode).then(async (ok) => {
      await this.pluginRegistry.hookBus.runAfterValidate({ ...hookContext, valid: ok });
      await this.middleware.run({
        form: this,
        phase: "afterValidate",
        signal,
        meta: { paths: targetPaths, mode, valid: ok },
      });
      return ok;
    });
  }

  private async runAfterSubmitPipeline(
    submitContext: {
      values: TValues;
      options?: SubmitOptions;
      success: boolean;
    },
    signal: AbortSignal,
  ): Promise<void> {
    await this.pluginRegistry.hookBus.runAfterSubmit(submitContext);
    await this.middleware.run({
      form: this,
      phase: "afterSubmit",
      signal,
      meta: { success: submitContext.success },
    });
  }

  private setSubmitPhase(phase: SubmitPhase): void {
    if (this.submitPhase === phase) {
      return;
    }
    this.submitPhase = phase;
    this.notify();
  }

  private async runValidatePaths(
    targetPaths: readonly FieldPath[],
    mode: import("../types/index.js").ValidationMode,
  ): Promise<boolean> {
    const execute = async (
      validatePathsInput: readonly FieldPath[],
      signal: AbortSignal,
    ): Promise<boolean> => {
      if (signal.aborted || this.store.isDestroyed()) {
        return false;
      }

      this.patchState({ isValidating: true });
      this.events.emit("validate");

      const settleAborted = (): false => {
        this.patchState({ isValidating: false });
        return false;
      };

      const fieldErrors = await runValidationPipeline({
        values: this.core.values,
        paths: validatePathsInput,
        fieldValidators: this.fieldValidators,
        configValidators: this.config.validators ?? {},
        ...(this.config.crossFieldValidators
          ? { crossFieldRules: this.config.crossFieldValidators }
          : {}),
        ...(this.config.formValidators ? { formValidators: this.config.formValidators } : {}),
        signal,
      });

      if (signal.aborted || this.store.isDestroyed()) {
        return settleAborted();
      }

      const errors = { ...fieldErrors };

      if (this.schemaAdapter) {
        const adapterErrors = await this.schemaAdapter.validate(this.core.values);
        if (signal.aborted || this.store.isDestroyed()) {
          return settleAborted();
        }

        const includeAllAdapterErrors = validatePathsInput.length !== 1;

        for (const [path, message] of Object.entries(adapterErrors)) {
          if (includeAllAdapterErrors || validatePathsInput.includes(path) || path === "_form") {
            errors[path] = message;
          }
        }
      }

      if (signal.aborted || this.store.isDestroyed()) {
        return settleAborted();
      }

      const mergedErrors = mergePathValidationErrors(this.core.errors, errors, validatePathsInput);

      this.patchState({ errors: mergedErrors, isValidating: false });
      this.events.emit("validated");
      return Object.keys(mergedErrors).length === 0;
    };

    if (targetPaths.length === 1) {
      const path = targetPaths[0];
      if (!path) {
        return this.asyncValidation.track(targetPaths, (signal) => execute(targetPaths, signal));
      }

      if (mode === "onChange") {
        // schedule owns AbortController — do not wrap with track (avoids double-abort).
        return this.asyncValidation.schedule(path, async (scheduledPaths, signal) => {
          if (signal.aborted) {
            return false;
          }
          return execute(scheduledPaths, signal);
        });
      }
    }

    return this.asyncValidation.track(targetPaths, (signal) => execute(targetPaths, signal));
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
    const metaPaths = new Set<FieldPath>([
      ...listAllPaths(this.core.values),
      ...this.fieldOptions.keys(),
    ]);
    const fieldMeta = Object.fromEntries(
      [...metaPaths].map((path) => {
        const options = this.fieldOptions.get(path);
        return [
          path,
          {
            isValidating: this.asyncValidation.isFieldValidating(path),
            ...(options?.label === undefined ? {} : { label: options.label }),
            ...(options?.description === undefined ? {} : { description: options.description }),
            ...(options?.hidden === undefined ? {} : { hidden: options.hidden }),
          },
        ];
      }),
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
      submitPhase: this.submitPhase,
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

  public getPresentation(path: FieldPath): PresentationState;
  public getPresentation(): PresentationSnapshot;
  public getPresentation(path?: FieldPath): PresentationState | PresentationSnapshot {
    const snapshot: PresentationSnapshot = {
      fieldUi: this.fieldUi,
      formUi: this.formUi,
      fieldOptions: { ...this.fieldOptionsState },
    };
    if (path === undefined) {
      return snapshot;
    }
    return buildPresentationState(path, snapshot, {
      ...(this.asyncValidation.isFieldValidating(path) ? { busy: true } : {}),
    });
  }

  public createCheckpoint(options: CreateCheckpointOptions = {}): FormCheckpoint<TValues> {
    const include = new Set(options.include ?? (["values"] as const));
    const checkpoint: FormCheckpoint<TValues> = {
      version: 1,
      kind: "checkpoint",
      capturedAt: Date.now(),
      values: cloneValue(this.core.values),
    };

    const withMeta = {
      ...checkpoint,
      ...(include.has("errors") ? { errors: { ...this.core.errors } } : {}),
      ...(include.has("touched") ? { touched: { ...this.core.touched } } : {}),
      ...(include.has("dirty") ? { dirty: { ...this.core.dirty } } : {}),
      ...(include.has("visited") ? { visited: { ...this.core.visited } } : {}),
      ...(include.has("fieldUi") ? { fieldUi: { ...this.fieldUi } } : {}),
      ...(include.has("workflow") ? { workflow: { currentStep: this.core.currentStep } } : {}),
    };

    return withMeta;
  }

  public restoreCheckpoint(
    checkpoint: FormCheckpoint<TValues>,
    options: RestoreCheckpointOptions = {},
  ): void {
    if (checkpoint.kind !== "checkpoint" || checkpoint.version !== 1) {
      throw new ConfigurationError("Invalid form checkpoint.");
    }

    const restoreMeta = options.restoreMeta !== false;
    const nextValues = cloneValue(checkpoint.values);

    this.store.replaceValues(nextValues);
    this.store.patchCore({
      ...(restoreMeta && checkpoint.errors ? { errors: { ...checkpoint.errors } } : {}),
      ...(restoreMeta && checkpoint.touched ? { touched: { ...checkpoint.touched } } : {}),
      ...(restoreMeta && checkpoint.dirty ? { dirty: { ...checkpoint.dirty } } : {}),
      ...(restoreMeta && checkpoint.visited ? { visited: { ...checkpoint.visited } } : {}),
      ...(checkpoint.workflow ? { currentStep: checkpoint.workflow.currentStep } : {}),
    });

    if (restoreMeta && checkpoint.fieldUi) {
      this.fieldUi = { ...checkpoint.fieldUi };
    }

    if (options.recordHistory) {
      this.undoRedo.record(cloneValue(nextValues));
    }

    this.recomputeFieldUi();
    this.notify();
    this.events.emit("reset");
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

  public dependencies(map: DependencyMap): void;
  public dependencies(): DependencyRegistrar<TValues>;
  public dependencies(map?: DependencyMap): void | DependencyRegistrar<TValues> {
    if (map) {
      this.dependencyEngine.registerMap(map, {
        ...(this.config.dependencyActions ? { actionsByChild: this.config.dependencyActions } : {}),
      });
      return;
    }
    return createDependencyRegistrar<TValues>(this.dependencyEngine, {
      ...(this.config.dependencyActions ? { actionsByChild: this.config.dependencyActions } : {}),
    });
  }

  public calculate(path: FieldPath): CalculationBuilderImpl<TValues>;
  public calculate(
    path: FieldPath,
    options: CalculateOptions<TValues> | ((context: { values: TValues }) => unknown),
  ): void;
  public calculate(
    path: FieldPath,
    options?: CalculateOptions<TValues> | ((context: { values: TValues }) => unknown),
  ): void | CalculationBuilderImpl<TValues> {
    if (options === undefined) {
      return new CalculationBuilderImpl<TValues>(path)._attachRegister((definition) => {
        this.registerCalculation(definition);
      });
    }

    const resolved = typeof options === "function" ? { compute: options } : options;
    this.registerCalculation({
      path,
      compute: (ctx) => resolved.compute({ values: ctx.values }),
      ...(resolved.deps === undefined ? {} : { deps: resolved.deps }),
      ...(resolved.markDirty === undefined ? {} : { markDirty: resolved.markDirty }),
      ...(resolved.lazy === undefined ? {} : { lazy: resolved.lazy }),
      ...(resolved.memoized === undefined ? {} : { memoized: resolved.memoized }),
    });
  }

  private registerCalculation(definition: CalculationDefinition<TValues>): void {
    const next = [...this.calculations, definition];
    const cycles = detectCalculationCycles(next);
    if (cycles.length > 0) {
      throw new ConfigurationError(
        `Calculation cycle detected: ${cycles.map((cycle) => cycle.join(" → ")).join("; ")}`,
        { details: { cycles: cycles.map((cycle) => [...cycle]) } },
      );
    }

    this.calculations.push(definition);
    this.applyCalculations(undefined, { initial: true });
    this.notify();
  }

  public transform(path: FieldPath): TransformPipelineHandle;
  public transform(path: FieldPath, stages: readonly TransformFn<TValues>[]): void;
  public transform(
    path: FieldPath,
    stages?: readonly TransformFn<TValues>[],
  ): void | TransformPipelineHandle {
    if (stages) {
      this.transformEngine.set(path, stages as readonly TransformFn[]);
      return;
    }
    return this.transformEngine.handle(path);
  }

  public saveDraft(): void {
    const persistStep = this.config.workflow?.wizard?.persistStepInDraft === true;
    this.draftManager.save(
      this.core.values,
      persistStep ? { currentStep: this.core.currentStep, persistWorkflow: true } : {},
    );
    this.events.emit("draft");
  }

  public async restoreDraft(options: RestoreDraftOptions = {}): Promise<boolean> {
    if (!this.draftManager.enabled) {
      return false;
    }

    if (this.store.isDirty() && options.force !== true) {
      return false;
    }

    const defaults = cloneValue(this.core.defaultValues) as TValues;
    const result = this.draftManager.applyLoadedDraft(defaults, {
      ...(options.merge ? { merge: options.merge } : {}),
      ...(options.prompt === undefined ? { prompt: false } : { prompt: options.prompt }),
    });

    if (!result.restored) {
      return false;
    }

    // D-RESTORE-RACE: re-check dirty after async tick boundary (sync today; keep guard).
    if (this.store.isDirty() && options.force !== true) {
      return false;
    }

    this.store.replaceValues(cloneValue(result.values));
    if (result.workflow?.currentStep !== undefined) {
      this.store.patchCore({ currentStep: result.workflow.currentStep });
    }
    this.recomputeFieldUi();
    this.applyCalculations(undefined, { initial: true });
    this.notify();
    this.events.emit("change");
    await this.pluginRegistry.hookBus.runOnDraftRestore({
      values: cloneValue(result.values),
    });
    return true;
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
        timeToCompleteMs: null,
        timeToFirstErrorMs: null,
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
    this.middleware.clear();
    this.ariaIds.clear();
    this.autosave.destroy();
    this.undoRedo.destroy();
    this.asyncValidation.destroy();
    this.transformEngine.destroy();
    this.moduleHost.destroy();
    this.events.clear();
    this.store.destroy();
  }

  public readonly workflow = {
    next: () => this.wizardNavigator.next(),
    prev: () => {
      this.wizardNavigator.prev();
    },
    goTo: (step: number | string, options?: import("../workflow/wizard.js").GoToOptions) =>
      this.wizardNavigator.goTo(step, options),
    getStepGraph: () => this.wizardNavigator.getStepGraph(),
    visibleSteps: (values?: TValues) => this.wizardNavigator.visibleSteps(values),
  };

  public registerPlugin(plugin: FormPlugin<TValues>): void {
    this.moduleHost.registerPlugin(plugin);
  }

  public listPlugins(): readonly {
    readonly name: string;
    readonly order: number;
    readonly version?: string;
  }[] {
    return this.pluginRegistry.list().map((plugin) => ({
      name: plugin.name,
      order: plugin.order ?? 100,
      ...(plugin.version ? { version: plugin.version } : {}),
    }));
  }

  private getWorkflowState(): WorkflowState {
    return buildWorkflowProgress({
      currentStep: this.core.currentStep,
      wizard: this.config.workflow?.wizard,
      values: this.core.values,
      isAutosaving: this.core.isAutosaving,
      lastAutosaveAt: this.core.lastAutosaveAt,
    });
  }

  private async ensureOfflineService(): Promise<
    Awaited<ReturnType<typeof ensureOfflineService<TValues>>>
  > {
    if (!this.offlineService) {
      const { toOfflineQueueRuntimeOptions } = await import("../engines/offline/config.js");
      this.offlineService = await ensureOfflineService<TValues>(
        this.offlineStorageKey,
        toOfflineQueueRuntimeOptions<TValues>(this.config.workflow?.offlineQueue),
      );
    }

    return this.offlineService;
  }

  private async ensureAnalyticsService(): Promise<
    Awaited<ReturnType<typeof ensureAnalyticsService>>
  > {
    if (!this.analyticsService) {
      const { toAnalyticsRuntimeOptions } = await import("../engines/analytics/config.js");
      this.analyticsService = await ensureAnalyticsService(
        toAnalyticsRuntimeOptions(this.config.workflow?.analytics),
      );
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
          const persistStep = this.config.workflow?.wizard?.persistStepInDraft === true;
          this.draftManager.save(
            this.core.values,
            persistStep ? { currentStep: this.core.currentStep, persistWorkflow: true } : {},
          );
          this.events.emit("draft");
        }
      },
    });
  }

  private scheduleAutosave(): void {
    if (this.submitInFlight || this.submission.isActive || this.store.isDestroyed()) {
      return;
    }
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

  private applyCalculations(
    changedPath?: FieldPath,
    options?: { readonly initial?: boolean },
  ): void {
    if (this.calculations.length === 0 || this.store.isDestroyed()) {
      return;
    }

    let seed: FieldPath | undefined = changedPath;
    const byPath = new Map(this.calculations.map((calc) => [calc.path, calc]));

    for (let pass = 0; pass < MAX_CALCULATION_PASSES; pass += 1) {
      const updates = runCalculationPass({
        calculations: this.calculations,
        values: this.core.values,
        memo: this.calculationMemo,
        ...(seed === undefined ? {} : { changedPath: seed }),
        ...(options?.initial && pass === 0 ? { initial: true } : {}),
      });

      const entries = Object.entries(updates);
      if (entries.length === 0) {
        return;
      }

      for (const [path, value] of entries) {
        const calc = byPath.get(path);
        this.patchValuesSilent(path, value, {
          markDirty: calc?.markDirty === true,
          recordHistory: false,
        });
      }

      // Next pass: any calc that depends on paths we just wrote.
      const written = entries.map(([path]) => path);
      const triggered = this.calculations.some((calc) => {
        const deps = calc.deps;
        if (!deps) {
          return written.length > 0;
        }
        return written.some((path) => deps.includes(path));
      });
      if (!triggered) {
        return;
      }
      // Re-run all calcs that might chain (omit changedPath filter).
      seed = undefined;
      options = undefined;
    }

    throw new ConfigurationError(
      `Calculation loop exceeded ${MAX_CALCULATION_PASSES} passes — check for circular derived fields.`,
    );
  }

  private async runDependencyRules(changedPath: FieldPath): Promise<void> {
    if (!this.hasWorkflowRules() || this.store.isDestroyed()) {
      return;
    }

    const generation = (this.populateGenerations.get(changedPath) ?? 0) + 1;
    this.populateGenerations.set(changedPath, generation);

    const engine = this.workflowEngine ?? (await this.getWorkflowEngine());
    if (this.store.isDestroyed() || this.populateGenerations.get(changedPath) !== generation) {
      return;
    }

    this.workflowEngine = engine;
    const valuesSnapshot = cloneValue(this.core.values);
    const updates = await engine.runDependencyRules({
      rules: [...this.baseRules, ...this.runtimeRules],
      changedPath,
      values: valuesSnapshot,
    });

    if (this.store.isDestroyed() || this.populateGenerations.get(changedPath) !== generation) {
      return;
    }

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
    path: FieldPath,
    fieldOptions?: FieldOptions<TValues>,
  ): unknown {
    const ctx = {
      path,
      values: this.core.values,
    };

    const registered = this.transformEngine.get(path);
    let next = value;
    if (registered.length > 0) {
      next = runTransformInbound(next, registered, ctx);
    }
    if (fieldOptions?.transform) {
      next = runTransformInbound(next, fieldOptions.transform, ctx);
    }

    return runFieldFormatPipeline(next, fieldOptions);
  }

  private patchValuesSilent(path: FieldPath, value: unknown, options?: SetValueOptions): void {
    const fieldOptions = this.fieldOptions.get(path);
    const formatted = this.applyFieldFormatting(value, path, fieldOptions);
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
    const formatted = this.applyFieldFormatting(value, path, fieldOpts);
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

    const cascade = this.dependencyEngine.onParentChange(path);
    for (const clear of cascade.clears) {
      this.patchValuesSilent(clear.path, clear.clearValue, {
        markDirty: false,
        recordHistory: false,
      });
    }

    const mode = fieldOpts?.validateOn ?? this.config.validateOn;
    const dependentPaths = [
      ...new Set([...this.collectDependentFieldPaths(path), ...cascade.revalidate]),
    ];
    if (mode === "onChange") {
      void this.validate({ paths: [path, ...dependentPaths], mode: "onChange" });
    } else if (cascade.revalidate.length > 0) {
      void this.validate({ paths: cascade.revalidate, mode: "onChange" });
    }

    this.scheduleAutosave();
    this.recomputeFieldUi();
    this.applyCalculations(path);
    for (const recomputePath of cascade.recompute) {
      this.applyCalculations(recomputePath);
    }
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
    return [
      ...new Set([
        ...this.dependencyEngine.getDependents(changedPath),
        ...[...this.fieldOptions.entries()]
          .filter(([, options]) => options.dependsOn?.includes(changedPath))
          .map(([fieldPath]) => fieldPath),
      ]),
    ];
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
