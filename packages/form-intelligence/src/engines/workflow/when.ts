import type { FormRuleDefinition } from "./types.js";

type RuleCommitHook<TValues extends Record<string, unknown>> = (
  rule: FormRuleDefinition<TValues>,
) => void;

export class WhenRuleBuilder<TValues extends Record<string, unknown> = Record<string, unknown>> {
  private readonly watch: string;
  private equalsValue: unknown | undefined;
  private notEqualsValue: unknown | undefined;
  private greaterThanValue: number | undefined;
  private lessThanValue: number | undefined;
  private showFields: string[] = [];
  private hideFields: string[] = [];
  private requireFields: string[] = [];
  private optionalFields: string[] = [];
  private enableFields: string[] = [];
  private disableFields: string[] = [];
  private disableSubmitFlag = false;
  private changeLoader: FormRuleDefinition<TValues>["changes"];
  private populateTarget: string | undefined;
  private thenHandler: FormRuleDefinition<TValues>["then"];
  private commitHook: RuleCommitHook<TValues> | undefined;
  private committed = false;

  public constructor(watch: string) {
    this.watch = watch;
  }

  public _attachCommitHook(hook: RuleCommitHook<TValues>): this {
    this.commitHook = hook;
    return this;
  }

  public equals(value: unknown): this {
    this.equalsValue = value;
    return this;
  }

  public notEquals(value: unknown): this {
    this.notEqualsValue = value;
    return this;
  }

  public greaterThan(value: number): this {
    this.greaterThanValue = value;
    return this;
  }

  public lessThan(value: number): this {
    this.lessThanValue = value;
    return this;
  }

  public show(...paths: string[]): this {
    this.showFields.push(...paths);
    return this.commit();
  }

  public hide(...paths: string[]): this {
    this.hideFields.push(...paths);
    return this.commit();
  }

  public require(...paths: string[]): this {
    this.requireFields.push(...paths);
    return this.commit();
  }

  public optional(...paths: string[]): this {
    this.optionalFields.push(...paths);
    return this.commit();
  }

  public enable(...paths: string[]): this {
    this.enableFields.push(...paths);
    return this.commit();
  }

  public disable(...paths: string[]): this {
    this.disableFields.push(...paths);
    return this.commit();
  }

  public disableSubmit(): this {
    this.disableSubmitFlag = true;
    return this.commit();
  }

  public changes(loader: NonNullable<FormRuleDefinition<TValues>["changes"]>): this {
    this.changeLoader = loader;
    return this;
  }

  public populate(target: string): this {
    this.populateTarget = target;
    return this.commit();
  }

  public then(handler: NonNullable<FormRuleDefinition<TValues>["then"]>): this {
    this.thenHandler = handler;
    return this.commit();
  }

  public build(): FormRuleDefinition<TValues> {
    return {
      watch: this.watch,
      ...(this.equalsValue !== undefined ? { equals: this.equalsValue } : {}),
      ...(this.notEqualsValue !== undefined ? { notEquals: this.notEqualsValue } : {}),
      ...(this.greaterThanValue !== undefined ? { greaterThan: this.greaterThanValue } : {}),
      ...(this.lessThanValue !== undefined ? { lessThan: this.lessThanValue } : {}),
      ...(this.showFields.length > 0 ? { show: this.showFields } : {}),
      ...(this.hideFields.length > 0 ? { hide: this.hideFields } : {}),
      ...(this.requireFields.length > 0 ? { require: this.requireFields } : {}),
      ...(this.optionalFields.length > 0 ? { optional: this.optionalFields } : {}),
      ...(this.enableFields.length > 0 ? { enable: this.enableFields } : {}),
      ...(this.disableFields.length > 0 ? { disable: this.disableFields } : {}),
      ...(this.disableSubmitFlag ? { disableSubmit: true } : {}),
      ...(this.changeLoader ? { changes: this.changeLoader } : {}),
      ...(this.populateTarget ? { populate: this.populateTarget } : {}),
      ...(this.thenHandler ? { then: this.thenHandler } : {}),
    };
  }

  public toRule(): FormRuleDefinition<TValues> {
    return this.build();
  }

  private commit(): this {
    if (this.commitHook && !this.committed) {
      this.committed = true;
      this.commitHook(this.build());
    }
    return this;
  }
}

export function when<TValues extends Record<string, unknown> = Record<string, unknown>>(
  field: string,
): WhenRuleBuilder<TValues> {
  return new WhenRuleBuilder<TValues>(field);
}
