import { afterEach, describe, expect, it, vi } from "vitest";

import { createDiagnostics } from "../../src/diagnostics/index.js";
import { createMemoryAdapter, createStorage } from "../../src/index.js";

describe("diagnostics", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("tracks stats and activity from writes", () => {
    const storage = createStorage({
      namespace: "d",
      adapter: createMemoryAdapter(),
    });
    const diagnostics = createDiagnostics(storage, { activityLimit: 10 });

    storage.set("a", 1);
    storage.set("b", 2);
    storage.remove("a");

    const stats = diagnostics.stats();
    expect(stats.sets).toBe(2);
    expect(stats.removes).toBe(1);

    const activity = diagnostics.activity();
    expect(activity[0]?.type).toBe("remove");
    expect(activity.some((entry) => entry.type === "set")).toBe(true);
  });

  it("report scans namespace sizes and expired", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

    const adapter = createMemoryAdapter();
    const storage = createStorage({
      namespace: "d",
      adapter,
      ttl: { seconds: 1 },
    });
    const diagnostics = createDiagnostics(storage);
    storage.set("live", "x", { ttl: { days: 1 } });
    storage.set("stale", "y");

    vi.setSystemTime(new Date("2026-01-01T00:00:02.000Z"));
    const report = diagnostics.report();
    expect(report.namespace).toBe("d");
    expect(report.entryCount).toBe(2);
    expect(report.expiredCount).toBe(1);
    expect(report.approxBytes).toBeGreaterThan(0);
    expect(report.stats.sets).toBe(2);
  });

  it("counts gets via diagnostics wrap", () => {
    const storage = createStorage({
      namespace: "d",
      adapter: createMemoryAdapter(),
    });
    const diagnostics = createDiagnostics(storage);
    storage.set("k", 1);
    storage.get("k");
    storage.peek("k");
    expect(diagnostics.stats().gets).toBe(1);
    expect(diagnostics.stats().peeks).toBe(1);
  });

  it("is idempotent and does not double-count", () => {
    const storage = createStorage({
      namespace: "d",
      adapter: createMemoryAdapter(),
    });
    const a = createDiagnostics(storage);
    const b = createDiagnostics(storage);
    expect(a).toBe(b);
    storage.set("k", 1);
    expect(a.stats().sets).toBe(1);
  });
});
