import { describe, expect, it } from "vitest";

import { createBrowserLifecycle } from "../../src/index.js";

import type {
  ConnectivityNavigatorLike,
  ConnectivityWindowLike,
} from "../../src/modules/connectivity/index.js";

class MockConnectivityWindow implements ConnectivityWindowLike {
  private readonly listeners = new Map<"offline" | "online", Set<() => void>>();

  public addEventListener(type: "offline" | "online", listener: () => void): void {
    const bucket = this.listeners.get(type) ?? new Set<() => void>();

    bucket.add(listener);
    this.listeners.set(type, bucket);
  }

  public removeEventListener(type: "offline" | "online", listener: () => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  public dispatch(type: "offline" | "online"): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener();
    }
  }

  public listenerCount(): number {
    return [...this.listeners.values()].reduce((total, bucket) => total + bucket.size, 0);
  }
}

class MockConnectivityNavigator implements ConnectivityNavigatorLike {
  public onLine = true;
}

describe("connectivity integration", () => {
  it("integrates connectivity transitions through Session Core", () => {
    const windowRef = new MockConnectivityWindow();
    const navigatorRef = new MockConnectivityNavigator();
    const runtime = globalThis as {
      navigator?: ConnectivityNavigatorLike;
      window?: ConnectivityWindowLike;
    };
    const previousNavigator = runtime.navigator;
    const previousWindow = runtime.window;
    const namedEvents: string[] = [];

    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: navigatorRef,
    });
    runtime.window = windowRef;

    try {
      const lifecycle = createBrowserLifecycle({
        autoStart: false,
        emitInitialState: true,
      });

      lifecycle.on("connection:online", (event) => {
        namedEvents.push(`${event.type}:${event.metadata?.reason ?? "unknown"}`);
      });
      lifecycle.on("connection:offline", (event) => {
        namedEvents.push(`${event.type}:${event.metadata?.reason ?? "unknown"}`);
      });
      lifecycle.on("connection:reconnect", (event) => {
        namedEvents.push(`${event.type}:${String(event.metadata?.offlineDuration ?? 0)}`);
      });

      lifecycle.start();

      expect(lifecycle.getSnapshot().connectivity).toBe("online");

      navigatorRef.onLine = false;
      windowRef.dispatch("offline");

      navigatorRef.onLine = true;
      windowRef.dispatch("online");

      expect(namedEvents).toEqual([
        "connection:online:initial",
        "connection:offline:offline",
        "connection:online:online",
        "connection:reconnect:0",
      ]);
      expect(lifecycle.getSnapshot().connectivity).toBe("online");

      lifecycle.dispose();
      expect(windowRef.listenerCount()).toBe(0);
    } finally {
      if (previousNavigator === undefined) {
        Reflect.deleteProperty(globalThis, "navigator");
      } else {
        Object.defineProperty(globalThis, "navigator", {
          configurable: true,
          value: previousNavigator,
        });
      }

      if (previousWindow === undefined) {
        delete runtime.window;
      } else {
        runtime.window = previousWindow;
      }
    }
  });
});
