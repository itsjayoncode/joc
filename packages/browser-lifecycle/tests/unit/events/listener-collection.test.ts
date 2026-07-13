import { describe, expect, it, vi } from "vitest";

import { ListenerCollection } from "../../../src/events/listener-collection.js";

interface CollectionEventMap {
  "alpha:ready": { readonly value: number };
}

describe("ListenerCollection", () => {
  it("stores listeners in registration order and removes them by id or reference", () => {
    const collection = new ListenerCollection<CollectionEventMap, "alpha:ready">();
    const first = vi.fn();
    const second = vi.fn();

    const firstEntry = collection.add(1, first, false);
    const secondEntry = collection.add(2, second, true);

    expect(firstEntry.once).toBe(false);
    expect(secondEntry.once).toBe(true);
    expect(collection.getEntries()).toHaveLength(2);
    expect(collection.getListeners()).toEqual([first, second]);
    expect(collection.listenerCount()).toBe(2);
    expect(collection.hasListeners()).toBe(true);

    expect(collection.removeById(1)).toBe(true);
    expect(collection.removeById(1)).toBe(false);
    expect(collection.getListeners()).toEqual([second]);
    expect(collection.removeListener(first)).toBe(false);
    expect(collection.removeListener(second)).toBe(true);
    expect(collection.listenerCount()).toBe(0);
  });

  it("removes all listeners and destroys cleanly", () => {
    const collection = new ListenerCollection<CollectionEventMap, "alpha:ready">();
    const listener = vi.fn();

    collection.add(1, listener, false);
    collection.add(2, listener, false);

    expect(collection.removeAll()).toBe(2);
    expect(collection.listenerCount()).toBe(0);

    collection.add(3, listener, false);
    collection.destroy();

    expect(collection.hasListeners()).toBe(false);
    expect(collection.getEntries()).toEqual([]);
  });
});
