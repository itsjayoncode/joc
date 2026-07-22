import { STORAGE_INTERNALS, getStorageInternals } from "../internals.js";

import type { JayOnCodeStorage } from "../types/index.js";

export type CrossTabRemoteEventType = "set" | "remove" | "clear";

export interface CrossTabRemoteEvent {
  readonly type: CrossTabRemoteEventType;
  readonly key?: string;
  readonly namespace: string;
  readonly at: number;
  readonly via: "broadcast" | "storage-event";
}

export interface EnableCrossTabSyncOptions {
  /** BroadcastChannel name (default `joc-storage:${namespace}`). */
  readonly channel?: string;
  /** Called when another tab reports a change (notify-only — no auto-merge). */
  readonly onRemote?: (event: CrossTabRemoteEvent) => void;
  /** Also listen to `window` `storage` events (useful for localStorage). Default true. */
  readonly listenStorageEvents?: boolean;
}

export interface CrossTabSyncHandle<T = unknown> {
  readonly storage: JayOnCodeStorage<T>;
  stop(): void;
}

interface CrossTabMessage {
  readonly type: CrossTabRemoteEventType;
  readonly key?: string;
  readonly namespace: string;
  readonly at: number;
  readonly origin: string;
}

function createOriginId(): string {
  return `tab-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

/**
 * Notify other same-origin tabs of sync-storage writes.
 * Does not silently apply remote values — use `onRemote` and re-read.
 */
export function enableCrossTabSync<T = unknown>(
  storage: JayOnCodeStorage<T>,
  options: EnableCrossTabSyncOptions = {},
): CrossTabSyncHandle<T> {
  const internals = getStorageInternals(storage);
  const channelName = options.channel?.trim() || `joc-storage:${internals.namespace}`;
  const listenStorageEvents = options.listenStorageEvents !== false;
  const origin = createOriginId();
  let stopped = false;

  const BroadcastChannelCtor =
    typeof globalThis.BroadcastChannel === "function" ? globalThis.BroadcastChannel : undefined;
  const channel = BroadcastChannelCtor ? new BroadcastChannelCtor(channelName) : undefined;

  const publish = (type: CrossTabRemoteEventType, key?: string): void => {
    if (stopped) {
      return;
    }
    const message: CrossTabMessage =
      key === undefined
        ? {
            type,
            namespace: internals.namespace,
            at: Date.now(),
            origin,
          }
        : {
            type,
            key,
            namespace: internals.namespace,
            at: Date.now(),
            origin,
          };
    channel?.postMessage(message);
  };

  const onBroadcast = (event: Event): void => {
    if (stopped) {
      return;
    }
    const data = (event as MessageEvent).data as CrossTabMessage | undefined;
    if (!data || data.origin === origin || data.namespace !== internals.namespace) {
      return;
    }
    const remote: CrossTabRemoteEvent =
      data.key === undefined
        ? {
            type: data.type,
            namespace: data.namespace,
            at: data.at,
            via: "broadcast",
          }
        : {
            type: data.type,
            key: data.key,
            namespace: data.namespace,
            at: data.at,
            via: "broadcast",
          };
    options.onRemote?.(remote);
  };

  channel?.addEventListener("message", onBroadcast);

  const onStorage = (event: Event): void => {
    if (stopped) {
      return;
    }
    const storageEvent = event as StorageEvent;
    if (!storageEvent.key) {
      return;
    }
    if (!storageEvent.key.startsWith(internals.prefix)) {
      return;
    }
    const logicalKey = storageEvent.key.slice(internals.prefix.length);
    const type: CrossTabRemoteEventType = storageEvent.newValue === null ? "remove" : "set";
    const remote: CrossTabRemoteEvent =
      logicalKey.length === 0
        ? {
            type,
            namespace: internals.namespace,
            at: Date.now(),
            via: "storage-event",
          }
        : {
            type,
            key: logicalKey,
            namespace: internals.namespace,
            at: Date.now(),
            via: "storage-event",
          };
    options.onRemote?.(remote);
  };

  if (listenStorageEvents && typeof globalThis.addEventListener === "function") {
    globalThis.addEventListener("storage", onStorage);
  }

  const synced: JayOnCodeStorage<T> = {
    namespace: storage.namespace,
    schemaVersion: storage.schemaVersion,
    get: (key) => storage.get(key),
    peek: (key) => storage.peek(key),
    has: (key) => storage.has(key),
    definePolicy: (name, policy) => {
      storage.definePolicy(name, policy);
    },
    set(key, value, setOptions) {
      storage.set(key, value, setOptions);
      publish("set", key);
    },
    remove(key) {
      storage.remove(key);
      publish("remove", key);
    },
    clear() {
      storage.clear();
      publish("clear");
    },
  };

  Object.defineProperty(synced, STORAGE_INTERNALS, {
    value: internals,
    enumerable: false,
    writable: false,
    configurable: false,
  });

  return {
    storage: synced,
    stop() {
      if (stopped) {
        return;
      }
      stopped = true;
      channel?.removeEventListener("message", onBroadcast);
      channel?.close();
      if (listenStorageEvents && typeof globalThis.removeEventListener === "function") {
        globalThis.removeEventListener("storage", onStorage);
      }
    },
  };
}
