import { describe, expect, it } from "vitest";

import { createBrowserLifecycle } from "../../src/index.js";

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

  public dispatchVisibilityChange(state: "hidden" | "visible"): void {
    this.hidden = state === "hidden";
    this.visibilityState = state;

    for (const listener of this.listeners) {
      listener();
    }
  }

  public listenerCount(): number {
    return this.listeners.size;
  }
}

describe("visibility integration", () => {
  it("integrates visibility transitions through Session Core with stable ordering", () => {
    const document = new MockVisibilityDocument();
    const runtime = globalThis as Record<string, unknown> & {
      document?: VisibilityDocumentLike;
    };
    const previousDocument = runtime.document;
    const namedEvents: string[] = [];
    const feedEvents: string[] = [];

    runtime.document = document;

    try {
      const lifecycle = createBrowserLifecycle({
        autoStart: false,
        emitInitialState: true,
      });

      lifecycle.on("session:started", (event) => {
        namedEvents.push(event.type);
      });
      lifecycle.on("page:visible", (event) => {
        namedEvents.push(`${event.type}:${event.metadata.reason}:${event.snapshot.phase}`);
      });
      lifecycle.on("page:hidden", (event) => {
        namedEvents.push(
          `${event.type}:${String(event.metadata.likelyLastSignal)}:${event.snapshot.phase}`,
        );
      });
      lifecycle.subscribe((event, snapshot) => {
        feedEvents.push(`${event.type}:${snapshot.phase}`);
      });

      lifecycle.start();

      expect(lifecycle.getSnapshot().visibility).toBe("visible");
      expect(document.listenerCount()).toBe(1);

      document.dispatchVisibilityChange("hidden");

      lifecycle.stop();
      document.dispatchVisibilityChange("visible");
      lifecycle.start();

      expect(namedEvents).toEqual([
        "session:started",
        "page:visible:initial:running",
        "page:hidden:true:running",
        "session:started",
        "page:visible:visibilitychange:running",
      ]);
      expect(feedEvents).toEqual([
        "session:started:running",
        "page:visible:running",
        "page:hidden:running",
        "session:stopped:stopped",
        "session:started:running",
        "page:visible:running",
      ]);

      lifecycle.dispose();
      expect(document.listenerCount()).toBe(0);
    } finally {
      if (previousDocument === undefined) {
        delete runtime.document;
      } else {
        runtime.document = previousDocument;
      }
    }
  });

  it("gracefully degrades when the Page Visibility API is unavailable", () => {
    const lifecycle = createBrowserLifecycle({
      autoStart: true,
    });

    expect(lifecycle.isRunning()).toBe(true);
    expect(lifecycle.getSnapshot().visibility).toBe("unknown");

    lifecycle.dispose();
  });
});
