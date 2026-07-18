export type FieldPath = string;

export interface FieldMetaState {
  readonly isValidating: boolean;
  readonly label?: string;
  readonly description?: string;
  readonly hidden?: boolean;
}

import type { SchemaAdapter } from "../adapters/schema-adapter.js";
import type { DraftStorageAdapter, DraftStorageKind } from "../engines/draft/storage-adapter.js";
import type { Formatter, Parser } from "../engines/formatter/types.js";
import type {
  CalculateOptions,
  FieldOption,
  FieldUiMap,
  FormRuleDefinition,
  FormUiState,
  WizardConfig,
} from "../engines/workflow/types.js";
import type { WhenRuleBuilder } from "../engines/workflow/when.js";

export type {
  SchemaAdapter,
  PersistenceAdapter,
  SyncPersistenceAdapter,
  FrameworkAdapter,
  SubmitTransportAdapter,
} from "../adapters/types.js";

export type {
  CalculateOptions,
  FieldOption,
  FieldUiMap,
  FieldUiState,
  FormRuleDefinition,
  FormUiState,
  RuleContext,
  WizardConfig,
  WizardGuardContext,
  WizardNavigateValidation,
  WizardStep,
  WizardStepGraph,
  WizardStepGraphNode,
} from "../engines/workflow/types.js";

/** Plain rule object or a `when()` builder (`createForm` calls `.build()` for builders). */
export type FormRuleInput<TValues extends Record<string, unknown> = Record<string, unknown>> =
  | FormRuleDefinition<TValues>
  // `when()` defaults to Record<string, unknown>; class generics are invariant, so accept both.
  | WhenRuleBuilder<TValues>
  | WhenRuleBuilder;

export type ValidationMode = "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";

export type FormEvent =
  | "change"
  | "blur"
  | "focus"
  | "reset"
  | "submit"
  | "validate"
  | "validated"
  | "autosave"
  | "draft";

export type ValidatorResult = true | false | string | undefined;

export interface ValidationFormAccessor<TValues extends Record<string, unknown>> {
  get(path: FieldPath): unknown;
  values(): TValues;
}

export interface ValidationContext<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly path: FieldPath;
  readonly form: ValidationFormAccessor<TValues>;
  /** Present when validation is tied to an in-flight async job (Phase 4A). */
  readonly signal?: AbortSignal;
}

export type {
  AsyncCachePolicy,
  AsyncJob,
  AsyncRetryPolicy,
  AsyncValidatorOptions,
  TtlInput,
} from "./async-validation.js";
export { ASYNC_VALIDATOR_OPTION_DEFAULTS } from "./async-validation.js";
export type {
  DependencyAction,
  DependencyEdge,
  DependencyEdgeConfig,
  DependencyGraph,
  DependencyMap,
  DependencyNode,
} from "../engines/dependency/types.js";

export type BuiltInFieldType = "text" | "email" | "password" | "url";

export interface FieldValidateRules {
  readonly required?: boolean;
  readonly email?: boolean;
  readonly password?: boolean;
  readonly url?: boolean;
  readonly minLength?: number;
  readonly custom?: CustomFieldValidator | readonly CustomFieldValidator[];
}

export interface CustomFieldValidatorContext<TValues extends Record<string, unknown>> {
  readonly value: unknown;
  readonly path: FieldPath;
  readonly form: ValidationFormAccessor<TValues>;
}

export type CustomFieldValidator<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> = (context: CustomFieldValidatorContext<TValues>) => ValidatorResult | Promise<ValidatorResult>;

export interface FieldSchemaConfig {
  readonly type?: BuiltInFieldType;
  readonly required?: boolean;
  readonly email?: boolean;
  readonly password?: boolean;
  readonly url?: boolean;
  readonly minLength?: number;
  readonly validate?: FieldValidateRules;
  readonly validators?: readonly CustomFieldValidator[];
  readonly format?: Formatter | "philippine-phone" | "credit-card" | "phone" | "currency" | "slug";
}

export type FormRef = (element: HTMLFormElement | null) => void;

export type FieldSchemaDefinition = BuiltInFieldType | FieldSchemaConfig;

