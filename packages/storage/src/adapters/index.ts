import { AdapterError, isQuotaExceededError, QuotaExceededError } from "../errors/index.js";

import type { StorageAdapter } from "../types/index.js";

/**
 * In-memory adapter backed by a `Map`. Use for tests, SSR, and ephemeral data.
 *
 * Import from the package root (not a repo file path):
 *
 * ```ts
 * import { createMemoryAdapter } from "@jayoncode/storage";
 * ```
 */
export function createMemoryAdapter(): StorageAdapter {
  const map = new Map<string, string>();

  return {
    getItem(key) {
      return map.get(key) ?? null;
    },
    setItem(key, value) {
      map.set(key, value);
    },
    removeItem(key) {
      map.delete(key);
    },
    keys() {
      return [...map.keys()];
    },
  };
}

function createWebStorageAdapter(getStorage: () => globalThis.Storage | undefined): StorageAdapter {
  return {
    getItem(key) {
      const storage = getStorage();
      if (!storage) {
        return null;
      }
      try {
        return storage.getItem(key);
      } catch (cause) {
        throw new AdapterError("Storage adapter getItem failed.", { cause });
      }
    },
    setItem(key, value) {
      const storage = getStorage();
      if (!storage) {
        throw new AdapterError("Web storage is unavailable in this environment.");
      }
      try {
        storage.setItem(key, value);
      } catch (cause) {
        if (isQuotaExceededError(cause)) {
          throw new QuotaExceededError("Web storage quota exceeded.", { cause });
        }
        throw new AdapterError("Storage adapter setItem failed.", { cause });
      }
    },
    removeItem(key) {
      const storage = getStorage();
      if (!storage) {
        return;
      }
      try {
        storage.removeItem(key);
      } catch (cause) {
        throw new AdapterError("Storage adapter removeItem failed.", { cause });
      }
    },
    keys() {
      const storage = getStorage();
      if (!storage) {
        return [];
      }
      const out: string[] = [];
      try {
        for (let index = 0; index < storage.length; index += 1) {
          const key = storage.key(index);
          if (key !== null) {
            out.push(key);
          }
        }
      } catch (cause) {
        throw new AdapterError("Storage adapter keys() failed.", { cause });
      }
      return out;
    },
  };
}

/**
 * Explicit `localStorage` adapter — values survive reload in the browser.
 *
 * ```ts
 * import { createLocalStorageAdapter } from "@jayoncode/storage";
 * ```
 */
export function createLocalStorageAdapter(): StorageAdapter {
  return createWebStorageAdapter(() => {
    if (typeof globalThis.localStorage === "undefined") {
      return undefined;
    }
    return globalThis.localStorage;
  });
}

/**
 * Explicit `sessionStorage` adapter — values last for the tab session.
 *
 * ```ts
 * import { createSessionStorageAdapter } from "@jayoncode/storage";
 * ```
 */
export function createSessionStorageAdapter(): StorageAdapter {
  return createWebStorageAdapter(() => {
    if (typeof globalThis.sessionStorage === "undefined") {
      return undefined;
    }
    return globalThis.sessionStorage;
  });
}
