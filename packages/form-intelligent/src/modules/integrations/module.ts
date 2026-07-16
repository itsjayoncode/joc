import { createBrowserLifecyclePlugin } from "../../integrations/browser-lifecycle.js";
import { createKeyboardPlugin, keyboard } from "../../integrations/keyboard.js";
import { createNoopPluginApi, resolvePluginCleanup } from "../../plugins/setup.js";

import type { KeyboardShortcutConfig } from "../../types/index.js";

export function createKeyboardModule<TValues extends Record<string, unknown>>(
  shortcuts: readonly KeyboardShortcutConfig[],
): import("../../core/module-types.js").FormModule<TValues> {
  const resolved = shortcuts.map((shortcut) => {
    switch (shortcut.action) {
      case "submit":
        return keyboard.shortcut(shortcut.combo, (form) => {
          void form.submit();
        });
      case "saveDraft":
        return keyboard.shortcut(shortcut.combo, (form) => {
          form.saveDraft();
        });
      case "undo":
        return keyboard.shortcut(shortcut.combo, (form) => {
          form.undo();
        });
      case "redo":
        return keyboard.shortcut(shortcut.combo, (form) => {
          form.redo();
        });
      default:
        return keyboard.shortcut(shortcut.combo, () => undefined);
    }
  });

  return {
    id: "keyboard",
    order: 90,
    start(context) {
      const cleanup = resolvePluginCleanup(
        createKeyboardPlugin(resolved).setup(
          context.form as import("../../types/index.js").FormInstance<Record<string, unknown>>,
          createNoopPluginApi(),
        ),
      );
      if (cleanup) {
        context.registerCleanup(cleanup);
      }
    },
  };
}

export function createBrowserSessionModule<
  TValues extends Record<string, unknown>,
>(): import("../../core/module-types.js").FormModule<TValues> {
  return {
    id: "browser-session",
    order: 95,
    start(context) {
      const cleanup = resolvePluginCleanup(
        createBrowserLifecyclePlugin<TValues>().setup(context.form, createNoopPluginApi()),
      );
      if (cleanup) {
        context.registerCleanup(cleanup);
      }
    },
  };
}