export type Validator<TValues extends Record<string, unknown> = Record<string, unknown>> = (
  value: unknown,
  context: ValidationContext<TValues>,
) => ValidatorResult | Promise<ValidatorResult>;

export interface FieldOptions<TValues extends Record<string, unknown>> {
  readonly defaultValue?: unknown;
  readonly validators?: readonly Validator<TValues>[];
  readonly validateOn?: ValidationMode;
  readonly dependsOn?: readonly FieldPath[];
  readonly format?: Formatter;
  readonly parse?: Parser;
  readonly formatOnDisplay?: boolean;
  readonly parseOnInput?: boolean;
  /**
   * Canonical inbound transforms (trim/normalize/sanitize/parse/stages).
   * Distinct from display `format`/`parse` — see `/transform` and TRANSFORM_INBOUND_ORDER.
   */
  readonly transform?:
    | readonly import("../engines/transform/types.js").TransformFn<TValues>[]
    | import("../engines/transform/types.js").TransformPipelineOptions;
  readonly label?: string;
  readonly description?: string;
  readonly hidden?: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface FieldHandle<_TValues extends Record<string, unknown>> {
  readonly path: FieldPath;
  readonly value: unknown;
  readonly error: string | undefined;
  readonly touched: boolean;
  readonly dirty: boolean;
  readonly visited: boolean;
  /** Presentation flags for this path (defaults when missing from `fieldUi`). */
  readonly ui: import("../engines/workflow/types.js").FieldUiState;
  /** Field state + meta (controller surface). */
  readonly meta: FieldState & FieldMetaState;
  /**
   * Accessibility snapshot + spread attributes.
   * Register element ids via `setAriaIds` so `aria-describedby` can link errors/help.
   */
  readonly aria: import("../engines/accessibility/types.js").FieldAriaResult;
  setValue(value: unknown): void;
  setTouched(touched?: boolean): void;
  setVisited(visited?: boolean): void;
  /** Register error/description element ids for `aria-describedby`. */
  setAriaIds(ids: import("../engines/accessibility/types.js").FieldAriaIds): void;
  onBlur(): void;
  onFocus(): void;
  validate(): Promise<boolean>;
  bind(): FieldBinding;
}

export interface FieldBinding {
  readonly name: string;
  readonly value: unknown;
  readonly onChange: (value: unknown) => void;
  readonly onBlur: () => void;
  readonly onFocus: () => void;
}

export type { Formatter, Parser } from "../format/types.js";
export type { FormatPreset } from "../format/presets.js";
export type { DraftStorageAdapter, DraftStorageKind } from "../engines/draft/storage-adapter.js";

export interface AutosaveConfig {
  readonly enabled?: boolean;
  readonly debounceMs?: number;
  readonly onSave: (values: Record<string, unknown>) => void | Promise<void>;
}

export interface DraftConfig {
  readonly enabled?: boolean;
  readonly storageKey?: string;
  readonly storage?: DraftStorageKind;
  readonly adapter?: DraftStorageAdapter;
  readonly onRestore?: (values: Record<string, unknown>) => void;
  readonly promptOnRestore?: boolean;
  readonly onRestorePrompt?: (values: Record<string, unknown>) => boolean;
  /** Persist versioned envelopes (`DraftEnvelopeV1`) instead of raw values. */
  readonly versioning?: boolean;
  /** App schema id compared / migrated when envelopes are enabled. */
  readonly schemaVersion?: string;
  /** Migrate an envelope before restore; throw to reject restore. */
  readonly migrateDraft?: (
    envelope: import("../engines/draft/envelope.js").DraftEnvelopeV1,
  ) => import("../engines/draft/envelope.js").DraftEnvelopeV1;
}

export interface RestoreDraftOptions {
  /** Default false — if the form is dirty, no-op unless force (D-RESTORE-RACE). */
  readonly force?: boolean;
  /** Default false — if true, call `DraftConfig.onRestorePrompt` when set. */
  readonly prompt?: boolean;
  /** Default `overlay` — `{ ...defaults, ...draft }`. `replace` uses draft keys only. */
  readonly merge?: "overlay" | "replace";
}

export interface AnalyticsConfig {
  readonly enabled?: boolean;
  /**
   * When set, only these paths appear in path-keyed metrics (deny-by-default for others).
   * Values are never captured — paths only.
   */
  readonly includePaths?: readonly FieldPath[];
  /** Paths omitted from path-keyed metrics. */
  readonly excludePaths?: readonly FieldPath[];
  /** Invoked whenever a snapshot is produced via `getAnalytics()`. */
  readonly onSnapshot?: (snapshot: FormAnalyticsSnapshot) => void;
}

export interface FormAnalyticsSnapshot {
  readonly startedAt: number;
  readonly completedAt: number | null;
  readonly errorCount: number;
  readonly errorsByField: Readonly<Record<FieldPath, number>>;
  readonly abandonedAt: number | null;
  readonly currentStep: number;
  readonly fieldViews: Readonly<Record<FieldPath, number>>;
  readonly dropOffField: FieldPath | null;
  readonly timeToCompleteMs: number | null;
  readonly timeToFirstErrorMs: number | null;
}

export interface OfflineQueueConfig {
  readonly enabled?: boolean;
  readonly storageKey?: string;
  /** Soft cap on queued items. */
  readonly maxItems?: number;
  /**
   * Behavior when `maxItems` is exceeded.
   * Default: `drop-oldest`.
   */
  readonly overflow?: import("../engines/offline/types.js").OfflineOverflowPolicy;
  /** Deduplicate pending items with the same key (skip enqueue). */
  readonly idempotencyKey?: (values: Record<string, unknown>) => string;
  /**
   * Called when a queued item fails during flush.
   * - `keep` (default) — leave at head, stop flush
   * - `drop` — discard and continue
   * - `retry` — keep at head and continue attempting
   */
  readonly onConflict?: (
    local: import("../engines/offline/types.js").QueuedSubmission<Record<string, unknown>>,
    error: unknown,
  ) =>
    | import("../engines/offline/types.js").OfflineConflictAction
    | void
    | Promise<import("../engines/offline/types.js").OfflineConflictAction | void>;
  readonly onOverflow?: (
    dropped: import("../engines/offline/types.js").QueuedSubmission<Record<string, unknown>>,
    policy: import("../engines/offline/types.js").OfflineOverflowPolicy,
  ) => void;
}

export interface KeyboardShortcutConfig {
  readonly combo: string;
  readonly action: "submit" | "saveDraft" | "undo" | "redo";
}

export interface WorkflowConfig {
  readonly autosave?: AutosaveConfig;
  readonly draft?: DraftConfig;
  readonly wizard?: WizardConfig;
  readonly analytics?: AnalyticsConfig;
  readonly offlineQueue?: OfflineQueueConfig;
  readonly keyboard?: readonly KeyboardShortcutConfig[];
}

export interface SubmissionQueueState {
  readonly pending: number;
  readonly flushing: boolean;
}

export interface SetValueOptions {
  readonly recordHistory?: boolean;
  readonly markDirty?: boolean;
}

export interface SubmitOptions {
  readonly preventDoubleSubmit?: boolean;
  readonly includeDiff?: boolean;
  readonly retry?: import("../submission/retry.js").RetryPolicy | number;
}

/** Submit lifecycle phase (Phase 10). `isSubmitting` remains the boolean loading flag. */
export type SubmitPhase = "idle" | "validating" | "submitting" | "success" | "error";

export type FormChangeType = "added" | "removed" | "changed" | "unchanged" | "moved";

export interface FormChangeRecord {
  readonly path: string;
  readonly type: FormChangeType;
  readonly previous?: unknown;
  readonly current?: unknown;
  /** Present when `type` is `moved` (source path). */
  readonly from?: string;
}

export interface FormDiffMetadata {
  readonly durationMs: number;
  readonly changeCount: number;
  readonly addedCount: number;
  readonly removedCount: number;
  readonly changedCount: number;
  readonly unchangedCount: number;
  readonly movedCount: number;
}

export interface FormDiffResult {
  readonly changes: readonly FormChangeRecord[];
  readonly hasChanges: boolean;
  readonly metadata: FormDiffMetadata;
}

export interface FormDiffOptions {
  readonly maxDepth?: number;
  readonly includeUnchanged?: boolean;
  readonly treatUndefinedAsMissing?: boolean;
}

export interface SubmitMeta {
  readonly changedFields?: readonly FieldPath[];
  readonly diff?: FormDiffResult;
  readonly signal?: AbortSignal;
}

export interface ValidateOptions {
  readonly paths?: readonly FieldPath[];
  readonly mode?: ValidationMode;
}

export interface ResetOptions<TValues extends Record<string, unknown>> {
  readonly values?: Partial<TValues>;
  readonly keepDirty?: boolean;
}

/**
 * State listener for `createForm({ subscribe })`. Receives the form instance.
 * Lives until `form.destroy()` — use `form.subscribe()` when you need unsubscribe.
 */
export type FormSubscribeListener<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> = (form: FormInstance<TValues>) => void;

export interface FormConfig<TValues extends Record<string, unknown>> {
  readonly initialValues?: TValues;
  readonly target?: string | HTMLElement;
  readonly form?: string | HTMLElement;
  readonly schema?: Partial<Record<FieldPath, FieldSchemaDefinition>> | SchemaAdapter;
  readonly onSubmit?: (values: TValues, meta?: SubmitMeta) => void | Promise<void>;
  readonly onSubmitError?: (error: unknown) => void;
  /**
   * Receives isolated plugin/hook failures (setup, hooks, destroy).
   * Does not rethrow — form continues per Phase 15 isolation policy.
   */
  readonly onPluginError?: import("../plugins/compat.js").PluginErrorHandler;
  readonly validateOn?: ValidationMode;
  readonly validators?: Partial<
    Record<FieldPath, Validator<TValues> | readonly Validator<TValues>[]>
  >;
  readonly crossFieldValidators?: readonly import("../validation/cross-field.js").CrossFieldRule<TValues>[];
  readonly formValidators?: readonly import("../validation/cross-field.js").CrossFieldValidator<TValues>[];
  readonly workflow?: WorkflowConfig;
  readonly autoSave?: AutosaveConfig & { readonly every?: string };
  readonly wizard?: boolean | WizardConfig;
  readonly rules?: readonly FormRuleInput<TValues>[];
  /**
   * Plugins registered at create time (same as calling `form.use(plugin)` for each entry, in order).
   * Prefer this for declarative setup; use `form.use()` later for conditional or late registration.
   */
  readonly plugins?: readonly FormPlugin<TValues>[];
  /**
   * State listeners registered at create time (same store as `form.subscribe()`).
   * Pass one listener or an array. Each receives the form instance, is invoked once after
   * create (so UI can sync immediately), then on every state notify. Lives until
   * `form.destroy()`. Prefer framework adapters for React/Vue; use this for vanilla / host UI.
   */
  readonly subscribe?: FormSubscribeListener<TValues> | readonly FormSubscribeListener<TValues>[];
  /**
   * Explicit dependency map: child → parent(s).
   * Cycles throw `ConfigurationError` at registration (ADR-007).
   */
  readonly dependencies?: import("../engines/dependency/types.js").DependencyMap;
  /** Per-child action overrides for `dependencies` (default `["clear","revalidate"]`). */
  readonly dependencyActions?: Partial<
    Record<FieldPath, readonly import("../engines/dependency/types.js").DependencyAction[]>
  >;
}

export interface FieldState {
  readonly touched: boolean;
  readonly dirty: boolean;
  readonly visited: boolean;
  readonly changed: boolean;
}

export interface FormState<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly errors: Readonly<Record<FieldPath, string>>;
  readonly touched: Readonly<Record<FieldPath, boolean>>;
  readonly dirty: Readonly<Record<FieldPath, boolean>>;
  readonly visited: Readonly<Record<FieldPath, boolean>>;
  readonly changed: Readonly<Record<FieldPath, boolean>>;
  readonly isSubmitting: boolean;
  readonly isValidating: boolean;
  readonly isValid: boolean;
  readonly isDirty: boolean;
  readonly isChanged: boolean;
  readonly submitCount: number;
  /** Last / current submit lifecycle phase. */
  readonly submitPhase: SubmitPhase;
  readonly workflow: WorkflowState;
  readonly fieldUi: FieldUiMap;
  readonly formUi: FormUiState;
  readonly fieldMeta: Readonly<Record<FieldPath, FieldMetaState>>;
  readonly fieldOptions: Readonly<Record<FieldPath, readonly FieldOption[]>>;
  readonly submissionQueue: SubmissionQueueState;
}

