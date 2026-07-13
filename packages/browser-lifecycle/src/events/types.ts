/* v8 ignore file -- type-only declarations */
/**
 * Generic event map used by the typed event infrastructure.
 */
export type EventMap = object;

/**
 * Valid event names for a given event map.
 */
export type EventName<TEventMap extends EventMap> = Extract<keyof TEventMap, string>;

/**
 * Payload type associated with an event name.
 */
export type EventPayload<
  TEventMap extends EventMap,
  TEventName extends EventName<TEventMap>,
> = TEventMap[TEventName];

/**
 * Internal metadata bag reserved for diagnostics and future instrumentation.
 */
export type EventInternalMetadata = Readonly<Record<string, unknown>>;

/**
 * Event definition metadata stored by the internal registry.
 */
export interface EventDefinition<TEventName extends string = string> {
  readonly description?: string;
  readonly experimental?: boolean;
  readonly internal?: boolean;
  readonly name: TEventName;
  readonly public?: boolean;
}

/**
 * Dispatch metadata created for each emission.
 */
export interface EventDispatchMetadata<TEventName extends string = string> {
  readonly dispatchId: number;
  readonly internal: EventInternalMetadata | undefined;
  readonly listenerCount: number;
  readonly source: string;
  readonly timestamp: number;
  readonly type: TEventName;
}

/**
 * Listener signature used throughout the infrastructure.
 */
export type EventListener<TEventMap extends EventMap, TEventName extends EventName<TEventMap>> = (
  payload: EventPayload<TEventMap, TEventName>,
  metadata: EventDispatchMetadata<TEventName>,
) => void;

/**
 * Cleanup handle returned by subscription methods.
 */
export interface EventSubscription<TEventName extends string = string> {
  readonly active: boolean;
  readonly event: TEventName;
  unsubscribe(): void;
}

/**
 * Internal dispatch context passed to error handlers.
 */
export interface EventDispatchContext<
  TEventMap extends EventMap,
  TEventName extends EventName<TEventMap>,
> {
  readonly metadata: EventDispatchMetadata<TEventName>;
  readonly payload: EventPayload<TEventMap, TEventName>;
}

/**
 * Error handler used to isolate listener failures.
 */
export type EventListenerErrorHandler<TEventMap extends EventMap> = (
  error: unknown,
  context: EventDispatchContext<TEventMap, EventName<TEventMap>>,
) => void;

/**
 * Public emit options for metadata creation.
 */
export interface EmitEventOptions {
  readonly internal?: EventInternalMetadata;
  readonly source?: string;
}

/**
 * Statistics tracked by the internal event registry.
 */
export interface EventRegistryStats<TEventName extends string = string> {
  readonly definition: EventDefinition<TEventName> | undefined;
  readonly emissionCount: number;
  readonly errorCount: number;
  readonly lastDispatchedAt: number | undefined;
  readonly lastDispatchSource: string | undefined;
  readonly listenerCount: number;
}

/**
 * Constructor options for the typed event emitter.
 */
export interface TypedEventEmitterOptions<TEventMap extends EventMap> {
  readonly definitions?: readonly EventDefinition<EventName<TEventMap>>[];
  readonly onListenerError?: EventListenerErrorHandler<TEventMap>;
  readonly timeProvider?: () => number;
}

/**
 * Internal listener entry stored in listener collections.
 */
export interface EventListenerEntry<
  TEventMap extends EventMap,
  TEventName extends EventName<TEventMap>,
> {
  active: boolean;
  readonly id: number;
  readonly listener: EventListener<TEventMap, TEventName>;
  readonly once: boolean;
}
