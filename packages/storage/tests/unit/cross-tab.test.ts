import { describe, expect, it, vi } from "vitest";

import { enableCrossTabSync } from "../../src/cross-tab/index.js";
import { createMemoryAdapter, createStorage } from "../../src/index.js";

import type { CrossTabRemoteEvent } from "../../src/cross-tab/index.js";

class FakeBroadcastChannel {
  static channels = new Map<string, Set<FakeBroadcastChannel>>();

  readonly name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  private readonly listeners = new Set<(event: Event) => void>();

  constructor(name: string) {
    this.name = name;
    const set = FakeBroadcastChannel.channels.get(name) ?? new Set();
    set.add(this);
    FakeBroadcastChannel.channels.set(name, set);
  }

  postMessage(data: unknown): void {
    const peers = FakeBroadcastChannel.channels.get(this.name) ?? new Set();
    for (const peer of peers) {
      if (peer === this) {
        continue;
      }
      const event = { data } as MessageEvent;
      peer.onmessage?.(event);
      for (const listener of peer.listeners) {
        listener(event);
      }
    }
  }

  addEventListener(_type: string, listener: EventListener): void {
    this.listeners.add(listener);
  }

  removeEventListener(_type: string, listener: EventListener): void {
    this.listeners.delete(listener);
  }

  close(): void {
    FakeBroadcastChannel.channels.get(this.name)?.delete(this);
  }
}

describe("@jayoncode/storage/cross-tab", () => {
  it("notifies peer tabs via BroadcastChannel without auto-merging", () => {
    vi.stubGlobal("BroadcastChannel", FakeBroadcastChannel);

    const storageA = createStorage({
      namespace: "app",
      adapter: createMemoryAdapter(),
    });
    const storageB = createStorage({
      namespace: "app",
      adapter: createMemoryAdapter(),
    });

    const remote: CrossTabRemoteEvent[] = [];
    const a = enableCrossTabSync(storageA);
    const b = enableCrossTabSync(storageB, {
      onRemote: (event) => remote.push(event),
    });

    a.storage.set("theme", "dark");
    expect(remote).toHaveLength(1);
    expect(remote[0]?.type).toBe("set");
    expect(remote[0]?.key).toBe("theme");
    expect(remote[0]?.via).toBe("broadcast");
    expect(b.storage.get("theme")).toBeNull();

    a.stop();
    b.stop();
    vi.unstubAllGlobals();
  });

  it("ignores own broadcast origin", () => {
    vi.stubGlobal("BroadcastChannel", FakeBroadcastChannel);

    const storage = createStorage({
      namespace: "solo",
      adapter: createMemoryAdapter(),
    });
    const remote: CrossTabRemoteEvent[] = [];
    const handle = enableCrossTabSync(storage, {
      onRemote: (event) => remote.push(event),
    });

    handle.storage.set("k", 1);
    expect(remote).toHaveLength(0);

    handle.stop();
    vi.unstubAllGlobals();
  });
});
