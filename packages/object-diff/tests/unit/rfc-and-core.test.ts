import { describe, expect, it } from "vitest";

import { applyPatch, applyPatchWithInverse, diff, patch, validatePatch } from "../../src/index.js";
import { InvalidPatchError, PatchApplyError } from "../../src/index.js";

describe("RFC 6902 move / copy / test", () => {
  it("applies move, copy, and test", () => {
    const doc = { a: 1, b: 2 };

    expect(applyPatch(doc, [{ op: "test", path: "/a", value: 1 }])).toEqual(doc);

    expect(applyPatch(doc, [{ op: "copy", from: "/a", path: "/c" }])).toEqual({
      a: 1,
      b: 2,
      c: 1,
    });

    expect(applyPatch(doc, [{ op: "move", from: "/a", path: "/c" }])).toEqual({
      b: 2,
      c: 1,
    });
  });

  it("fails test when value mismatches", () => {
    expect(() => applyPatch({ a: 1 }, [{ op: "test", path: "/a", value: 9 }])).toThrow(
      PatchApplyError,
    );
  });

  it("validates from for move/copy", () => {
    expect(() => {
      validatePatch([{ op: "move", path: "/a" }]);
    }).toThrow(InvalidPatchError);
    expect(() => {
      validatePatch([{ op: "copy", path: "/a", from: "/b" }]);
    }).not.toThrow();
  });

  it("generates move ops when detectMoves is enabled", () => {
    const result = diff({ oldKey: "same" }, { newKey: "same" }, { detectMoves: true });
    const ops = patch(result);

    expect(ops).toEqual([{ op: "move", from: "/oldKey", path: "/newKey" }]);
    expect(applyPatch({ oldKey: "same" }, ops)).toEqual({ newKey: "same" });
  });

  it("inverts move with applyPatchWithInverse", () => {
    const { value, inverse } = applyPatchWithInverse({ a: 1, b: 2 }, [
      { op: "move", from: "/a", path: "/c" },
    ]);

    expect(value).toEqual({ b: 2, c: 1 });
    expect(applyPatch(value, inverse)).toEqual({ a: 1, b: 2 });
  });
});

describe("core entry isolation", () => {
  it("core exports diff but not patch/serialize", async () => {
    const core = await import("../../src/core/api.js");
    expect(typeof core.diff).toBe("function");
    expect(typeof core.hasChanges).toBe("function");
    expect("patch" in core).toBe(false);
    expect("serialize" in core).toBe(false);
  });
});
