import {
  createBrowserLifecycle,
  type BrowserLifecycle,
  type BrowserLifecycleConfig,
  type BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

import { formatPlaygroundTimestamp } from "./browser-lifecycle.js";

export const STATE_EXPLORER_MAX_SNAPSHOTS = 100;
export const STATE_EXPLORER_VERSION = "1.0.0";

export interface StateSnapshotRecord {
  readonly capturedAt: number;
  readonly capturedAtLabel: string;
  readonly id: string;
  readonly sequence: number;
  readonly sessionId: string;
  readonly snapshot: BrowserLifecycleSnapshot;
}

export interface StateDiffEntry {
  readonly current?: unknown;
  readonly kind: "added" | "changed" | "removed";
  readonly path: string;
  readonly previous?: unknown;
}

export interface ModuleStateCard {
  readonly current: string;
  readonly id: string;
  readonly label: string;
  readonly previous?: string;
  readonly status: string;
  readonly transitionCount: number;
}

export interface SessionOverview {
  readonly isRunning: boolean;
  readonly lifecycle: string;
  readonly moduleCount: number;
  readonly sessionId: string;
  readonly sessionStatus: string;
  readonly startedAtLabel: string;
  readonly uptime: string;
  readonly version: string;
}

export const STATE_EXPLORER_CONFIG: BrowserLifecycleConfig = {
  autoStart: false,
  crossTab: {
    channelName: "jayoncode:state-explorer",
    heartbeatInterval: 1_000,
    leaderTimeout: 3_000,
  },
  emitInitialState: true,
  idleTimeout: 30_000,
};

export function createStateExplorerSession(): BrowserLifecycle {
  return createBrowserLifecycle(STATE_EXPLORER_CONFIG);
}

export function countActiveModules(snapshot: BrowserLifecycleSnapshot): number {
  const { capabilities } = snapshot;
  return [
    capabilities.visibility,
    capabilities.focus,
    capabilities.connectivity,
    capabilities.idle,
    capabilities.pageLifecycle,
    capabilities.broadcastChannel,
  ].filter(Boolean).length;
}

export function formatSessionUptime(snapshot: BrowserLifecycleSnapshot, now = Date.now()): string {
  const startedAt = snapshot.timestamps.startedAt;
  if (startedAt === undefined) {
    return "—";
  }
  const elapsed = Math.max(0, now - startedAt);
  const seconds = Math.floor(elapsed / 1_000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    return `${String(hours)}h ${String(minutes % 60)}m`;
  }
  if (minutes > 0) {
    return `${String(minutes)}m ${String(seconds % 60)}s`;
  }
  return `${String(seconds)}s`;
}

export function getSessionOverview(
  snapshot: BrowserLifecycleSnapshot,
  sessionId: string,
  isRunning: boolean,
): SessionOverview {
  return {
    isRunning,
    lifecycle: snapshot.phase,
    moduleCount: countActiveModules(snapshot),
    sessionId,
    sessionStatus: snapshot.phase,
    startedAtLabel:
      snapshot.timestamps.startedAt === undefined
        ? "—"
        : formatPlaygroundTimestamp(snapshot.timestamps.startedAt),
    uptime: formatSessionUptime(snapshot),
    version: STATE_EXPLORER_VERSION,
  };
}

export function createStateSnapshotRecord(
  snapshot: BrowserLifecycleSnapshot,
  sequence: number,
  sessionId: string,
  capturedAt = Date.now(),
): StateSnapshotRecord {
  return {
    capturedAt,
    capturedAtLabel: formatPlaygroundTimestamp(capturedAt),
    id: `snapshot-${String(sequence)}`,
    sequence,
    sessionId,
    snapshot,
  };
}

export function appendStateSnapshot(
  history: readonly StateSnapshotRecord[],
  record: StateSnapshotRecord,
): StateSnapshotRecord[] {
  return [record, ...history].slice(0, STATE_EXPLORER_MAX_SNAPSHOTS);
}

export function snapshotsAreEqual(
  left: BrowserLifecycleSnapshot,
  right: BrowserLifecycleSnapshot,
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function flattenSnapshot(value: unknown, path = ""): Map<string, unknown> {
  const entries = new Map<string, unknown>();
  if (value === null || typeof value !== "object") {
    entries.set(path || "$", value);
    return entries;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      for (const [childPath, childValue] of flattenSnapshot(item, `${path}[${String(index)}]`)) {
        entries.set(childPath, childValue);
      }
    });
    return entries;
  }
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    const childPath = path ? `${path}.${key}` : key;
    if (child !== null && typeof child === "object") {
      for (const [nestedPath, nestedValue] of flattenSnapshot(child, childPath)) {
        entries.set(nestedPath, nestedValue);
      }
    } else {
      entries.set(childPath, child);
    }
  }
  return entries;
}

