import { describe, expect, it } from "vitest";

import { createFocusAdapter } from "../../src/modules/focus/focus-adapter.js";

import type { FocusDocumentLike, FocusWindowLike } from "../../src/modules/focus/index.js";

class MockFocusWindow implements FocusWindowLike {
  private readonly listeners = new Map<"blur" | "focus", Set<() => void>>();

  public addEventListener(type: "blur" | "focus", listener: () => void): void {
    const bucket = this.listeners.get(type) ?? new Set<() => void>();

    bucket.add(listener);
    this.listeners.set(type, bucket);
  }

  public removeEventListener(type: "blur" | "focus", listener: () => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  public dispatch(type: "blur" | "focus"): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener();
    }
  }
}

describe("focus adapter", () => {
  it("detects support when window and document.hasFocus exist", () => {
    const windowRef = new MockFocusWindow();
    const documentRef: FocusDocumentLike = {
      hasFocus: () => true,
    };

    const adapter = createFocusAdapter({ document: documentRef, window: windowRef });

    expect(adapter.isSupported()).toBe(true);
    expect(adapter.read()).toBe("focused");
  });

  it("returns undefined when document.hasFocus is unavailable", () => {
    const adapter = createFocusAdapter({
      window: new MockFocusWindow(),
    });

    expect(adapter.isSupported()).toBe(false);
    expect(adapter.read()).toBeUndefined();
  });
});
