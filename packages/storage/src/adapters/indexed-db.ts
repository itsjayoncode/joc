import { AdapterError } from "../errors/index.js";

import type { AsyncStorageAdapter } from "../types/index.js";

const DEFAULT_DB_NAME = "jayoncode-storage";
const DEFAULT_STORE_NAME = "entries";
const DB_VERSION = 1;

export interface IndexedDbAdapterOptions {
  readonly dbName?: string;
  readonly storeName?: string;
}

function openDatabase(dbName: string, storeName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new AdapterError("indexedDB is not available in this environment."));
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
      reject(request.error ?? new AdapterError("Failed to open IndexedDB."));
    };
  });
}

function runStoreRequest<T>(
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
      reject(request.error ?? new AdapterError("IndexedDB request failed."));
    };
  });
}

/**
 * IndexedDB adapter for `@jayoncode/storage/async`.
 *
 * Default DB name is `jayoncode-storage` — not Form Intelligence’s draft DB.
 */
export function createIndexedDbAdapter(options: IndexedDbAdapterOptions = {}): AsyncStorageAdapter {
  const dbName = options.dbName?.trim() || DEFAULT_DB_NAME;
  const storeName = options.storeName?.trim() || DEFAULT_STORE_NAME;
  let databasePromise: Promise<IDBDatabase> | undefined;

  const getDatabase = (): Promise<IDBDatabase> => {
    databasePromise ??= openDatabase(dbName, storeName);
    return databasePromise;
  };

  return {
    async getItem(key) {
      const database = await getDatabase();
      const value = await runStoreRequest<unknown>(
        database,
        storeName,
        "readonly",
        (store) => store.get(key) as IDBRequest<unknown>,
      );
      return typeof value === "string" ? value : null;
    },
    async setItem(key, value) {
      const database = await getDatabase();
      await runStoreRequest(database, storeName, "readwrite", (store) => store.put(value, key));
    },
    async removeItem(key) {
      const database = await getDatabase();
      await runStoreRequest(database, storeName, "readwrite", (store) => store.delete(key));
    },
    async keys() {
      const database = await getDatabase();
      const keys = await runStoreRequest<IDBValidKey[]>(database, storeName, "readonly", (store) =>
        store.getAllKeys(),
      );
      return keys.filter((key): key is string => typeof key === "string");
    },
  };
}