export interface WorkflowState {
  readonly currentStep: number;
  readonly totalSteps: number;
  readonly canGoNext: boolean;
  readonly canGoPrev: boolean;
  readonly progress: number;
  readonly isAutosaving: boolean;
  readonly lastAutosaveAt: number | null;
}

export type FormSelector<TValues extends Record<string, unknown>, TSelected> = (
  state: FormState<TValues>,
) => TSelected;

/** Durable form checkpoint — distinct from `getSnapshot()` (external-store identity). */
export interface FormCheckpoint<TValues extends Record<string, unknown> = Record<string, unknown>> {
  readonly version: 1;
  readonly kind: "checkpoint";
  readonly capturedAt: number;
  readonly values: TValues;
  readonly errors?: Readonly<Record<FieldPath, string>>;
  readonly touched?: Readonly<Record<FieldPath, boolean>>;
  readonly dirty?: Readonly<Record<FieldPath, boolean>>;
  readonly visited?: Readonly<Record<FieldPath, boolean>>;
  readonly fieldUi?: FieldUiMap;
  readonly workflow?: { readonly currentStep: number };
}

export interface CreateCheckpointOptions {
  readonly include?: readonly (
    "values" | "errors" | "touched" | "dirty" | "visited" | "fieldUi" | "workflow"
  )[];
}

