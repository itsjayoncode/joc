import { describe, expect, it } from "vitest";

import { diff } from "../../src/index.js";
import { exclude, filter, find, ofType, paths, query, summary } from "../../src/query/index.js";

describe("query engine", () => {
  const result = diff(
    { user: { name: "Ada", role: "admin" }, password: "secret", meta: { n: 1 } },
    { user: { name: "Grace", role: "admin" }, password: "secret", meta: { n: 2 }, tag: "x" },
  );

  it("finds the first matching change", () => {
    const hit = find(result, (record) => record.path.startsWith("user."));
    expect(hit?.path).toBe("user.name");
  });

  it("filters by predicate into a DiffResult", () => {
    const onlyUser = filter(result, (record) => record.path.startsWith("user."));
    expect(paths(onlyUser)).toEqual(["user.name"]);
    expect(onlyUser.metadata.changeCount).toBe(1);
  });

  it("excludes by path globs and prefixes", () => {
    const scrubbed = exclude(result, ["password", "meta.*"]);
    expect(paths(scrubbed)).toEqual(["user.name", "tag"]);
    expect(scrubbed.changes.some((change) => change.path === "meta.n")).toBe(false);
  });

  it("excludes by predicate", () => {
    const scrubbed = exclude(result, (record) => record.type === "added");
    expect(summary(scrubbed).added).toBe(0);
  });

  it("summarizes change counts from the change set", () => {
    expect(summary(result)).toEqual({
      total: 3,
      added: 1,
      removed: 0,
      changed: 2,
      unchanged: 0,
      moved: 0,
    });
  });

  it("filters by type", () => {
    expect(ofType(result, "added").changes.every((change) => change.type === "added")).toBe(true);
  });

  it("supports fluent query chaining", () => {
    const view = query(result).exclude(["password"]).updated().paths();
    expect(view).toEqual(["user.name", "meta.n"]);

    expect(query(result).added().summary()).toEqual({
      total: 1,
      added: 1,
      removed: 0,
      changed: 0,
      unchanged: 0,
      moved: 0,
    });
  });

  it("does not mutate the original DiffResult", () => {
    const before = result.changes.length;
    filter(result, () => false);
    expect(result.changes).toHaveLength(before);
  });
});

describe("root helpers remain unchanged", () => {
  it("added(a, b) still diffs two values", async () => {
    const { added } = await import("../../src/index.js");
    expect(added({ a: 1 }, { a: 1, b: 2 }).map((change) => change.path)).toEqual(["b"]);
  });
});
