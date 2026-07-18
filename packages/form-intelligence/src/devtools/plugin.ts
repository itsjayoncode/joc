import { formDevToolsRegistry } from "./registry.js";

import type { FormDevToolsPluginOptions } from "./types.js";
import type { FormInstance, FormPlugin } from "../types/index.js";

export function createDevToolsPlugin(options: FormDevToolsPluginOptions = {}): FormPlugin {
  return {
    name: "devtools",
    setup(form, _api) {
      return formDevToolsRegistry.register(form, options);
    },
  };
}

export function enableFormDevTools<TValues extends Record<string, unknown>>(
  form: FormInstance<TValues>,
  options: FormDevToolsPluginOptions = {},
): void {
  form.use(createDevToolsPlugin(options) as FormPlugin<TValues>);
}

export function connectFormDevToolsToGlobal(options: { readonly globalKey?: string } = {}): void {
  if (typeof globalThis === "undefined") {
    return;
  }

  const key = options.globalKey ?? "__FORM_INTELLIGENT_DEVTOOLS__";
  Object.assign(globalThis, {
    [key]: formDevToolsRegistry,
  });
}
