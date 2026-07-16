import { FormModuleRegistry } from "./module-registry.js";
import { resolvePluginCleanup, createNoopPluginApi } from "../plugins/setup.js";

import type { FormEventBus } from "./events.js";
import type { FormModule, FormModuleContext } from "./module-types.js";
import type { ResolvedFormConfig } from "./options.js";
import type { FormPluginApi } from "../plugins/hooks.js";
import type { PluginRegistry } from "../plugins/registry.js";
import type { FormInstance, FormPlugin } from "../types/index.js";

export function pluginAsModule<TValues extends Record<string, unknown>>(
  plugin: FormPlugin<TValues>,
  order = plugin.order ?? 100,
  api?: FormPluginApi<TValues>,
): FormModule<TValues> {
  return {
    id: plugin.name,
    order,
    start(context) {
      const cleanup = resolvePluginCleanup(
        api ? plugin.setup(context.form, api) : plugin.setup(context.form, createNoopPluginApi()),
      );
      if (cleanup) {
        context.registerCleanup(cleanup);
      }
    },
  };
}

export class FormModuleHost<TValues extends Record<string, unknown>> {
  private readonly registry = new FormModuleRegistry<TValues>();
  private readonly cleanups: (() => void)[] = [];
  private started = false;

  public constructor(
    private readonly form: FormInstance<TValues>,
    private readonly config: ResolvedFormConfig<TValues>,
    private readonly events: FormEventBus,
    private readonly pluginRegistry: PluginRegistry<TValues>,
  ) {}

  public register(module: FormModule<TValues>): void {
    this.registry.register(module);

    if (this.started) {
      const context = this.createContext();
      module.initialize?.(context);
      module.start?.(context);
    }
  }

  public registerPlugin(plugin: FormPlugin<TValues>, order = plugin.order ?? 100): void {
    this.pluginRegistry.register(this.form, plugin, order);
  }

  public has(id: string): boolean {
    return this.registry.has(id);
  }

  public start(): void {
    if (this.started) {
      return;
    }

    const context = this.createContext();
    this.registry.initializeAll(context);
    this.registry.startAll(context);
    this.started = true;
  }

  public destroy(): void {
    const context = this.createContext();
    this.registry.stopAll(context);
    this.registry.destroyAll(context);
    this.pluginRegistry.destroy();

    for (const cleanup of this.cleanups.splice(0)) {
      cleanup();
    }

    this.started = false;
  }

  private createContext(): FormModuleContext<TValues> {
    return {
      form: this.form,
      config: this.config,
      events: this.events,
      registerCleanup: (cleanup) => {
        this.cleanups.push(cleanup);
      },
    };
  }
}
