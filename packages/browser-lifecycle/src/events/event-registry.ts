/* v8 ignore next -- import declaration */
import { ListenerCollection } from "./listener-collection.js";

import type {
  EventDefinition,
  EventDispatchMetadata,
  EventListener,
  EventListenerEntry,
  EventMap,
  EventName,
  EventRegistryStats,
} from "./types.js";

interface MutableEventRegistryStats<TEventName extends string> {
  definition: EventDefinition<TEventName> | undefined;
  emissionCount: number;
  errorCount: number;
  lastDispatchedAt: number | undefined;
  lastDispatchSource: string | undefined;
}

/**
 * Internal registry responsible for event definitions, listeners, and dispatch statistics.
 */
export class EventRegistry<TEventMap extends EventMap> {
  private readonly collections = new Map<
    EventName<TEventMap>,
    ListenerCollection<TEventMap, EventName<TEventMap>>
  >();
  private readonly definitions = new Map<
    EventName<TEventMap>,
    EventDefinition<EventName<TEventMap>>
  >();
  private readonly stats = new Map<
    EventName<TEventMap>,
    MutableEventRegistryStats<EventName<TEventMap>>
  >();
  private nextListenerId = 1;

  public constructor(definitions: readonly EventDefinition<EventName<TEventMap>>[] = []) {
    for (const definition of definitions) {
      this.define(definition);
    }
  }

  /**
   * Registers or replaces an event definition.
   */
  public define(definition: EventDefinition<EventName<TEventMap>>): void {
    this.definitions.set(definition.name, definition);
    this.ensureStats(definition.name).definition = definition;
  }

  /**
   * Returns the known definitions in registration order.
   */
  public getDefinitions(): readonly EventDefinition<EventName<TEventMap>>[] {
    return [...this.definitions.values()];
  }

  /**
   * Adds a listener to the registry.
   */
  public addListener<TEventName extends EventName<TEventMap>>(
    event: TEventName,
    listener: EventListener<TEventMap, TEventName>,
    once: boolean,
  ): EventListenerEntry<TEventMap, TEventName> {
    const collection = this.ensureCollection(event);
    const entry = collection.add(this.nextListenerId, listener, once);

    this.nextListenerId += 1;

    return entry;
  }

  /**
   * Removes the first active listener matching the provided function reference.
   */
  public removeListener<TEventName extends EventName<TEventMap>>(
    event: TEventName,
    listener: EventListener<TEventMap, TEventName>,
  ): boolean {
    const collection = this.collections.get(event);

    if (!collection) {
      return false;
    }

    return collection.removeListener(
      listener as unknown as EventListener<TEventMap, EventName<TEventMap>>,
    );
  }

  /**
   * Removes a listener by its internal id.
   */
  public removeListenerById(event: EventName<TEventMap>, id: number): boolean {
    const collection = this.collections.get(event);

    if (!collection) {
      return false;
    }

    return collection.removeById(id);
  }

  /**
   * Returns a snapshot of active listeners for one event.
   */
  public getListeners<TEventName extends EventName<TEventMap>>(
    event: TEventName,
  ): readonly EventListener<TEventMap, TEventName>[] {
    const collection = this.collections.get(event);

    if (!collection) {
      return [];
    }

    return collection.getListeners();
  }

  /**
   * Returns a snapshot of active listener entries for one event.
   */
  public getListenerEntries<TEventName extends EventName<TEventMap>>(
    event: TEventName,
  ): readonly EventListenerEntry<TEventMap, TEventName>[] {
    const collection = this.collections.get(event);

    if (!collection) {
      return [];
    }

    return collection.getEntries();
  }

  /**
   * Returns the listener count for one event or for the entire emitter.
   */
  public listenerCount(event?: EventName<TEventMap>): number {
    if (event !== undefined) {
      return this.collections.get(event)?.listenerCount() ?? 0;
    }

    let count = 0;

    for (const collection of this.collections.values()) {
      count += collection.listenerCount();
    }

    return count;
  }

  /**
   * Returns true when listeners exist for one event or for the entire emitter.
   */
  public hasListeners(event?: EventName<TEventMap>): boolean {
    return this.listenerCount(event) > 0;
  }

  /**
   * Removes all listeners for one event or for the entire registry.
   */
  public removeAll(event?: EventName<TEventMap>): number {
    if (event !== undefined) {
      return this.collections.get(event)?.removeAll() ?? 0;
    }

    let removed = 0;

    for (const collection of this.collections.values()) {
      removed += collection.removeAll();
    }

    return removed;
  }

  /**
   * Records dispatch metadata for registry statistics.
   */
  public recordDispatch<TEventName extends EventName<TEventMap>>(
    event: TEventName,
    metadata: EventDispatchMetadata<TEventName>,
  ): void {
    const stats = this.ensureStats(event);
    stats.emissionCount += 1;
    stats.lastDispatchedAt = metadata.timestamp;
    stats.lastDispatchSource = metadata.source;
  }

  /**
   * Records an isolated listener error for one event.
   */
  public recordListenerError(event: EventName<TEventMap>): void {
    this.ensureStats(event).errorCount += 1;
  }

  /**
   * Returns registry statistics for one event.
   */
  public getStats(event: EventName<TEventMap>): EventRegistryStats<EventName<TEventMap>> {
    const stats = this.ensureStats(event);

    return {
      definition: stats.definition,
      emissionCount: stats.emissionCount,
      errorCount: stats.errorCount,
      lastDispatchedAt: stats.lastDispatchedAt,
      lastDispatchSource: stats.lastDispatchSource,
      listenerCount: this.listenerCount(event),
    };
  }

  /**
   * Destroys all listener storage and leaves definitions intact for debugging.
   */
  public destroy(): void {
    for (const collection of this.collections.values()) {
      collection.destroy();
    }
  }

  private ensureCollection<TEventName extends EventName<TEventMap>>(
    event: TEventName,
  ): ListenerCollection<TEventMap, TEventName> {
    const existing = this.collections.get(event);

    if (existing) {
      return existing as unknown as ListenerCollection<TEventMap, TEventName>;
    }

    const collection = new ListenerCollection<TEventMap, TEventName>();
    this.collections.set(
      event,
      collection as unknown as ListenerCollection<TEventMap, EventName<TEventMap>>,
    );

    return collection;
  }

  private ensureStats(
    event: EventName<TEventMap>,
  ): MutableEventRegistryStats<EventName<TEventMap>> {
    const existing = this.stats.get(event);

    if (existing) {
      return existing;
    }

    const stats: MutableEventRegistryStats<EventName<TEventMap>> = {
      definition: this.definitions.get(event),
      emissionCount: 0,
      errorCount: 0,
      lastDispatchedAt: undefined,
      lastDispatchSource: undefined,
    };

    this.stats.set(event, stats);

    return stats;
  }
}
