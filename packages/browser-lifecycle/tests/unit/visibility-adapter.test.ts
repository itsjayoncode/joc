import { describe, expect, it } from "vitest";

import { createVisibilityAdapter } from "../../src/modules/visibility/index.js";

import type { VisibilityDocumentLike } from "../../src/modules/visibility/index.js";

class MockVisibilityDocument implements VisibilityDocumentLike {
  public hidden = false;
  public visibilityState = "visible";

  private readonly listeners = new Set<() => void>();

  public addEventListener(_type: "visibilitychange", listener: () => void): void {
    this.listeners.add(listener);
  }

  public removeEventListener(_type: "visibilitychange", listener: () => void): void {
    this.listeners.delete(listener);
  }

  public dispatchVisibilityChange(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public listenerCount(): number {
    return this.listeners.size;
  }
}

describe("createVisibilityAdapter", () => {
  it("reads visible and hidden document state", () => {
    const document = new MockVisibilityDocument();
    const adapter = createVisibilityAdapter({
      document,
    });

    expect(adapter.isSupported()).toBe(true);
    expect(adapter.read()).toEqual({
      hidden: false,
      visibilityState: "visible",
    });

    document.hidden = true;
    document.visibilityState = "hidden";

    expect(adapter.read()).toEqual({
      hidden: true,
      visibilityState: "hidden",
    });
  });

  it("gracefully disables itself when document visibility is unavailable", () => {
    const adapter = createVisibilityAdapter({});
    const unsubscribe = adapter.subscribe(() => undefined);

    expect(adapter.isSupported()).toBe(false);
    expect(adapter.read()).toBeUndefined();
    expect(() => {
      unsubscribe();
    }).not.toThrow();
  });

  it("subscribes and removes visibilitychange listeners", () => {
    const document = new MockVisibilityDocument();
    const adapter = createVisibilityAdapter({
      document,
    });
    const calls: string[] = [];
    const unsubscribe = adapter.subscribe(() => {
      calls.push(document.visibilityState);
    });

    expect(document.listenerCount()).toBe(1);

    document.dispatchVisibilityChange();
    document.hidden = true;
    document.visibilityState = "hidden";
    document.dispatchVisibilityChange();

    unsubscribe();
    document.dispatchVisibilityChange();

    expect(document.listenerCount()).toBe(0);
    expect(calls).toEqual(["visible", "hidden"]);
  });
});
