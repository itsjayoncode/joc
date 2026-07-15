import { createBrowserLifecycle, supportsIdle, supportsRequestIdleCallback } from "@jayoncode/browser-lifecycle";

import type {
  BrowserLifecycle,
  BrowserLifecycleActivityEventName,
  BrowserLifecycleConfig,
  BrowserLifecycleEventMap,
  BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

import { formatPlaygroundTimestamp, formatFocusDuration } from "./browser-lifecycle.js";

export type IdlePlaygroundEvent =
  | BrowserLifecycleEventMap["activity:detected"]
  | BrowserLifecycleEventMap["activity:reset"]
  | BrowserLifecycleEventMap["session:active"]
  | BrowserLifecycleEventMap["session:idle"];

export type BrowserLifecycleActivityState = BrowserLifecycleSnapshot["activity"];

export interface IdleEventLogEntry {
  readonly current: BrowserLifecycleActivityState | "active" | "idle";
  readonly id: string;
  readonly label: string;
  readonly payloadSummary: string;
  readonly previous: BrowserLifecycleActivityState;
  readonly source: string;
  readonly timestamp: number;
  readonly timestampLabel: string;
  readonly type: IdlePlaygroundEvent["type"];
}

export interface IdleBrowserApiInfo {
  readonly activitySources: readonly BrowserLifecycleActivityEventName[];
  readonly idleCapability: boolean;
  readonly idleTimeout: number | false;
  readonly limitations: readonly string[];
  readonly requestIdleCallbackSupported: boolean;
  readonly strategy: string;
}

export const IDLE_TIMEOUT_PRESETS = [
  { id: "10s", label: "10 seconds", value: 10_000 },
  { id: "30s", label: "30 seconds", value: 30_000 },
  { id: "1m", label: "1 minute", value: 60_000 },
  { id: "5m", label: "5 minutes", value: 300_000 },
] as const;

export function createIdlePlaygroundSession(idleTimeoutMs: number): BrowserLifecycle {
  const config: BrowserLifecycleConfig = {
    autoStart: false,
    crossTab: false,
    emitInitialState: true,
    idleTimeout: idleTimeoutMs,
  };

  return createBrowserLifecycle(config);
}

export function formatIdleDuration(milliseconds: number): string {
  return formatFocusDuration(milliseconds);
}

export function formatIdleEventLogEntry(
  event: IdlePlaygroundEvent,
  options: { readonly id?: string } = {},
): IdleEventLogEntry {
  const timestampLabel = formatPlaygroundTimestamp(event.timestamp);

  return {
    current: event.current,
    id: options.id ?? `${event.type}-${String(event.timestamp)}`,
    label: event.type,
    payloadSummary: `${event.previous} → ${event.current} · source=${event.source}`,
    previous: event.previous,
    source: event.source,
    timestamp: event.timestamp,
    timestampLabel,
    type: event.type,
  };
}

export function getIdleStatusLabel(activity: BrowserLifecycleActivityState): string {
  switch (activity) {
    case "active":
      return "Active";
    case "idle":
      return "Idle";
    default:
      return "Unknown";
  }
}

export function isIdlePlaygroundSupported(
  snapshot: Pick<BrowserLifecycleSnapshot, "capabilities">,
  idleTimeout: number | false,
): boolean {
  return snapshot.capabilities.idle && idleTimeout !== false;
}

export function sortIdleEventLogNewestFirst(
  entries: readonly IdleEventLogEntry[],
): readonly IdleEventLogEntry[] {
  return [...entries].sort((left, right) => right.timestamp - left.timestamp);
}

export function filterIdleEventLog(
  entries: readonly IdleEventLogEntry[],
  query: string,
): readonly IdleEventLogEntry[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return entries;
  return entries.filter((entry) =>
    [entry.type, entry.label, entry.payloadSummary, entry.source, entry.timestampLabel]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function getIdleBrowserApiInfo(
  snapshot?: Pick<BrowserLifecycleSnapshot, "capabilities">,
  idleTimeout: number | false = 30_000,
): IdleBrowserApiInfo {
  return {
    activitySources: [
      "pointerdown",
      "keydown",
      "touchstart",
      "visibilitychange",
      "focus",
    ],
    idleCapability: snapshot?.capabilities.idle ?? supportsIdle(),
    idleTimeout,
    limitations: [
      "Idle Detection API is experimental and not used as the primary signal.",
      "requestIdleCallback measures main-thread scheduling, not user inactivity.",
      "Activity heuristics remain the default idle strategy.",
    ],
    requestIdleCallbackSupported: supportsRequestIdleCallback(),
    strategy: "Activity heuristics with configurable idleTimeout",
  };
}
