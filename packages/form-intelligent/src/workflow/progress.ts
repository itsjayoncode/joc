import { resolveWizardState } from "../engines/wizard/index.js";

import type { WizardConfig, WorkflowState } from "../types/index.js";

export interface WorkflowProgressInput {
  readonly currentStep: number;
  readonly wizard?: WizardConfig | undefined;
  readonly isAutosaving: boolean;
  readonly lastAutosaveAt: number | null;
}

export function buildWorkflowProgress(input: WorkflowProgressInput): WorkflowState {
  const wizard = resolveWizardState(input.currentStep, input.wizard);
  return {
    currentStep: wizard.currentStep,
    totalSteps: wizard.totalSteps,
    canGoNext: wizard.canGoNext,
    canGoPrev: wizard.canGoPrev,
    progress: wizard.progress,
    isAutosaving: input.isAutosaving,
    lastAutosaveAt: input.lastAutosaveAt,
  };
}
