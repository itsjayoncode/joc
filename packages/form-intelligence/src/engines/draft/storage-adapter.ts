import { DraftStorageError, isQuotaExceededError } from "../../errors/index.js";

import type { SyncPersistenceAdapter } from "../../adapters/persistence-adapter.js";

export type DraftStorageKind = "localStorage" | "sessionStorage";

/** Sync draft storage — alias of {@link SyncPersistenceAdapter}. */
export type DraftStorageAdapter = SyncPersistenceAdapter;

export interface AsyncDraftStorageAdapter {
  load(key: string): Promise<Record<string, unknown> | null>;
  save(key: string, values: Record<string, unknown>): Promise<void>;
  clear(key: string): Promise<void>;
}

export interface DraftStorageOptions {
  readonly storage?: DraftStorageKind;
  readonly adapter?: DraftStorageAdapter;
}

export interface DraftConfigStorageSource {
  readonly storage?: DraftStorageKind;
  readonly adapter?: DraftStorageAdapter;
}

function readJsonRecord(raw: string | null): Record<string, unknown> | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function createSyncWebStorage(getStorage: () => Storage | undefined): DraftStorageAdapter {
  return {
    load(key) {
      const storage = getStorage();
      if (!storage) {
        return null;
      }

      return readJsonRecord(storage.getItem(key));
    },
    save(key, values) {
      const storage = getStorage();
      if (!storage) {
        return;
      }

      try {
        storage.setItem(key, JSON.stringify(values));
      } catch (error) {
        if (isQuotaExceededError(error)) {
          throw new DraftStorageError("Draft storage quota exceeded.", {
            cause: error,
            details: { reason: "quota" },
          });
        }
        throw error;
      }
    },
    clear(key) {
      const storage = getStorage();
      if (!storage) {
        return;
      }

      storage.removeItem(key);
    },
  };
}

export function createDraftStorage(kind: DraftStorageKind = "localStorage"): DraftStorageAdapter {
  if (kind === "sessionStorage") {
    return createSyncWebStorage(() =>
      typeof sessionStorage === "undefined" ? undefined : sessionStorage,
    );
  }

  return createSyncWebStorage(() =>
    typeof localStorage === "undefined" ? undefined : localStorage,
  );
}

export function resolveDraftStorage(
  source?: DraftStorageOptions | DraftConfigStorageSource,
): DraftStorageAdapter {
  if (source?.adapter) {
    return source.adapter;
  }

  return createDraftStorage(source?.storage ?? "localStorage");
}
