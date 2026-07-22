import { describe, expect, it, vi } from "vitest";

import { ConfigurationError } from "../../src/errors/index.js";
import { createMemoryAdapter, createStorage, QuotaExceededError } from "../../src/index.js";
import { enableQuotaGuard, estimateNamespaceBytes } from "../../src/quota/index.js";

describe("quota", () => {
  it("estimates namespace bytes", () => {
    const storage = createStorage({
      namespace: "q",
      adapter: createMemoryAdapter(),
    });
    storage.set("a", { n: 1 });
    expect(estimateNamespaceBytes(storage)).toBeGreaterThan(0);
  });

  it("throws when soft max would be exceeded", () => {
    const storage = createStorage({
      namespace: "q",
      adapter: createMemoryAdapter(),
    });
    const { storage: guarded } = enableQuotaGuard(storage, {
      maxApproxBytes: 40,
      mode: "throw",
    });

    expect(() => {
      guarded.set("big", { payload: "x".repeat(80) });
    }).toThrow(QuotaExceededError);
    expect(storage.get("big")).toBeNull();
  });

  it("warns once when crossing warnAtRatio then resets under", () => {
    const onWarn = vi.fn();
    const storage = createStorage({
      namespace: "q",
      adapter: createMemoryAdapter(),
    });
    const { storage: guarded } = enableQuotaGuard(storage, {
      maxApproxBytes: 500,
      warnAtRatio: 0.2,
      mode: "warn",
      onWarn,
    });

    guarded.set("a", { payload: "y".repeat(120) });
    expect(onWarn).toHaveBeenCalledTimes(1);
    guarded.set("b", { payload: "z".repeat(120) });
    expect(onWarn).toHaveBeenCalledTimes(1);

    guarded.remove("a");
    guarded.remove("b");
    guarded.set("c", { payload: "tiny" });
    guarded.set("d", { payload: "y".repeat(120) });
    expect(onWarn).toHaveBeenCalledTimes(2);
  });

  it("rejects invalid maxApproxBytes", () => {
    const storage = createStorage({
      namespace: "q",
      adapter: createMemoryAdapter(),
    });
    expect(() => enableQuotaGuard(storage, { maxApproxBytes: -1 })).toThrow(ConfigurationError);
  });
});
