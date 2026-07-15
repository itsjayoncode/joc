import { describe, expect, it } from "vitest";

import {
  added,
  applyPatch,
  compare,
  diff,
  hasChanges,
  patch,
  removed,
  serialize,
  updated,
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
