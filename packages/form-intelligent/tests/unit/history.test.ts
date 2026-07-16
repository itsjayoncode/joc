import { describe, expect, it } from "vitest";

import { ValueHistoryStack } from "../../src/history/stack.js";

describe("value history", () => {
  it("supports undo and redo", () => {
    const history = new ValueHistoryStack<{ count: number }>();
    history.record({ count: 1 });
    history.record({ count: 2 });
    expect(history.canUndo()).toBe(true);
    const undone = history.undo({ count: 3 });
    expect(undone).toEqual({ count: 2 });
    const redone = history.redo({ count: 1 });
    expect(redone).toEqual({ count: 3 });
  });
});
