import { LifecycleError } from "../../errors/index.js";

import type {
  ConditionHandle,
  ConditionHandler,
  ConditionsApi,
  CreateConditionsApiOptions,
} from "./types.js";
import type {
  BrowserLifecycle,
  BrowserLifecycleEventName,
} from "../../core/session/types.js";

/**
 * Creates a thin conditions DSL over public lifecycle events.
 *
 * - No polling.
 * - Handler errors are isolated (do not tear down the session).
 * - Allocates nothing on `createBrowserLifecycle()` — only when this factory is called.
 */
export function createConditionsApi(
  lifecycle: Pick<BrowserLifecycle, "on">,
  options: CreateConditionsApiOptions = {},
): ConditionsApi {
  const handles = new Set<ConditionHandle>();
  let disposed = false;

  const bind = (
    eventName: BrowserLifecycleEventName,
    handler: ConditionHandler,
  ): ConditionHandle => {
    if (disposed) {
      throw new LifecycleError("Cannot register conditions because the conditions API was disposed.");
    }

    const unsubscribeEvent = lifecycle.on(eventName, () => {
      try {
        handler();
      } catch (error) {
        options.onHandlerError?.(error);
      }
    });

    const handle: ConditionHandle = {
      unsubscribe(): void {
        unsubscribeEvent();
        handles.delete(handle);
      },
    };

    handles.add(handle);
    return handle;
  };

  return {
    dispose(): void {
      if (disposed) {
        return;
      }
      disposed = true;
      for (const handle of [...handles]) {
        handle.unsubscribe();
      }
      handles.clear();
    },
    focused(handler: ConditionHandler): ConditionHandle {
      return bind("window:focus", handler);
    },
    hidden(handler: ConditionHandler): ConditionHandle {
      return bind("page:hidden", handler);
    },
    online(handler: ConditionHandler): ConditionHandle {
      return bind("connection:online", handler);
    },
    visible(handler: ConditionHandler): ConditionHandle {
      return bind("page:visible", handler);
    },
  };
}
