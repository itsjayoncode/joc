import {
  createBrowserLifecycle,
  supportsAbortController,
  supportsBroadcastChannel,
  supportsConnectivity,
  supportsFocus,
  supportsIdle,
  supportsPageLifecycle,
  supportsRequestIdleCallback,
  supportsVisibility,
  type BrowserLifecycle,
  type BrowserLifecycleConfig,
  type BrowserLifecycleRuntimeDiagnostics,
} from "@jayoncode/browser-lifecycle";

import { MODULE_LIFECYCLE_MODULES } from "./playground-developer-tools-data.js";

export type DeveloperLogLevel = "debug" | "error" | "info" | "trace" | "warning";

export interface DeveloperBrowserApiEntry {
  readonly browserSessionModule: string;
  readonly description: string;
  readonly id: string;
  readonly label: string;
  readonly status: "experimental" | "permission-required" | "supported" | "unsupported";
}

export interface DeveloperLogEntry {
  readonly category: string;
  readonly id: string;
  readonly level: DeveloperLogLevel;
  readonly message: string;
  readonly module: string;
  readonly source: string;
  readonly timestamp: number;
  readonly timestampLabel: string;
}

export interface DeveloperModuleEntry {
  readonly events: readonly string[];
  readonly id: string;
  readonly label: string;
  readonly status: string;
}

export interface DeveloperRuntimeInspector {
  readonly configuration: Record<string, unknown>;
  readonly diagnostics: BrowserLifecycleRuntimeDiagnostics;
  readonly modules: readonly DeveloperModuleEntry[];
  readonly snapshot: ReturnType<BrowserLifecycle["getSnapshot"]>;
}

export const DEVELOPER_TOOLS_CONFIG: BrowserLifecycleConfig = {
  autoStart: false,
  crossTab: {
    channelName: "jayoncode:developer-tools",
    heartbeatInterval: 1_000,
    leaderTimeout: 3_000,
  },
  debug: true,
  emitInitialState: true,
  idleTimeout: 30_000,
};

export const DEBUG_PREFERENCES_KEY = "developer-tools.debug-enabled";

export function createDeveloperToolsSession(debugEnabled: boolean): BrowserLifecycle {
  return createBrowserLifecycle({
    ...DEVELOPER_TOOLS_CONFIG,
    debug: debugEnabled,
  });
}

export function formatDeveloperTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}

export function getBrowserApiInspectorEntries(): DeveloperBrowserApiEntry[] {
  return [
    {
      browserSessionModule: "visibility",
      description: "Maps document visibility to page:visible and page:hidden.",
      id: "page-visibility",
      label: "Page Visibility API",
      status: supportsVisibility() ? "supported" : "unsupported",
    },
    {
      browserSessionModule: "lifecycle",
      description: "Maps pagehide/pageshow to page lifecycle events.",
      id: "page-lifecycle",
      label: "Page Lifecycle API",
      status: supportsPageLifecycle() ? "supported" : "unsupported",
    },
    {
      browserSessionModule: "cross-tab",
      description: "BroadcastChannel transport for tab coordination.",
      id: "broadcast-channel",
      label: "BroadcastChannel",
      status: supportsBroadcastChannel() ? "supported" : "unsupported",
    },
    {
      browserSessionModule: "connectivity",
      description: "Advisory online/offline observation.",
      id: "connectivity",
      label: "Navigator onLine",
      status: supportsConnectivity() ? "supported" : "unsupported",
    },
    {
      browserSessionModule: "focus",
      description: "Window focus and blur normalization.",
      id: "focus",
      label: "Window Focus API",
      status: supportsFocus() ? "supported" : "unsupported",
    },
    {
      browserSessionModule: "idle",
      description: "Activity listeners for idle detection.",
      id: "idle",
      label: "Idle Activity APIs",
      status: supportsIdle() ? "supported" : "unsupported",
    },
    {
      browserSessionModule: "session-core",
      description: "AbortController support in capability detection.",
      id: "abort-controller",
      label: "AbortController",
      status: supportsAbortController() ? "supported" : "unsupported",
    },
    {
      browserSessionModule: "session-core",
      description: "requestIdleCallback availability.",
      id: "request-idle-callback",
      label: "requestIdleCallback",
      status: supportsRequestIdleCallback() ? "supported" : "unsupported",
    },
    {
      browserSessionModule: "session-core",
      description: "High-resolution timing for dispatch measurement.",
      id: "performance",
      label: "Performance API",
      status: typeof performance !== "undefined" ? "supported" : "unsupported",
    },
    {
      browserSessionModule: "session-core",
      description: "Chrome-specific heap metrics when exposed on performance.memory.",
      id: "memory",
      label: "User-Agent Memory API",
      status:
        typeof performance !== "undefined" &&
        "memory" in performance &&
        performance.memory !== undefined
          ? "supported"
          : "unsupported",
    },
    {
      browserSessionModule: "session-core",
      description: "Not used directly by Browser Lifecycle today.",
      id: "wake-lock",
      label: "Wake Lock API",
      status:
        typeof navigator !== "undefined" && "wakeLock" in navigator
          ? "experimental"
          : "unsupported",
    },
  ];
}

export function buildDeveloperRuntimeInspector(
  lifecycle: BrowserLifecycle,
): DeveloperRuntimeInspector {
  const diagnostics = lifecycle.getRuntimeDiagnostics();
  const snapshot = lifecycle.getSnapshot();

  return {
    configuration: {
      autoStart: false,
      debug: diagnostics.debug,
      eventBufferSize: diagnostics.eventBufferSize,
      idleTimeout: 30_000,
    },
    diagnostics,
    modules: MODULE_LIFECYCLE_MODULES.map((module) => ({
      events: module.events,
      id: module.id,
      label: module.label,
      status: module.id === "plugins"
        ? diagnostics.pluginCount > 0 ? "running" : "idle"
        : diagnostics.isRunning
          ? "running"
          : "stopped",
    })),
    snapshot,
  };
}

export function createDeveloperLogEntry(input: {
  readonly category: string;
  readonly level: DeveloperLogLevel;
  readonly message: string;
  readonly module: string;
  readonly source: string;
  readonly timestamp: number;
}): DeveloperLogEntry {
  return {
    category: input.category,
    id: `${input.source}-${String(input.timestamp)}-${input.message}`,
    level: input.level,
    message: input.message,
    module: input.module,
    source: input.source,
    timestamp: input.timestamp,
    timestampLabel: formatDeveloperTimestamp(input.timestamp),
  };
}

export function filterDeveloperLogs(
  logs: readonly DeveloperLogEntry[],
  query: string,
): DeveloperLogEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...logs];
  }
  return logs.filter((entry) =>
    [entry.level, entry.module, entry.category, entry.message, entry.source]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}

export function readDebugPreference(): boolean {
  if (typeof globalThis.localStorage === "undefined") {
    return true;
  }
  return globalThis.localStorage.getItem(`joc.browser-session-playground.${DEBUG_PREFERENCES_KEY}`) !== "false";
}

export function writeDebugPreference(enabled: boolean): void {
  if (typeof globalThis.localStorage === "undefined") {
    return;
  }
  globalThis.localStorage.setItem(`joc.browser-session-playground.${DEBUG_PREFERENCES_KEY}`, String(enabled));
}
