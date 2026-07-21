import { afterEach, describe, expect, it } from "vitest";

import {
  AdapterError,
  createLocalStorageAdapter,
  createSessionStorageAdapter,
  createStorage,
  isQuotaExceededError,
  QuotaExceededError,
} from "../../src/index.js";

function installMemoryDomStorage(options?: {
  readonly setItem?: (key: string, value: string) => void;
}): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key) {
      return map.get(key) ?? null;
    },
    key(index) {
      return [...map.keys()][index] ?? null;
    },
    removeItem(key) {
      map.delete(key);
    },
    setItem(key, value) {
      if (options?.setItem) {
        options.setItem(key, value);
        return;
      }
      map.set(key, value);
    },
  };
}

describe("web storage adapters", () => {
  const originalLocal = globalThis.localStorage;
  const originalSession = globalThis.sessionStorage;

  afterEach(() => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: originalLocal,
    });
    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      value: originalSession,
    });
  });

  it("round-trips through localStorage adapter", () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: installMemoryDomStorage(),
    });

    const storage = createStorage({
      namespace: "web",
      adapter: createLocalStorageAdapter(),
    });
    storage.set("theme", "dark");
    expect(storage.get("theme")).toBe("dark");
    expect(globalThis.localStorage.getItem("web:theme")).toContain('"value":"dark"');
    storage.clear();
    expect(storage.has("theme")).toBe(false);
  });

  it("round-trips through sessionStorage adapter", () => {
    Object.defineProperty(globalThis, "sessionStorage", {
      configurable: true,
      value: installMemoryDomStorage(),
    });

    const storage = createStorage({
      namespace: "sess",
      adapter: createSessionStorageAdapter(),
    });
    storage.set("token", "abc");
    expect(storage.peek("token")?.value).toBe("abc");
  });

  it("throws AdapterError when localStorage is unavailable on set", () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: undefined,
    });

    const storage = createStorage({
      namespace: "gone",
      adapter: createLocalStorageAdapter(),
    });
    expect(storage.get("k")).toBeNull();
    expect(() => {
      storage.set("k", 1);
    }).toThrow(AdapterError);
  });

  it("maps quota failures to QuotaExceededError", () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: installMemoryDomStorage({
        setItem() {
          const error = new Error("quota");
          error.name = "QuotaExceededError";
          throw error;
        },
      }),
    });

    const storage = createStorage({
      namespace: "q",
      adapter: createLocalStorageAdapter(),
    });
    expect(() => {
      storage.set("k", "x");
    }).toThrow(QuotaExceededError);
    try {
      storage.set("k", "x");
    } catch (error) {
      expect(isQuotaExceededError(error)).toBe(true);
    }
  });
});
