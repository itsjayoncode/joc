import type {
  BrowserLifecycleEventMap,
  BrowserLifecycleEventName,
} from "../../core/session/types.js";
import type { DeepReadonly } from "../../types/index.js";

export type Unsubscribe = () => void;

export type ResilienceHandler<TEventName extends BrowserLifecycleEventName> = (
  event: DeepReadonly<BrowserLifecycleEventMap[TEventName]>,
) => void;

export interface ResilienceApi {
  onReconnect(handler: ResilienceHandler<"connection:reconnect">): Unsubscribe;
  /** Maps to `page:resume`. */
  onWake(handler: ResilienceHandler<"page:resume">): Unsubscribe;
  /** Maps to `session:restored`. */
  onRestore(handler: ResilienceHandler<"session:restored">): Unsubscribe;
  /**
   * Fires on reconnect, wake (`page:resume`), or restore — ChatGPT-style recovery.
   * Returns a single unsubscribe for all three.
   */
  onRecover(
    handler: (
      event:
        | DeepReadonly<BrowserLifecycleEventMap["connection:reconnect"]>
        | DeepReadonly<BrowserLifecycleEventMap["page:resume"]>
        | DeepReadonly<BrowserLifecycleEventMap["session:restored"]>,
    ) => void,
  ): Unsubscribe;
  /**
   * Unsubscribe all active resilience handlers.
   * Does not dispose the underlying session.
   */
  dispose(): void;
}

export interface CreateResilienceApiOptions {
  /** Invoked when a handler throws (session continues). */
  readonly onHandlerError?: (error: unknown) => void;
}
