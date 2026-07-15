import {
  createBrowserLifecycle,
  type BrowserLifecycle,
  type BrowserLifecycleConfig,
  type BrowserLifecycleEventMap,
  type BrowserLifecycleEventName,
  type BrowserLifecyclePlugin,
  type BrowserLifecyclePluginDiagnostic,
  type BrowserLifecyclePluginHookLogEntry,
  type BrowserLifecyclePluginPhase,
  type BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

import { formatPlaygroundTimestamp } from "./browser-lifecycle.js";

export const PLUGIN_SYSTEM_VERSION = "1.0.0";
export const PLUGIN_API_VERSION = "1.0.0";

export const PLUGIN_SUPPORTED_HOOKS = [
  "onRegister",
  "onStart",
  "onStop",
  "onDestroy",
  "onEvent",
] as const;

export const PLUGIN_LIFECYCLE_PHASES: readonly BrowserLifecyclePluginPhase[] = [
  "registered",
  "initialized",
  "started",
  "running",
  "stopped",
  "destroyed",
];

export interface PluginPlaygroundEventEntry {
  readonly durationMs?: number;
  readonly eventType?: BrowserLifecycleEventName;
  readonly hook?: string;
  readonly id: string;
  readonly label: string;
  readonly payloadSummary: string;
  readonly pluginId?: string;
  readonly source: string;
  readonly timestamp: number;
  readonly timestampLabel: string;
  readonly type: string;
}

export interface LoggerPluginState {
  readonly consoleOutput: readonly string[];
  readonly executionCount: number;
  readonly lastExecutionAt?: number;
}

export interface PluginPlaygroundSessionOptions {
  readonly includeLoggerPlugin?: boolean;
  readonly plugins?: readonly BrowserLifecyclePlugin[];
}

export const PLUGINS_PLAYGROUND_CONFIG: BrowserLifecycleConfig = {
  autoStart: false,
  emitInitialState: true,
  idleTimeout: false,
};

export const PLUGIN_DEVELOPER_EXAMPLES = [
  {
    description: "Log every public Browser Lifecycle event through a plugin hook.",
    id: "logger-plugin",
    snippet: `const loggerPlugin = {
  id: "logger",
  name: "Logger",
  onEvent(event, payload) {
    console.log(event, payload);
  },
};

const lifecycle = createBrowserLifecycle({ plugins: [loggerPlugin] });
lifecycle.start();`,
    title: "Logger plugin",
  },
  {
    description: "Pause analytics collection whenever the session stops.",
    id: "analytics-plugin",
    snippet: `const analyticsPlugin = {
  id: "analytics",
  onStart() {
    analytics.resume();
  },
  onStop() {
    analytics.pause();
  },
};

lifecycle.use(analyticsPlugin);
lifecycle.start();`,
    title: "Analytics plugin",
  },
] as const;

export function createLoggerPlugin(
  onLog?: (message: string) => void,
): BrowserLifecyclePlugin & { getState: () => LoggerPluginState } {
  const state: {
    consoleOutput: string[];
    executionCount: number;
    lastExecutionAt?: number;
  } = {
    consoleOutput: [],
    executionCount: 0,
  };

  const plugin: BrowserLifecyclePlugin & { getState: () => LoggerPluginState } = {
    author: "Jayoncode",
    description: "Records Browser Lifecycle events to the plugin playground console.",
    id: "playground-logger",
    name: "LoggerPlugin",
    onEvent(event) {
      const message = `[LoggerPlugin] ${event}`;
      state.consoleOutput = [message, ...state.consoleOutput].slice(0, 50);
      state.executionCount += 1;
      state.lastExecutionAt = Date.now();
      onLog?.(message);
    },
    onRegister() {
      const message = "[LoggerPlugin] registered";
      state.consoleOutput = [message, ...state.consoleOutput].slice(0, 50);
      onLog?.(message);
    },
    onStart() {
      const message = "[LoggerPlugin] started";
      state.consoleOutput = [message, ...state.consoleOutput].slice(0, 50);
      onLog?.(message);
    },
    onStop() {
      const message = "[LoggerPlugin] stopped";
      state.consoleOutput = [message, ...state.consoleOutput].slice(0, 50);
      onLog?.(message);
    },
    priority: 10,
    version: "1.0.0",
    getState() {
      return {
        consoleOutput: [...state.consoleOutput],
        executionCount: state.executionCount,
        ...(state.lastExecutionAt === undefined ? {} : { lastExecutionAt: state.lastExecutionAt }),
      };
    },
  };

  return plugin;
}

export function createPluginsPlaygroundSession(
  options: PluginPlaygroundSessionOptions = {},
): BrowserLifecycle {
  const loggerPlugin = options.includeLoggerPlugin === false ? undefined : createLoggerPlugin();
  const lifecycle = createBrowserLifecycle({
    ...PLUGINS_PLAYGROUND_CONFIG,
    plugins: [
      ...(options.plugins ?? []),
      ...(loggerPlugin ? [loggerPlugin] : []),
    ],
  });

  return lifecycle;
}

export function formatPluginLifecycleLabel(phase: BrowserLifecyclePluginPhase): string {
  return phase.charAt(0).toUpperCase() + phase.slice(1);
}

export function formatPluginDiagnosticSummary(plugin: BrowserLifecyclePluginDiagnostic): string {
  return `${plugin.name ?? plugin.id} · v${plugin.version ?? "0.0.0"} · ${plugin.lifecycle}`;
}

export function formatPluginEventFromHook(entry: BrowserLifecyclePluginHookLogEntry): PluginPlaygroundEventEntry {
  return {
    durationMs: entry.durationMs,
    hook: entry.hook,
    id: entry.id,
    label: entry.hook,
    payloadSummary: entry.eventType ? `event=${entry.eventType}` : `hook=${entry.hook}`,
    pluginId: entry.pluginId,
    source: entry.source,
    timestamp: entry.timestamp,
    timestampLabel: formatPlaygroundTimestamp(entry.timestamp),
    type: "Plugin Hook Executed",
    ...(entry.eventType === undefined ? {} : { eventType: entry.eventType }),
  };
}

export function formatPluginPublicEvent(
  event:
    | BrowserLifecycleEventMap["plugin:error"]
    | BrowserLifecycleEventMap["plugin:registered"]
    | BrowserLifecycleEventMap["plugin:removed"],
): PluginPlaygroundEventEntry {
  const label =
    event.type === "plugin:registered"
      ? "Plugin Registered"
      : event.type === "plugin:removed"
        ? "Plugin Removed"
        : "Plugin Error";

  const pluginId = event.metadata?.pluginId;

  return {
    id: `${event.type}-${String(event.timestamp)}`,
    label,
    payloadSummary: `pluginId=${pluginId ?? "unknown"}`,
    source: event.source,
    timestamp: event.timestamp,
    timestampLabel: formatPlaygroundTimestamp(event.timestamp),
    type: label,
    ...(pluginId === undefined ? {} : { pluginId }),
    ...(event.type === "plugin:error" && event.metadata && "hook" in event.metadata && event.metadata.hook
      ? { hook: event.metadata.hook }
      : {}),
  };
}

export function getPluginArchitectureSteps(): readonly { readonly description: string; readonly title: string }[] {
  return [
    {
      description: "Developers implement BrowserLifecyclePlugin hooks and register through use() or config.",
      title: "Developer Plugin",
    },
    {
      description: "PluginRuntime validates metadata, orders plugins, and executes lifecycle hooks.",
      title: "Plugin Manager",
    },
    {
      description: "Session Core coordinates modules, snapshots, and public event emission.",
      title: "Session Core",
    },
    {
      description: "Typed public events and subscribe() feed diagnostics and downstream integrations.",
      title: "Event Infrastructure",
    },
    {
      description: "Visibility, focus, connectivity, idle, lifecycle, and cross-tab modules emit normalized events.",
      title: "Browser Modules",
    },
  ];
}

export function getPluginSystemInfo(snapshot?: BrowserLifecycleSnapshot): {
  readonly apiVersion: string;
  readonly capabilities: BrowserLifecycleSnapshot["capabilities"] | undefined;
  readonly hookTypes: readonly string[];
  readonly lifecycleHooks: readonly string[];
  readonly systemVersion: string;
} {
  return {
    apiVersion: PLUGIN_API_VERSION,
    capabilities: snapshot?.capabilities,
    hookTypes: [...PLUGIN_SUPPORTED_HOOKS],
    lifecycleHooks: ["onRegister", "onStart", "onStop", "onDestroy"],
    systemVersion: PLUGIN_SYSTEM_VERSION,
  };
}

export function mergePluginPlaygroundEvents(
  hookLog: readonly BrowserLifecyclePluginHookLogEntry[],
  publicEvents: readonly PluginPlaygroundEventEntry[],
): PluginPlaygroundEventEntry[] {
  const hookEntries = hookLog.map((entry) => formatPluginEventFromHook(entry));
  return [...publicEvents, ...hookEntries]
    .sort((left, right) => right.timestamp - left.timestamp)
    .slice(0, 200);
}

export function searchPluginPlaygroundEvents(
  events: readonly PluginPlaygroundEventEntry[],
  query: string,
): PluginPlaygroundEventEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [...events];
  }

  return events.filter((entry) =>
    [entry.type, entry.label, entry.pluginId, entry.payloadSummary, entry.hook, entry.eventType]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}

export const LOGGER_PLUGIN_SOURCE = `export const loggerPlugin = {
  id: "playground-logger",
  name: "LoggerPlugin",
  version: "1.0.0",
  onRegister() {
    console.log("plugin registered");
  },
  onStart() {
    console.log("plugin started");
  },
  onEvent(event, payload) {
    console.log(event, payload);
  },
  onStop() {
    console.log("plugin stopped");
  },
};`;
