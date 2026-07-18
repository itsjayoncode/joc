import type { BrowserLifecycle } from "@jayoncode/browser-lifecycle";

import type { FormPlugin } from "../types/index.js";

export interface BrowserLifecycleIntegrationOptions {
  readonly saveDraftOnHidden?: boolean;
  readonly flushOfflineQueueOnOnline?: boolean;
  readonly lifecycle?: BrowserLifecycle;
}

export function createBrowserLifecyclePlugin<TValues extends Record<string, unknown>>(
  options: BrowserLifecycleIntegrationOptions = {},
): FormPlugin<TValues> {
  return {
    name: "browser-lifecycle",
    setup(form, _api) {
      let disposed = false;
      const cleanups: Array<() => void> = [];

      const attach = (lifecycle: BrowserLifecycle, ownsLifecycle: boolean): void => {
        if (disposed) {
          if (ownsLifecycle) {
            lifecycle.dispose();
          }
          return;
        }

        if (options.saveDraftOnHidden !== false) {
          cleanups.push(
            lifecycle.on("page:hidden", () => {
              form.saveDraft();
            }),
          );
        }

        if (options.flushOfflineQueueOnOnline !== false) {
          cleanups.push(
            lifecycle.on("connection:online", () => {
              void form.flushOfflineQueue();
            }),
          );
        }

        if (ownsLifecycle && !lifecycle.isRunning()) {
          lifecycle.start();
        }
      };

      if (options.lifecycle) {
        attach(options.lifecycle, false);
      } else {
        void import("@jayoncode/browser-lifecycle").then(({ createBrowserLifecycle }) => {
          if (disposed) {
            return;
          }

          const lifecycle = createBrowserLifecycle({ autoStart: true });
          attach(lifecycle, true);
          cleanups.push(() => {
            lifecycle.dispose();
          });
        });
      }

      return () => {
        disposed = true;
        for (const cleanup of cleanups) {
          cleanup();
        }
      };
    },
  };
}
