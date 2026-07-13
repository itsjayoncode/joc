import {
  DEFAULT_ACTIVITY_DEBOUNCE,
  DEFAULT_ACTIVITY_EVENTS,
  DEFAULT_CROSS_TAB_CHANNEL_NAME,
  DEFAULT_CROSS_TAB_HEARTBEAT_INTERVAL,
  DEFAULT_CROSS_TAB_LEADER_TIMEOUT,
  DEFAULT_EVENT_BUFFER_SIZE,
} from "../../constants/index.js";
import { ConfigurationError } from "../../errors/index.js";
import { deepFreeze, isObject, mergeObjects } from "../../utils/index.js";

import type {
  BrowserLifecycleActivityEventName,
  BrowserLifecycleConfig,
  BrowserLifecycleCrossTabConfig,
  BrowserLifecycleCrossTabConfigInput,
  BrowserLifecyclePlugin,
  BrowserLifecycleValidationIssue,
  PlainObject,
  ResolvedBrowserLifecycleConfig,
} from "../../types/index.js";

const ALLOWED_CONFIG_KEYS = new Set<keyof BrowserLifecycleConfig>([
  "activityDebounce",
  "activityEvents",
  "autoStart",
  "crossTab",
  "debug",
  "emitInitialState",
  "eventBufferSize",
  "idleTimeout",
  "plugins",
]);

const ALLOWED_ACTIVITY_EVENTS = new Set<BrowserLifecycleActivityEventName>(DEFAULT_ACTIVITY_EVENTS);

/**
 * Returns an immutable copy of the default configuration.
 */
export function getDefaultBrowserLifecycleConfig(): ResolvedBrowserLifecycleConfig {
  return createBrowserLifecycleConfig();
}

/**
 * Validates a potential Browser Lifecycle configuration object.
 */
export function validateBrowserLifecycleConfig(
  input: unknown,
): asserts input is BrowserLifecycleConfig {
  const issues = collectValidationIssues(input);

  if (issues.length > 0) {
    throw new ConfigurationError("Invalid Browser Lifecycle configuration.", {
      details: {
        issues,
      },
    });
  }
}

/**
 * Creates an immutable resolved configuration object.
 */
export function createBrowserLifecycleConfig(
  input: BrowserLifecycleConfig = {},
): ResolvedBrowserLifecycleConfig {
  validateBrowserLifecycleConfig(input);

  const resolvedCrossTab = resolveCrossTabConfig(input.crossTab);

  return deepFreeze({
    activityDebounce: input.activityDebounce ?? DEFAULT_ACTIVITY_DEBOUNCE,
    activityEvents: resolveActivityEvents(input.activityEvents),
    autoStart: input.autoStart ?? true,
    crossTab: resolvedCrossTab,
    debug: input.debug ?? false,
    emitInitialState: input.emitInitialState ?? false,
    eventBufferSize: input.eventBufferSize ?? DEFAULT_EVENT_BUFFER_SIZE,
    idleTimeout: input.idleTimeout ?? false,
    plugins: [...(input.plugins ?? [])],
  });
}

function collectValidationIssues(input: unknown): BrowserLifecycleValidationIssue[] {
  if (!isObject(input) || Array.isArray(input)) {
    return [
      {
        message: "Configuration must be a plain object.",
        path: "$",
      },
    ];
  }

  const issues: BrowserLifecycleValidationIssue[] = [];
  const config = input;

  for (const key of Object.keys(config)) {
    if (!ALLOWED_CONFIG_KEYS.has(key as keyof BrowserLifecycleConfig)) {
      issues.push({
        message: `Unknown configuration property "${key}".`,
        path: key,
      });
    }
  }

  pushBooleanIssue(issues, "autoStart", config.autoStart);
  pushBooleanIssue(issues, "emitInitialState", config.emitInitialState);
  pushBooleanIssue(issues, "debug", config.debug);
  pushIntegerIssue(issues, "eventBufferSize", config.eventBufferSize, {
    minimum: 0,
  });
  pushIntegerIssue(issues, "activityDebounce", config.activityDebounce, {
    minimum: 0,
  });
  pushIdleTimeoutIssue(issues, config.idleTimeout);
  pushActivityEventsIssue(issues, config.activityEvents);
  pushCrossTabIssue(issues, config.crossTab);
  pushPluginsIssue(issues, config.plugins);

  return issues;
}

function pushBooleanIssue(
  issues: BrowserLifecycleValidationIssue[],
  path: string,
  value: unknown,
): void {
  if (value !== undefined && typeof value !== "boolean") {
    issues.push({
      message: "Expected a boolean value.",
      path,
    });
  }
}

function pushIntegerIssue(
  issues: BrowserLifecycleValidationIssue[],
  path: string,
  value: unknown,
  options: {
    readonly minimum: number;
  },
): void {
  if (value === undefined) {
    return;
  }

  if (typeof value !== "number" || !Number.isInteger(value) || value < options.minimum) {
    issues.push({
      message: `Expected an integer greater than or equal to ${String(options.minimum)}.`,
      path,
    });
  }
}

function pushIdleTimeoutIssue(issues: BrowserLifecycleValidationIssue[], value: unknown): void {
  if (value === undefined || value === false) {
    return;
  }

  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    issues.push({
      message: "idleTimeout must be false or a positive integer.",
      path: "idleTimeout",
    });
  }
}

