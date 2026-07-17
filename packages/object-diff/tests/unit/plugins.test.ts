import { describe, expect, it, vi } from "vitest";

import { PluginError, diff as rootDiff } from "../../src/index.js";
import { createEngine } from "../../src/plugins/index.js";

describe("plugin system", () => {
  it("createEngine works with zero plugins", () => {
    const engine = createEngine();
    expect(engine.plugins).toEqual([]);
    expect(engine.diff({ a: 1 }, { a: 2 }).metadata.changeCount).toBe(1);
  });

  it("applies matcher plugins before user customComparator", () => {
    const engine = createEngine({
      plugins: [
        {
          name: "case-insensitive-string",
          matchers: [
            (a, b) => {
              if (typeof a === "string" && typeof b === "string") {
                return a.toLowerCase() === b.toLowerCase();
              }

              return undefined;
            },
          ],
        },
      ],
    });

    expect(engine.compare("Ada", "ada")).toBe(true);
    expect(engine.hasChanges({ name: "Ada" }, { name: "ADA" })).toBe(false);
  });

  it("runs diff hooks and can transform afterDiff", () => {
    const before = vi.fn();
    const engine = createEngine({
      plugins: [
        {
          name: "audit",
          hooks: {
            beforeDiff: before,
            afterDiff: (result) => ({
              ...result,
              changes: result.changes.filter((change) => change.path !== "secret"),
              metadata: {
                ...result.metadata,
                changeCount: result.changes.filter((change) => change.path !== "secret").length,
              },
            }),
          },
        },
      ],
    });

    const result = engine.diff({ a: 1, secret: "x" }, { a: 2, secret: "y" });
    expect(before).toHaveBeenCalledOnce();
    expect(result.changes.map((change) => change.path)).toEqual(["a"]);
  });

  it("registers formatter plugins via serialize", () => {
    const engine = createEngine({
      plugins: [
        {
          name: "csv-format",
          formatters: [
            {
              name: "csv",
              format: (result) =>
                result.changes.map((change) => `${change.type},${change.path}`).join("\n"),
            },
          ],
        },
      ],
    });

    const result = engine.diff({ a: 1 }, { a: 2 });
    expect(engine.serialize(result, "csv")).toBe("changed,a");
    expect(engine.serialize(result, "human")).toContain("changed `a`");
  });

  it("registers named merge strategies", () => {
    const engine = createEngine({
      plugins: [
        {
          name: "prefer-left",
          mergeStrategies: [
            {
              name: "prefer-left",
              resolve: (conflict) => conflict.left,
            },
          ],
        },
      ],
    });

    const merged = engine.merge({ x: 1 }, { x: 2 }, { strategy: "prefer-left" });
    expect(merged.value).toEqual({ x: 1 });
    expect(merged.conflicts).toHaveLength(1);
  });

  it("wraps hook failures as PluginError", () => {
    const engine = createEngine({
      plugins: [
        {
          name: "boom",
          hooks: {
            beforeDiff: () => {
              throw new Error("nope");
            },
          },
        },
      ],
    });

    expect(() => engine.diff(1, 2)).toThrow(PluginError);
  });

  it("rejects duplicate plugin names", () => {
    expect(() =>
      createEngine({
        plugins: [{ name: "x" }, { name: "x" }],
      }),
    ).toThrow(PluginError);
  });

  it("does not register anything on root import", () => {
    const a = rootDiff({ n: 1 }, { n: 2 });
    expect(a.metadata.changeCount).toBe(1);
  });
});

describe("root isolation", () => {
  it("does not export createEngine from root", async () => {
    const root = await import("../../src/index.js");
    expect("createEngine" in root).toBe(false);
  });
});
