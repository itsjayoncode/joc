import type { SandboxConfig } from "./types.js";

/**
 * Extensibility registry for sandbox capabilities.
 * Opt-in Session Intelligence / Insights factories ship in the package;
 * sandbox panels may still be incomplete — descriptions must stay honest.
 */
export interface SandboxCapability {
  readonly id: string;
  readonly label: string;
  readonly group: "modules" | "idle" | "cross-tab" | "plugins" | "diagnostics" | "future";
  readonly docsPath: string;
  readonly description: string;
  readonly available: boolean;
  readonly isEnabled: (config: SandboxConfig) => boolean;
  readonly codeHint?: (config: SandboxConfig) => string | undefined;
}

export const SANDBOX_CAPABILITIES: readonly SandboxCapability[] = [
  {
    id: "visibility",
    label: "Visibility",
    group: "modules",
    docsPath: "/modules/visibility",
    description: "Page Visibility API observer (always active when session runs).",
    available: true,
    isEnabled: (c) => c.modules.visibility,
  },
  {
    id: "focus",
    label: "Focus",
    group: "modules",
    docsPath: "/modules/focus",
    description: "Window focus/blur attention observer.",
    available: true,
    isEnabled: (c) => c.modules.focus,
  },
  {
    id: "connectivity",
    label: "Connectivity",
    group: "modules",
    docsPath: "/modules/connectivity",
    description: "Advisory online/offline observation.",
    available: true,
    isEnabled: (c) => c.modules.connectivity,
  },
  {
    id: "idle",
    label: "Idle",
    group: "idle",
    docsPath: "/modules/idle",
    description: "Idle timeout + activity debounce.",
    available: true,
    isEnabled: (c) => c.modules.idle,
    codeHint: (c) =>
      c.modules.idle ? `idleTimeout: ${String(c.idle.timeoutMs)}` : "idleTimeout: false",
  },
  {
    id: "lifecycle",
    label: "Lifecycle",
    group: "modules",
    docsPath: "/modules/lifecycle",
    description: "Page Lifecycle freeze/resume signals.",
    available: true,
    isEnabled: (c) => c.modules.lifecycle,
  },
  {
    id: "cross-tab",
    label: "Cross Tab",
    group: "cross-tab",
    docsPath: "/modules/cross-tab",
    description: "BroadcastChannel coordination + primary election.",
    available: true,
    isEnabled: (c) => c.modules.crossTab,
    codeHint: (c) => (c.modules.crossTab ? "crossTab: { … }" : "crossTab: false"),
  },
  {
    id: "logger-plugin",
    label: "Logger plugin",
    group: "plugins",
    docsPath: "/modules/plugins",
    description: "Demo plugin that logs events.",
    available: true,
    isEnabled: (c) => c.loggerPlugin,
  },
  {
    id: "debug",
    label: "Debug mode",
    group: "diagnostics",
    docsPath: "/modules/configuration",
    description: "Verbose package diagnostics.",
    available: true,
    isEnabled: (c) => c.diagnostics.debug,
  },
  {
    id: "activity",
    label: "Activity",
    group: "future",
    docsPath: "/modules/activity",
    description:
      "Opt-in createActivityApi — active/idle facade on the sandbox Dashboard.",
    available: true,
    isEnabled: (c) => c.modules.activity,
  },
  {
    id: "presence",
    label: "Presence",
    group: "future",
    docsPath: "/modules/presence",
    description:
      "Opt-in createPresenceApi — page-local ACTIVE/AWAY/UNKNOWN on the sandbox Dashboard.",
    available: true,
    isEnabled: (c) => c.modules.presence,
  },
  {
    id: "timeline",
    label: "Timeline",
    group: "future",
    docsPath: "/modules/timeline",
    description:
      "Opt-in createTimelineApi — chronological history in the sandbox Timeline tab (no replay/export).",
    available: true,
    isEnabled: (c) => c.modules.timeline,
  },
  {
    id: "metrics",
    label: "Metrics",
    group: "future",
    docsPath: "/modules/metrics",
    description:
      "Opt-in createMetricsApi — Session Insights on the sandbox Dashboard (durations, attention).",
    available: true,
    isEnabled: (c) => c.modules.metrics,
  },
  {
    id: "reports",
    label: "Reports",
    group: "future",
    docsPath: "/modules/reports",
    description:
      "Opt-in createReportsApi — on-demand session summary on the sandbox Dashboard (allocates metrics if needed).",
    available: true,
    isEnabled: (c) => c.modules.reports,
  },
];

export function capabilitiesByGroup(
  group: SandboxCapability["group"],
): readonly SandboxCapability[] {
  return SANDBOX_CAPABILITIES.filter((entry) => entry.group === group);
}

export function activeCapabilityLabels(config: SandboxConfig): readonly string[] {
  return SANDBOX_CAPABILITIES.filter((entry) => entry.available && entry.isEnabled(config)).map(
    (entry) => entry.label,
  );
}
