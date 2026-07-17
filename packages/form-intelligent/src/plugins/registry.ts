import { satisfiesEnginesRange } from "./compat.js";
import { PluginHookBus } from "./hooks.js";
import { resolvePluginCleanup } from "./setup.js";
import { ConfigurationError } from "../errors/index.js";

import type { PluginErrorHandler } from "./compat.js";
import type { FormPluginApi } from "./hooks.js";
import type { FormInstance, FormPlugin } from "../types/index.js";

interface RegisteredPlugin<TValues extends Record<string, unknown>> {
  readonly plugin: FormPlugin<TValues>;
  readonly order: number;
  readonly registrationIndex: number;
  readonly cleanup?: () => void;
}

export interface PluginRegistryOptions {
  readonly onPluginError?: PluginErrorHandler;
}

export class PluginRegistry<TValues extends Record<string, unknown>> {
  private readonly hooks: PluginHookBus<TValues>;
  private readonly plugins = new Map<string, RegisteredPlugin<TValues>>();
  private nextRegistrationIndex = 1;
  private readonly onPluginError: PluginErrorHandler | undefined;

  public constructor(options: PluginRegistryOptions = {}) {
    this.onPluginError = options.onPluginError;
    this.hooks = new PluginHookBus<TValues>(
      options.onPluginError ? { onPluginError: options.onPluginError } : {},
    );
  }

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
    if (plugin.engines && !satisfiesEnginesRange(plugin.engines)) {
      throw new ConfigurationError(
        `Plugin "${plugin.name}" requires engines "${plugin.engines}" which is incompatible with this form-intelligent version.`,
        {
          details: {
            plugin: plugin.name,
            engines: plugin.engines,
            ...(plugin.version ? { version: plugin.version } : {}),
          },
        },
      );
    }

    this.unregister(plugin.name);

    let cleanup: (() => void) | undefined;
    try {
      cleanup = resolvePluginCleanup(plugin.setup(form, this.hooks.createApi(plugin.name)));
    } catch (error) {
      this.onPluginError?.({
        plugin: plugin.name,
        phase: "setup",
        error,
      });
      // Isolation: setup failure does not brick the form or leave a partial registration.
      return;
    }

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

    this.safeCleanup(existing);
    return this.plugins.delete(name);
  }

  public list(): readonly FormPlugin<TValues>[] {
    return this.getOrderedRecords().map((record) => record.plugin);
  }

  public destroy(): void {
    for (const record of this.getReverseOrderedRecords()) {
      this.safeCleanup(record);
    }

    this.plugins.clear();
    this.hooks.clear();
    this.nextRegistrationIndex = 1;
  }

  private safeCleanup(record: RegisteredPlugin<TValues>): void {
    if (!record.cleanup) {
      return;
    }

    try {
      record.cleanup();
    } catch (error) {
      this.onPluginError?.({
        plugin: record.plugin.name,
        phase: "destroy",
        error,
      });
    }
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
