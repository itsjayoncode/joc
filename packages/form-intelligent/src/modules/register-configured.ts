import { createHistoryModule, type HistoryService } from "./history/module.js";

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
    const queueConfig = config.workflow.offlineQueue;
    const storageKey = queueConfig.storageKey ?? options.formId;
    const offlinePromise =
      services.offline ??
      Promise.all([import("../core/lazy-engines.js"), import("../engines/offline/config.js")]).then(
        ([{ ensureOfflineService }, { toOfflineQueueRuntimeOptions }]) =>
          ensureOfflineService<TValues>(
            storageKey,
            toOfflineQueueRuntimeOptions<TValues>(queueConfig),
          ),
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
      Promise.all([
        import("../core/lazy-engines.js"),
        import("../engines/analytics/config.js"),
      ]).then(([{ ensureAnalyticsService }, { toAnalyticsRuntimeOptions }]) =>
        ensureAnalyticsService(toAnalyticsRuntimeOptions(config.workflow?.analytics)),
      );

    void analyticsPromise.then(async (analytics) => {
      const { createAnalyticsModule } = await import("../engines/analytics/index.js");
      host.register(createAnalyticsModule(analytics));
    });
  }

  const keyboardShortcuts = config.workflow?.keyboard ?? [];
  if (keyboardShortcuts.length > 0) {
    void import("./integrations/module.js").then(({ createKeyboardModule }) => {
      host.register(createKeyboardModule(keyboardShortcuts));
    });
  }

  if (config.workflow?.draft?.enabled) {
    void import("./integrations/module.js").then(({ createBrowserSessionModule }) => {
      host.register(createBrowserSessionModule());
    });
  }
}

export { HistoryService, createHistoryModule } from "./history/module.js";
