import { ConfigurationError } from "../errors/index.js";

import type { FormModule, FormModuleContext } from "./module-types.js";

interface RegisteredModule<TValues extends Record<string, unknown>> {
  readonly module: FormModule<TValues>;
  readonly registrationIndex: number;
}

export class FormModuleRegistry<TValues extends Record<string, unknown>> {
  private readonly modules = new Map<string, RegisteredModule<TValues>>();
  private nextRegistrationIndex = 1;

  public register(module: FormModule<TValues>): void {
    if (this.modules.has(module.id)) {
      throw new ConfigurationError(`A form module with id "${module.id}" is already registered.`);
    }

    this.modules.set(module.id, {
      module,
      registrationIndex: this.nextRegistrationIndex,
    });
    this.nextRegistrationIndex += 1;
  }

  public unregister(id: string): boolean {
    return this.modules.delete(id);
  }

  public has(id: string): boolean {
    return this.modules.has(id);
  }

  public size(): number {
    return this.modules.size;
  }

  public list(): readonly FormModule<TValues>[] {
    return this.getOrderedRecords().map((record) => record.module);
  }

  public initializeAll(context: FormModuleContext<TValues>): void {
    for (const record of this.getOrderedRecords()) {
      record.module.initialize?.(context);
    }
  }

  public startAll(context: FormModuleContext<TValues>): void {
    for (const record of this.getOrderedRecords()) {
      record.module.start?.(context);
    }
  }

  public stopAll(context: FormModuleContext<TValues>): void {
    for (const record of this.getReverseOrderedRecords()) {
      record.module.stop?.(context);
    }
  }

  public destroyAll(context: FormModuleContext<TValues>): void {
    for (const record of this.getReverseOrderedRecords()) {
      record.module.destroy?.(context);
    }
  }

  private getOrderedRecords(): RegisteredModule<TValues>[] {
    return [...this.modules.values()].sort((left, right) => {
      const leftOrder = left.module.order ?? 0;
      const rightOrder = right.module.order ?? 0;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.registrationIndex - right.registrationIndex;
    });
  }

  private getReverseOrderedRecords(): RegisteredModule<TValues>[] {
    return this.getOrderedRecords().reverse();
  }
}
