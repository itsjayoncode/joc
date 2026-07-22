import { describe, expect, it } from "vitest";

import {
  added,
  applyPatch,
  applyPatchWithInverse,
  compare,
  diff,
  hasChanges,
  InvalidPatchError,
  optimizePatch,
  patch,
  removed,
  serialize,
  updated,
  validatePatch,
  type Patch,
} from "../../src/index.js";

describe("compare", () => {
  it("returns true for equal primitives", () => {
    expect(compare(1, 1)).toBe(true);
    expect(compare("a", "a")).toBe(true);
    expect(compare(null, null)).toBe(true);
  });

  it("treats NaN as equal", () => {
    expect(compare(Number.NaN, Number.NaN)).toBe(true);
  });

  it("compares nested objects deeply", () => {
    expect(compare({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    expect(compare({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
  });
});

describe("diff", () => {
  it("detects added, removed, and changed keys", () => {
    const result = diff({ a: 1, b: 2 }, { a: 1, c: 3, b: 4 });

    expect(updated({ a: 1, b: 2 }, { a: 1, c: 3, b: 4 }).some((c) => c.path === "b")).toBe(true);
    expect(added({ a: 1, b: 2 }, { a: 1, c: 3, b: 4 }).some((c) => c.path === "c")).toBe(true);
    expect(result.metadata.changeCount).toBeGreaterThan(0);
  });

  it("detects array changes", () => {
    const changes = diff([1, 2], [1, 3]).changes;
    expect(changes.some((change) => change.type === "changed")).toBe(true);
  });

  it("supports includeUnchanged", () => {
    const changes = diff({ a: 1 }, { a: 1 }, { includeUnchanged: true }).changes;
    expect(changes.some((change) => change.type === "unchanged")).toBe(true);
  });
});

describe("hasChanges", () => {
  it("returns false for equal values", () => {
    expect(hasChanges({ a: 1 }, { a: 1 })).toBe(false);
  });

  it("returns true when values differ", () => {
    expect(hasChanges({ a: 1 }, { a: 2 })).toBe(true);
  });
});

describe("patch", () => {
  it("generates and applies replace operations", () => {
    const source = { user: { name: "John" } };
    const target = { user: { name: "Jane" } };
    const result = diff(source, target);
    const operations = patch(result);
    const applied = applyPatch(source, operations);

    expect(applied).toEqual(target);
  });

  it("serializes diff output", () => {
    const result = diff({ a: 1 }, { a: 2 });
    expect(serialize(result, "json")).toContain("changed");
    expect(serialize(result, "markdown")).toContain("#");
    expect(serialize(result, "table")).toContain("|");
  });

  it("rejects prototype-polluting patch paths", () => {
    const attempts = [
      [{ op: "add" as const, path: "/__proto__/polluted", value: true }],
      [{ op: "add" as const, path: "/constructor/prototype/polluted", value: true }],
      [{ op: "replace" as const, path: "/prototype", value: true }],
    ];

    for (const pollutionAttempt of attempts) {
      expect(() => applyPatch({}, pollutionAttempt)).toThrow(InvalidPatchError);
    }

    expect(Object.prototype).not.toHaveProperty("polluted");
  });
});

describe("filtered helpers", () => {
  it("returns only removed changes", () => {
    const changes = removed({ a: 1, b: 2 }, { a: 1 });
    expect(changes.every((change) => change.type === "removed")).toBe(true);
    expect(changes.some((change) => change.path === "b")).toBe(true);
  });
});

describe("dates and regex", () => {
  it("compares dates by time value", () => {
    const date = new Date("2024-01-01T00:00:00.000Z");
    expect(compare(date, new Date("2024-01-01T00:00:00.000Z"))).toBe(true);
    expect(hasChanges(date, new Date("2024-01-02T00:00:00.000Z"))).toBe(true);
  });

  it("compares regex by source and flags", () => {
    expect(compare(/abc/i, /abc/i)).toBe(true);
    expect(hasChanges(/abc/i, /abc/g)).toBe(true);
  });
});

describe("phase 2 options", () => {
  it("detectMoves pairs equal removed+added into moved", () => {
    const result = diff({ a: { id: 1 }, b: 2 }, { c: { id: 1 }, b: 2 }, { detectMoves: true });

    expect(result.changes).toEqual([
      expect.objectContaining({
        type: "moved",
        from: "a",
        path: "c",
      }),
    ]);
    expect(result.metadata.movedCount).toBe(1);
  });

  it("ignores configured paths", () => {
    const result = diff(
      { user: { name: "a", secret: "x" } },
      { user: { name: "b", secret: "y" } },
      { ignore: ["user.secret"] },
    );

    expect(result.changes.some((c) => c.path === "user.secret")).toBe(false);
    expect(result.changes.some((c) => c.path === "user.name")).toBe(true);
  });

  it("includes only configured paths", () => {
    const result = diff(
      { a: 1, b: 2, c: { d: 3 } },
      { a: 9, b: 8, c: { d: 7 } },
      { include: ["a"] },
    );

    expect(result.changes.every((c) => c.path === "a")).toBe(true);
  });

  it("matches array items by identityKey", () => {
    const before = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
    ];
    const after = [
      { id: 2, name: "b" },
      { id: 1, name: "a2" },
    ];

    const positional = diff(before, after);
    const byId = diff(before, after, { identityKey: "id" });

    expect(byId.changes.some((c) => c.path.endsWith(".name"))).toBe(true);
    expect(byId.metadata.changeCount).toBeLessThan(positional.metadata.changeCount);
  });

  it("hasChanges respects ignore", () => {
    expect(hasChanges({ keep: 1, skip: 1 }, { keep: 1, skip: 2 }, { ignore: ["skip"] })).toBe(
      false,
    );
  });
});

describe("phase 1 algorithms", () => {
  it("detectMoves reports array reorder as moved", () => {
    const result = diff(["A", "B", "C"], ["B", "C", "A"], { detectMoves: true });

    expect(result.changes).toEqual([
      expect.objectContaining({
        type: "moved",
        from: "[0]",
        path: "[2]",
        previous: "A",
        current: "A",
      }),
    ]);
    expect(result.metadata.movedCount).toBe(1);
  });

  it("identityKey + detectMoves emits moved on reorder", () => {
    const before = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 3, name: "c" },
    ];
    const after = [
      { id: 2, name: "b" },
      { id: 3, name: "c" },
      { id: 1, name: "a" },
    ];

    const result = diff(before, after, { identityKey: "id", detectMoves: true });

    expect(result.changes.some((change) => change.type === "moved")).toBe(true);
    expect(result.metadata.movedCount).toBeGreaterThanOrEqual(1);
    expect(hasChanges(before, after, { identityKey: "id", detectMoves: true })).toBe(true);
  });

  it("ignore prefix.** still reports a change on the prefix", () => {
    const result = diff(
      { secrets: { token: "a", nested: { x: 1 } }, keep: 1 },
      { secrets: { token: "b", nested: { x: 2 } }, keep: 1 },
      { ignore: ["secrets.**"] },
    );

    expect(result.changes.some((change) => change.path.startsWith("secrets."))).toBe(false);
    expect(result.changes).toEqual([
      expect.objectContaining({
        type: "changed",
        path: "secrets",
      }),
    ]);
    expect(
      hasChanges(
        { secrets: { token: "a" } },
        { secrets: { token: "b" } },
        { ignore: ["secrets.**"] },
      ),
    ).toBe(true);
    expect(
      hasChanges(
        { secrets: { token: "a" }, keep: 1 },
        { secrets: { token: "a" }, keep: 1 },
        { ignore: ["secrets.**"] },
      ),
    ).toBe(false);
  });

  it("hasChanges with identityKey early-exits without requiring a full collect", () => {
    const before = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
    ];
    const after = [
      { id: 2, name: "b" },
      { id: 1, name: "a2" },
    ];

    expect(hasChanges(before, after, { identityKey: "id" })).toBe(true);
    expect(hasChanges(before, before, { identityKey: "id" })).toBe(false);
  });
});

describe("phase 3 patch hardening", () => {
  it("validates patch shape and unsupported ops", () => {
    expect(() => {
      validatePatch("nope");
    }).toThrow(InvalidPatchError);
    expect(() => {
      validatePatch([{ op: "wat" as "add", path: "/a", value: 1 }]);
    }).toThrow(InvalidPatchError);
    expect(() => {
      validatePatch([{ op: "add", path: "a", value: 1 }]);
    }).toThrow(InvalidPatchError);
  });

  it("optimizes sequential replaces on the same path", () => {
    const optimized = optimizePatch([
      { op: "replace", path: "/a", value: 1 },
      { op: "replace", path: "/a", value: 2 },
      { op: "replace", path: "/b", value: 3 },
    ]);

    expect(optimized).toEqual([
      { op: "replace", path: "/a", value: 2 },
      { op: "replace", path: "/b", value: 3 },
    ]);
  });

  it("applies RFC-style add/replace/remove fixtures", () => {
    const doc = { foo: "bar", baz: [1, 2] };
    const safeOps: Patch = [
      { op: "replace", path: "/foo", value: "qux" },
      { op: "add", path: "/baz/2", value: 3 },
      { op: "remove", path: "/baz/0" },
    ];

    const next = applyPatch(doc, safeOps);
    expect(next).toEqual({ foo: "qux", baz: [2, 3] });
    expect(doc).toEqual({ foo: "bar", baz: [1, 2] });
  });

  it("applyPatchWithInverse restores previous values", () => {
    const source = { user: { name: "John", role: "admin" } };
    const ops = patch(diff(source, { user: { name: "Jane", role: "admin" } }));
    const { value, inverse } = applyPatchWithInverse(source, ops);

    expect(value).toEqual({ user: { name: "Jane", role: "admin" } });
    expect(applyPatch(value, inverse)).toEqual(source);
  });

  it("patch({ optimize: true }) coalesces replaces", () => {
    const result = diff({ a: 1, b: 1 }, { a: 2, b: 2 });
    const raw = patch(result);
    const optimized = patch(result, { optimize: true });
    expect(optimized.length).toBeLessThanOrEqual(raw.length);
  });
});
