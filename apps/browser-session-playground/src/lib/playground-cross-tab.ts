import {
  createBrowserLifecycle,
  supportsBroadcastChannel,
} from "@jayoncode/browser-lifecycle";

import type {
  BrowserLifecycle,
  BrowserLifecycleConfig,
  BrowserLifecycleEventMap,
  BrowserLifecycleSnapshot,
  BrowserLifecycleTabState,
} from "@jayoncode/browser-lifecycle";

import { formatPlaygroundTimestamp, formatFocusDuration } from "./browser-lifecycle.js";

export type CrossTabPlaygroundEvent =
  | BrowserLifecycleEventMap["tab:message"]
  | BrowserLifecycleEventMap["tab:primary"]
  | BrowserLifecycleEventMap["tab:secondary"];

export interface CrossTabEventLogEntry {
  readonly id: string;
  readonly label: string;
  readonly payloadSummary: string;
  readonly timestamp: number;
  readonly timestampLabel: string;
  readonly type: CrossTabPlaygroundEvent["type"];
}

export interface CrossTabBrowserApiInfo {
  readonly broadcastChannelSupported: boolean;
  readonly channelName: string;
  readonly crossTabEnabled: boolean;
  readonly limitations: readonly string[];
  readonly mappings: readonly { readonly browserApi: string; readonly sessionEvent: string }[];
  readonly storageEventsSupported: boolean;
}

export const CROSS_TAB_PLAYGROUND_CONFIG: BrowserLifecycleConfig = {
  autoStart: false,
  crossTab: {
    channelName: "jayoncode:browser-session-playground",
    heartbeatInterval: 1_000,
    leaderTimeout: 3_000,
  },
  emitInitialState: true,
  idleTimeout: false,
};

export const CROSS_TAB_DEVELOPER_EXAMPLES = [
  {
    description: "Keep a single primary tab responsible for websocket ownership.",
    id: "single-websocket",
    snippet: `const lifecycle = createBrowserLifecycle({ crossTab: true });

lifecycle.on("tab:primary", () => {
  websocket.connect();
});

lifecycle.on("tab:secondary", () => {
  websocket.disconnect();
});

lifecycle.start();`,
    title: "Single WebSocket owner",
  },
  {
    description: "Broadcast logout to every open tab through Browser Lifecycle transport events.",
    id: "cross-tab-logout",
    snippet: `const lifecycle = createBrowserLifecycle({ crossTab: true });

lifecycle.on("tab:message", (event) => {
  if (event.metadata?.messageType === "logout") {
    auth.clearSession();
  }
});

lifecycle.start();`,
    title: "Cross-tab logout",
  },
] as const;

export function createCrossTabPlaygroundSession(): BrowserLifecycle {
  return createBrowserLifecycle(CROSS_TAB_PLAYGROUND_CONFIG);
}

export function formatCrossTabEventLogEntry(event: CrossTabPlaygroundEvent): CrossTabEventLogEntry {
  return {
    id: `${event.type}-${String(event.timestamp)}`,
    label: event.type,
    payloadSummary:
      event.type === "tab:message"
        ? `messageType=${event.metadata?.messageType ?? "unknown"} · sender=${event.metadata?.senderId ?? "unknown"}`
        : `role=${event.current} · previous=${String(event.previous)}`,
    timestamp: event.timestamp,
    timestampLabel: formatPlaygroundTimestamp(event.timestamp),
    type: event.type,
  };
}

export function getTabRoleLabel(tab: BrowserLifecycleTabState): string {
  switch (tab) {
    case "primary":
      return "Primary";
    case "secondary":
      return "Secondary";
    case "single":
      return "Single tab";
    default:
      return "Unknown";
  }
}

export function isCrossTabPlaygroundSupported(
  snapshot: Pick<BrowserLifecycleSnapshot, "capabilities">,
): boolean {
  return snapshot.capabilities.broadcastChannel;
}

export function sortCrossTabEventLogNewestFirst(
  entries: readonly CrossTabEventLogEntry[],
): readonly CrossTabEventLogEntry[] {
  return [...entries].sort((left, right) => right.timestamp - left.timestamp);
}

export function getCrossTabBrowserApiInfo(
  snapshot?: Pick<BrowserLifecycleSnapshot, "capabilities">,
): CrossTabBrowserApiInfo {
  const runtime = globalThis as { readonly localStorage?: { setItem: (key: string, value: string) => void } };

  return {
    broadcastChannelSupported: snapshot?.capabilities.broadcastChannel ?? supportsBroadcastChannel(),
    channelName: CROSS_TAB_PLAYGROUND_CONFIG.crossTab
      ? typeof CROSS_TAB_PLAYGROUND_CONFIG.crossTab === "object"
        ? CROSS_TAB_PLAYGROUND_CONFIG.crossTab.channelName ?? "jayoncode:browser-session-playground"
        : "jayoncode:browser-session-playground"
      : "jayoncode:browser-session-playground",
    crossTabEnabled: true,
    limitations: [
      "BroadcastChannel requires same-origin tabs.",
      "Storage events act as a fallback transport when configured.",
      "Leader election is advisory and heartbeat-driven.",
    ],
    mappings: [
      { browserApi: "BroadcastChannel", sessionEvent: "tab:message" },
      { browserApi: "storage event", sessionEvent: "tab:message" },
      { browserApi: "leader heartbeat", sessionEvent: "tab:primary / tab:secondary" },
    ],
    storageEventsSupported: runtime.localStorage !== undefined,
  };
}

export function formatCrossTabDuration(milliseconds: number): string {
  return formatFocusDuration(milliseconds);
}
