export type FieldPath = string;

export type ValidationMode = "onChange" | "onBlur" | "onSubmit" | "onTouched";

export type FormEvent =
  "change" | "blur" | "focus" | "reset" | "submit" | "validate" | "autosave" | "draft";

export type ValidatorResult = true | string | undefined;

export interface ValidationContext<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly path: FieldPath;
}

export type Validator<TValues extends Record<string, unknown> = Record<string, unknown>> = (
  value: unknown,
  context: ValidationContext<TValues>,
) => ValidatorResult | Promise<ValidatorResult>;

export interface FieldOptions<TValues extends Record<string, unknown>> {
  readonly defaultValue?: unknown;
  readonly validators?: readonly Validator<TValues>[];
  readonly validateOn?: ValidationMode;
  readonly format?: Formatter;
  readonly parse?: Parser;
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

export type Formatter = (value: unknown) => unknown;
export type Parser = (value: unknown) => unknown;

export interface AutosaveConfig {
  readonly enabled?: boolean;
  readonly debounceMs?: number;
  readonly onSave: (values: Record<string, unknown>) => void | Promise<void>;
}

export interface DraftConfig {
  readonly enabled?: boolean;
  readonly storageKey?: string;
  readonly onRestore?: (values: Record<string, unknown>) => void;
}

export interface WizardStep {
  readonly id: string;
  readonly fields?: readonly FieldPath[];
  readonly validate?: boolean;
}

export interface WizardConfig {
  readonly steps: readonly WizardStep[];
  readonly initialStep?: number;
}

export interface WorkflowConfig {
  readonly autosave?: AutosaveConfig;
  readonly draft?: DraftConfig;
  readonly wizard?: WizardConfig;
}

export interface SubmitOptions {
  readonly preventDoubleSubmit?: boolean;
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
  readonly initialValues: TValues;
  readonly onSubmit?: (values: TValues) => void | Promise<void>;
  readonly onSubmitError?: (error: unknown) => void;
  readonly validateOn?: ValidationMode;
  readonly validators?: Partial<
    Record<FieldPath, Validator<TValues> | readonly Validator<TValues>[]>
  >;
  readonly workflow?: WorkflowConfig;
}

export interface FieldState {
  readonly touched: boolean;
  readonly dirty: boolean;
  readonly visited: boolean;
}

export interface FormState<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly errors: Readonly<Record<FieldPath, string>>;
  readonly touched: Readonly<Record<FieldPath, boolean>>;
  readonly dirty: Readonly<Record<FieldPath, boolean>>;
  readonly visited: Readonly<Record<FieldPath, boolean>>;
  readonly isSubmitting: boolean;
  readonly isValidating: boolean;
  readonly isValid: boolean;
  readonly submitCount: number;
  readonly workflow: WorkflowState;
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
  field(path: FieldPath, options?: FieldOptions<TValues>): FieldHandle<TValues>;
  submit(options?: SubmitOptions): Promise<boolean>;
  reset(options?: ResetOptions<TValues>): void;
  validate(options?: ValidateOptions): Promise<boolean>;
  values(): TValues;
  values(path: FieldPath): unknown;
  errors(path?: FieldPath): string | undefined | Readonly<Record<FieldPath, string>>;
  setValue(path: FieldPath, value: unknown): void;
  setError(path: FieldPath, message: string): void;
  clearErrors(path?: FieldPath): void;
  getFieldState(path: FieldPath): FieldState;
  getFormState(): FormState<TValues>;
  use<TSelected>(selector: FormSelector<TValues, TSelected>): TSelected;
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

export interface FormPlugin<TValues extends Record<string, unknown> = Record<string, unknown>> {
  readonly name: string;
  setup(form: FormInstance<TValues>): (() => void) | undefined;
}

export interface SchemaAdapter {
  readonly validate: (
    values: Record<string, unknown>,
  ) => Promise<Readonly<Record<FieldPath, string>>> | Readonly<Record<FieldPath, string>>;
}
