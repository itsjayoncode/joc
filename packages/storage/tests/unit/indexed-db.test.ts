import { describe, expect, it, vi } from "vitest";

import { createIndexedDbAdapter } from "../../src/adapters/indexed-db.js";
import { createAsyncStorage } from "../../src/async/index.js";
import { AdapterError } from "../../src/index.js";

describe("createIndexedDbAdapter", () => {
  it("rejects when indexedDB is missing", async () => {
    const original = globalThis.indexedDB;
    // @ts-expect-error test override
    delete globalThis.indexedDB;

    const adapter = createIndexedDbAdapter({ dbName: "test-joc-storage" });
    await expect(adapter.getItem("k")).rejects.toBeInstanceOf(AdapterError);

    globalThis.indexedDB = original;
  });

  it("round-trips via a stubbed IndexedDB-like map when available", async () => {
    if (typeof indexedDB === "undefined") {
      return;
    }

    const adapter = createIndexedDbAdapter({
      dbName: `joc-storage-test-${String(Date.now())}`,
      storeName: "entries",
    });
    const storage = createAsyncStorage({
      namespace: "idb",
      adapter,
    });

    await storage.set("theme", "dark");
    await expect(storage.get("theme")).resolves.toBe("dark");
    await storage.clear();
    await expect(storage.get("theme")).resolves.toBeNull();
  });
});

describe("createIndexedDbAdapter stubs", () => {
  it("stores string values through a fake IDB", async () => {
    const store = new Map<string, string>();
    const fakeDb = {
      objectStoreNames: { contains: () => true },
      transaction: () => ({
        objectStore: () => ({
          get: (key: string) => {
            const request = {
              result: store.get(key),
              onsuccess: null as ((ev: Event) => void) | null,
              onerror: null as ((ev: Event) => void) | null,
            };
            queueMicrotask(() => request.onsuccess?.(new Event("success")));
            return request;
          },
          put: (value: string, key: string) => {
            store.set(key, value);
            const request = {
              result: undefined,
              onsuccess: null as ((ev: Event) => void) | null,
              onerror: null as ((ev: Event) => void) | null,
            };
            queueMicrotask(() => request.onsuccess?.(new Event("success")));
            return request;
          },
          delete: (key: string) => {
            store.delete(key);
            const request = {
              result: undefined,
              onsuccess: null as ((ev: Event) => void) | null,
              onerror: null as ((ev: Event) => void) | null,
            };
            queueMicrotask(() => request.onsuccess?.(new Event("success")));
            return request;
          },
          getAllKeys: () => {
            const request = {
              result: [...store.keys()],
              onsuccess: null as ((ev: Event) => void) | null,
              onerror: null as ((ev: Event) => void) | null,
            };
            queueMicrotask(() => request.onsuccess?.(new Event("success")));
            return request;
          },
        }),
      }),
    };

    vi.stubGlobal("indexedDB", {
      open: () => {
        const request = {
          result: fakeDb,
          onsuccess: null as ((ev: Event) => void) | null,
          onerror: null as ((ev: Event) => void) | null,
          onupgradeneeded: null as ((ev: Event) => void) | null,
        };
        queueMicrotask(() => request.onsuccess?.(new Event("success")));
        return request;
      },
    });

    const adapter = createIndexedDbAdapter({ dbName: "fake", storeName: "entries" });
    await adapter.setItem("a:b", '{"v":1}');
    await expect(adapter.getItem("a:b")).resolves.toBe('{"v":1}');
    await expect(adapter.keys()).resolves.toEqual(["a:b"]);
    await adapter.removeItem("a:b");
    await expect(adapter.getItem("a:b")).resolves.toBeNull();

    vi.unstubAllGlobals();
  });
});
