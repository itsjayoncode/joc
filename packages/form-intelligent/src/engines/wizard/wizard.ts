import { listVisibleStepIndexes, wizardStepId } from "./graph.js";
import { WorkflowError } from "../workflow/errors.js";

import type { WizardConfig, WizardStep } from "../workflow/types.js";

export function resolveWizardState(
  stepIndex: number,
  config: WizardConfig | undefined,
  values: Record<string, unknown> = {},
): {
  currentStep: number;
  totalSteps: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  progress: number;
} {
  const totalConfigured = config?.steps.length ?? 1;
  const visible = config ? listVisibleStepIndexes(config, values) : [0];
  const totalSteps = Math.max(visible.length, 1);
  const currentStep = Math.min(Math.max(stepIndex, 0), Math.max(totalConfigured - 1, 0));
  const visiblePosition = visible.indexOf(currentStep);
  const progressIndex = visiblePosition >= 0 ? visiblePosition : currentStep;

  return {
    currentStep,
    totalSteps,
    canGoPrev: visible.some((index) => index < currentStep),
    canGoNext: visible.some((index) => index > currentStep),
    progress:
      totalSteps <= 1
        ? 100
        : Math.min(100, Math.max(0, Math.round(((progressIndex + 1) / totalSteps) * 100))),
  };
}

export function getStepFields(step: WizardStep | undefined): string[] {
  return step?.fields ? [...step.fields] : [];
}

export function assertStepIndex(step: number, config: WizardConfig | undefined): void {
  if (!config) {
    throw new WorkflowError("Wizard workflow is not configured.");
  }

  if (step < 0 || step >= config.steps.length) {
    throw new WorkflowError(`Wizard step ${String(step)} is out of range.`);
  }
}

export function assertStepTarget(step: number | string, config: WizardConfig | undefined): number {
  if (!config) {
    throw new WorkflowError("Wizard workflow is not configured.");
  }

  if (typeof step === "number") {
    assertStepIndex(step, config);
    return step;
  }

  const index = config.steps.findIndex((entry, i) => wizardStepId(entry, i) === step);
  if (index < 0) {
    throw new WorkflowError(`Wizard step "${step}" was not found.`);
  }
  return index;
}
