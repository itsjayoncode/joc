/* v8 ignore next -- import declaration */
import type { EventListener, EventListenerEntry, EventMap, EventName } from "./types.js";

/**
 * Ordered listener storage for one named event.
 */
export class ListenerCollection<
  TEventMap extends EventMap,
  TEventName extends EventName<TEventMap>,
> {
  private readonly entries: EventListenerEntry<TEventMap, TEventName>[] = [];

  /**
   * Adds a listener entry and preserves registration order.
   */
  public add(
    id: number,
    listener: EventListener<TEventMap, TEventName>,
    once: boolean,
  ): EventListenerEntry<TEventMap, TEventName> {
    const entry: EventListenerEntry<TEventMap, TEventName> = {
      active: true,
      id,
      listener,
      once,
    };

    this.entries.push(entry);

    return entry;
  }

  /**
   * Returns a stable snapshot of the active listener entries.
   */
  public getEntries(): readonly EventListenerEntry<TEventMap, TEventName>[] {
    return [...this.entries];
  }

  /**
   * Returns a stable snapshot of the active listeners.
   */
  public getListeners(): readonly EventListener<TEventMap, TEventName>[] {
    return this.entries.filter((entry) => entry.active).map((entry) => entry.listener);
  }

  /**
   * Returns true when at least one active listener remains.
   */
  public hasListeners(): boolean {
    return this.listenerCount() > 0;
  }

  /**
   * Returns the number of active listeners.
   */
  public listenerCount(): number {
    let count = 0;

    for (const entry of this.entries) {
      if (entry.active) {
        count += 1;
      }
    }

    return count;
  }

  /**
   * Removes the first active listener matching the provided function reference.
   */
  public removeListener(listener: EventListener<TEventMap, TEventName>): boolean {
    for (const entry of this.entries) {
      if (entry.active && entry.listener === listener) {
        entry.active = false;
        this.compact();
        return true;
      }
    }

    return false;
  }

  /**
   * Removes a listener by its internal id.
   */
  public removeById(id: number): boolean {
    for (const entry of this.entries) {
      if (entry.active && entry.id === id) {
        entry.active = false;
        this.compact();
        return true;
      }
    }

    return false;
  }

  /**
   * Removes all listeners from the collection.
   */
  public removeAll(): number {
    const removed = this.listenerCount();

    for (const entry of this.entries) {
      entry.active = false;
    }

    this.entries.length = 0;

    return removed;
  }

  /**
   * Destroys the collection and clears all listener references.
   */
  public destroy(): void {
    this.removeAll();
  }

  private compact(): void {
    let nextIndex = 0;

    for (const entry of this.entries) {
      if (entry.active) {
        this.entries[nextIndex] = entry;
        nextIndex += 1;
      }
    }

    this.entries.length = nextIndex;
  }
}
