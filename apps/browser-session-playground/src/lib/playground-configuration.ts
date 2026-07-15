import {
  ConfigurationError,
  createBrowserLifecycle,
  createBrowserLifecycleConfig,
  getDefaultBrowserLifecycleConfig,
  mergeBrowserLifecycleConfig,
  validateBrowserLifecycleConfig,
  type BrowserLifecycle,
  type BrowserLifecycleConfig,
  type BrowserLifecycleValidationIssue,
  type ResolvedBrowserLifecycleConfig,
} from "@jayoncode/browser-lifecycle";

export const CONFIGURATION_PLAYGROUND_VERSION = "1.0.0";
export const CUSTOM_PRESETS_STORAGE_KEY = "configuration.custom-presets";

export type ConfigurationPresetId =
  | "accessibility"
  | "debug"
  | "default"
  | "development"
  | "minimal"
  | "performance"
  | "production"
  | "testing";

export interface ConfigurationFieldDescriptor {
  readonly defaultValue: string;
  readonly description: string;
  readonly key: string;
  readonly requiresRestart: boolean;
  readonly type: string;
}

export interface ConfigurationPreset {
  readonly config: BrowserLifecycleConfig;
  readonly description: string;
  readonly id: ConfigurationPresetId;
  readonly label: string;
}

export interface ConfigurationValidationResult {
  readonly issues: readonly BrowserLifecycleValidationIssue[];
  readonly valid: boolean;
}

export interface ConfigurationDiffEntry {
  readonly current?: unknown;
  readonly kind: "added" | "changed" | "removed";
  readonly path: string;
  readonly previous?: unknown;
}

export interface CustomConfigurationPreset {
  readonly config: BrowserLifecycleConfig;
  readonly description: string;
  readonly id: string;
  readonly label: string;
  readonly savedAt: number;
}

export const BUILTIN_CONFIGURATION_PRESETS: readonly ConfigurationPreset[] = [
  {
    config: {},
    description: "Package defaults with all modules available.",
    id: "default",
    label: "Default",
  },
  {
    config: { debug: false, emitInitialState: false, idleTimeout: false },
    description: "Reduced observer overhead for production-like sessions.",
    id: "performance",
    label: "Performance",
  },
  {
    config: { debug: true, emitInitialState: true },
    description: "Verbose diagnostics and initial state emission.",
    id: "debug",
    label: "Debug",
  },
  {
    config: { crossTab: false, emitInitialState: false, idleTimeout: false },
    description: "Smallest viable Browser Lifecycle footprint.",
    id: "minimal",
    label: "Minimal",
  },
  {
    config: { autoStart: false, debug: true, emitInitialState: true },
    description: "Manual start with rich diagnostics for local development.",
    id: "development",
    label: "Development",
  },
  {
    config: { autoStart: true, debug: false, emitInitialState: false },
    description: "Auto-starting session with conservative diagnostics.",
    id: "production",
    label: "Production",
  },
  {
    config: { autoStart: false, idleTimeout: 1_000 },
    description: "Fast idle transitions for automated testing.",
    id: "testing",
    label: "Testing",
  },
  {
    config: { activityDebounce: 0 },
    description: "Immediate activity detection for assistive workflows.",
    id: "accessibility",
    label: "Accessibility",
  },
] as const;

/**
 * Converts a resolved configuration back into public input shape for merge/validation.
 */
export function toConfigurationInput(
  resolved: ResolvedBrowserLifecycleConfig,
): BrowserLifecycleConfig {
  return {
    activityDebounce: resolved.activityDebounce,
    activityEvents: [...resolved.activityEvents],
    autoStart: resolved.autoStart,
    crossTab: resolved.crossTab.enabled
      ? {
          channelName: resolved.crossTab.channelName,
          heartbeatInterval: resolved.crossTab.heartbeatInterval,
          leaderTimeout: resolved.crossTab.leaderTimeout,
        }
      : false,
    debug: resolved.debug,
    emitInitialState: resolved.emitInitialState,
    eventBufferSize: resolved.eventBufferSize,
    idleTimeout: resolved.idleTimeout,
    plugins: [...resolved.plugins],
  };
}

export function buildPendingConfigurationInput(
  applied: ResolvedBrowserLifecycleConfig,
  pending: BrowserLifecycleConfig,
): BrowserLifecycleConfig {
  return {
    ...toConfigurationInput(applied),
    ...pending,
  };
}

