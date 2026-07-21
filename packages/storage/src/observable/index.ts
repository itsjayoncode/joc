import { isEnvelope } from "../core/envelope.js";
import { isExpired } from "../core/ttl.js";
import { getStorageInternals } from "../internals.js";

import type { JayOnCodeStorage, SetStorageOptions, StorageEnvelope } from "../types/index.js";

export type StorageEventType = "set" | "remove" | "clear" | "expired" | "migrated";

export interface StorageSetEvent<T = unknown> {
  readonly type: "set";
  readonly key: string;
  readonly value: T;
}

export interface StorageRemoveEvent {
  readonly type: "remove";
  readonly key: string;
}

export interface StorageClearEvent {
  readonly type: "clear";
}

export interface StorageExpiredEvent {
  readonly type: "expired";
  readonly key: string;
  readonly via: "get" | "peek" | "has";
}

export interface StorageMigratedEvent<T = unknown> {
  readonly type: "migrated";
  readonly key: string;
  readonly from: string;
  readonly to: string;
  readonly value: T;
}

export type StorageEvent<T = unknown> =
  | StorageSetEvent<T>
  | StorageRemoveEvent
  | StorageClearEvent
  | StorageExpiredEvent
  | StorageMigratedEvent<T>;

export type StorageEventMap<T = unknown> = {
  set: StorageSetEvent<T>;
  remove: StorageRemoveEvent;
  clear: StorageClearEvent;
  expired: StorageExpiredEvent;
  migrated: StorageMigratedEvent<T>;
};

export type Unsubscribe = () => void;

export interface ObservableJayOnCodeStorage<T = unknown> extends JayOnCodeStorage<T> {
  watch(key: string, listener: (value: T | null) => void): Unsubscribe;
  on<K extends StorageEventType>(
    type: K,
    listener: (event: StorageEventMap<T>[K]) => void,
  ): Unsubscribe;
}

interface WatchListener {
  readonly key: string;
  readonly fn: (value: unknown) => void;
}

interface ObservableState {
  readonly eventListeners: Map<StorageEventType, Set<(event: StorageEvent) => void>>;
  readonly watchListeners: Set<WatchListener>;
  wrapped: boolean;
}

const stateByStorage = new WeakMap<object, ObservableState>();

function getState(storage: object): ObservableState {
  let state = stateByStorage.get(storage);
  if (!state) {
    state = {
      eventListeners: new Map(),
      watchListeners: new Set(),
      wrapped: false,
    };
    stateByStorage.set(storage, state);
  }
  return state;
}

function emit(state: ObservableState, event: StorageEvent): void {
  const listeners = state.eventListeners.get(event.type);
  if (listeners) {
    for (const listener of [...listeners]) {
      try {
        listener(event);
      } catch {
        // Listener errors must not break storage operations.
      }
    }
  }
}

function emitWatch(state: ObservableState, key: string, value: unknown): void {
  for (const listener of [...state.watchListeners]) {
    if (listener.key !== key) {
      continue;
    }
    try {
      listener.fn(value);
    } catch {
      // ignore
    }
  }
}

function readRawEnvelope(storage: JayOnCodeStorage, key: string): StorageEnvelope | null {
  const { adapter, prefix, deserialize } = getStorageInternals(storage);
  const raw = adapter.getItem(`${prefix}${key}`);
  if (raw === null) {
    return null;
  }
  try {
    const parsed = deserialize(raw);
    return isEnvelope(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function wrapStorage<T>(storage: JayOnCodeStorage<T>, state: ObservableState): void {
  if (state.wrapped) {
    return;
  }
  state.wrapped = true;

  const originalSet = storage.set.bind(storage);
  const originalGet = storage.get.bind(storage);
  const originalRemove = storage.remove.bind(storage);
  const originalClear = storage.clear.bind(storage);
  const originalPeek = storage.peek.bind(storage);

  storage.set = (key: string, value: T, options?: SetStorageOptions) => {
    originalSet(key, value, options);
    emit(state, { type: "set", key, value });
    emitWatch(state, key, value);
  };

  storage.remove = (key: string) => {
    originalRemove(key);
    emit(state, { type: "remove", key });
    emitWatch(state, key, null);
  };

  storage.clear = () => {
    const watchedKeys = [...state.watchListeners].map((listener) => listener.key);
    originalClear();
    emit(state, { type: "clear" });
    for (const key of new Set(watchedKeys)) {
      emitWatch(state, key, null);
    }
  };

  storage.peek = (key: string) => {
    const before = readRawEnvelope(storage, key);
    const { now } = getStorageInternals(storage);
    const wasExpired = before !== null && isExpired(before.expiresAt, now());
    const result = originalPeek(key);
    if (wasExpired) {
      emit(state, { type: "expired", key, via: "peek" });
      emitWatch(state, key, null);
    }
    return result;
  };

  storage.has = (key: string) => {
    const before = readRawEnvelope(storage, key);
    const { now } = getStorageInternals(storage);
    const wasExpired = before !== null && isExpired(before.expiresAt, now());
    // Use original peek so we do not double-emit through the wrapped peek.
    const result = originalPeek(key) !== null;
    if (wasExpired) {
      emit(state, { type: "expired", key, via: "has" });
      emitWatch(state, key, null);
    }
    return result;
  };

  storage.get = (key: string) => {
    const before = readRawEnvelope(storage, key);
    const { now, schemaVersion } = getStorageInternals(storage);

    if (before && isExpired(before.expiresAt, now())) {
      const result = originalGet(key);
      emit(state, { type: "expired", key, via: "get" });
      emitWatch(state, key, null);
      return result;
    }

    if (before && before.schemaVersion !== schemaVersion) {
      const from = before.schemaVersion;
      const result = originalGet(key);
      if (result !== null) {
        emit(state, {
          type: "migrated",
          key,
          from,
          to: schemaVersion,
          value: result,
        });
        emitWatch(state, key, result);
      } else {
        emitWatch(state, key, null);
      }
      return result;
    }

    return originalGet(key);
  };
}

/**
 * Enable in-process observation on a `createStorage` instance.
 * Idempotent. Does **not** bridge cross-tab `storage` events.
 */
export function observe<T = unknown>(storage: JayOnCodeStorage<T>): ObservableJayOnCodeStorage<T> {
  getStorageInternals(storage);
  const state = getState(storage);
  wrapStorage(storage, state);

  const observed = storage as ObservableJayOnCodeStorage<T>;

  observed.watch = (key, listener) => {
    const entry: WatchListener = { key, fn: listener as (value: unknown) => void };
    state.watchListeners.add(entry);
    return () => {
      state.watchListeners.delete(entry);
    };
  };

  observed.on = (type, listener) => {
    let set = state.eventListeners.get(type);
    if (!set) {
      set = new Set();
      state.eventListeners.set(type, set);
    }
    const fn = listener as (event: StorageEvent) => void;
    set.add(fn);
    return () => {
      set.delete(fn);
    };
  };

  return observed;
}
