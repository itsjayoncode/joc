import type { AsyncDraftStorageAdapter } from "./storage-adapter.js";

const DEFAULT_DB_NAME = "jayoncode-form-intelligent-drafts";
const DEFAULT_STORE_NAME = "drafts";
const DB_VERSION = 1;

export interface IndexedDbDraftStorageOptions {
  readonly dbName?: string;
  readonly storeName?: string;
}

function openDatabase(dbName: string, storeName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("indexedDB is not available in this environment."));
      return;
    }

    const request = indexedDB.open(dbName, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error ?? new Error("Failed to open IndexedDB."));
    };
  });
}

function runTransaction<T>(
  database: IDBDatabase,
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    const request = operation(store);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error ?? new Error("IndexedDB request failed."));
    };
  });
}

export function createIndexedDbDraftStorage(
  options: IndexedDbDraftStorageOptions = {},
): AsyncDraftStorageAdapter {
  const dbName = options.dbName ?? DEFAULT_DB_NAME;
  const storeName = options.storeName ?? DEFAULT_STORE_NAME;

  return {
    async load(key) {
      const database = await openDatabase(dbName, storeName);

      try {
        const raw = await runTransaction<string | undefined>(
          database,
          storeName,
          "readonly",
          (store) => store.get(key),
        );

        if (typeof raw !== "string") {
          return null;
        }

        return JSON.parse(raw) as Record<string, unknown>;
      } catch {
        return null;
      } finally {
        database.close();
      }
    },
    async save(key, values) {
      const database = await openDatabase(dbName, storeName);

      try {
        await runTransaction(database, storeName, "readwrite", (store) =>
          store.put(JSON.stringify(values), key),
        );
      } finally {
        database.close();
      }
    },
    async clear(key) {
      const database = await openDatabase(dbName, storeName);

      try {
        await runTransaction(database, storeName, "readwrite", (store) => store.delete(key));
      } finally {
        database.close();
      }
    },
  };
}

export async function loadDraftAsync(
  key: string,
  adapter: AsyncDraftStorageAdapter,
): Promise<Record<string, unknown> | null> {
  return adapter.load(key);
}

export async function saveDraftAsync(
  key: string,
  values: Record<string, unknown>,
  adapter: AsyncDraftStorageAdapter,
): Promise<void> {
  await adapter.save(key, values);
}

export async function clearDraftAsync(
  key: string,
  adapter: AsyncDraftStorageAdapter,
): Promise<void> {
  await adapter.clear(key);
}
