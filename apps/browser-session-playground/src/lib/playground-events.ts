import {
  createBrowserLifecycle,
  type BrowserLifecycle,
  type BrowserLifecycleConfig,
  type BrowserLifecycleEventMap,
  type BrowserLifecycleEventName,
  type BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

import { formatPlaygroundTimestamp } from "./browser-lifecycle.js";

export const EVENT_EXPLORER_MAX_EVENTS = 1_000;
export const BROWSER_LIFECYCLE_PACKAGE_VERSION = "0.0.0-dev";

export type EventExplorerCategory =
  | "activity"
  | "connectivity"
  | "cross-tab"
  | "focus"
  | "idle"
  | "lifecycle"
  | "plugin"
  | "session"
  | "visibility"
  | "unknown";

export interface EventExplorerFilters {
  readonly categories: readonly EventExplorerCategory[];
  readonly modules: readonly string[];
  readonly query: string;
  readonly sources: readonly string[];
}

export type EventExplorerPriority = "high" | "low" | "normal";

export interface EventExplorerRecord {
  readonly category: EventExplorerCategory;
  readonly current: unknown;
  readonly eventId: string;
  readonly id: string;
  readonly metadata: Record<string, unknown> | undefined;
  readonly module: string;
  readonly payload: BrowserLifecycleEventMap[BrowserLifecycleEventName];
  readonly payloadSummary: string;
  readonly priority: EventExplorerPriority;
  readonly status: "delivered";
  readonly previous: unknown;
  readonly sequence: number;
  readonly sessionId: string;
  readonly snapshot: BrowserLifecycleSnapshot;
  readonly source: string;
  readonly timestamp: number;
  readonly timestampLabel: string;
  readonly type: BrowserLifecycleEventName;
}

export interface EventExplorerStats {
  readonly droppedEvents: number;
  readonly eventsPerSecond: number;
  readonly streamStatus: "live" | "paused";
  readonly totalEvents: number;
}

export const EVENTS_PLAYGROUND_CONFIG: BrowserLifecycleConfig = {
  autoStart: false,
  crossTab: {
    channelName: "jayoncode:event-explorer",
    heartbeatInterval: 1_000,
    leaderTimeout: 3_000,
  },
  emitInitialState: true,
  idleTimeout: 30_000,
};

export function createEventsPlaygroundSession(): BrowserLifecycle {
  return createBrowserLifecycle(EVENTS_PLAYGROUND_CONFIG);
}

export function categorizeEvent(type: BrowserLifecycleEventName): EventExplorerCategory {
  if (type.startsWith("page:")) return "visibility";
  if (type.startsWith("window:")) return "focus";
  if (type.startsWith("connection:")) return "connectivity";
  if (type.startsWith("activity:") || type === "session:active" || type === "session:idle") return "idle";
  if (type.startsWith("tab:")) return "cross-tab";
  if (type.startsWith("plugin:")) return "plugin";
  if (type === "session:started" || type === "session:stopped" || type === "session:restored") return "session";
  if (type === "page:suspend" || type === "page:resume") return "lifecycle";
  return "unknown";
}

export function getEventModule(type: BrowserLifecycleEventName): string {
  const category = categorizeEvent(type);
  switch (category) {
    case "visibility":
      return "visibility";
    case "focus":
      return "focus";
    case "connectivity":
      return "connectivity";
    case "idle":
      return "idle";
    case "lifecycle":
      return "lifecycle";
    case "cross-tab":
      return "cross-tab";
    case "plugin":
      return "plugin-runtime";
    case "session":
      return "session-core";
    default:
      return "unknown";
  }
}

export function summarizeEventPayload(
  event: BrowserLifecycleEventMap[BrowserLifecycleEventName],
): string {
  const metadata = event.metadata ? JSON.stringify(event.metadata) : "{}";
  return `${event.type} · current=${String(event.current)} · previous=${String(event.previous)} · metadata=${metadata}`;
}

export function getEventPriority(type: BrowserLifecycleEventName): EventExplorerPriority {
  if (type === "session:started" || type === "session:stopped" || type === "plugin:error") {
    return "high";
  }
  if (type.startsWith("activity:") || type === "session:idle") {
    return "low";
  }
  return "normal";
}

export function createEventExplorerRecord(
  event: BrowserLifecycleEventMap[BrowserLifecycleEventName],
  snapshot: BrowserLifecycleSnapshot,
  sequence: number,
  sessionId: string,
): EventExplorerRecord {
  return {
    category: categorizeEvent(event.type),
    current: event.current,
    eventId: `${sessionId}-${String(sequence)}`,
    id: `${event.type}-${String(event.timestamp)}-${String(sequence)}`,
    metadata: event.metadata ? { ...event.metadata } : undefined,
    module: getEventModule(event.type),
    payload: event,
    priority: getEventPriority(event.type),
    status: "delivered",
    payloadSummary: summarizeEventPayload(event),
    previous: event.previous,
    sequence,
    sessionId,
    snapshot,
    source: event.source,
    timestamp: event.timestamp,
    timestampLabel: formatPlaygroundTimestamp(event.timestamp),
    type: event.type,
  };
}

export function getDefaultEventExplorerFilters(): EventExplorerFilters {
  return {
    categories: [],
    modules: [],
    query: "",
    sources: [],
  };
}

export function filterEventExplorerRecords(
  records: readonly EventExplorerRecord[],
  filters: EventExplorerFilters,
): EventExplorerRecord[] {
  const query = filters.query.trim().toLowerCase();

  return records.filter((record) => {
    if (filters.categories.length > 0 && !filters.categories.includes(record.category)) {
      return false;
    }
    if (filters.modules.length > 0 && !filters.modules.includes(record.module)) {
      return false;
    }
    if (filters.sources.length > 0 && !filters.sources.includes(record.source)) {
      return false;
    }
    if (!query) {
      return true;
    }

    const haystack = [
      record.type,
      record.module,
      record.category,
      record.source,
      record.payloadSummary,
      JSON.stringify(record.metadata ?? {}),
      String(record.sequence),
      record.sessionId,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function calculateEventExplorerStats(
  records: readonly EventExplorerRecord[],
  droppedEvents: number,
  isPaused: boolean,
  windowMs = 5_000,
): EventExplorerStats {
  const now = Date.now();
  const recent = records.filter((record) => now - record.timestamp <= windowMs);
  const eventsPerSecond = recent.length / (windowMs / 1_000);

  return {
    droppedEvents,
    eventsPerSecond: Number(eventsPerSecond.toFixed(2)),
    streamStatus: isPaused ? "paused" : "live",
    totalEvents: records.length,
  };
}

export function exportEventRecords(
  records: readonly EventExplorerRecord[],
  format: "csv" | "json" | "ndjson" | "txt",
): string {
  switch (format) {
    case "json":
      return JSON.stringify(
        records.map((record) => ({
          category: record.category,
          current: record.current,
          metadata: record.metadata,
          module: record.module,
          previous: record.previous,
          sequence: record.sequence,
          sessionId: record.sessionId,
          source: record.source,
          timestamp: record.timestamp,
          type: record.type,
        })),
        null,
        2,
      );
    case "ndjson":
      return records
        .map((record) =>
          JSON.stringify({
            timestamp: record.timestamp,
            type: record.type,
            module: record.module,
            sequence: record.sequence,
            payload: record.payload,
          }),
        )
        .join("\n");
    case "csv": {
      const header = "timestamp,type,module,category,source,sequence,sessionId,payloadSummary";
      const rows = records.map((record) =>
        [
          record.timestamp,
          record.type,
          record.module,
          record.category,
          record.source,
          record.sequence,
          record.sessionId,
          `"${record.payloadSummary.replaceAll('"', '""')}"`,
        ].join(","),
      );
      return [header, ...rows].join("\n");
    }
    case "txt":
    default:
      return records
        .map(
          (record) =>
            `${record.timestampLabel} · #${String(record.sequence)} · ${record.type} · ${record.module} · ${record.payloadSummary}`,
        )
        .join("\n");
  }
}

export function getAvailableEventCategories(
  records: readonly EventExplorerRecord[],
): EventExplorerCategory[] {
  return [...new Set(records.map((record) => record.category))].sort();
}

export function getAvailableEventModules(records: readonly EventExplorerRecord[]): string[] {
  return [...new Set(records.map((record) => record.module))].sort();
}

export function getAvailableEventSources(records: readonly EventExplorerRecord[]): string[] {
  return [...new Set(records.map((record) => record.source))].sort();
}

export function formatEventMetadataTable(
  record: EventExplorerRecord,
): readonly { readonly key: string; readonly value: string }[] {
  return [
    { key: "Event ID", value: record.eventId },
    { key: "Sequence", value: String(record.sequence) },
    { key: "Session ID", value: record.sessionId },
    { key: "Module", value: record.module },
    { key: "Category", value: record.category },
    { key: "Source", value: record.source },
    { key: "Timestamp", value: record.timestampLabel },
    { key: "Previous", value: String(record.previous) },
    { key: "Current", value: String(record.current) },
    { key: "Priority", value: record.priority },
    { key: "Status", value: record.status },
    { key: "Propagation", value: "public" },
    { key: "Phase", value: record.snapshot.phase },
  ];
}

export function exportEventMetadata(record: EventExplorerRecord, pretty = true): string {
  return JSON.stringify(
    {
      category: record.category,
      current: record.current,
      eventId: record.eventId,
      metadata: record.metadata,
      module: record.module,
      previous: record.previous,
      priority: record.priority,
      sequence: record.sequence,
      sessionId: record.sessionId,
      source: record.source,
      status: record.status,
      timestamp: record.timestamp,
      type: record.type,
    },
    null,
    pretty ? 2 : undefined,
  );
}

export function searchPayloadText(payload: unknown, query: string): boolean {
  if (!query.trim()) {
    return true;
  }
  return JSON.stringify(payload).toLowerCase().includes(query.trim().toLowerCase());
}
