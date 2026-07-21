import {
  QuotaExceededError,
  createLocalStorageAdapter,
  createMemoryAdapter,
  createSessionStorageAdapter,
  type StorageAdapter,
  type StorageEnvelope,
} from "@jayoncode/storage";

export type AdapterKind = "memory" | "local" | "session";

export function resolveAdapter(kind: AdapterKind): StorageAdapter {
  switch (kind) {
    case "local":
      return createLocalStorageAdapter();
    case "session":
      return createSessionStorageAdapter();
    default:
      return createMemoryAdapter();
  }
}

/** Playground-only — never ships inside `@jayoncode/storage`. */
export function withQuotaSimulation(adapter: StorageAdapter, enabled: boolean): StorageAdapter {
  if (!enabled) {
    return adapter;
  }

  const wrapped: StorageAdapter = {
    getItem(key) {
      return adapter.getItem(key);
    },
    setItem() {
      throw new QuotaExceededError("Lab simulated quota exceeded (not a real browser quota).");
    },
    removeItem(key) {
      adapter.removeItem(key);
    },
  };

  if (typeof adapter.keys === "function") {
    const listKeys = adapter.keys.bind(adapter);
    return {
      ...wrapped,
      keys: () => listKeys(),
    };
  }

  return wrapped;
}

/** Demo migrate: v1 → v2 wraps value with a marker (Lab dry-run + get). */
export function demoMigrateEnvelope<T>(
  envelope: StorageEnvelope<T>,
  fromVersion: string,
): StorageEnvelope<T> | null {
  if (fromVersion === "2") {
    return envelope;
  }

  const value =
    envelope.value !== null && typeof envelope.value === "object" && !Array.isArray(envelope.value)
      ? ({ ...(envelope.value as Record<string, unknown>), _migratedFrom: fromVersion } as T)
      : ({ value: envelope.value, _migratedFrom: fromVersion } as T);

  return {
    ...envelope,
    schemaVersion: "2",
    value,
  };
}
