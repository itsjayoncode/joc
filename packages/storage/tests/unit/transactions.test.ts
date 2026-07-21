import { describe, expect, it } from "vitest";

import { ConfigurationError, createMemoryAdapter, createStorage } from "../../src/index.js";
import { transaction } from "../../src/transactions/index.js";

describe("transactions", () => {
  it("commits multiple writes together", () => {
    const storage = createStorage({
      namespace: "tx",
      adapter: createMemoryAdapter(),
    });

    const result = transaction(storage, () => {
      storage.set("a", 1);
      storage.set("b", 2);
      return storage.get("a");
    });

    expect(result).toBe(1);
    expect(storage.get("a")).toBe(1);
    expect(storage.get("b")).toBe(2);
  });

  it("rolls back on throw", () => {
    const storage = createStorage({
      namespace: "tx",
      adapter: createMemoryAdapter(),
    });
    storage.set("a", "keep");

    expect(() =>
      transaction(storage, () => {
        storage.set("a", "temp");
        storage.set("b", "new");
        throw new Error("boom");
      }),
    ).toThrow("boom");

    expect(storage.get("a")).toBe("keep");
    expect(storage.get("b")).toBeNull();
  });

  it("supports read-your-writes inside the transaction", () => {
    const storage = createStorage({
      namespace: "tx",
      adapter: createMemoryAdapter(),
    });

    transaction(storage, () => {
      storage.set("k", "inside");
      expect(storage.get("k")).toBe("inside");
      storage.remove("k");
      expect(storage.get("k")).toBeNull();
    });

    expect(storage.get("k")).toBeNull();
  });

  it("rejects nested transactions", () => {
    const storage = createStorage({
      namespace: "tx",
      adapter: createMemoryAdapter(),
    });

    expect(() => {
      transaction(storage, () => {
        transaction(storage, () => {
          storage.set("a", 1);
        });
      });
    }).toThrow(ConfigurationError);
  });

  it("rolls back clear", () => {
    const storage = createStorage({
      namespace: "tx",
      adapter: createMemoryAdapter(),
    });
    storage.set("a", 1);
    storage.set("b", 2);

    expect(() =>
      transaction(storage, () => {
        storage.clear();
        expect(storage.get("a")).toBeNull();
        throw new Error("abort");
      }),
    ).toThrow("abort");

    expect(storage.get("a")).toBe(1);
    expect(storage.get("b")).toBe(2);
  });

  it("commits clear then set", () => {
    const storage = createStorage({
      namespace: "tx",
      adapter: createMemoryAdapter(),
    });
    storage.set("old", 1);

    transaction(storage, () => {
      storage.clear();
      storage.set("new", 2);
    });

    expect(storage.get("old")).toBeNull();
    expect(storage.get("new")).toBe(2);
  });
});
