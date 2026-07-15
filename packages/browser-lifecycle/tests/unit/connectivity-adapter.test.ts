import { describe, expect, it } from "vitest";

import { createConnectivityAdapter } from "../../src/modules/connectivity/connectivity-adapter.js";

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
}

describe("connectivity adapter", () => {
  it("detects support when navigator.onLine and window events exist", () => {
    const navigatorRef: ConnectivityNavigatorLike = { onLine: true };
    const windowRef = new MockConnectivityWindow();

    const adapter = createConnectivityAdapter({ navigator: navigatorRef, window: windowRef });

    expect(adapter.isSupported()).toBe(true);
    expect(adapter.read()).toBe("online");
  });

  it("returns undefined when navigator.onLine is unavailable", () => {
    const adapter = createConnectivityAdapter({
      window: new MockConnectivityWindow(),
    });

    expect(adapter.isSupported()).toBe(false);
    expect(adapter.read()).toBeUndefined();
  });
});
