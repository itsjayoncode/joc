export {
  assertStepIndex,
  assertStepTarget,
  getStepFields,
  getStepGraph,
  listVisibleStepIds,
  resolveWizardState,
} from "../engines/wizard/index.js";

import {
  assertStepTarget,
  getStepFields,
  getStepGraph as buildStepGraph,
  isStepVisible,
  listVisibleStepIds,
  resolveNextStepIndex,
  resolvePrevStepIndex,
  wizardStepId,
} from "../engines/wizard/index.js";
import { listAllPaths } from "../validation/pipeline.js";

import type { WizardGuardContext } from "../engines/workflow/types.js";
import type {
  ValidateOptions,
  WizardConfig,
  WizardNavigateValidation,
  WizardStepGraph,
} from "../types/index.js";

export interface GoToOptions {
  readonly validate?: WizardNavigateValidation;
}

export interface WizardNavigatorOptions<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly getWizard: () => WizardConfig | undefined;
  readonly getCurrentStep: () => number;
  readonly setStep: (step: number) => void;
  readonly getValues: () => TValues;
  readonly validate: (options?: ValidateOptions) => Promise<boolean>;
}

export class WizardNavigator<TValues extends Record<string, unknown> = Record<string, unknown>> {
  public constructor(private readonly options: WizardNavigatorOptions<TValues>) {}

  public async next(): Promise<boolean> {
    const wizard = this.options.getWizard();
    if (!wizard) {
      return false;
    }

    const currentIndex = this.options.getCurrentStep();
    const values = this.options.getValues();
    const targetIndex = resolveNextStepIndex(wizard, currentIndex, values);
    if (targetIndex === null) {
      return false;
    }

    const current = wizard.steps[currentIndex];
    if (current?.validate !== false) {
      const valid = await this.options.validate({
        paths: getStepFields(current),
        mode: "onSubmit",
      });
      if (!valid) {
        return false;
      }
    }

    return this.transitionTo(targetIndex);
  }

  public prev(): void {
    const wizard = this.options.getWizard();
    if (!wizard) {
      return;
    }

    const targetIndex = resolvePrevStepIndex(
      wizard,
      this.options.getCurrentStep(),
      this.options.getValues(),
    );
    if (targetIndex === null) {
      return;
    }

    void this.transitionTo(targetIndex, { skipLeaveValidate: true });
  }

  public async goTo(step: number | string, options: GoToOptions = {}): Promise<boolean> {
    const wizard = this.options.getWizard();
    const targetIndex = assertStepTarget(step, wizard);
    if (!wizard) {
      return false;
    }

    const values = this.options.getValues();
    if (!isStepVisible(wizard.steps[targetIndex], values)) {
      return false;
    }

    const mode = options.validate ?? wizard.goToValidation ?? "all";
    if (mode === "all") {
      const valid = await this.options.validate({
        mode: "onSubmit",
        paths: listAllPaths(values),
      });
      if (!valid) {
        return false;
      }
    } else if (mode === "step") {
      const current = wizard.steps[this.options.getCurrentStep()];
      const valid = await this.options.validate({
        paths: getStepFields(current),
        mode: "onSubmit",
      });
      if (!valid) {
        return false;
      }
    }

    return this.transitionTo(targetIndex);
  }

  public getStepGraph(): WizardStepGraph {
    const wizard = this.options.getWizard();
    if (!wizard) {
      return { nodes: [] };
    }
    return buildStepGraph(wizard);
  }

  public visibleSteps(values?: TValues): readonly string[] {
    const wizard = this.options.getWizard();
    if (!wizard) {
      return [];
    }
    return listVisibleStepIds(wizard, values ?? this.options.getValues());
  }

  private async transitionTo(
    targetIndex: number,
    options: { readonly skipLeaveValidate?: boolean } = {},
  ): Promise<boolean> {
    const wizard = this.options.getWizard();
    if (!wizard) {
      return false;
    }

    const fromIndex = this.options.getCurrentStep();
    if (fromIndex === targetIndex) {
      return true;
    }

    const values = this.options.getValues();
    const fromStep = wizard.steps[fromIndex];
    const toStep = wizard.steps[targetIndex];
    const signal = new AbortController().signal;
    const guardContext: WizardGuardContext<TValues> = {
      values,
      fromStepId: fromStep ? wizardStepId(fromStep, fromIndex) : undefined,
      toStepId: wizardStepId(toStep, targetIndex),
      signal,
    };

    if (!options.skipLeaveValidate && fromStep?.canLeave) {
      if (!(await fromStep.canLeave(guardContext as WizardGuardContext))) {
        return false;
      }
    }

    if (toStep?.canEnter) {
      if (!(await toStep.canEnter(guardContext as WizardGuardContext))) {
        return false;
      }
    }

    this.options.setStep(targetIndex);
    return true;
  }
}