export const CONFIGURATION_FIELD_DESCRIPTORS: readonly ConfigurationFieldDescriptor[] = [
  {
    defaultValue: "true",
    description: "Starts the session immediately after creation.",
    key: "autoStart",
    requiresRestart: true,
    type: "boolean",
  },
  {
    defaultValue: "false",
    description: "Emits advisory initial state events on startup.",
    key: "emitInitialState",
    requiresRestart: true,
    type: "boolean",
  },
  {
    defaultValue: "false",
    description: "Enables verbose Session Core diagnostics.",
    key: "debug",
    requiresRestart: true,
    type: "boolean",
  },
  {
    defaultValue: "false",
    description: "Idle timeout in milliseconds, or false to disable.",
    key: "idleTimeout",
    requiresRestart: true,
    type: "false | number",
  },
  {
    defaultValue: "100",
    description: "Internal event buffer size for diagnostics.",
    key: "eventBufferSize",
    requiresRestart: true,
    type: "number",
  },
  {
    defaultValue: "250",
    description: "Debounce interval for activity detection.",
    key: "activityDebounce",
    requiresRestart: true,
    type: "number",
  },
  {
    defaultValue: "default",
    description: "Activity events observed by the idle module.",
    key: "activityEvents",
    requiresRestart: true,
    type: "default | string[]",
  },
  {
    defaultValue: "enabled",
    description: "Cross-tab coordination channel settings.",
    key: "crossTab",
    requiresRestart: true,
    type: "boolean | object",
  },
  {
    defaultValue: "[]",
    description: "Plugins registered before session start.",
    key: "plugins",
    requiresRestart: true,
    type: "BrowserLifecyclePlugin[]",
  },
];

export function createConfigurationPlaygroundSession(
  config: BrowserLifecycleConfig = {},
): { readonly lifecycle: BrowserLifecycle; readonly resolved: ResolvedBrowserLifecycleConfig } {
  const resolved = createBrowserLifecycleConfig(config);
  return {
    lifecycle: createBrowserLifecycle(config),
    resolved,
  };
}

export function getDefaultConfiguration(): ResolvedBrowserLifecycleConfig {
  return getDefaultBrowserLifecycleConfig();
}

export function validatePlaygroundConfiguration(
  input: unknown,
): ConfigurationValidationResult {
  try {
    validateBrowserLifecycleConfig(input);
    return { issues: [], valid: true };
  } catch (error) {
    if (error instanceof ConfigurationError) {
      const issues = (error.details?.issues as BrowserLifecycleValidationIssue[] | undefined) ?? [
        { message: error.message, path: "$" },
      ];
      return { issues, valid: false };
    }
    return {
      issues: [{ message: error instanceof Error ? error.message : "Unknown validation error.", path: "$" }],
      valid: false,
    };
  }
}

export function resolvePresetConfig(presetId: ConfigurationPresetId): BrowserLifecycleConfig {
  const preset = BUILTIN_CONFIGURATION_PRESETS.find((entry) => entry.id === presetId);
  if (!preset) {
    return {};
  }
  return { ...preset.config };
}

export function mergePlaygroundConfiguration(
  base: BrowserLifecycleConfig | ResolvedBrowserLifecycleConfig,
  override: BrowserLifecycleConfig = {},
): ResolvedBrowserLifecycleConfig {
  const baseInput =
    "crossTab" in base && typeof base.crossTab === "object" && "enabled" in base.crossTab
      ? toConfigurationInput(base as ResolvedBrowserLifecycleConfig)
      : base;

  return mergeBrowserLifecycleConfig(baseInput as BrowserLifecycleConfig, override);
}

export function serializeConfiguration(
  config: BrowserLifecycleConfig | ResolvedBrowserLifecycleConfig,
  compact = false,
): string {
  return JSON.stringify(config, null, compact ? undefined : 2);
}

export function parseImportedConfiguration(raw: string): {
  readonly config?: BrowserLifecycleConfig;
  readonly error?: string;
} {
  try {
    const parsed: unknown = JSON.parse(raw);
    const validation = validatePlaygroundConfiguration(parsed);
    if (!validation.valid) {
      return { error: validation.issues.map((issue) => `${issue.path}: ${issue.message}`).join("; ") };
    }
    return { config: parsed as BrowserLifecycleConfig };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Invalid JSON." };
  }
}

