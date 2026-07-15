import {
  createBrowserLifecycle,
  supportsConnectivity,
  supportsFocus,
} from "@jayoncode/browser-lifecycle";

import type {
  BrowserLifecycle,
  BrowserLifecycleConfig,
  BrowserLifecycleEventMap,
  BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

export type BrowserLifecycleVisibilityState = BrowserLifecycleSnapshot["visibility"];
export type BrowserLifecycleAttentionState = BrowserLifecycleSnapshot["attention"];
export type BrowserLifecycleConnectivityState = BrowserLifecycleSnapshot["connectivity"];

export type VisibilityPlaygroundEvent =
  | BrowserLifecycleEventMap["page:hidden"]
  | BrowserLifecycleEventMap["page:visible"];

export type VisibilityPlaygroundEventName = VisibilityPlaygroundEvent["type"];

export type FocusPlaygroundEvent =
  | BrowserLifecycleEventMap["window:blur"]
  | BrowserLifecycleEventMap["window:focus"];

export type FocusPlaygroundEventName = FocusPlaygroundEvent["type"];

export type ConnectivityPlaygroundEvent =
  | BrowserLifecycleEventMap["connection:offline"]
  | BrowserLifecycleEventMap["connection:online"]
  | BrowserLifecycleEventMap["connection:reconnect"];

export type ConnectivityPlaygroundEventName = ConnectivityPlaygroundEvent["type"];

export interface BrowserLifecycleIntegrationSummary {
  readonly defaultConfig: BrowserLifecycleConfig;
  readonly entryPoint: "createBrowserLifecycle";
  readonly packageName: "@jayoncode/browser-lifecycle";
}

export interface VisibilityEventLogEntry {
  readonly current: "hidden" | "visible";
  readonly id: string;
  readonly label: string;
  readonly likelyLastSignal?: boolean;
  readonly previous: BrowserLifecycleVisibilityState;
  readonly reason?: string;
  readonly timestamp: number;
  readonly timestampLabel: string;
  readonly type: VisibilityPlaygroundEventName;
}

export interface FocusEventLogEntry {
  readonly current: BrowserLifecycleAttentionState;
  readonly id: string;
  readonly label: string;
  readonly payloadSummary: string;
  readonly previous: BrowserLifecycleAttentionState;
  readonly reason?: string;
  readonly source: string;
  readonly timestamp: number;
  readonly timestampLabel: string;
  readonly type: FocusPlaygroundEventName;
}

export interface FocusBrowserApiMapping {
  readonly browserApi: string;
  readonly sessionEvent: string;
}

export interface FocusBrowserApiInfo {
  readonly currentBrowserFocus: boolean | null;
  readonly documentHasFocusSupported: boolean;
  readonly eventSource: string;
  readonly focusCapability: boolean;
  readonly mappings: readonly FocusBrowserApiMapping[];
  readonly windowBlurSupported: boolean;
  readonly windowFocusSupported: boolean;
}

export interface ConnectivityEventLogEntry {
  readonly current: BrowserLifecycleConnectivityState | "online";
  readonly id: string;
  readonly label: string;
  readonly offlineDuration?: number;
  readonly payloadSummary: string;
  readonly previous: BrowserLifecycleConnectivityState;
  readonly reason?: string;
  readonly source: string;
  readonly timestamp: number;
  readonly timestampLabel: string;
  readonly type: ConnectivityPlaygroundEventName;
}

export interface ConnectivityBrowserApiMapping {
  readonly browserApi: string;
  readonly sessionEvent: string;
}

export interface NetworkInformationSnapshot {
  readonly connectionType: string | null;
  readonly downlink: number | null;
  readonly effectiveType: string | null;
  readonly rtt: number | null;
  readonly saveData: boolean | null;
  readonly supported: boolean;
}

export interface ConnectivityBrowserApiInfo {
  readonly connectivityCapability: boolean;
  readonly currentNavigatorOnLine: boolean | null;
  readonly eventSource: string;
  readonly limitations: readonly string[];
  readonly mappings: readonly ConnectivityBrowserApiMapping[];
  readonly navigatorOnLineSupported: boolean;
  readonly networkInformation: NetworkInformationSnapshot;
  readonly onlineEventSupported: boolean;
}

export const VISIBILITY_PLAYGROUND_CONFIG: BrowserLifecycleConfig = {
  autoStart: false,
  crossTab: false,
  emitInitialState: true,
};

export const FOCUS_PLAYGROUND_CONFIG: BrowserLifecycleConfig = {
  autoStart: false,
  crossTab: false,
  emitInitialState: true,
};

export const CONNECTIVITY_PLAYGROUND_CONFIG: BrowserLifecycleConfig = {
  autoStart: false,
  crossTab: false,
  emitInitialState: true,
};

export const CONNECTIVITY_BROWSER_API_MAPPINGS: readonly ConnectivityBrowserApiMapping[] = [
  { browserApi: "online event", sessionEvent: "connection:online" },
  { browserApi: "offline event", sessionEvent: "connection:offline" },
  { browserApi: "navigator.onLine", sessionEvent: "snapshot.connectivity" },
  { browserApi: "offline → online cycle", sessionEvent: "connection:reconnect" },
] as const;

export const CONNECTIVITY_DEVELOPER_EXAMPLES = [
  {
    description:
      "Pause API polling while the advisory connectivity hint reports offline to avoid noisy failed requests.",
    id: "pause-polling",
    snippet: `const lifecycle = createBrowserLifecycle({ emitInitialState: true });

lifecycle.on("connection:offline", () => {
  pollingController.pause();
});

lifecycle.on("connection:online", () => {
  pollingController.resume();
});

lifecycle.start();`,
    title: "Pause API polling",
  },
  {
    description:
      "Retry failed requests after a reconnect event instead of treating navigator.onLine as proof the server is reachable.",
    id: "retry-requests",
    snippet: `const lifecycle = createBrowserLifecycle();

lifecycle.on("connection:reconnect", () => {
  requestQueue.retryFailed();
});

lifecycle.start();`,
    title: "Retry failed requests",
  },
  {
    description:
      "Show an offline banner from Browser Lifecycle events while keeping queued writes for later sync.",
    id: "offline-banner",
    snippet: `const lifecycle = createBrowserLifecycle({ emitInitialState: true });

lifecycle.on("connection:offline", () => {
  banner.show("You appear offline. Changes will sync when connectivity returns.");
});

lifecycle.on("connection:reconnect", () => {
  banner.hide();
  syncQueue.flush();
});

lifecycle.start();`,
    title: "Offline notification banner",
  },
  {
    description:
      "Disable destructive network actions while offline and re-enable them after connection:online.",
    id: "disable-network-actions",
    snippet: `const lifecycle = createBrowserLifecycle();
let canSubmit = lifecycle.getSnapshot().connectivity === "online";

lifecycle.on("connection:offline", () => {
  canSubmit = false;
});

lifecycle.on("connection:online", () => {
  canSubmit = true;
});

lifecycle.start();`,
    title: "Disable network actions",
  },
] as const;

export const FOCUS_BROWSER_API_MAPPINGS: readonly FocusBrowserApiMapping[] = [
  { browserApi: "window focus", sessionEvent: "window:focus" },
  { browserApi: "window blur", sessionEvent: "window:blur" },
  { browserApi: "document.hasFocus()", sessionEvent: "snapshot.attention" },
] as const;

export const FOCUS_DEVELOPER_EXAMPLES = [
  {
    description:
      "Pause keyboard shortcuts when the window loses attention so shortcuts do not fire while the user works elsewhere.",
    id: "pause-shortcuts",
    snippet: `const lifecycle = createBrowserLifecycle({ emitInitialState: true });

lifecycle.on("window:blur", () => {
  shortcutManager.pause();
});

lifecycle.on("window:focus", () => {
  shortcutManager.resume();
});

lifecycle.start();`,
    title: "Pause keyboard shortcuts",
  },
  {
    description:
      "Stop game input loops on blur and resume them when focus returns to keep simulation aligned with attention.",
    id: "pause-game-controls",
    snippet: `const lifecycle = createBrowserLifecycle();

lifecycle.on("window:blur", () => {
  gameControls.disable();
});

lifecycle.on("window:focus", () => {
  gameControls.enable();
});

lifecycle.start();`,
    title: "Pause game controls",
  },
  {
    description:
      "Require an active window before confirming sensitive actions so blur transitions block destructive operations.",
    id: "lock-secure-actions",
    snippet: `const lifecycle = createBrowserLifecycle({ emitInitialState: true });
let windowFocused = lifecycle.getSnapshot().attention === "focused";

lifecycle.on("window:blur", () => {
  windowFocused = false;
});

lifecycle.on("window:focus", () => {
  windowFocused = true;
});

function confirmSecureAction() {
  if (!windowFocused) {
    return;
  }

  submitSecureAction();
}`,
    title: "Lock secure actions",
  },
] as const;

export function getBrowserLifecycleIntegrationSummary(): BrowserLifecycleIntegrationSummary {
  return {
    defaultConfig: VISIBILITY_PLAYGROUND_CONFIG,
    entryPoint: "createBrowserLifecycle",
    packageName: "@jayoncode/browser-lifecycle",
  };
}

export function createVisibilityPlaygroundSession(): BrowserLifecycle {
  return createBrowserLifecycle(VISIBILITY_PLAYGROUND_CONFIG);
}

export function createFocusPlaygroundSession(): BrowserLifecycle {
  return createBrowserLifecycle(FOCUS_PLAYGROUND_CONFIG);
}

export function createConnectivityPlaygroundSession(): BrowserLifecycle {
  return createBrowserLifecycle(CONNECTIVITY_PLAYGROUND_CONFIG);
}

export function formatPlaygroundTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatVisibilityTimestamp(timestamp: number): string {
  return formatPlaygroundTimestamp(timestamp);
}

export function formatFocusTimestamp(timestamp: number): string {
  return formatPlaygroundTimestamp(timestamp);
}

export function formatFocusDuration(milliseconds: number): string {
  if (milliseconds < 1_000) {
    return `${String(milliseconds)}ms`;
  }

  const totalSeconds = Math.floor(milliseconds / 1_000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${String(seconds)}s`;
  }

  return `${String(minutes)}m ${String(seconds)}s`;
}

export function formatVisibilityEventLogEntry(
  event: VisibilityPlaygroundEvent,
  options: {
    readonly formatTimestamp?: (timestamp: number) => string;
    readonly id?: string;
  } = {},
): VisibilityEventLogEntry {
  const formatTimestamp = options.formatTimestamp ?? formatVisibilityTimestamp;
  const timestampLabel = formatTimestamp(event.timestamp);

  if (event.type === "page:visible") {
    return {
      current: event.current,
      id: options.id ?? `${event.type}-${String(event.timestamp)}`,
      label: `${event.type} (${event.metadata.reason})`,
      previous: event.previous,
      reason: event.metadata.reason,
      timestamp: event.timestamp,
      timestampLabel,
      type: event.type,
    };
  }

  return {
    current: event.current,
    id: options.id ?? `${event.type}-${String(event.timestamp)}`,
    label: `${event.type} (likelyLastSignal=${String(event.metadata.likelyLastSignal)})`,
    likelyLastSignal: event.metadata.likelyLastSignal,
    previous: event.previous,
    reason: event.metadata.reason,
    timestamp: event.timestamp,
    timestampLabel,
    type: event.type,
  };
}

export function getVisibilityStatusLabel(
  visibility: BrowserLifecycleVisibilityState,
): string {
  switch (visibility) {
    case "hidden":
      return "Hidden";
    case "visible":
      return "Visible";
    default:
      return "Unknown";
  }
}

export function isVisibilityPlaygroundSupported(
  snapshot: Pick<BrowserLifecycleSnapshot, "capabilities">,
): boolean {
  return snapshot.capabilities.visibility;
}

export function sortVisibilityEventLog(
  entries: readonly VisibilityEventLogEntry[],
): readonly VisibilityEventLogEntry[] {
  return [...entries].sort((left, right) => left.timestamp - right.timestamp);
}

export function formatFocusEventLogEntry(
  event: FocusPlaygroundEvent,
  options: {
    readonly formatTimestamp?: (timestamp: number) => string;
    readonly id?: string;
  } = {},
): FocusEventLogEntry {
  const formatTimestamp = options.formatTimestamp ?? formatFocusTimestamp;
  const timestampLabel = formatTimestamp(event.timestamp);
  const reason = String(event.metadata?.reason ?? "transition");

  return {
    current: event.current,
    id: options.id ?? `${event.type}-${String(event.timestamp)}`,
    label: `${event.type} (${reason})`,
    payloadSummary: `${event.previous} → ${event.current} · source=${event.source} · reason=${reason}`,
    previous: event.previous,
    reason,
    source: event.source,
    timestamp: event.timestamp,
    timestampLabel,
    type: event.type,
  };
}

export function getFocusStatusLabel(attention: BrowserLifecycleAttentionState): string {
  switch (attention) {
    case "focused":
      return "Focused";
    case "unfocused":
      return "Blurred";
    default:
      return "Unknown";
  }
}

export function isFocusPlaygroundSupported(
  snapshot: Pick<BrowserLifecycleSnapshot, "capabilities">,
): boolean {
  return snapshot.capabilities.focus;
}

export function sortFocusEventLogNewestFirst(
  entries: readonly FocusEventLogEntry[],
): readonly FocusEventLogEntry[] {
  return [...entries].sort((left, right) => right.timestamp - left.timestamp);
}

export function filterFocusEventLog(
  entries: readonly FocusEventLogEntry[],
  query: string,
): readonly FocusEventLogEntry[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return entries;
  }

  return entries.filter((entry) => {
    const haystack = [
      entry.type,
      entry.label,
      entry.payloadSummary,
      entry.previous,
      entry.current,
      entry.source,
      entry.reason ?? "",
      entry.timestampLabel,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function serializeFocusEventLogEntry(entry: FocusEventLogEntry): string {
  return JSON.stringify(
    {
      current: entry.current,
      previous: entry.previous,
      reason: entry.reason,
      source: entry.source,
      timestamp: entry.timestamp,
      type: entry.type,
    },
    null,
    2,
  );
}

export function getFocusBrowserApiInfo(
  snapshot?: Pick<BrowserLifecycleSnapshot, "capabilities">,
): FocusBrowserApiInfo {
  const runtime = globalThis as {
    readonly document?: { hasFocus?: () => boolean };
    readonly window?: {
      addEventListener?: unknown;
      removeEventListener?: unknown;
    };
  };

  const documentHasFocusSupported = typeof runtime.document?.hasFocus === "function";
  const windowFocusSupported =
    runtime.window !== undefined &&
    typeof runtime.window.addEventListener === "function" &&
    typeof runtime.window.removeEventListener === "function";

  return {
    currentBrowserFocus: documentHasFocusSupported ? runtime.document?.hasFocus?.() ?? null : null,
    documentHasFocusSupported,
    eventSource: "window focus/blur events normalized through document.hasFocus()",
    focusCapability: snapshot?.capabilities.focus ?? supportsFocus(),
    mappings: FOCUS_BROWSER_API_MAPPINGS,
    windowBlurSupported: windowFocusSupported,
    windowFocusSupported,
  };
}

export function formatConnectivityDuration(milliseconds: number): string {
  return formatFocusDuration(milliseconds);
}

export function formatConnectivityEventLogEntry(
  event: ConnectivityPlaygroundEvent,
  options: {
    readonly formatTimestamp?: (timestamp: number) => string;
    readonly id?: string;
  } = {},
): ConnectivityEventLogEntry {
  const formatTimestamp = options.formatTimestamp ?? formatPlaygroundTimestamp;
  const timestampLabel = formatTimestamp(event.timestamp);
  const reason =
    event.type === "connection:reconnect" ? undefined : event.metadata?.reason;
  const offlineDuration =
    event.type === "connection:reconnect" ? event.metadata?.offlineDuration : undefined;

  return {
    current: event.current,
    id: options.id ?? `${event.type}-${String(event.timestamp)}`,
    label:
      event.type === "connection:reconnect"
        ? `${event.type} (${String(offlineDuration ?? 0)}ms offline)`
        : `${event.type} (${reason ?? "transition"})`,
    ...(offlineDuration !== undefined ? { offlineDuration } : {}),
    payloadSummary:
      event.type === "connection:reconnect"
        ? `offline → online · duration=${String(offlineDuration ?? 0)}ms · source=${event.source}`
        : `${event.previous} → ${event.current} · source=${event.source} · advisory=true`,
    previous: event.previous,
    ...(reason !== undefined ? { reason } : {}),
    source: event.source,
    timestamp: event.timestamp,
    timestampLabel,
    type: event.type,
  };
}

export function getConnectivityStatusLabel(
  connectivity: BrowserLifecycleConnectivityState,
): string {
  switch (connectivity) {
    case "online":
      return "Online";
    case "offline":
      return "Offline";
    default:
      return "Unknown";
  }
}

export function isConnectivityPlaygroundSupported(
  snapshot: Pick<BrowserLifecycleSnapshot, "capabilities">,
): boolean {
  return snapshot.capabilities.connectivity;
}

export function sortConnectivityEventLogNewestFirst(
  entries: readonly ConnectivityEventLogEntry[],
): readonly ConnectivityEventLogEntry[] {
  return [...entries].sort((left, right) => right.timestamp - left.timestamp);
}

export function filterConnectivityEventLog(
  entries: readonly ConnectivityEventLogEntry[],
  query: string,
): readonly ConnectivityEventLogEntry[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return entries;
  }

  return entries.filter((entry) => {
    const haystack = [
      entry.type,
      entry.label,
      entry.payloadSummary,
      entry.previous,
      entry.current,
      entry.source,
      entry.reason ?? "",
      entry.timestampLabel,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function serializeConnectivityEventLogEntry(entry: ConnectivityEventLogEntry): string {
  return JSON.stringify(
    {
      current: entry.current,
      offlineDuration: entry.offlineDuration,
      previous: entry.previous,
      reason: entry.reason,
      source: entry.source,
      timestamp: entry.timestamp,
      type: entry.type,
    },
    null,
    2,
  );
}

function readNetworkInformationSnapshot(): NetworkInformationSnapshot {
  const runtime = globalThis as {
    readonly navigator?: {
      readonly connection?: {
        readonly downlink?: number;
        readonly effectiveType?: string;
        readonly rtt?: number;
        readonly saveData?: boolean;
        readonly type?: string;
      };
      readonly mozConnection?: unknown;
      readonly webkitConnection?: unknown;
    };
  };

  const navigatorRef = runtime.navigator;
  const connection = (navigatorRef?.connection ??
    navigatorRef?.mozConnection ??
    navigatorRef?.webkitConnection) as
    | {
        readonly downlink?: number;
        readonly effectiveType?: string;
        readonly rtt?: number;
        readonly saveData?: boolean;
        readonly type?: string;
      }
    | undefined;

  if (!connection) {
    return {
      connectionType: null,
      downlink: null,
      effectiveType: null,
      rtt: null,
      saveData: null,
      supported: false,
    };
  }

  return {
    connectionType: connection.type ?? null,
    downlink: connection.downlink ?? null,
    effectiveType: connection.effectiveType ?? null,
    rtt: connection.rtt ?? null,
    saveData: connection.saveData ?? null,
    supported: true,
  };
}

export function getConnectivityBrowserApiInfo(
  snapshot?: Pick<BrowserLifecycleSnapshot, "capabilities">,
): ConnectivityBrowserApiInfo {
  const runtime = globalThis as {
    readonly navigator?: { readonly onLine?: boolean };
    readonly window?: {
      addEventListener?: unknown;
      removeEventListener?: unknown;
    };
  };

  const navigatorOnLineSupported = typeof runtime.navigator?.onLine === "boolean";
  const onlineEventSupported =
    runtime.window !== undefined &&
    typeof runtime.window.addEventListener === "function" &&
    typeof runtime.window.removeEventListener === "function";

  return {
    connectivityCapability: snapshot?.capabilities.connectivity ?? supportsConnectivity(),
    currentNavigatorOnLine: navigatorOnLineSupported ? runtime.navigator?.onLine ?? null : null,
    eventSource: "window online/offline events normalized through navigator.onLine",
    limitations: [
      "navigator.onLine can report online while servers are unreachable.",
      "Browser connectivity is not the same as internet availability.",
      "Server availability requires application-level health checks.",
    ],
    mappings: CONNECTIVITY_BROWSER_API_MAPPINGS,
    navigatorOnLineSupported,
    networkInformation: readNetworkInformationSnapshot(),
    onlineEventSupported,
  };
}
