import { createHistoryModule, type HistoryService } from "./history/module.js";
import { createBrowserSessionModule, createKeyboardModule } from "./integrations/module.js";

import type { FormModuleHost } from "../core/form-module-host.js";
import type { ResolvedFormConfig } from "../core/options.js";
import type { AnalyticsService } from "../engines/analytics/index.js";
import type { OfflineService } from "../engines/offline/index.js";

export interface FormModuleServices<TValues extends Record<string, unknown>> {
  readonly history: HistoryService<TValues>;
  readonly offline?: Promise<OfflineService<TValues>>;
  readonly analytics?: Promise<AnalyticsService>;
}

export function registerConfiguredModules<TValues extends Record<string, unknown>>(
  host: FormModuleHost<TValues>,
  config: ResolvedFormConfig<TValues>,
  services: FormModuleServices<TValues>,
  options: { readonly formId: string; readonly onReconnect: () => void },
): void {
  host.register(createHistoryModule(services.history));

  if (config.workflow?.offlineQueue?.enabled) {
    const storageKey = config.workflow.offlineQueue.storageKey ?? options.formId;
    const offlinePromise =
      services.offline ??
      import("../core/lazy-engines.js").then(({ ensureOfflineService }) =>
        ensureOfflineService<TValues>(storageKey),
      );

    void offlinePromise.then(async (offline) => {
      const { createOfflineModule } = await import("../engines/offline/index.js");
      host.register(
        createOfflineModule(offline, {
          storageKey,
          onReconnect: options.onReconnect,
        }),
      );
    });
  }

  if (config.workflow?.analytics?.enabled) {
    const analyticsPromise =
      services.analytics ??
      import("../core/lazy-engines.js").then(({ ensureAnalyticsService }) =>
        ensureAnalyticsService(),
      );

    void analyticsPromise.then(async (analytics) => {
      const { createAnalyticsModule } = await import("../engines/analytics/index.js");
      host.register(createAnalyticsModule(analytics));
    });
  }

  const keyboardShortcuts = config.workflow?.keyboard ?? [];
  if (keyboardShortcuts.length > 0) {
    host.register(createKeyboardModule(keyboardShortcuts));
  }

  if (config.workflow?.draft?.enabled) {
    host.register(createBrowserSessionModule());
  }
}

export { HistoryService, createHistoryModule } from "./history/module.js";
