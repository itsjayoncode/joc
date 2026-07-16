export type FieldPath = string;

export interface FieldUiState {
  visible: boolean;
  disabled: boolean;
  required: boolean | undefined;
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
  readonly id: string;
  readonly fields?: readonly FieldPath[];
  readonly validate?: boolean;
}

export interface WizardConfig {
  readonly steps: readonly WizardStep[];
  readonly initialStep?: number;
}

export interface CalculateOptions<TValues extends Record<string, unknown>> {
  readonly deps?: readonly FieldPath[];
  readonly markDirty?: boolean;
  readonly compute: (context: { values: TValues }) => unknown;
}
