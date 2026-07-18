import type { WizardConfig, WizardStep } from "../engines/workflow/types.js";

export function resolveWizardState(
  stepIndex: number,
  config: WizardConfig | undefined,
): {
  currentStep: number;
  totalSteps: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  progress: number;
} {
  const totalSteps = config?.steps.length ?? 1;
  const currentStep = Math.min(Math.max(stepIndex, 0), Math.max(totalSteps - 1, 0));

  return {
    currentStep,
    totalSteps,
    canGoPrev: currentStep > 0,
    canGoNext: currentStep < totalSteps - 1,
    progress: totalSteps <= 1 ? 100 : Math.round(((currentStep + 1) / totalSteps) * 100),
  };
}

export function getStepFields(step: WizardStep | undefined): string[] {
  return step?.fields ? [...step.fields] : [];
}
