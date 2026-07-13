/* v8 ignore next -- import declaration */
import { EventDispatcher } from "./event-dispatcher.js";
import { EventRegistry } from "./event-registry.js";
import { SubscriptionManager } from "./subscription-manager.js";

import type {
  EmitEventOptions,
  EventDefinition,
  EventDispatchMetadata,
  EventListener,
  EventMap,
  EventName,
  EventPayload,
  EventRegistryStats,
  EventSubscription,
  TypedEventEmitterOptions,
} from "./types.js";

const DESTROYED_EVENT_EMITTER_MESSAGE = "Cannot use a destroyed typed event emitter.";

/**
 * Generic typed event emitter used by Browser Lifecycle Manager internals.
 */
export class TypedEventEmitter<TEventMap extends EventMap> {
  private readonly dispatcher: EventDispatcher<TEventMap>;
  private readonly registry: EventRegistry<TEventMap>;
  private readonly subscriptions: SubscriptionManager<TEventMap>;
  private destroyed = false;

  public constructor(options: TypedEventEmitterOptions<TEventMap> = {}) {
    this.registry = new EventRegistry<TEventMap>(options.definitions);
    this.subscriptions = new SubscriptionManager<TEventMap>(this.registry);
    this.dispatcher = new EventDispatcher<TEventMap>(
      this.registry,
      options.onListenerError,
      options.timeProvider ?? Date.now,
    );
  }

  /**
   * Registers a persistent listener.
   */
  public on<TEventName extends EventName<TEventMap>>(
    event: TEventName,
    listener: EventListener<TEventMap, TEventName>,
  ): EventSubscription<TEventName> {
    this.ensureActive();
    return this.subscriptions.on(event, listener);
  }

  /**
   * Removes the first listener matching the provided function reference.
   */
  public off<TEventName extends EventName<TEventMap>>(
    event: TEventName,
    listener: EventListener<TEventMap, TEventName>,
  ): void {
    if (this.destroyed) {
      return;
    }

    this.subscriptions.off(event, listener);
  }

  /**
   * Registers a one-time listener.
   */
  public once<TEventName extends EventName<TEventMap>>(
    event: TEventName,
    listener: EventListener<TEventMap, TEventName>,
  ): EventSubscription<TEventName> {
    this.ensureActive();
    return this.subscriptions.once(event, listener);
  }

  /**
   * Emits an event synchronously and returns dispatch metadata.
   */
  public emit<TEventName extends EventName<TEventMap>>(
    event: TEventName,
    payload: EventPayload<TEventMap, TEventName>,
    options: EmitEventOptions = {},
  ): EventDispatchMetadata<TEventName> {
    this.ensureActive();
    return this.dispatcher.emit(event, payload, options);
  }

  /**
   * Returns the active listeners for one event in registration order.
   */
  public listeners<TEventName extends EventName<TEventMap>>(
    event: TEventName,
  ): readonly EventListener<TEventMap, TEventName>[] {
    if (this.destroyed) {
      return [];
    }

    return this.registry.getListeners(event);
  }

  /**
   * Returns the active listener count for one event or for the full emitter.
   */
  public listenerCount(event?: EventName<TEventMap>): number {
    if (this.destroyed) {
      return 0;
    }

    return this.registry.listenerCount(event);
  }

  /**
   * Returns true when listeners exist for one event or for the entire emitter.
   */
  public hasListeners(event?: EventName<TEventMap>): boolean {
    if (this.destroyed) {
      return false;
    }

    return this.registry.hasListeners(event);
  }

  /**
   * Removes all listeners for one event or for the entire emitter.
   */
  public removeAll(event?: EventName<TEventMap>): void {
    if (this.destroyed) {
      return;
    }

    this.registry.removeAll(event);
  }

  /**
   * Destroys the emitter and clears all listeners.
   */
  public destroy(): void {
    if (this.destroyed) {
      return;
    }

    this.registry.destroy();
    this.destroyed = true;
  }

  /**
   * Returns the registered definitions for diagnostics and tests.
   */
  public definitions(): readonly EventDefinition<EventName<TEventMap>>[] {
    return this.registry.getDefinitions();
  }

  /**
   * Returns dispatch statistics for one event.
   */
  public stats<TEventName extends EventName<TEventMap>>(
    event: TEventName,
  ): EventRegistryStats<TEventName> {
    return this.registry.getStats(event) as unknown as EventRegistryStats<TEventName>;
  }

  private ensureActive(): void {
    if (this.destroyed) {
      throw new Error(DESTROYED_EVENT_EMITTER_MESSAGE);
    }
  }
}
