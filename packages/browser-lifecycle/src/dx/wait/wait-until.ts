import { LifecycleError } from "../../errors/index.js";

import type { WaitOptions } from "./types.js";
import type {
  BrowserLifecycle,
  BrowserLifecycleEventName,
  BrowserLifecycleSnapshot,
} from "../../core/session/types.js";

type Predicate = (snapshot: Readonly<BrowserLifecycleSnapshot>) => boolean;

interface WaitRequest {
  readonly reject: (reason: unknown) => void;
  readonly cleanup: () => void;
}

/**
 * Shared wait primitive: snapshot check → one-shot event subscription → cleanup.
 * No polling.
 */
export function waitUntil(
  lifecycle: Pick<BrowserLifecycle, "getSnapshot" | "on">,
  predicate: Predicate,
  events: readonly BrowserLifecycleEventName[],
  options: WaitOptions,
  track: (request: WaitRequest) => () => void,
): Promise<void> {
  if (options.signal?.aborted) {
    return Promise.reject(
      options.signal.reason ??
        new DOMException("Wait aborted.", "AbortError"),
    );
  }

  const snapshot = lifecycle.getSnapshot();
  if (snapshot.phase === "disposed") {
    return Promise.reject(
      new LifecycleError("Cannot wait on a disposed BrowserLifecycle instance."),
    );
  }

  if (predicate(snapshot)) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    let settled = false;
    const unsubscribers: Array<() => void> = [];
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let removeTrack: (() => void) | undefined;

    const settle = (action: () => void): void => {
      if (settled) {
        return;
      }
      settled = true;
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      for (const unsubscribe of unsubscribers) {
        unsubscribe();
      }
      options.signal?.removeEventListener("abort", onAbort);
      removeTrack?.();
      action();
    };

    const onAbort = (): void => {
      settle(() => {
        reject(
          options.signal?.reason ??
            new DOMException("Wait aborted.", "AbortError"),
        );
      });
    };

    const cleanup = (): void => {
      settle(() => {
        reject(new LifecycleError("Wait cancelled because the wait API was disposed."));
      });
    };

    removeTrack = track({ cleanup, reject });

    for (const eventName of events) {
      unsubscribers.push(
        lifecycle.on(eventName, () => {
          if (predicate(lifecycle.getSnapshot())) {
            settle(() => {
              resolve();
            });
          }
        }),
      );
    }

    if (options.signal) {
      options.signal.addEventListener("abort", onAbort, { once: true });
    }

    if (options.timeoutMs !== undefined) {
      if (!Number.isFinite(options.timeoutMs) || options.timeoutMs < 0) {
        settle(() => {
          reject(new LifecycleError("Wait timeoutMs must be a non-negative finite number."));
        });
        return;
      }

      timeoutId = setTimeout(() => {
        settle(() => {
          reject(
            new LifecycleError(`Wait timed out after ${String(options.timeoutMs)}ms.`),
          );
        });
      }, options.timeoutMs);
    }
  });
}
