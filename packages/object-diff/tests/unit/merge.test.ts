import { describe, expect, it } from "vitest";

import { InvalidOptionsError } from "../../src/index.js";
import { merge } from "../../src/merge/index.js";

describe("merge engine", () => {
  it("two-way latest-wins prefers right on leaf conflict", () => {
    const result = merge(
      { user: { name: "Ada", role: "admin" } },
      { user: { name: "Grace", role: "admin" } },
      { strategy: "latest-wins" },
    );

    expect(result.value).toEqual({ user: { name: "Grace", role: "admin" } });
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0]?.path).toBe("user.name");
  });

  it("merges non-conflicting object keys", () => {
    const result = merge({ a: 1, b: 2 }, { a: 1, c: 3 });

    expect(result.value).toEqual({ a: 1, b: 2, c: 3 });
    expect(result.conflicts).toHaveLength(0);
  });

  it("manual strategy keeps left and lists conflicts", () => {
    const result = merge({ x: 1 }, { x: 2 }, { strategy: "manual" });

    expect(result.value).toEqual({ x: 1 });
    expect(result.conflicts).toHaveLength(1);
  });

  it("custom strategy uses resolve", () => {
    const result = merge(
      { x: 1 },
      { x: 2 },
      {
        strategy: "custom",
        resolve: (conflict) => `${String(conflict.left)}|${String(conflict.right)}`,
      },
    );

    expect(result.value).toEqual({ x: "1|2" });
    expect(result.conflicts).toHaveLength(1);
  });

  it("throws when custom strategy lacks resolve", () => {
    expect(() => merge({ a: 1 }, { a: 2 }, { strategy: "custom" })).toThrow(InvalidOptionsError);
  });

  it("three-way takes the side that changed from base", () => {
    const base = { title: "draft", count: 1 };
    const left = { title: "left", count: 1 };
    const right = { title: "draft", count: 2 };

    const result = merge(left, right, { base });

    expect(result.value).toEqual({ title: "left", count: 2 });
    expect(result.conflicts).toHaveLength(0);
  });

  it("three-way records conflict when both sides change differently", () => {
    const base = { title: "draft" };
    const result = merge(
      { title: "left" },
      { title: "right" },
      {
        base,
        strategy: "latest-wins",
      },
    );

    expect(result.value).toEqual({ title: "right" });
    expect(result.conflicts).toHaveLength(1);
    expect(result.conflicts[0]?.base).toBe("draft");
  });

  it("includes applied DiffResult by default", () => {
    const left = { a: 1 };
    const result = merge(left, { a: 2 });
    expect(result.applied?.metadata.changeCount).toBeGreaterThan(0);
  });

  it("merges arrays by identityKey instead of as atomic leaves", () => {
    const result = merge(
      {
        items: [
          { id: 1, name: "a" },
          { id: 2, name: "b" },
        ],
      },
      {
        items: [
          { id: 2, name: "b2" },
          { id: 3, name: "c" },
        ],
      },
      { identityKey: "id", strategy: "latest-wins" },
    );

    expect(result.value).toEqual({
      items: [
        { id: 2, name: "b2" },
        { id: 3, name: "c" },
        { id: 1, name: "a" },
      ],
    });
    expect(result.conflicts).toEqual([
      expect.objectContaining({
        path: "items[0].name",
        reason: "both-changed",
        left: "b",
        right: "b2",
        identity: 2,
      }),
    ]);
  });

  it("three-way identity merge keeps one-sided edits and reports delete-edit", () => {
    const base = {
      items: [
        { id: 1, name: "a" },
        { id: 2, name: "b" },
        { id: 3, name: "c" },
      ],
    };
    const left = {
      items: [
        { id: 1, name: "a-left" },
        { id: 2, name: "b" },
        { id: 3, name: "c" },
      ],
    };
    const right = {
      items: [
        { id: 2, name: "b" },
        { id: 3, name: "c-right" },
        { id: 4, name: "d" },
      ],
    };

    const result = merge(left, right, {
      base,
      identityKey: "id",
      strategy: "latest-wins",
    });

    expect(result.value).toEqual({
      items: [
        { id: 2, name: "b" },
        { id: 3, name: "c-right" },
        { id: 4, name: "d" },
      ],
    });
    expect(result.conflicts).toEqual([
      expect.objectContaining({
        reason: "delete-edit",
        identity: 1,
        left: { id: 1, name: "a-left" },
      }),
    ]);
  });

  it("exposes reason on leaf conflicts", () => {
    const result = merge({ x: 1 }, { x: 2 });
    expect(result.conflicts[0]).toEqual(
      expect.objectContaining({
        path: "x",
        reason: "both-changed",
        left: 1,
        right: 2,
      }),
    );
  });

  it("throws on duplicate identity keys during merge", () => {
    expect(() =>
      merge({ items: [{ id: 1 }, { id: 1 }] }, { items: [{ id: 1 }] }, { identityKey: "id" }),
    ).toThrow(InvalidOptionsError);
  });
});
