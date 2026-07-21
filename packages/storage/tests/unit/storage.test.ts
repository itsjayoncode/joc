import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ConfigurationError,
  createMemoryAdapter,
  createStorage,
  isQuotaExceededError,
  MigrationError,
  packageId,
  QuotaExceededError,
  SerializationError,
} from "../../src/index.js";

import type { StorageAdapter } from "../../src/index.js";

describe("@jayoncode/storage", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("exposes package id", () => {
    expect(packageId).toBe("storage");
  });

  it("requires namespace and adapter", () => {
    expect(() =>
      createStorage({
        namespace: " ",
        adapter: createMemoryAdapter(),
      }),
    ).toThrow(ConfigurationError);
  });

  it("round-trips values with namespaced keys", () => {
    const adapter = createMemoryAdapter();
    const storage = createStorage<{ count: number }>({
      namespace: "app",
      adapter,
    });

    storage.set("cart", { count: 2 });
    expect(storage.get("cart")).toEqual({ count: 2 });
    expect(adapter.getItem("app:cart")).toMatch(/"count":2/);
    expect(storage.has("cart")).toBe(true);
    storage.remove("cart");
    expect(storage.get("cart")).toBeNull();
  });

  it("applies default TTL and expires entries", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const storage = createStorage({
      namespace: "ttl",
      adapter: createMemoryAdapter(),
      ttl: { minutes: 1 },
    });

    storage.set("token", "secret");
    expect(storage.get("token")).toBe("secret");

    vi.setSystemTime(new Date("2026-01-01T00:02:00.000Z"));
    expect(storage.get("token")).toBeNull();
  });

  it("supports per-write TTL override", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const storage = createStorage({
      namespace: "ttl",
      adapter: createMemoryAdapter(),
      ttl: { hours: 1 },
    });

    storage.set("a", 1, { ttl: { seconds: 5 } });
    vi.setSystemTime(new Date("2026-01-01T00:00:06.000Z"));
    expect(storage.get("a")).toBeNull();
  });

  it("migrates envelopes when schemaVersion changes", () => {
    const adapter = createMemoryAdapter();
    const v1 = createStorage<{ n: number }>({
      namespace: "mig",
      adapter,
      schemaVersion: "1",
    });
    v1.set("x", { n: 1 });

    const v2 = createStorage<{ n: number; label: string }>({
      namespace: "mig",
      adapter,
      schemaVersion: "2",
      migrate: (envelope) => ({
        ...envelope,
        schemaVersion: "2",
        value: {
          n: (envelope.value as { n: number }).n,
          label: "migrated",
        },
      }),
    });

    expect(v2.get("x")).toEqual({ n: 1, label: "migrated" });
    expect(v2.peek("x")?.schemaVersion).toBe("2");
  });

  it("throws when schema mismatches without migrate", () => {
    const adapter = createMemoryAdapter();
    createStorage({ namespace: "m", adapter, schemaVersion: "1" }).set("k", true);

    const next = createStorage({ namespace: "m", adapter, schemaVersion: "2" });
    expect(() => next.get("k")).toThrow(MigrationError);
  });

  it("clears only the namespace", () => {
    const adapter = createMemoryAdapter();
    const a = createStorage({ namespace: "a", adapter });
    const b = createStorage({ namespace: "b", adapter });
    a.set("1", "a");
    b.set("1", "b");
    a.clear();
    expect(a.get("1")).toBeNull();
    expect(b.get("1")).toBe("b");
  });

  it("peek returns envelope metadata", () => {
    const storage = createStorage({
      namespace: "peek",
      adapter: createMemoryAdapter(),
      schemaVersion: "3",
    });
    storage.set("k", { ok: true });
    const envelope = storage.peek("k");
    expect(envelope?.v).toBe(1);
    expect(envelope?.schemaVersion).toBe("3");
    expect(envelope?.value).toEqual({ ok: true });
  });

  it("rejects keys that contain ':'", () => {
    const storage = createStorage({
      namespace: "keys",
      adapter: createMemoryAdapter(),
    });
    expect(() => {
      storage.set("a:b", 1);
    }).toThrow(ConfigurationError);
  });

  it("has uses peek and does not migrate", () => {
    const adapter = createMemoryAdapter();
    createStorage({ namespace: "h", adapter, schemaVersion: "1" }).set("k", true);

    const migrate = vi.fn();
    const next = createStorage({
      namespace: "h",
      adapter,
      schemaVersion: "2",
      migrate,
    });

    expect(next.has("k")).toBe(true);
    expect(migrate).not.toHaveBeenCalled();
    expect(next.peek("k")?.schemaVersion).toBe("1");
  });

  it("clear throws when adapter.keys is missing", () => {
    const base = createMemoryAdapter();
    const adapter: StorageAdapter = {
      getItem: base.getItem.bind(base),
      setItem: base.setItem.bind(base),
      removeItem: base.removeItem.bind(base),
    };
    const storage = createStorage({ namespace: "c", adapter });
    storage.set("k", 1);
    expect(() => {
      storage.clear();
    }).toThrow(ConfigurationError);
    expect(storage.get("k")).toBe(1);
  });

  it("rejects non-finite expiresAt as a non-envelope", () => {
    const adapter = createMemoryAdapter();
    adapter.setItem(
      "bad:k",
      JSON.stringify({
        v: 1,
        schemaVersion: "1",
        savedAt: 1,
        expiresAt: "soon",
        value: true,
      }),
    );
    const storage = createStorage({ namespace: "bad", adapter });
    expect(() => storage.peek("k")).toThrow(SerializationError);
  });

  it("peek lazily deletes expired entries", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const adapter = createMemoryAdapter();
    const storage = createStorage({
      namespace: "exp",
      adapter,
      ttl: { seconds: 1 },
    });
    storage.set("k", "x");
    vi.setSystemTime(new Date("2026-01-01T00:00:02.000Z"));
    expect(storage.peek("k")).toBeNull();
    expect(adapter.getItem("exp:k")).toBeNull();
  });

  it("applies named policies from createStorage", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const storage = createStorage({
      namespace: "pol",
      adapter: createMemoryAdapter(),
      ttl: { hours: 1 },
      policies: {
        preferences: { ttl: { days: 365 } },
        cache: { ttl: { minutes: 10 } },
      },
    });

    storage.set("theme", "dark", { policy: "preferences" });
    expect(storage.peek("theme")?.expiresAt).toBe(Date.parse("2027-01-01T00:00:00.000Z"));

    storage.set("feed", 1, { policy: "cache" });
    vi.setSystemTime(new Date("2026-01-01T00:11:00.000Z"));
    expect(storage.get("feed")).toBeNull();
    expect(storage.get("theme")).toBe("dark");
  });

  it("lets per-write ttl override policy after validating the name", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const storage = createStorage({
      namespace: "pol",
      adapter: createMemoryAdapter(),
      policies: {
        cache: { ttl: { minutes: 10 } },
      },
    });

    storage.set("a", 1, { policy: "cache", ttl: { seconds: 5 } });
    vi.setSystemTime(new Date("2026-01-01T00:00:06.000Z"));
    expect(storage.get("a")).toBeNull();
  });

  it("throws for unknown or empty policy names", () => {
    const storage = createStorage({
      namespace: "pol",
      adapter: createMemoryAdapter(),
      policies: { cache: { ttl: { minutes: 1 } } },
    });

    expect(() => {
      storage.set("x", 1, { policy: "missing" });
    }).toThrow(ConfigurationError);
    expect(() => {
      storage.set("x", 1, { policy: "  " });
    }).toThrow(ConfigurationError);
    expect(() => {
      storage.definePolicy(" ", { ttl: { seconds: 1 } });
    }).toThrow(ConfigurationError);
  });

  it("definePolicy registers presets used by later sets", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const storage = createStorage({
      namespace: "pol",
      adapter: createMemoryAdapter(),
    });
    storage.definePolicy("session", { ttl: { hours: 8 } });
    storage.set("draft", { n: 1 }, { policy: "session" });
    expect(storage.peek("draft")?.expiresAt).toBe(Date.parse("2026-01-01T08:00:00.000Z"));
  });

  it("empty policy falls through to instance ttl", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const storage = createStorage({
      namespace: "pol",
      adapter: createMemoryAdapter(),
      ttl: { minutes: 2 },
      policies: {
        bare: {},
      },
    });

    storage.set("k", 1, { policy: "bare" });
    vi.setSystemTime(new Date("2026-01-01T00:01:00.000Z"));
    expect(storage.get("k")).toBe(1);
    vi.setSystemTime(new Date("2026-01-01T00:03:00.000Z"));
    expect(storage.get("k")).toBeNull();
  });

  it("get and peek ignore policies", () => {
    const storage = createStorage({
      namespace: "pol",
      adapter: createMemoryAdapter(),
      policies: {
        cache: { ttl: { minutes: 1 } },
      },
    });
    storage.set("k", "v");
    expect(storage.get("k")).toBe("v");
    expect(storage.peek("k")?.value).toBe("v");
  });

  it("migrate returning null deletes the key", () => {
    const adapter = createMemoryAdapter();
    createStorage({ namespace: "m", adapter, schemaVersion: "1" }).set("k", { n: 1 });

    const next = createStorage({
      namespace: "m",
      adapter,
      schemaVersion: "2",
      migrate: () => null,
    });

    expect(next.get("k")).toBeNull();
    expect(adapter.getItem("m:k")).toBeNull();
  });

  it("ttl duration <= 0 omits expiresAt", () => {
    const storage = createStorage({
      namespace: "ttl0",
      adapter: createMemoryAdapter(),
      ttl: { seconds: 0 },
    });
    storage.set("k", 1);
    expect(storage.peek("k")?.expiresAt).toBeUndefined();
  });

  it("defaults blank schemaVersion to 1", () => {
    const storage = createStorage({
      namespace: "ver",
      adapter: createMemoryAdapter(),
      schemaVersion: "  ",
    });
    expect(storage.schemaVersion).toBe("1");
    storage.set("k", true);
    expect(storage.peek("k")?.schemaVersion).toBe("1");
  });

  it("rejects envelopes with wrong wire version", () => {
    const adapter = createMemoryAdapter();
    adapter.setItem(
      "ver:k",
      JSON.stringify({
        v: 2,
        schemaVersion: "1",
        savedAt: 1,
        value: true,
      }),
    );
    const storage = createStorage({ namespace: "ver", adapter });
    expect(() => storage.peek("k")).toThrow(SerializationError);
  });

  it("detects quota exceeded errors", () => {
    expect(isQuotaExceededError(new QuotaExceededError("q"))).toBe(true);
    expect(isQuotaExceededError({ name: "NS_ERROR_DOM_QUOTA_REACHED" })).toBe(true);
    expect(isQuotaExceededError({ code: 22 })).toBe(true);
    expect(isQuotaExceededError(new Error("nope"))).toBe(false);
  });
});
