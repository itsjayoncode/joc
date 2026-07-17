import {
  createBrowserLifecycle,
  type BrowserLifecycle,
  type BrowserLifecycleConfig,
  type BrowserLifecyclePlugin,
} from "@jayoncode/browser-lifecycle";

import type { SandboxConfig } from "./types.js";

export function createSandboxLoggerPlugin(): BrowserLifecyclePlugin {
  return {
    id: "sandbox-logger",
    name: "Sandbox Logger",
    description: "Playground logger plugin — mirrors events to diagnostics.",
    version: "1.0.0",
    enabled: true,
    onEvent(event) {
      // Logger plugin intentionally writes to the browser console for live demos.
      // eslint-disable-next-line no-console -- playground logger plugin
      console.debug(`[sandbox-logger] ${event}`);
    },
  };
}

/** Map sandbox UI config → package BrowserLifecycleConfig. */
export function sandboxConfigToPackageConfig(config: SandboxConfig): BrowserLifecycleConfig {
  const plugins: BrowserLifecyclePlugin[] = [];
  if (config.loggerPlugin) {
    plugins.push(createSandboxLoggerPlugin());
  }

  const packageConfig: BrowserLifecycleConfig = {
    autoStart: false,
    emitInitialState: config.emitInitialState,
    debug: config.diagnostics.debug,
    eventBufferSize: config.eventBufferSize,
    activityDebounce: config.idle.debounceMs,
    ...(config.idle.useDefaultEvents ? { activityEvents: "default" as const } : {}),
    idleTimeout: config.modules.idle ? config.idle.timeoutMs : false,
    crossTab: config.modules.crossTab
      ? {
          channelName: config.crossTab.channelName,
          heartbeatInterval: config.crossTab.heartbeatInterval,
          leaderTimeout: config.crossTab.leaderTimeout,
        }
      : false,
    ...(plugins.length > 0 ? { plugins } : {}),
  };

  return packageConfig;
}

export function createSandboxSession(config: SandboxConfig): BrowserLifecycle {
  return createBrowserLifecycle(sandboxConfigToPackageConfig(config));
}
