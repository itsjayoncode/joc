import { LifecycleError } from "../../errors/index.js";

import type {
  CreateResilienceApiOptions,
  ResilienceApi,
  ResilienceHandler,
  Unsubscribe,
} from "./types.js";
import type {
  BrowserLifecycle,
  BrowserLifecycleEventName,
} from "../../core/session/types.js";

/**
 * Creates Resilience helpers for reconnect / wake / restore workflows.
 *
 * - Wraps existing catalog events only (no browser APIs, no persistence).
 * - Handler errors are isolated.
 * - Allocates nothing on `createBrowserLifecycle()` — only when this factory is called.
 */
export function createResilienceApi(
  lifecycle: Pick<BrowserLifecycle, "on">,
  options: CreateResilienceApiOptions = {},
): ResilienceApi {
  const unsubscribers = new Set<Unsubscribe>();
  let disposed = false;

  const bind = <TEventName extends BrowserLifecycleEventName>(
    eventName: TEventName,
    handler: ResilienceHandler<TEventName>,
  ): Unsubscribe => {
    if (disposed) {
      throw new LifecycleError(
        "Cannot register resilience handlers because the resilience API was disposed.",
      );
    }

    const unsubscribeEvent = lifecycle.on(eventName, (event) => {
      try {
        handler(event);
      } catch (error) {
        options.onHandlerError?.(error);
      }
    });

    const unsubscribe: Unsubscribe = () => {
      unsubscribeEvent();
      unsubscribers.delete(unsubscribe);
    };

    unsubscribers.add(unsubscribe);
    return unsubscribe;
  };

  return {
    dispose(): void {
      if (disposed) {
        return;
      }
      disposed = true;
      for (const unsubscribe of [...unsubscribers]) {
        unsubscribe();
      }
      unsubscribers.clear();
    },
    onReconnect(handler: ResilienceHandler<"connection:reconnect">): Unsubscribe {
      return bind("connection:reconnect", handler);
    },
    onRecover(handler): Unsubscribe {
      const offReconnect = bind("connection:reconnect", handler);
      const offWake = bind("page:resume", handler);
      const offRestore = bind("session:restored", handler);
      return () => {
        offReconnect();
        offWake();
        offRestore();
      };
    },
    onRestore(handler: ResilienceHandler<"session:restored">): Unsubscribe {
      return bind("session:restored", handler);
    },
    onWake(handler: ResilienceHandler<"page:resume">): Unsubscribe {
      return bind("page:resume", handler);
    },
  };
}
