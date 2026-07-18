export { AutosaveScheduler } from "./autosave.js";
export type { AutosaveHooks } from "./autosave.js";
export { clearDraft, DraftManager, loadDraft, resolveDraftStorage, saveDraft } from "./drafts.js";
export type { DraftRestoreResult } from "./drafts.js";
export { assertStepIndex, getStepFields, resolveWizardState, WizardNavigator } from "./wizard.js";
export type { WizardNavigatorOptions, GoToOptions } from "./wizard.js";
export type {
  WizardConfig,
  WizardStep,
  WizardGuardContext,
  WizardNavigateValidation,
  WizardStepGraph,
  WizardStepGraphNode,
} from "../engines/workflow/types.js";
export {
  evaluateConditionalUi,
  evaluateFormRules,
  extractDepsFromValues,
  runCalculations,
  when,
  WhenRuleBuilder,
  WorkflowError,
  RULE_EVALUATION_ORDER,
} from "./conditional.js";
export type {
  CalculateOptions,
  CalculationDefinition,
  ConditionalEvaluationContext,
  FieldOption,
  FieldUiMap,
  FieldUiState,
  FormRuleDefinition,
  FormUiState,
  RuleContext,
  RuleEvaluationOrder,
} from "./conditional.js";
export {
  buildFieldDependencyGraph,
  collectDependentFieldPaths,
  runDependencyRules,
} from "./dependencies.js";
export { buildWorkflowProgress } from "./progress.js";
export type { WorkflowProgressInput } from "./progress.js";
export {
  createHistoryModule,
  createStateHistory,
  HistoryService,
  UndoRedoController,
  ValueHistoryStack,
} from "./undo-redo.js";
// browser-lifecycle plugin lives on `/plugins` — do not re-export here (keeps core-login tree-shakeable).
