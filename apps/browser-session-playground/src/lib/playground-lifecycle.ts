import {
  createBrowserLifecycle,
  supportsPageLifecycle,
} from "@jayoncode/browser-lifecycle";

import type {
  BrowserLifecycle,
  BrowserLifecycleConfig,
  BrowserLifecycleEventMap,
  BrowserLifecyclePageState,
  BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

import { formatPlaygroundTimestamp, formatFocusDuration } from "./browser-lifecycle.js";

export type LifecyclePlaygroundEvent =
  | BrowserLifecycleEventMap["page:resume"]
  | BrowserLifecycleEventMap["page:suspend"]
  | BrowserLifecycleEventMap["session:restored"];

export interface LifecycleEventLogEntry {
  readonly current: string;
  readonly id: string;
  readonly label: string;
  readonly payloadSummary: string;
  readonly previous: string;
  readonly source: string;
  readonly timestamp: number;
  readonly timestampLabel: string;
  readonly type:
    | LifecyclePlaygroundEvent["type"]
    | "page:hidden"
    | "page:visible";
}

export interface LifecycleBrowserApiInfo {
  readonly lifecycleCapability: boolean;
  readonly limitations: readonly string[];
  readonly mappings: readonly { readonly browserApi: string; readonly sessionEvent: string }[];
}

export const LIFECYCLE_PLAYGROUND_CONFIG: BrowserLifecycleConfig = {
  autoStart: false,
  crossTab: false,
  emitInitialState: true,
  idleTimeout: false,
};

export const LIFECYCLE_BROWSER_COMPATIBILITY = [
  { browser: "Chrome", freeze: "supported", resume: "supported", visibility: "supported" },
  { browser: "Firefox", freeze: "partial", resume: "partial", visibility: "supported" },
  { browser: "Safari", freeze: "supported", resume: "supported", visibility: "supported" },
  { browser: "Edge", freeze: "supported", resume: "supported", visibility: "supported" },
] as const;

export function createLifecyclePlaygroundSession(): BrowserLifecycle {
  return createBrowserLifecycle(LIFECYCLE_PLAYGROUND_CONFIG);
}

export function formatLifecycleDuration(milliseconds: number): string {
  return formatFocusDuration(milliseconds);
}

export function formatLifecycleEventLogEntry(
  event:
    | LifecyclePlaygroundEvent
    | BrowserLifecycleEventMap["page:hidden"]
    | BrowserLifecycleEventMap["page:visible"],
  options: { readonly id?: string } = {},
): LifecycleEventLogEntry {
  const timestampLabel = formatPlaygroundTimestamp(event.timestamp);

  return {
    current: event.current,
    id: options.id ?? `${event.type}-${String(event.timestamp)}`,
    label: event.type,
    payloadSummary: `${event.previous} → ${event.current} · source=${event.source}`,
    previous: String(event.previous),
    source: event.source,
    timestamp: event.timestamp,
    timestampLabel,
    type: event.type,
  };
}

export function getLifecycleStatusLabel(lifecycle: BrowserLifecyclePageState): string {
  switch (lifecycle) {
    case "active":
      return "Active";
    case "frozen":
      return "Frozen";
    case "terminated":
      return "Terminated";
    default:
      return "Unknown";
  }
}

export function isLifecyclePlaygroundSupported(
  snapshot: Pick<BrowserLifecycleSnapshot, "capabilities">,
): boolean {
  return snapshot.capabilities.pageLifecycle || supportsPageLifecycle();
}

export function sortLifecycleEventLogNewestFirst(
  entries: readonly LifecycleEventLogEntry[],
): readonly LifecycleEventLogEntry[] {
  return [...entries].sort((left, right) => right.timestamp - left.timestamp);
}

export function getLifecycleBrowserApiInfo(
  snapshot?: Pick<BrowserLifecycleSnapshot, "capabilities">,
): LifecycleBrowserApiInfo {
  return {
    lifecycleCapability: snapshot?.capabilities.pageLifecycle ?? supportsPageLifecycle(),
    limitations: [
      "Page lifecycle events vary by browser and may not fire in every environment.",
      "Visibility transitions are shown for context but owned by the visibility module.",
    ],
    mappings: [
      { browserApi: "document.visibilityState + freeze", sessionEvent: "page:suspend" },
      { browserApi: "document.visibilityState + resume", sessionEvent: "page:resume" },
      { browserApi: "pageshow persisted", sessionEvent: "session:restored" },
      { browserApi: "visibilitychange", sessionEvent: "page:visible / page:hidden" },
    ],
  };
}
