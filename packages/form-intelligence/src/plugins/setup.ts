import type { FormPluginApi } from "./hooks.js";
import type { FormPlugin, FormPluginSetupResult } from "../types/index.js";

export function createNoopPluginApi<
  TValues extends Record<string, unknown>,
>(): FormPluginApi<TValues> {
  return {
    on: () => () => undefined,
    off: () => undefined,
  };
}

export function resolvePluginCleanup(
  result: void | (() => void) | FormPluginSetupResult,
): (() => void) | undefined {
  if (typeof result === "function") {
    return result;
  }

  if (result && typeof result.onDestroy === "function") {
    return result.onDestroy;
  }

  return undefined;
}

export function invokePluginSetup<TValues extends Record<string, unknown>>(
  plugin: FormPlugin<TValues>,
  form: Parameters<FormPlugin<TValues>["setup"]>[0],
  api: Parameters<FormPlugin<TValues>["setup"]>[1],
): void | (() => void) | FormPluginSetupResult {
  return plugin.setup(form, api);
}
