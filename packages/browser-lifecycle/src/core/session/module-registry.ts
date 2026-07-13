/* v8 ignore next */
import { ModuleRegistryError } from "../../errors/index.js";

import type { SessionContext, SessionModule } from "./types.js";

interface RegisteredModule {
  readonly module: SessionModule;
  readonly registrationIndex: number;
}

/**
 * Internal module registry used by Session Core orchestration.
 */
export class ModuleRegistry {
  private readonly modules = new Map<string, RegisteredModule>();
  private nextRegistrationIndex = 1;

  /**
   * Registers a module and rejects duplicate ids.
   */
  public register(module: SessionModule): void {
    if (this.modules.has(module.id)) {
      throw new ModuleRegistryError(`A module with id "${module.id}" is already registered.`);
    }

    this.modules.set(module.id, {
      module,
      registrationIndex: this.nextRegistrationIndex,
    });
    this.nextRegistrationIndex += 1;
  }

  /**
   * Unregisters a module by id.
   */
  public unregister(id: string): boolean {
    return this.modules.delete(id);
  }

  /**
   * Returns true when a module id is registered.
   */
  public has(id: string): boolean {
    return this.modules.has(id);
  }

  /**
   * Returns the number of registered modules.
   */
  public size(): number {
    return this.modules.size;
  }

  /**
   * Returns the registered modules in deterministic lifecycle order.
   */
  public list(): readonly SessionModule[] {
    return this.getOrderedRecords().map((record) => record.module);
  }

  /**
   * Initializes registered modules in ascending order.
   */
  public initializeAll(context: SessionContext): void {
    for (const record of this.getOrderedRecords()) {
      record.module.initialize?.(context);
    }
  }

  /**
   * Starts registered modules in ascending order.
   */
  public startAll(context: SessionContext): void {
    for (const record of this.getOrderedRecords()) {
      record.module.start?.(context);
    }
  }

  /**
   * Stops registered modules in reverse order.
   */
  public stopAll(context: SessionContext): void {
    for (const record of this.getReverseOrderedRecords()) {
      record.module.stop?.(context);
    }
  }

  /**
   * Destroys registered modules in reverse order.
   */
  public destroyAll(context: SessionContext): void {
    for (const record of this.getReverseOrderedRecords()) {
      record.module.destroy?.(context);
    }
  }

  private getOrderedRecords(): RegisteredModule[] {
    return [...this.modules.values()].sort((left, right) => {
      const leftOrder = left.module.order ?? 0;
      const rightOrder = right.module.order ?? 0;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.registrationIndex - right.registrationIndex;
    });
  }

  private getReverseOrderedRecords(): RegisteredModule[] {
    return this.getOrderedRecords().reverse();
  }
}
