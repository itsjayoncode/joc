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
  WizardStep,
} from "../engines/workflow/types.js";

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
}

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
  setValue(value: unknown): void;
  setTouched(touched?: boolean): void;
  setVisited(visited?: boolean): void;
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
}

export interface AnalyticsConfig {
  readonly enabled?: boolean;
}

export interface OfflineQueueConfig {
  readonly enabled?: boolean;
  readonly storageKey?: string;
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

export interface FormAnalyticsSnapshot {
  readonly startedAt: number;
  readonly completedAt: number | null;
  readonly errorCount: number;
  readonly errorsByField: Readonly<Record<FieldPath, number>>;
  readonly abandonedAt: number | null;
  readonly currentStep: number;
  readonly fieldViews: Readonly<Record<FieldPath, number>>;
  readonly dropOffField: FieldPath | null;
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

export type FormChangeType = "added" | "removed" | "changed" | "unchanged";

export interface FormChangeRecord {
  readonly path: string;
  readonly type: FormChangeType;
  readonly previous?: unknown;
  readonly current?: unknown;
}

export interface FormDiffMetadata {
  readonly durationMs: number;
  readonly changeCount: number;
  readonly addedCount: number;
  readonly removedCount: number;
  readonly changedCount: number;
  readonly unchangedCount: number;
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

export interface FormConfig<TValues extends Record<string, unknown>> {
  readonly initialValues?: TValues;
  readonly target?: string | HTMLElement;
  readonly form?: string | HTMLElement;
  readonly schema?: Partial<Record<FieldPath, FieldSchemaDefinition>> | SchemaAdapter;
  readonly onSubmit?: (values: TValues, meta?: SubmitMeta) => void | Promise<void>;
  readonly onSubmitError?: (error: unknown) => void;
  readonly validateOn?: ValidationMode;
  readonly validators?: Partial<
    Record<FieldPath, Validator<TValues> | readonly Validator<TValues>[]>
  >;
  readonly crossFieldValidators?: readonly import("../validation/cross-field.js").CrossFieldRule<TValues>[];
  readonly formValidators?: readonly import("../validation/cross-field.js").CrossFieldValidator<TValues>[];
  readonly workflow?: WorkflowConfig;
  readonly autoSave?: AutosaveConfig & { readonly every?: string };
  readonly wizard?: boolean | WizardConfig;
  readonly rules?: readonly FormRuleDefinition<TValues>[];
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

export interface FormInstance<TValues extends Record<string, unknown>> {
  readonly id: string;
  readonly ref: FormRef;
  field(path: FieldPath, options?: FieldOptions<TValues>): FieldHandle<TValues>;
  pushField(arrayPath: FieldPath, item?: unknown): FieldPath;
  removeField(arrayPath: FieldPath, index: number): void;
  insertField(arrayPath: FieldPath, index: number, item?: unknown): FieldPath;
  submit(options?: SubmitOptions): Promise<boolean>;
  cancelSubmit(): void;
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
  /** For `useSyncExternalStore(form.subscribe, form.getSnapshot)`. */
  getSnapshot(): FormState<TValues>;
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
  calculate(
    path: FieldPath,
    options: CalculateOptions<TValues> | ((context: { values: TValues }) => unknown),
  ): void;
  saveDraft(): void;
  undo(): boolean;
  redo(): boolean;
  getAnalytics(): FormAnalyticsSnapshot;
  flushOfflineQueue(): Promise<{ flushed: number; failed: number }>;
  use(plugin: FormPlugin<TValues>): void;
  use<TSelected>(selector: FormSelector<TValues, TSelected>): TSelected;
  /** Advanced: reactive UI updates. Framework adapters call this internally. */
  subscribe(listener: () => void): () => void;
  on(event: FormEvent, listener: () => void): () => void;
  destroy(): void;
  registerPlugin(plugin: FormPlugin<TValues>): void;
  workflow: {
    next(): Promise<boolean>;
    prev(): void;
    goTo(step: number): Promise<boolean>;
  };
}

export interface FormPluginSetupResult {
  readonly onDestroy?: () => void;
}

export interface FormPlugin<TValues extends Record<string, unknown> = Record<string, unknown>> {
  readonly name: string;
  readonly order?: number;
  setup(
    form: FormInstance<TValues>,
    api: import("../plugins/hooks.js").FormPluginApi<TValues>,
  ): void | (() => void) | FormPluginSetupResult;
}
