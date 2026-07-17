import { describe, expect, it } from "vitest";

import { diff, patch as buildPatch } from "../../src/index.js";
import { pathDepth, statistics } from "../../src/stats/index.js";

describe("statistics engine", () => {
  it("computes path depth", () => {
    expect(pathDepth("")).toBe(0);
    expect(pathDepth("user")).toBe(1);
    expect(pathDepth("user.name")).toBe(2);
    expect(pathDepth("items[0].id")).toBe(3);
  });

  it("reports totals, depths, and hot prefixes", () => {
    const result = diff(
      {
        user: { name: "Ada", role: "admin" },
        items: [{ id: 1 }, { id: 2 }],
        meta: { n: 1 },
      },
      {
        user: { name: "Grace", role: "admin" },
        items: [{ id: 1 }, { id: 9 }],
        meta: { n: 2 },
        tag: "x",
      },
    );

    const stats = statistics(result);

    expect(stats.totalChanges).toBe(result.metadata.changeCount);
    expect(stats.changedRatio).toBe(1);
    expect(stats.arrayChangeCount).toBeGreaterThan(0);
    expect(stats.objectChangeCount).toBeGreaterThan(0);
    expect(stats.maxDepth).toBeGreaterThanOrEqual(2);
    expect(stats.deepestPath).toBeTruthy();
    expect(stats.moveCount).toBe(0);
    expect(stats.estimatedPatchSize).toBeGreaterThan(0);
    expect(stats.hotPrefixes.length).toBeGreaterThan(0);
    expect(stats.hotPrefixes[0]?.count).toBeGreaterThanOrEqual(1);
  });

  it("uses provided patch for estimated size", () => {
    const left = { a: 1 };
    const right = { a: 2, b: 3 };
    const result = diff(left, right);
    const ops = buildPatch(result);

    const fromEstimate = statistics(result);
    const fromPatch = statistics(result, ops);

    expect(fromPatch.estimatedPatchSize).toBe(JSON.stringify(ops).length);
    expect(fromEstimate.estimatedPatchSize).toBeGreaterThan(0);
  });

  it("reflects unchanged records in changedRatio", () => {
    const result = diff({ a: 1, b: 2 }, { a: 1, b: 3 }, { includeUnchanged: true });
    const stats = statistics(result);

    expect(stats.changedRatio).toBeLessThan(1);
    expect(stats.changedRatio).toBeGreaterThan(0);
  });

  it("respects hotPrefixLimit", () => {
    const result = diff({ a: 1, b: 1, c: 1 }, { a: 2, b: 2, c: 2 });
    const stats = statistics(result, undefined, { hotPrefixLimit: 2 });
    expect(stats.hotPrefixes).toHaveLength(2);
  });
});

describe("root isolation", () => {
  it("does not export statistics from root", async () => {
    const root = await import("../../src/index.js");
    expect("statistics" in root).toBe(false);
  });
});
