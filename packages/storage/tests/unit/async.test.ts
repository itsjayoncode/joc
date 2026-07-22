import { afterEach, describe, expect, it, vi } from "vitest";

import { createAsyncStorage, createMemoryAsyncAdapter } from "../../src/async/index.js";
import { ConfigurationError, MigrationError } from "../../src/index.js";

describe("@jayoncode/storage/async", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("round-trips values asynchronously", async () => {
    const storage = createAsyncStorage<{ count: number }>({
      namespace: "app",
      adapter: createMemoryAsyncAdapter(),
    });

    await storage.set("cart", { count: 2 });
    await expect(storage.get("cart")).resolves.toEqual({ count: 2 });
    await expect(storage.has("cart")).resolves.toBe(true);
    await storage.remove("cart");
    await expect(storage.get("cart")).resolves.toBeNull();
  });

  it("applies TTL and expires entries", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const storage = createAsyncStorage({
      namespace: "ttl",
      adapter: createMemoryAsyncAdapter(),
      ttl: { minutes: 1 },
    });

    await storage.set("token", "secret");
    await expect(storage.get("token")).resolves.toBe("secret");

    vi.setSystemTime(new Date("2026-01-01T00:02:00.000Z"));
    await expect(storage.get("token")).resolves.toBeNull();
  });

  it("migrates on get", async () => {
    const adapter = createMemoryAsyncAdapter();
    const v1 = createAsyncStorage<{ n: number }>({
      namespace: "mig",
      adapter,
      schemaVersion: "1",
    });
    await v1.set("x", { n: 1 });

    const v2 = createAsyncStorage<{ n: number; label: string }>({
      namespace: "mig",
      adapter,
      schemaVersion: "2",
      migrate: (envelope) => ({
        ...envelope,
        schemaVersion: "2",
        value: { n: (envelope.value as { n: number }).n, label: "ok" },
      }),
    });

    await expect(v2.get("x")).resolves.toEqual({ n: 1, label: "ok" });
  });

  it("throws when migrate is missing across versions", async () => {
    const adapter = createMemoryAsyncAdapter();
    await createAsyncStorage({
      namespace: "mig",
      adapter,
      schemaVersion: "1",
    }).set("x", 1);

    const v2 = createAsyncStorage({
      namespace: "mig",
      adapter,
      schemaVersion: "2",
    });

    await expect(v2.get("x")).rejects.toBeInstanceOf(MigrationError);
  });

  it("requires keys() for clear", async () => {
    const storage = createAsyncStorage({
      namespace: "c",
      adapter: {
        async getItem() {
          return null;
        },
        async setItem() {},
        async removeItem() {},
      },
    });

    await expect(storage.clear()).rejects.toBeInstanceOf(ConfigurationError);
  });
});
