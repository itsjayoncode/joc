/* v8 ignore next */
import { noop } from "../../utils/index.js";

import type {
  ActivityTargetLike,
  IdleActivitySource,
  IdleAdapter,
  IdleAdapterEnvironment,
} from "./types.js";

export function createActivityAdapter(
  environment: IdleAdapterEnvironment = getDefaultEnvironment(),
): IdleAdapter {
  const windowRef = environment.window;
  const documentRef = environment.document;

  return {
    isSupported(events: readonly IdleActivitySource[]): boolean {
      return events.every((eventName) => supportsActivityEvent(eventName, windowRef, documentRef));
    },
    subscribe(
      events: readonly IdleActivitySource[],
      listener: (source: IdleActivitySource) => void,
    ): () => void {
      const cleanups: Array<() => void> = [];

      for (const eventName of events) {
        const target = getActivityTarget(eventName, windowRef, documentRef);

        if (!target) {
          continue;
        }

        const wrappedListener = (): void => {
          listener(eventName);
        };

        target.addEventListener(eventName, wrappedListener);
        cleanups.push(() => {
          target.removeEventListener(eventName, wrappedListener);
        });
      }

      if (cleanups.length === 0) {
        return noop;
      }

      return (): void => {
        for (const cleanup of cleanups) {
          cleanup();
        }
      };
    },
  };
}

function getDefaultEnvironment(): IdleAdapterEnvironment {
  const runtime = globalThis as {
    readonly document?: ActivityTargetLike;
    readonly window?: ActivityTargetLike;
  };

  return {
    ...(runtime.document ? { document: runtime.document } : {}),
    ...(runtime.window ? { window: runtime.window } : {}),
  };
}

function getActivityTarget(
  eventName: IdleActivitySource,
  windowRef: ActivityTargetLike | undefined,
  documentRef: ActivityTargetLike | undefined,
): ActivityTargetLike | undefined {
  if (eventName === "visibilitychange") {
    return documentRef;
  }

  return windowRef;
}

function supportsActivityEvent(
  eventName: IdleActivitySource,
  windowRef: ActivityTargetLike | undefined,
  documentRef: ActivityTargetLike | undefined,
): boolean {
  const target = getActivityTarget(eventName, windowRef, documentRef);

  return (
    target !== undefined &&
    typeof target.addEventListener === "function" &&
    typeof target.removeEventListener === "function"
  );
}
