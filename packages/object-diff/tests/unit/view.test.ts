import { describe, expect, it } from "vitest";

import { diff } from "../../src/index.js";
import { createDiffView } from "../../src/view/index.js";

describe("createDiffView", () => {
  const result = diff(
    { user: { name: "Ada" }, secret: "x", count: 1 },
    { user: { name: "Grace" }, secret: "y", count: 1, tag: "new" },
  );

  it("chains query + serialize + patch without mutating the source", () => {
    const before = result.changes.length;
    const view = createDiffView(result).exclude(["secret"]).updated();

    expect(view.paths()).toEqual(["user.name"]);
    expect(view.serialize("human")).toContain("changed `user.name`");
    expect(view.patch()).toEqual(
      expect.arrayContaining([expect.objectContaining({ op: "replace", path: "/user/name" })]),
    );
    expect(result.changes).toHaveLength(before);
  });

  it("exposes summary and statistics", () => {
    const view = createDiffView(result);
    expect(view.summary().total).toBe(result.metadata.changeCount);
    expect(view.statistics().totalChanges).toBeGreaterThan(0);
  });
});

describe("root isolation", () => {
  it("does not export createDiffView from root", async () => {
    const root = await import("../../src/index.js");
    expect("createDiffView" in root).toBe(false);
  });
});