export interface RestoreCheckpointOptions {
  readonly recordHistory?: boolean;
  readonly restoreMeta?: boolean;
}

export interface FormInstance<TValues extends Record<string, unknown>> {
  readonly id: string;
  readonly ref: FormRef;
  field(path: FieldPath, options?: FieldOptions<TValues>): FieldHandle<TValues>;
  /** First path with a non-empty error (stable key order). */
  firstInvalidPath(): FieldPath | undefined;
  /**
   * Focus first invalid control when `document` exists; SSR-safe no-op.
   * Returns the focused path or `undefined`.
   */
  focusFirstInvalid(): FieldPath | undefined;
  pushField(arrayPath: FieldPath, item?: unknown): FieldPath;
  removeField(arrayPath: FieldPath, index: number): void;
  insertField(arrayPath: FieldPath, index: number, item?: unknown): FieldPath;
  submit(options?: SubmitOptions): Promise<boolean>;
  cancelSubmit(): void;
  /**
   * Register onion middleware for submit/validate phases.
   * Same stack as plugin hooks — see `MIDDLEWARE_HOOK_MAP`.
   */
  useMiddleware(
    middleware: import("../plugins/middleware.js").MiddlewareInput<TValues>,
  ): () => void;
  reset(options?: ResetOptions<TValues>): void;
  validate(options?: ValidateOptions): Promise<boolean>;
  values(): TValues;
  values(path: FieldPath): unknown;
  get(path: FieldPath): unknown;
  errors(path?: FieldPath): string | undefined | Readonly<Record<FieldPath, string>>;
  setValue(path: FieldPath, value: unknown, options?: SetValueOptions): void;
  setError(path: FieldPath, message: string): void;
  clearErrors(path?: FieldPath): void;
  getFieldState(path: FieldPath): FieldState;
  getFieldMeta(path: FieldPath): FieldMetaState;
  /** Current form snapshot — same as `getFormState()`. */
  readonly state: FormState<TValues>;
  getFormState(): FormState<TValues>;
  /** For `useSyncExternalStore(form.subscribe, form.getSnapshot)`. Not a durable checkpoint. */
  getSnapshot(): FormState<TValues>;
  /** Per-path presentation (field UI + options + form UI). */
  getPresentation(path: FieldPath): import("../engines/presentation/resolve.js").PresentationState;
  /** Full presentation maps (same sources as `state.fieldUi` / `formUi` / `fieldOptions`). */
  getPresentation(): import("../engines/presentation/resolve.js").PresentationSnapshot;
  /** Durable checkpoint for undo/restore flows — see `restoreCheckpoint`. */
  createCheckpoint(options?: CreateCheckpointOptions): FormCheckpoint<TValues>;
  restoreCheckpoint(checkpoint: FormCheckpoint<TValues>, options?: RestoreCheckpointOptions): void;
  getValues(): TValues;
  getErrors(): Readonly<Record<FieldPath, string>>;
  isValid(): boolean;
  isSubmitting(): boolean;
  isDirty(): boolean;
  changedFields(): readonly FieldPath[];
  changedSinceSubmitFields(): readonly FieldPath[];
  diffFromDefaults(options?: FormDiffOptions): Promise<FormDiffResult>;
  diffFrom(baseline: Record<string, unknown>, options?: FormDiffOptions): Promise<FormDiffResult>;
  when(field: FieldPath): WhenRuleBuilder<TValues>;
  /** Register explicit dependency map (fail-fast on cycles). */
  dependencies(map: import("../engines/dependency/types.js").DependencyMap): void;
  /** Fluent dependency registrar + `inspect()`. */
  dependencies(): import("../engines/dependency/registrar.js").DependencyRegistrar<TValues>;
  /** Fluent derived field: `form.calculate("total").from("price","qty").compute(...)`. */
  calculate(path: FieldPath): import("../engines/calculation/index.js").CalculationBuilder<TValues>;
  calculate(
    path: FieldPath,
    options: CalculateOptions<TValues> | ((context: { values: TValues }) => unknown),
  ): void;
  /** Register inbound transform stages for a path. */
  transform(path: FieldPath): import("../engines/transform/types.js").TransformPipelineHandle;
  transform(
    path: FieldPath,
    stages: readonly import("../engines/transform/types.js").TransformFn<TValues>[],
  ): void;
  saveDraft(): void;
  /**
   * Restore persisted draft into the live form (after mount).
   * Returns `true` when values were applied; `false` when skipped
   * (disabled / empty / declined / dirty without `force` / corrupt).
   */
  restoreDraft(options?: RestoreDraftOptions): Promise<boolean>;
  undo(): boolean;
  redo(): boolean;
  getAnalytics(): FormAnalyticsSnapshot;
  flushOfflineQueue(): Promise<{ flushed: number; failed: number }>;
  use(plugin: FormPlugin<TValues>): void;
  use<TSelected>(selector: FormSelector<TValues, TSelected>): TSelected;
  /** Registered plugins (name / order / version) for DevTools introspection. */
  listPlugins(): readonly {
    readonly name: string;
    readonly order: number;
    readonly version?: string;
  }[];
  /**
   * Advanced: reactive UI updates. Framework adapters call this internally.
   * For declarative create-time listeners, prefer `createForm({ subscribe })`.
   */
  subscribe(listener: () => void): () => void;
  on(event: FormEvent, listener: () => void): () => void;
  destroy(): void;
  registerPlugin(plugin: FormPlugin<TValues>): void;
  workflow: {
    next(): Promise<boolean>;
    prev(): void;
    goTo(
      step: number | string,
      options?: import("../workflow/wizard.js").GoToOptions,
    ): Promise<boolean>;
    getStepGraph(): import("../engines/workflow/types.js").WizardStepGraph;
    visibleSteps(values?: TValues): readonly string[];
  };
}

export interface FormPluginSetupResult {
  readonly onDestroy?: () => void;
}

export interface FormPlugin<TValues extends Record<string, unknown> = Record<string, unknown>> {
  readonly name: string;
  /** Plugin package/semver label (metadata only). */
  readonly version?: string;
  /**
   * Semver range against `@jayoncode/form-intelligent`
   * (`>=3.1.0`, `^3.1.0`, or exact). Checked at `register`/`use`.
   */
  readonly engines?: string;
  readonly order?: number;
  setup(
    form: FormInstance<TValues>,
    api: import("../plugins/hooks.js").FormPluginApi<TValues>,
  ): void | (() => void) | FormPluginSetupResult;
}
