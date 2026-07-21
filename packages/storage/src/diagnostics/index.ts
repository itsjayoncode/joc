import { isEnvelope } from "../core/envelope.js";
import { isExpired } from "../core/ttl.js";
import { ConfigurationError } from "../errors/index.js";
import { getStorageInternals } from "../internals.js";
import { observe, type StorageEventType } from "../observable/index.js";

import type { JayOnCodeStorage } from "../types/index.js";

export interface DiagnosticsOptions {
  /** Max activity-log entries retained (default 100). Applied on first attach only. */
  readonly activityLimit?: number;
}

export interface DiagnosticsStats {
  readonly sets: number;
  readonly gets: number;
  readonly peeks: number;
  readonly removes: number;
  readonly clears: number;
  readonly expired: number;
  readonly migrated: number;
}

export interface ActivityEntry {
  readonly at: number;
  readonly type: string;
  readonly key?: string;
  readonly detail?: string;
}

export interface DiagnosticsReport {
  readonly namespace: string;
  readonly schemaVersion: string;
  readonly entryCount: number;
  readonly expiredCount: number;
  readonly invalidCount: number;
  /** Sum of raw string lengths for namespace keys (approx; not browser quota remaining). */
  readonly approxBytes: number;
  readonly stats: DiagnosticsStats;
  readonly activity: readonly ActivityEntry[];
}

export interface StorageDiagnostics {
  report(): DiagnosticsReport;
  stats(): DiagnosticsStats;
  activity(): readonly ActivityEntry[];
  disconnect(): void;
}

interface DiagnosticsSession {
  readonly handle: StorageDiagnostics;
  connected: boolean;
  connect: () => void;
}

const sessionByStorage = new WeakMap<object, DiagnosticsSession>();

/**
 * Developer diagnostics for one `createStorage` instance.
 * Idempotent. Not on the default export — import from `@jayoncode/storage/diagnostics`.
 * Does not claim exact browser quota remaining.
 */
export function createDiagnostics(
  storage: JayOnCodeStorage,
  options: DiagnosticsOptions = {},
): StorageDiagnostics {
  getStorageInternals(storage);

  const existing = sessionByStorage.get(storage);
  if (existing) {
    if (!existing.connected) {
      existing.connect();
    }
    return existing.handle;
  }

  const activityLimit = Math.max(1, options.activityLimit ?? 100);
  const counters = {
    sets: 0,
    gets: 0,
    peeks: 0,
    removes: 0,
    clears: 0,
    expired: 0,
    migrated: 0,
  };
  const ring: ActivityEntry[] = [];
  let unsubscribers: Array<() => void> = [];

  const pushActivity = (entry: ActivityEntry) => {
    ring.unshift(entry);
    if (ring.length > activityLimit) {
      ring.length = activityLimit;
    }
  };

  const observed = observe(storage);

  const originalGet = storage.get.bind(storage);
  const originalPeek = storage.peek.bind(storage);
  storage.get = (key: string) => {
    counters.gets += 1;
    return originalGet(key);
  };
  storage.peek = (key: string) => {
    counters.peeks += 1;
    return originalPeek(key);
  };

  const connect = () => {
    if (unsubscribers.length > 0) {
      return;
    }
    const eventTypes: StorageEventType[] = ["set", "remove", "clear", "expired", "migrated"];
    unsubscribers = eventTypes.map((type) =>
      observed.on(type, (event) => {
        const at = Date.now();
        switch (event.type) {
          case "set":
            counters.sets += 1;
            pushActivity({ at, type: "set", key: event.key });
            break;
          case "remove":
            counters.removes += 1;
            pushActivity({ at, type: "remove", key: event.key });
            break;
          case "clear":
            counters.clears += 1;
            pushActivity({ at, type: "clear" });
            break;
          case "expired":
            counters.expired += 1;
            pushActivity({
              at,
              type: "expired",
              key: event.key,
              detail: event.via,
            });
            break;
          case "migrated":
            counters.migrated += 1;
            pushActivity({
              at,
              type: "migrated",
              key: event.key,
              detail: `${event.from}->${event.to}`,
            });
            break;
        }
      }),
    );
    session.connected = true;
  };

  const snapshotStats = (): DiagnosticsStats => ({ ...counters });

  const handle: StorageDiagnostics = {
    stats: snapshotStats,
    activity: () => [...ring],
    disconnect() {
      for (const off of unsubscribers) {
        off();
      }
      unsubscribers = [];
      session.connected = false;
    },
    report() {
      const { adapter, namespace, prefix, schemaVersion, deserialize, now } =
        getStorageInternals(storage);
      if (typeof adapter.keys !== "function") {
        throw new ConfigurationError(
          "diagnostics.report() requires adapter.keys() to enumerate namespace keys.",
        );
      }

      let entryCount = 0;
      let expiredCount = 0;
      let invalidCount = 0;
      let approxBytes = 0;
      const clock = now();

      for (const physical of adapter.keys()) {
        if (!physical.startsWith(prefix)) {
          continue;
        }
        const raw = adapter.getItem(physical);
        if (raw === null) {
          continue;
        }
        approxBytes += raw.length;
        entryCount += 1;
        try {
          const parsed = deserialize(raw);
          if (!isEnvelope(parsed)) {
            invalidCount += 1;
            continue;
          }
          if (isExpired(parsed.expiresAt, clock)) {
            expiredCount += 1;
          }
        } catch {
          invalidCount += 1;
        }
      }

      return {
        namespace,
        schemaVersion,
        entryCount,
        expiredCount,
        invalidCount,
        approxBytes,
        stats: snapshotStats(),
        activity: [...ring],
      };
    },
  };

  const session: DiagnosticsSession = {
    handle,
    connected: false,
    connect,
  };
  sessionByStorage.set(storage, session);
  connect();
  return handle;
}
