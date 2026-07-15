import { describe, expect, it } from "vitest";

import { createBrowserLifecycle } from "../../src/index.js";

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

  public listenerCount(): number {
    return [...this.listeners.values()].reduce((total, bucket) => total + bucket.size, 0);
  }
}

describe("focus integration", () => {
  it("integrates focus transitions through Session Core", () => {
    const windowRef = new MockFocusWindow();
    let focused = true;
    const documentRef: FocusDocumentLike = {
      hasFocus: () => focused,
    };
    const runtime = globalThis as {
      document?: FocusDocumentLike;
      window?: FocusWindowLike;
    };
    const previousDocument = runtime.document;
    const previousWindow = runtime.window;
    const namedEvents: string[] = [];

    runtime.document = documentRef;
    runtime.window = windowRef;

    try {
      const lifecycle = createBrowserLifecycle({
        autoStart: false,
        emitInitialState: true,
      });

      lifecycle.on("window:focus", (event) => {
        const reason =
          typeof event.metadata?.reason === "string" ? event.metadata.reason : "unknown";
        namedEvents.push(`${event.type}:${reason}`);
      });
      lifecycle.on("window:blur", (event) => {
        const reason =
          typeof event.metadata?.reason === "string" ? event.metadata.reason : "unknown";
        namedEvents.push(`${event.type}:${reason}`);
      });

      lifecycle.start();

      expect(lifecycle.getSnapshot().attention).toBe("focused");

      focused = false;
      windowRef.dispatch("blur");

      focused = true;
      windowRef.dispatch("focus");

      expect(namedEvents).toEqual([
        "window:focus:initial",
        "window:blur:blur",
        "window:focus:focus",
      ]);
      expect(lifecycle.getSnapshot().attention).toBe("focused");

      lifecycle.dispose();
      expect(windowRef.listenerCount()).toBe(0);
    } finally {
      if (previousDocument === undefined) {
        delete runtime.document;
      } else {
        runtime.document = previousDocument;
      }

      if (previousWindow === undefined) {
        delete runtime.window;
      } else {
        runtime.window = previousWindow;
      }
    }
  });
});
