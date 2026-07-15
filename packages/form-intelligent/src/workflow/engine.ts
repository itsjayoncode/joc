import { WorkflowError } from "../errors/index.js";

import type { WizardConfig, WizardStep } from "../types/index.js";

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

export function assertStepIndex(step: number, config: WizardConfig | undefined): void {
  if (!config) {
    throw new WorkflowError("Wizard workflow is not configured.");
  }

  if (step < 0 || step >= config.steps.length) {
    throw new WorkflowError(`Wizard step ${String(step)} is out of range.`);
  }
}

export function loadDraft(storageKey: string): Record<string, unknown> | null {
  if (typeof localStorage === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function saveDraft(storageKey: string, values: Record<string, unknown>): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(values));
}

export function clearDraft(storageKey: string): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.removeItem(storageKey);
}
