export { assertStepIndex, getStepFields, resolveWizardState } from "../engines/wizard/index.js";

import { assertStepIndex, getStepFields } from "../engines/wizard/index.js";

import type { ValidateOptions, WizardConfig } from "../types/index.js";

export interface WizardNavigatorOptions {
  readonly getWizard: () => WizardConfig | undefined;
  readonly getCurrentStep: () => number;
  readonly setStep: (step: number) => void;
  readonly validate: (options?: ValidateOptions) => Promise<boolean>;
}

export class WizardNavigator {
  public constructor(private readonly options: WizardNavigatorOptions) {}

  public async next(): Promise<boolean> {
    const wizard = this.options.getWizard();
    if (!wizard) {
      return false;
    }

    const valid = await this.options.validate({
      paths: getStepFields(wizard.steps[this.options.getCurrentStep()]),
      mode: "onSubmit",
    });

    if (!valid) {
      return false;
    }

    const nextStep = this.options.getCurrentStep() + 1;
    if (nextStep >= wizard.steps.length) {
      return false;
    }

    this.options.setStep(nextStep);
    return true;
  }

  public prev(): void {
    if (this.options.getCurrentStep() > 0) {
      this.options.setStep(this.options.getCurrentStep() - 1);
    }
  }

  public async goTo(step: number): Promise<boolean> {
    assertStepIndex(step, this.options.getWizard());
    const valid = await this.options.validate({ mode: "onSubmit" });
    if (!valid) {
      return false;
    }

    this.options.setStep(step);
    return true;
  }
}
