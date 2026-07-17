import { describe, expect, it } from "vitest";

import { diff, hasChanges, serialize } from "../../src/index.js";
import { merge } from "../../src/merge/index.js";
import { createEngine } from "../../src/plugins/index.js";

/**
 * Contract tests for Phase 9 integration sketches — public API only.
 */
describe("integration contracts", () => {
  it("supports form dirty check + audit serialize", () => {
    const saved = { email: "a@x.com", role: "admin" };
    const draft = { email: "a@x.com", role: "editor" };

    expect(hasChanges(saved, draft)).toBe(true);
    expect(serialize(diff(saved, draft), "markdown")).toContain("role");
  });

  it("supports session snapshot path lists", () => {
    const previous = { route: "/a", scrollY: 0 };
    const current = { route: "/b", scrollY: 10 };
    const paths = diff(previous, current).changes.map((change) => change.path);

    expect(paths).toEqual(expect.arrayContaining(["route", "scrollY"]));
  });

  it("maps changes to audit-shaped events", () => {
    const events = diff({ n: 1 }, { n: 2 }).changes.map((change) => ({
      type: "object-diff.change" as const,
      path: change.path,
      changeType: change.type,
    }));

    expect(events).toEqual([{ type: "object-diff.change", path: "n", changeType: "changed" }]);
  });

  it("supports three-way collaboration merge", () => {
    const result = merge(
      { title: "A", body: "local" },
      { title: "B", body: "base" },
      { base: { title: "A", body: "base" }, strategy: "latest-wins" },
    );

    expect(result.value).toEqual({ title: "B", body: "local" });
    expect(result.conflicts).toHaveLength(0);
  });

  it("supports optional plugin engine without root coupling", () => {
    const engine = createEngine();
    expect(engine.compare(1, 1)).toBe(true);
  });
});