export function computeStateDiff(
  previous: BrowserLifecycleSnapshot,
  current: BrowserLifecycleSnapshot,
): StateDiffEntry[] {
  const previousFlat = flattenSnapshot(previous);
  const currentFlat = flattenSnapshot(current);
  const paths = new Set([...previousFlat.keys(), ...currentFlat.keys()]);
  const diff: StateDiffEntry[] = [];

  for (const path of [...paths].sort()) {
    const hasPrevious = previousFlat.has(path);
    const hasCurrent = currentFlat.has(path);
    const previousValue = previousFlat.get(path);
    const currentValue = currentFlat.get(path);

    if (!hasPrevious && hasCurrent) {
      diff.push({ current: currentValue, kind: "added", path });
      continue;
    }
    if (hasPrevious && !hasCurrent) {
      diff.push({ kind: "removed", path, previous: previousValue });
      continue;
    }
    if (hasPrevious && hasCurrent && JSON.stringify(previousValue) !== JSON.stringify(currentValue)) {
      diff.push({
        current: currentValue,
        kind: "changed",
        path,
        previous: previousValue,
      });
    }
  }

  return diff;
}

export function getModuleStateCards(
  snapshot: BrowserLifecycleSnapshot,
  transitionCounts: Readonly<Record<string, number>>,
  previousSnapshot?: BrowserLifecycleSnapshot,
): ModuleStateCard[] {
  const createCard = (
    id: string,
    label: string,
    current: string,
    previous: string | undefined,
    status: string,
    transitionCount: number,
  ): ModuleStateCard =>
    previous === undefined
      ? { current, id, label, status, transitionCount }
      : { current, id, label, previous, status, transitionCount };

  return [
    createCard(
      "visibility",
      "Visibility",
      snapshot.visibility,
      previousSnapshot?.visibility,
      snapshot.capabilities.visibility ? "active" : "unavailable",
      transitionCounts.visibility ?? 0,
    ),
    createCard(
      "focus",
      "Focus",
      snapshot.attention,
      previousSnapshot?.attention,
      snapshot.capabilities.focus ? "active" : "unavailable",
      transitionCounts.focus ?? 0,
    ),
    createCard(
      "connectivity",
      "Connectivity",
      snapshot.connectivity,
      previousSnapshot?.connectivity,
      snapshot.capabilities.connectivity ? "active" : "unavailable",
      transitionCounts.connectivity ?? 0,
    ),
    createCard(
      "idle",
      "Idle",
      snapshot.activity,
      previousSnapshot?.activity,
      snapshot.capabilities.idle ? "active" : "unavailable",
      transitionCounts.idle ?? 0,
    ),
    createCard(
      "lifecycle",
      "Lifecycle",
      snapshot.lifecycle,
      previousSnapshot?.lifecycle,
      snapshot.capabilities.pageLifecycle ? "active" : "unavailable",
      transitionCounts.lifecycle ?? 0,
    ),
    createCard(
      "cross-tab",
      "Cross Tab",
      snapshot.tab,
      previousSnapshot?.tab,
      snapshot.capabilities.broadcastChannel ? "active" : "unavailable",
      transitionCounts["cross-tab"] ?? 0,
    ),
  ];
}

export function exportStateSnapshot(snapshot: BrowserLifecycleSnapshot, pretty = true): string {
  return JSON.stringify(snapshot, null, pretty ? 2 : undefined);
}

export function incrementTransitionCount(
  counts: Record<string, number>,
  eventType: string,
): Record<string, number> {
  const next = { ...counts };
  if (eventType.startsWith("page:") && !eventType.includes("suspend") && !eventType.includes("resume")) {
    next.visibility = (next.visibility ?? 0) + 1;
  } else if (eventType.startsWith("window:")) {
    next.focus = (next.focus ?? 0) + 1;
  } else if (eventType.startsWith("connection:")) {
    next.connectivity = (next.connectivity ?? 0) + 1;
  } else if (
    eventType.startsWith("activity:") ||
    eventType === "session:active" ||
    eventType === "session:idle"
  ) {
    next.idle = (next.idle ?? 0) + 1;
  } else if (eventType === "page:suspend" || eventType === "page:resume" || eventType === "session:restored") {
    next.lifecycle = (next.lifecycle ?? 0) + 1;
  } else if (eventType.startsWith("tab:")) {
    next["cross-tab"] = (next["cross-tab"] ?? 0) + 1;
  }
  return next;
}
