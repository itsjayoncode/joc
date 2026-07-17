import { LifecycleError } from "../../errors/index.js";
import { waitUntil } from "./wait-until.js";

import type { WaitApi, WaitOptions } from "./types.js";
import type { BrowserLifecycle } from "../../core/session/types.js";

/**
 * Creates subscription-based wait helpers.
 *
 * - No polling / setInterval condition checks.
 * - Resolves immediately when the snapshot already satisfies the condition.
 * - Allocates nothing on `createBrowserLifecycle()` — only when this factory is called.
 */
export function createWaitApi(
  lifecycle: Pick<BrowserLifecycle, "getSnapshot" | "on">,
): WaitApi {
  const pending = new Set<{ cleanup: () => void }>();
  let disposed = false;

  const track = (request: { cleanup: () => void }): (() => void) => {
    pending.add(request);
    return () => {
      pending.delete(request);
    };
  };

  const runWait = (
    predicate: Parameters<typeof waitUntil>[1],
    events: Parameters<typeof waitUntil>[2],
    options: WaitOptions = {},
  ): Promise<void> => {
    if (disposed) {
      return Promise.reject(
        new LifecycleError("Cannot wait because the wait API was disposed."),
      );
    }
    return waitUntil(lifecycle, predicate, events, options, track);
  };

  return {
    dispose(): void {
      if (disposed) {
        return;
      }
      disposed = true;
      for (const request of [...pending]) {
        request.cleanup();
      }
      pending.clear();
    },
    untilBlurred(options?: WaitOptions): Promise<void> {
      return runWait((snapshot) => snapshot.attention === "unfocused", ["window:blur"], options);
    },
    untilFocused(options?: WaitOptions): Promise<void> {
      return runWait((snapshot) => snapshot.attention === "focused", ["window:focus"], options);
    },
    untilHidden(options?: WaitOptions): Promise<void> {
      return runWait((snapshot) => snapshot.visibility === "hidden", ["page:hidden"], options);
    },
    untilOffline(options?: WaitOptions): Promise<void> {
      return runWait(
        (snapshot) => snapshot.connectivity === "offline",
        ["connection:offline"],
        options,
      );
    },
    untilOnline(options?: WaitOptions): Promise<void> {
      return runWait(
        (snapshot) => snapshot.connectivity === "online",
        ["connection:online"],
        options,
      );
    },
    untilVisible(options?: WaitOptions): Promise<void> {
      return runWait((snapshot) => snapshot.visibility === "visible", ["page:visible"], options);
    },
  };
}
