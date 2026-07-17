import { describe, expect, it } from "vitest";

import { applyPatch, compare, diff, hasChanges, patch, serialize } from "../../src/index.js";
import { merge } from "../../src/merge/index.js";

function makeTree(depth: number, breadth: number, label = "v"): unknown {
  if (depth <= 0) {
    return label;
  }

  const node: Record<string, unknown> = {};

  for (let index = 0; index < breadth; index += 1) {
    node[`k${String(index)}`] = makeTree(depth - 1, breadth, `${label}-${String(index)}`);
  }

  return node;
}

function median(samples: number[]): number {
  const sorted = [...samples].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2
    : (sorted[mid] ?? 0);
}

function bench(run: () => void, iterations = 7): number {
  run(); // warm
  const samples: number[] = [];

  for (let index = 0; index < iterations; index += 1) {
    const started = performance.now();
    run();
    samples.push(performance.now() - started);
  }

  return median(samples);
}

describe("performance budgets", () => {
  const medium = makeTree(4, 8) as Record<string, unknown>;
  const mediumClone = structuredClone(medium);
  const mediumFirstDiff = { ...structuredClone(medium), k0: "changed-root" };

  it("hasChanges identical medium tree stays under budget", () => {
    const ms = bench(() => {
      expect(hasChanges(medium, mediumClone)).toBe(false);
    });

    // Phase 1 baseline ~41ms; Phase 10 keeps headroom for CI variance.
    expect(ms).toBeLessThan(120);
  });

  it("hasChanges first-diff exits quickly", () => {
    const ms = bench(() => {
      expect(hasChanges(medium, mediumFirstDiff)).toBe(true);
    });

    expect(ms).toBeLessThan(20);
  });

  it("diff sparse medium tree stays under budget", () => {
    const ms = bench(() => {
      expect(diff(medium, mediumFirstDiff).metadata.changeCount).toBeGreaterThan(0);
    });

    expect(ms).toBeLessThan(120);
  });

  it("compare identical matches hasChanges cost class", () => {
    const ms = bench(() => {
      expect(compare(medium, mediumClone)).toBe(true);
    });

    expect(ms).toBeLessThan(120);
  });

  it("applyPatch of replaces stays under budget", () => {
    const left = { a: 1, b: 2, c: 3, d: 4, e: 5 };
    const right = { a: 9, b: 8, c: 7, d: 6, e: 5 };
    const ops = patch(diff(left, right));

    const ms = bench(() => {
      applyPatch(left, ops);
    });

    expect(ms).toBeLessThan(20);
  });

  it("serialize markdown of many changes stays under budget", () => {
    const before: Record<string, number> = {};
    const after: Record<string, number> = {};

    for (let index = 0; index < 200; index += 1) {
      before[`f${String(index)}`] = index;
      after[`f${String(index)}`] = index + 1;
    }

    const result = diff(before, after);

    const ms = bench(() => {
      serialize(result, "markdown");
    });

    expect(ms).toBeLessThan(40);
  });

  it("merge two medium trees stays under budget", () => {
    const left = structuredClone(medium);
    const right = structuredClone(mediumFirstDiff);

    const ms = bench(() => {
      merge(left, right, { strategy: "latest-wins", includeApplied: false });
    });

    expect(ms).toBeLessThan(200);
  });
});