function pushActivityEventsIssue(issues: BrowserLifecycleValidationIssue[], value: unknown): void {
  if (value === undefined || value === "default") {
    return;
  }

  if (!Array.isArray(value) || value.length === 0) {
    issues.push({
      message: 'activityEvents must be "default" or a non-empty array.',
      path: "activityEvents",
    });
    return;
  }

  for (const [index, eventName] of value.entries()) {
    if (!ALLOWED_ACTIVITY_EVENTS.has(eventName as BrowserLifecycleActivityEventName)) {
      issues.push({
        message: `Unsupported activity event "${String(eventName)}".`,
        path: `activityEvents[${String(index)}]`,
      });
    }
  }
}

function pushCrossTabIssue(issues: BrowserLifecycleValidationIssue[], value: unknown): void {
  if (value === undefined || typeof value === "boolean") {
    return;
  }

  if (!isObject(value) || Array.isArray(value)) {
    issues.push({
      message: "crossTab must be a boolean or a configuration object.",
      path: "crossTab",
    });
    return;
  }

  const crossTabConfig = value;
  const allowedKeys = new Set<keyof BrowserLifecycleCrossTabConfigInput>([
    "channelName",
    "heartbeatInterval",
    "leaderTimeout",
  ]);

  for (const key of Object.keys(crossTabConfig)) {
    if (!allowedKeys.has(key as keyof BrowserLifecycleCrossTabConfigInput)) {
      issues.push({
        message: `Unknown crossTab property "${key}".`,
        path: `crossTab.${key}`,
      });
    }
  }

  if (
    crossTabConfig.channelName !== undefined &&
    (typeof crossTabConfig.channelName !== "string" || crossTabConfig.channelName.trim() === "")
  ) {
    issues.push({
      message: "crossTab.channelName must be a non-empty string.",
      path: "crossTab.channelName",
    });
  }

  pushIntegerIssue(issues, "crossTab.heartbeatInterval", crossTabConfig.heartbeatInterval, {
    minimum: 1,
  });
  pushIntegerIssue(issues, "crossTab.leaderTimeout", crossTabConfig.leaderTimeout, {
    minimum: 1,
  });

  const heartbeatInterval = crossTabConfig.heartbeatInterval;
  const leaderTimeout = crossTabConfig.leaderTimeout;

  if (
    Number.isInteger(heartbeatInterval) &&
    Number.isInteger(leaderTimeout) &&
    (leaderTimeout as number) <= (heartbeatInterval as number)
  ) {
    issues.push({
      message: "crossTab.leaderTimeout must be greater than crossTab.heartbeatInterval.",
      path: "crossTab.leaderTimeout",
    });
  }
}

function pushPluginsIssue(issues: BrowserLifecycleValidationIssue[], value: unknown): void {
  if (value === undefined) {
    return;
  }

  if (!Array.isArray(value)) {
    issues.push({
      message: "plugins must be an array.",
      path: "plugins",
    });
    return;
  }

  const seen = new Set<string>();

  for (const [index, plugin] of value.entries()) {
    if (!isObject(plugin) || Array.isArray(plugin)) {
      issues.push({
        message: "Each plugin must be an object.",
        path: `plugins[${String(index)}]`,
      });
      continue;
    }

    if (typeof plugin.id !== "string" || plugin.id.trim() === "") {
      issues.push({
        message: "Each plugin must have a non-empty string id.",
        path: `plugins[${String(index)}].id`,
      });
      continue;
    }

    if (seen.has(plugin.id)) {
      issues.push({
        message: `Duplicate plugin id "${plugin.id}".`,
        path: `plugins[${String(index)}].id`,
      });
      continue;
    }

    seen.add(plugin.id);
  }
}

function resolveActivityEvents(
  input: BrowserLifecycleConfig["activityEvents"],
): readonly BrowserLifecycleActivityEventName[] {
  if (input === undefined || input === "default") {
    return [...DEFAULT_ACTIVITY_EVENTS];
  }

  return [...new Set(input)];
}

function resolveCrossTabConfig(
  input: BrowserLifecycleConfig["crossTab"],
): BrowserLifecycleCrossTabConfig {
  const defaults: BrowserLifecycleCrossTabConfig = {
    channelName: DEFAULT_CROSS_TAB_CHANNEL_NAME,
    enabled: false,
    heartbeatInterval: DEFAULT_CROSS_TAB_HEARTBEAT_INTERVAL,
    leaderTimeout: DEFAULT_CROSS_TAB_LEADER_TIMEOUT,
  };

  if (input === undefined || input === false) {
    return defaults;
  }

  if (input === true) {
    return {
      ...defaults,
      enabled: true,
    };
  }

  const merged = mergeObjects(
    defaults as unknown as PlainObject,
    input as unknown as PlainObject,
  ) as unknown as BrowserLifecycleCrossTabConfig;

  return {
    ...merged,
    enabled: true,
  };
}

/**
 * Creates an immutable configuration object by layering overrides on top of a base config.
 */
export function mergeBrowserLifecycleConfig(
  base: BrowserLifecycleConfig = {},
  override: BrowserLifecycleConfig = {},
): ResolvedBrowserLifecycleConfig {
  validateBrowserLifecycleConfig(base);
  validateBrowserLifecycleConfig(override);

  const merged = mergeObjects(
    base as PlainObject,
    override as PlainObject,
  ) as BrowserLifecycleConfig;

  return createBrowserLifecycleConfig(merged);
}

/**
 * Returns a readonly copy of plugin ids for diagnostics and tests.
 */
export function getPluginIds(config: ResolvedBrowserLifecycleConfig): readonly string[] {
  return config.plugins.map((plugin: BrowserLifecyclePlugin) => plugin.id);
}
