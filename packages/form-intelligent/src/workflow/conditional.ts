export {
  evaluateFormRules,
  runCalculations,
  extractDepsFromValues,
  when,
  WhenRuleBuilder,
  WorkflowError,
} from "../engines/workflow/index.js";
export type {
  CalculateOptions,
  CalculationDefinition,
  FieldOption,
  FieldUiMap,
  FieldUiState,
  FormRuleDefinition,
  FormUiState,
  RuleContext,
} from "../engines/workflow/index.js";

import { evaluateFormRules } from "../engines/workflow/index.js";

import type {
  FieldPath,
  FieldUiMap,
  FormRuleDefinition,
  FormUiState,
} from "../engines/workflow/types.js";

export interface ConditionalEvaluationContext<TValues extends Record<string, unknown>> {
  readonly rules: readonly FormRuleDefinition<TValues>[];
  readonly values: TValues;
  readonly fieldPaths: readonly FieldPath[];
  readonly setValue: (path: FieldPath, value: unknown) => void;
}

export function evaluateConditionalUi<TValues extends Record<string, unknown>>(
  context: ConditionalEvaluationContext<TValues>,
): { readonly fieldUi: FieldUiMap; readonly formUi: FormUiState } {
  return evaluateFormRules(context);
}
