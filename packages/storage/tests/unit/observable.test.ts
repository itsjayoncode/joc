import { afterEach, describe, expect, it, vi } from "vitest";

import { createMemoryAdapter, createStorage } from "../../src/index.js";
import { observe } from "../../src/observable/index.js";

describe("observable", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("watch receives set and remove", () => {
    const storage = observe(
      createStorage<string>({ namespace: "o", adapter: createMemoryAdapter() }),
    );
    const values: Array<string | null> = [];
    const stop = storage.watch("theme", (value) => {
      values.push(value);
    });

    storage.set("theme", "dark");
    storage.remove("theme");
    stop();
    storage.set("theme", "light");

    expect(values).toEqual(["dark", null]);
  });

  it("on(set) and unsubscribe", () => {
    const storage = observe(createStorage({ namespace: "o", adapter: createMemoryAdapter() }));
    const keys: string[] = [];
    const off = storage.on("set", (event) => {
      keys.push(event.key);
    });
    storage.set("a", 1);
    off();
    storage.set("b", 2);
    expect(keys).toEqual(["a"]);
  });

  it("emits expired on get", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const storage = observe(
      createStorage({
        namespace: "o",
        adapter: createMemoryAdapter(),
        ttl: { seconds: 1 },
      }),
    );
    const expired: string[] = [];
    storage.on("expired", (event) => {
      expired.push(`${event.key}:${event.via}`);
    });
    storage.set("k", 1);
    vi.setSystemTime(new Date("2026-01-01T00:00:02.000Z"));
    expect(storage.get("k")).toBeNull();
    expect(expired).toEqual(["k:get"]);
  });

  it("emits migrated on get", () => {
    const adapter = createMemoryAdapter();
    createStorage({ namespace: "o", adapter, schemaVersion: "1" }).set("k", { n: 1 });

    const storage = observe(
      createStorage<{ n: number; label: string }>({
        namespace: "o",
        adapter,
        schemaVersion: "2",
        migrate: (envelope) => ({
          ...envelope,
          schemaVersion: "2",
          value: {
            n: (envelope.value as { n: number }).n,
            label: "ok",
          },
        }),
      }),
    );

    const migrated: string[] = [];
    storage.on("migrated", (event) => {
      migrated.push(`${event.from}->${event.to}`);
    });
    expect(storage.get("k")).toEqual({ n: 1, label: "ok" });
    expect(migrated).toEqual(["1->2"]);
  });

  it("clear notifies watchers with null", () => {
    const storage = observe(createStorage({ namespace: "o", adapter: createMemoryAdapter() }));
    const values: Array<unknown> = [];
    storage.watch("a", (value) => {
      values.push(value);
    });
    storage.set("a", 1);
    storage.clear();
    expect(values).toEqual([1, null]);
  });

  it("listener errors do not break set", () => {
    const storage = observe(createStorage({ namespace: "o", adapter: createMemoryAdapter() }));
    storage.on("set", () => {
      throw new Error("boom");
    });
    expect(() => {
      storage.set("k", 1);
    }).not.toThrow();
    expect(storage.get("k")).toBe(1);
  });
});
