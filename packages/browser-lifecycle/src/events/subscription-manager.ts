/* v8 ignore next -- import declaration */
import type { EventRegistry } from "./event-registry.js";
import type {
  EventListener,
  EventListenerEntry,
  EventMap,
  EventName,
  EventSubscription,
} from "./types.js";

/**
 * Subscription manager responsible for listener registration and cleanup.
 */
export class SubscriptionManager<TEventMap extends EventMap> {
  public constructor(private readonly registry: EventRegistry<TEventMap>) {}

  /**
   * Registers a persistent listener and returns a cleanup handle.
   */
  public on<TEventName extends EventName<TEventMap>>(
    event: TEventName,
    listener: EventListener<TEventMap, TEventName>,
  ): EventSubscription<TEventName> {
    const entry = this.registry.addListener(event, listener, false);

    return this.createSubscription(event, entry);
  }

  /**
   * Registers a one-time listener and returns a cleanup handle.
   */
  public once<TEventName extends EventName<TEventMap>>(
    event: TEventName,
    listener: EventListener<TEventMap, TEventName>,
  ): EventSubscription<TEventName> {
    const entry = this.registry.addListener(event, listener, true);

    return this.createSubscription(event, entry);
  }

  /**
   * Removes the first matching listener by function reference.
   */
  public off<TEventName extends EventName<TEventMap>>(
    event: TEventName,
    listener: EventListener<TEventMap, TEventName>,
  ): void {
    this.registry.removeListener(event, listener);
  }

  /**
   * Unsubscribes an existing subscription handle.
   */
  public unsubscribe<TEventName extends EventName<TEventMap>>(
    subscription: EventSubscription<TEventName>,
  ): void {
    subscription.unsubscribe();
  }

  private createSubscription<TEventName extends EventName<TEventMap>>(
    event: TEventName,
    entry: EventListenerEntry<TEventMap, TEventName>,
  ): EventSubscription<TEventName> {
    return {
      get active(): boolean {
        return entry.active;
      },
      event,
      unsubscribe: (): void => {
        if (!entry.active) {
          return;
        }

        this.registry.removeListenerById(event, entry.id);
      },
    };
  }
}
