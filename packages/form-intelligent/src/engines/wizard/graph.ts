import type {
  WizardConfig,
  WizardStep,
  WizardStepGraph,
  WizardStepGraphNode,
} from "../workflow/types.js";

export function wizardStepId(step: WizardStep | undefined, index: number): string {
  return step?.id ?? `step-${index}`;
}

export function findStepIndex(config: WizardConfig, step: number | string): number {
  if (typeof step === "number") {
    return step;
  }

  const byId = config.steps.findIndex((entry, index) => wizardStepId(entry, index) === step);
  return byId;
}

export function isStepVisible(
  step: WizardStep | undefined,
  values: Record<string, unknown>,
): boolean {
  if (!step?.when) {
    return true;
  }
  return step.when(values);
}

export function listVisibleStepIndexes(
  config: WizardConfig,
  values: Record<string, unknown>,
): readonly number[] {
  const visible: number[] = [];
  for (let index = 0; index < config.steps.length; index += 1) {
    if (isStepVisible(config.steps[index], values)) {
      visible.push(index);
    }
  }
  return visible;
}

export function resolveNextStepIndex(
  config: WizardConfig,
  currentIndex: number,
  values: Record<string, unknown>,
): number | null {
  const current = config.steps[currentIndex];
  if (current?.next) {
    const targetId = typeof current.next === "function" ? current.next(values) : current.next;
    if (targetId) {
      const targetIndex = findStepIndex(config, targetId);
      if (
        targetIndex >= 0 &&
        targetIndex < config.steps.length &&
        isStepVisible(config.steps[targetIndex], values)
      ) {
        return targetIndex;
      }
      return null;
    }
  }

  for (let index = currentIndex + 1; index < config.steps.length; index += 1) {
    if (isStepVisible(config.steps[index], values)) {
      return index;
    }
  }
  return null;
}

export function resolvePrevStepIndex(
  config: WizardConfig,
  currentIndex: number,
  values: Record<string, unknown>,
): number | null {
  for (let index = currentIndex - 1; index >= 0; index -= 1) {
    if (isStepVisible(config.steps[index], values)) {
      return index;
    }
  }
  return null;
}

export function getStepGraph(config: WizardConfig): WizardStepGraph {
  const nodes: WizardStepGraphNode[] = config.steps.map((step, index) => {
    const id = wizardStepId(step, index);
    const nextIds: string[] = [];

    if (typeof step.next === "string") {
      nextIds.push(step.next);
    } else if (typeof step.next === "function") {
      // Dynamic edges are not static — point at linear successors for inspection.
      const linear = resolveNextStepIndex(config, index, {});
      if (linear !== null) {
        nextIds.push(wizardStepId(config.steps[linear], linear));
      }
    } else {
      const linear = resolveNextStepIndex(config, index, {});
      if (linear !== null) {
        nextIds.push(wizardStepId(config.steps[linear], linear));
      }
    }

    return { id, index, nextIds };
  });

  return { nodes };
}

export function listVisibleStepIds(
  config: WizardConfig,
  values: Record<string, unknown>,
): readonly string[] {
  return listVisibleStepIndexes(config, values).map((index) =>
    wizardStepId(config.steps[index], index),
  );
}
