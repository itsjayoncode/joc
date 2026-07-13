/* v8 ignore next -- import declaration */
import type { EventRegistry } from "./event-registry.js";
import type {
  EmitEventOptions,
  EventDispatchContext,
  EventDispatchMetadata,
  EventListenerErrorHandler,
  EventMap,
  EventName,
  EventPayload,
} from "./types.js";

/**
 * Event dispatcher responsible for creating metadata, invoking listeners, and isolating failures.
 */
export class EventDispatcher<TEventMap extends EventMap> {
  private nextDispatchId = 1;

  public constructor(
    private readonly registry: EventRegistry<TEventMap>,
    private readonly onListenerError: EventListenerErrorHandler<TEventMap> | undefined,
    private readonly timeProvider: () => number,
  ) {}

  /**
   * Emits one event synchronously in registration order.
   */
  public emit<TEventName extends EventName<TEventMap>>(
    event: TEventName,
    payload: EventPayload<TEventMap, TEventName>,
    options: EmitEventOptions = {},
  ): EventDispatchMetadata<TEventName> {
    const entries = this.registry.getListenerEntries(event);
    const metadata: EventDispatchMetadata<TEventName> = {
      dispatchId: this.nextDispatchId,
      internal: options.internal,
      listenerCount: entries.length,
      source: options.source ?? "emitter",
      timestamp: this.timeProvider(),
      type: event,
    };

    this.nextDispatchId += 1;
    this.registry.recordDispatch(event, metadata);

    for (const entry of entries) {
      if (!entry.active) {
        continue;
      }

      if (entry.once) {
        this.registry.removeListenerById(event, entry.id);
      }

      try {
        entry.listener(payload, metadata);
      } catch (error) {
        this.registry.recordListenerError(event);

        if (this.onListenerError) {
          const context: EventDispatchContext<TEventMap, EventName<TEventMap>> = {
            metadata,
            payload,
          };

          this.onListenerError(error, context);
        }
      }
    }

    return metadata;
  }
}
