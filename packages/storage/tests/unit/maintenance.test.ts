import { describe, expect, it, vi } from "vitest";

import { ConfigurationError, createMemoryAdapter, createStorage } from "../../src/index.js";
import { cleanup } from "../../src/maintenance/index.js";

import type { StorageAdapter } from "../../src/index.js";

describe("cleanup (maintenance)", () => {
  it("removes expired keys and keeps valid ones", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const adapter = createMemoryAdapter();
    const storage = createStorage({
      namespace: "m",
      adapter,
      ttl: { seconds: 1 },
    });
    storage.set("keep", "forever", { ttl: { days: 1 } });
    storage.set("gone", "temp");

    vi.setSystemTime(new Date("2026-01-01T00:00:02.000Z"));
    const report = cleanup(storage);

    expect(report.scanned).toBe(2);
    expect(report.removedExpired).toBe(1);
    expect(report.skipped).toBe(1);
    expect(storage.get("keep")).toBe("forever");
    expect(adapter.getItem("m:gone")).toBeNull();

    vi.useRealTimers();
  });

  it("optionally removes invalid envelopes", () => {
    const adapter = createMemoryAdapter();
    const storage = createStorage({ namespace: "m", adapter });
    storage.set("ok", 1);
    adapter.setItem("m:bad", "{not-json");

    const without = cleanup(storage);
    expect(without.removedInvalid).toBe(0);
    expect(without.errors.length).toBe(1);
    expect(adapter.getItem("m:bad")).not.toBeNull();

    const withRemove = cleanup(storage, { removeInvalid: true });
    expect(withRemove.removedInvalid).toBe(1);
    expect(adapter.getItem("m:bad")).toBeNull();
    expect(storage.get("ok")).toBe(1);
  });

  it("throws when adapter.keys is missing", () => {
    const base = createMemoryAdapter();
    const adapter: StorageAdapter = {
      getItem: base.getItem.bind(base),
      setItem: base.setItem.bind(base),
      removeItem: base.removeItem.bind(base),
    };
    const storage = createStorage({ namespace: "m", adapter });
    expect(() => cleanup(storage)).toThrow(ConfigurationError);
  });

  it("only scans the instance namespace", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const adapter = createMemoryAdapter();
    const a = createStorage({ namespace: "a", adapter, ttl: { seconds: 1 } });
    const b = createStorage({ namespace: "b", adapter, ttl: { seconds: 1 } });
    a.set("x", 1);
    b.set("x", 1);

    vi.setSystemTime(new Date("2026-01-01T00:00:02.000Z"));
    const report = cleanup(a);
    expect(report.removedExpired).toBe(1);
    expect(adapter.getItem("b:x")).not.toBeNull();

    vi.useRealTimers();
  });
});