export function computeConfigurationDiff(
  previous: BrowserLifecycleConfig | ResolvedBrowserLifecycleConfig,
  current: BrowserLifecycleConfig | ResolvedBrowserLifecycleConfig,
): ConfigurationDiffEntry[] {
  const previousJson = JSON.stringify(previous, null, 2);
  const currentJson = JSON.stringify(current, null, 2);
  if (previousJson === currentJson) {
    return [];
  }

  const flatten = (value: unknown, path = ""): Map<string, unknown> => {
    const entries = new Map<string, unknown>();
    if (value === null || typeof value !== "object") {
      entries.set(path || "$", value);
      return entries;
    }
    if (Array.isArray(value)) {
      entries.set(path || "$", value);
      return entries;
    }
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      const childPath = path ? `${path}.${key}` : key;
      if (child !== null && typeof child === "object" && !Array.isArray(child)) {
        for (const [nestedPath, nestedValue] of flatten(child, childPath)) {
          entries.set(nestedPath, nestedValue);
        }
      } else {
        entries.set(childPath, child);
      }
    }
    return entries;
  };

  const left = flatten(previous);
  const right = flatten(current);
  const paths = new Set([...left.keys(), ...right.keys()]);
  const diff: ConfigurationDiffEntry[] = [];

  for (const path of [...paths].sort()) {
    const previousValue = left.get(path);
    const currentValue = right.get(path);
    if (!left.has(path) && right.has(path)) {
      diff.push({ current: currentValue, kind: "added", path });
      continue;
    }
    if (left.has(path) && !right.has(path)) {
      diff.push({ kind: "removed", path, previous: previousValue });
      continue;
    }
    if (JSON.stringify(previousValue) !== JSON.stringify(currentValue)) {
      diff.push({ current: currentValue, kind: "changed", path, previous: previousValue });
    }
  }

  return diff;
}

export function getConfigurationFieldRows(
  resolved: ResolvedBrowserLifecycleConfig,
  pending: BrowserLifecycleConfig,
  defaults: ResolvedBrowserLifecycleConfig,
): readonly {
  readonly defaultValue: string;
  readonly description: string;
  readonly key: string;
  readonly modified: boolean;
  readonly type: string;
  readonly value: string;
}[] {
  return CONFIGURATION_FIELD_DESCRIPTORS.map((field) => {
    const resolvedValue = (resolved as unknown as Record<string, unknown>)[field.key];
    const pendingHasKey = Object.prototype.hasOwnProperty.call(pending, field.key);
    const value =
      field.key === "crossTab"
        ? JSON.stringify(resolved.crossTab)
        : field.key === "plugins"
          ? JSON.stringify(resolved.plugins)
          : field.key === "activityEvents"
            ? JSON.stringify(resolved.activityEvents)
            : JSON.stringify(resolvedValue);
    const defaultValue =
      field.key === "crossTab"
        ? JSON.stringify(defaults.crossTab)
        : field.key === "plugins"
          ? JSON.stringify(defaults.plugins)
          : field.key === "activityEvents"
            ? JSON.stringify(defaults.activityEvents)
            : JSON.stringify((defaults as unknown as Record<string, unknown>)[field.key]);

    return {
      defaultValue,
      description: field.description,
      key: field.key,
      modified: pendingHasKey,
      type: field.type,
      value,
    };
  });
}

export function readCustomPresets(): CustomConfigurationPreset[] {
  if (typeof globalThis.localStorage === "undefined") {
    return [];
  }
  const raw = globalThis.localStorage.getItem(`joc.browser-session-playground.${CUSTOM_PRESETS_STORAGE_KEY}`);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as CustomConfigurationPreset[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCustomPresets(presets: readonly CustomConfigurationPreset[]): void {
  if (typeof globalThis.localStorage === "undefined") {
    return;
  }
  globalThis.localStorage.setItem(
    `joc.browser-session-playground.${CUSTOM_PRESETS_STORAGE_KEY}`,
    JSON.stringify(presets),
  );
}

export function exportConfigurationBundle(
  config: ResolvedBrowserLifecycleConfig,
  presetLabel?: string,
): string {
  return JSON.stringify(
    {
      configuration: config,
      exportedAt: new Date().toISOString(),
      package: "@jayoncode/browser-lifecycle",
      preset: presetLabel,
      version: CONFIGURATION_PLAYGROUND_VERSION,
    },
    null,
    2,
  );
}
