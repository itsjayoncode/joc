export type FieldPath = string;

export interface FieldUiState {
  visible: boolean;
  disabled: boolean;
  required: boolean | undefined;
  /** Additive — when true, controls should be non-editable but still focusable. */
  readOnly?: boolean;
  /** Additive — e.g. async option load / validating. */
  busy?: boolean;
}

export interface FormUiState {
  readonly submitDisabled: boolean;
}

export interface FieldOption {
  readonly label: string;
  readonly value: string;
}

export interface RuleContext<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  show(...paths: readonly string[]): void;
  hide(...paths: readonly string[]): void;
  require(...paths: readonly string[]): void;
  optional(...paths: readonly string[]): void;
  enable(...paths: readonly string[]): void;
  disable(...paths: readonly string[]): void;
  disableSubmit(): void;
  enableSubmit(): void;
  setValue(path: string, value: unknown): void;
}

export interface FormRuleDefinition<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly watch: string;
  readonly equals?: unknown;
  readonly notEquals?: unknown;
  readonly greaterThan?: number;
  readonly lessThan?: number;
  readonly show?: readonly string[];
  readonly hide?: readonly string[];
  readonly require?: readonly string[];
  readonly optional?: readonly string[];
  readonly enable?: readonly string[];
  readonly disable?: readonly string[];
  readonly disableSubmit?: boolean;
  readonly changes?: (
    value: unknown,
    values: TValues,
  ) => readonly FieldOption[] | Promise<readonly FieldOption[]>;
  readonly populate?: string;
  readonly then?: (context: RuleContext<TValues>) => void;
}

export type FieldUiMap = Readonly<Record<string, FieldUiState>>;

export interface WizardStep {
  readonly id?: string;
  readonly fields?: readonly FieldPath[];
  readonly validate?: boolean;
  /** Skip this step when predicate returns false (conditional steps MVP). */
  readonly when?: (values: Record<string, unknown>) => boolean;
  /** Explicit next step id, or resolver from values. */
  readonly next?: string | ((values: Record<string, unknown>) => string | undefined);
  readonly canLeave?: (ctx: WizardGuardContext) => boolean | Promise<boolean>;
  readonly canEnter?: (ctx: WizardGuardContext) => boolean | Promise<boolean>;
}

export interface WizardGuardContext<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly values: TValues;
  readonly fromStepId: string | undefined;
  readonly toStepId: string;
  readonly signal: AbortSignal;
}

/** Validation scope for `workflow.goTo`. Default `"all"` preserves SHIPPED behavior. */
export type WizardNavigateValidation = "step" | "all" | "none";

export type { CalculateOptions } from "../calculation/index.js";

export interface WizardConfig {
  readonly steps: readonly WizardStep[];
  readonly initialStep?: number;
  /**
   * Default validation for `goTo`.
   * - `all` — validate entire form (SHIPPED default)
   * - `step` — validate current step fields only
   * - `none` — skip validation
   */
  readonly goToValidation?: WizardNavigateValidation;
  /** When true, draft save/restore includes `currentStep`. */
  readonly persistStepInDraft?: boolean;
}

export interface WizardStepGraphNode {
  readonly id: string;
  readonly index: number;
  readonly nextIds: readonly string[];
}

export interface WizardStepGraph {
  readonly nodes: readonly WizardStepGraphNode[];
}
