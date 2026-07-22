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

  it("explains changes as structured records", () => {
    const explanations = createDiffView(result).exclude(["secret"]).explain();

    expect(explanations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "user.name",
          type: "changed",
          reason: "Primitive value changed",
          confidence: "high",
          summary: "`user.name` updated",
        }),
        expect.objectContaining({
          path: "tag",
          type: "added",
        }),
      ]),
    );
  });

  it("explains moves with identityKey hint and human format", () => {
    const moved = diff(
      [
        { id: 1, name: "a" },
        { id: 2, name: "b" },
        { id: 3, name: "c" },
      ],
      [
        { id: 2, name: "b" },
        { id: 3, name: "c" },
        { id: 1, name: "a" },
      ],
      { identityKey: "id", detectMoves: true },
    );

    const view = createDiffView(moved).moved();
    const structured = view.explain({ identityKey: "id" });

    expect(structured.length).toBeGreaterThanOrEqual(1);
    expect(structured[0]).toEqual(
      expect.objectContaining({
        type: "moved",
        reason: "Matched using identityKey 'id'",
        confidence: "high",
      }),
    );

    const human = view.explain({ format: "human", identityKey: "id" });
    expect(human).toContain("item moved");
    expect(human).toContain("matched using id");
    expect(human).toMatch(/index \d+ → \d+/);
  });
});

describe("root isolation", () => {
  it("does not export createDiffView from root", async () => {
    const root = await import("../../src/index.js");
    expect("createDiffView" in root).toBe(false);
  });
});
