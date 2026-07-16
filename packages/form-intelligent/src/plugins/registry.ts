import { PluginHookBus } from "./hooks.js";
import { resolvePluginCleanup } from "./setup.js";

import type { FormPluginApi } from "./hooks.js";
import type { FormInstance, FormPlugin } from "../types/index.js";

interface RegisteredPlugin<TValues extends Record<string, unknown>> {
  readonly plugin: FormPlugin<TValues>;
  readonly order: number;
  readonly registrationIndex: number;
  readonly cleanup?: () => void;
}

export class PluginRegistry<TValues extends Record<string, unknown>> {
  private readonly hooks = new PluginHookBus<TValues>();
  private readonly plugins = new Map<string, RegisteredPlugin<TValues>>();
  private nextRegistrationIndex = 1;

  public get api(): FormPluginApi<TValues> {
    return this.hooks.createApi();
  }

  public get hookBus(): PluginHookBus<TValues> {
    return this.hooks;
  }

  public register(
    form: FormInstance<TValues>,
    plugin: FormPlugin<TValues>,
    order = plugin.order ?? 100,
  ): void {
    this.unregister(plugin.name);

    const cleanup = resolvePluginCleanup(plugin.setup(form, this.hooks.createApi()));
    this.plugins.set(plugin.name, {
      plugin,
      order,
      registrationIndex: this.nextRegistrationIndex,
      ...(cleanup ? { cleanup } : {}),
    });
    this.nextRegistrationIndex += 1;
  }

  public unregister(name: string): boolean {
    const existing = this.plugins.get(name);
    if (!existing) {
      return false;
    }

    existing.cleanup?.();
    return this.plugins.delete(name);
  }

  public list(): readonly FormPlugin<TValues>[] {
    return this.getOrderedRecords().map((record) => record.plugin);
  }

  public destroy(): void {
    for (const record of this.getReverseOrderedRecords()) {
      record.cleanup?.();
    }

    this.plugins.clear();
    this.hooks.clear();
    this.nextRegistrationIndex = 1;
  }

  private getOrderedRecords(): RegisteredPlugin<TValues>[] {
    return [...this.plugins.values()].sort((left, right) => {
      if (left.order !== right.order) {
        return left.order - right.order;
      }

      return left.registrationIndex - right.registrationIndex;
    });
  }

  private getReverseOrderedRecords(): RegisteredPlugin<TValues>[] {
    return this.getOrderedRecords().reverse();
  }
}
