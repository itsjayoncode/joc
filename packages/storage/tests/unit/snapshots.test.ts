import { afterEach, describe, expect, it, vi } from "vitest";

import { ConfigurationError, createMemoryAdapter, createStorage } from "../../src/index.js";
import { restore, snapshot } from "../../src/snapshots/index.js";

describe("snapshots", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("exports and restores namespace entries (merge)", () => {
    const adapter = createMemoryAdapter();
    const storage = createStorage({ namespace: "app", adapter });
    storage.set("a", 1);
    storage.set("b", 2);

    const snap = snapshot(storage);
    expect(snap.format).toBe(1);
    expect(snap.namespace).toBe("app");
    expect(snap.entries).toHaveLength(2);

    storage.remove("a");
    storage.set("c", 3);

    const report = restore(storage, snap, { mode: "merge" });
    expect(report.written).toBe(2);
    expect(report.cleared).toBe(false);
    expect(storage.get("a")).toBe(1);
    expect(storage.get("b")).toBe(2);
    expect(storage.get("c")).toBe(3);
  });

  it("overwrite clears keys not in the snapshot", () => {
    const adapter = createMemoryAdapter();
    const storage = createStorage({ namespace: "app", adapter });
    storage.set("a", 1);
    const snap = snapshot(storage);
    storage.set("extra", 9);

    const report = restore(storage, snap, { mode: "overwrite" });
    expect(report.cleared).toBe(true);
    expect(storage.get("a")).toBe(1);
    expect(storage.get("extra")).toBeNull();
  });

  it("skips expired entries by default", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const adapter = createMemoryAdapter();
    const storage = createStorage({
      namespace: "app",
      adapter,
      ttl: { seconds: 1 },
    });
    storage.set("live", "ok", { ttl: { days: 1 } });
    storage.set("stale", "bye");

    vi.setSystemTime(new Date("2026-01-01T00:00:02.000Z"));
    const snap = snapshot(storage);
    expect(snap.entries.map((entry) => entry.key)).toEqual(["live"]);

    const withExpired = snapshot(storage, { includeExpired: true });
    expect(withExpired.entries).toHaveLength(2);
  });

  it("rejects namespace mismatch", () => {
    const a = createStorage({ namespace: "a", adapter: createMemoryAdapter() });
    const b = createStorage({ namespace: "b", adapter: createMemoryAdapter() });
    a.set("k", 1);
    const snap = snapshot(a);
    expect(() => restore(b, snap)).toThrow(ConfigurationError);
  });

  it("does not migrate on restore — get migrates later", () => {
    const adapter = createMemoryAdapter();
    const v1 = createStorage({ namespace: "app", adapter, schemaVersion: "1" });
    v1.set("k", { n: 1 });
    const snap = snapshot(v1);

    const v2 = createStorage({
      namespace: "app",
      adapter: createMemoryAdapter(),
      schemaVersion: "2",
      migrate: (envelope) => ({
        ...envelope,
        schemaVersion: "2",
        value: { n: (envelope.value as { n: number }).n, label: "ok" },
      }),
    });
    restore(v2, snap, { mode: "overwrite" });
    expect(v2.peek("k")?.schemaVersion).toBe("1");
    expect(v2.get("k")).toEqual({ n: 1, label: "ok" });
    expect(v2.peek("k")?.schemaVersion).toBe("2");
  });
});
