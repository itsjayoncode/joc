import { projectActivityView } from "./project-activity.js";

import type { ActivityApi, ActivityView } from "./types.js";
import type { BrowserLifecycle, BrowserLifecycleEventName } from "../../core/session/types.js";

const LAST_ACTIVE_EVENTS = [
  "activity:detected",
  "activity:reset",
  "session:active",
] as const satisfies readonly BrowserLifecycleEventName[];

export interface CreateActivityApiOptions {
  /**
   * When true (default), subscribe to activity-related public events to track `lastActiveAt`.
   * Set false for a pure snapshot projector with **zero** subscriptions.
   */
  readonly trackLastActiveAt?: boolean;
}

/**
 * Creates an Activity facade over an existing BrowserLifecycle instance.
 *
 * - Does **not** attach browser DOM listeners.
 * - Does **not** enable idle observation (caller must set `idleTimeout` on the session).
 * - Allocates nothing on `createBrowserLifecycle()` — only when this factory is called.
 */
export function createActivityApi(
  lifecycle: Pick<BrowserLifecycle, "getSnapshot" | "on">,
  options: CreateActivityApiOptions = {},
): ActivityApi {
  const trackLastActiveAt = options.trackLastActiveAt !== false;
  let lastActiveAt: number | undefined;
  let disposed = false;
  const unsubscribers: Array<() => void> = [];

  const initial = lifecycle.getSnapshot();
  if (initial.activity === "active") {
    lastActiveAt = initial.timestamps.lastEventAt ?? initial.timestamps.updatedAt;
  }

  if (trackLastActiveAt) {
    for (const eventName of LAST_ACTIVE_EVENTS) {
      unsubscribers.push(
        lifecycle.on(eventName, (event) => {
          if (!disposed) {
            lastActiveAt = event.timestamp;
          }
        }),
      );
    }

    unsubscribers.push(
      lifecycle.on("session:idle", (event) => {
        if (disposed) {
          return;
        }
        const meta = event.metadata;
        if (meta && typeof meta.lastActivityAt === "number") {
          lastActiveAt = meta.lastActivityAt;
        }
      }),
    );
  }

  const read = (): ActivityView => projectActivityView(lifecycle.getSnapshot(), lastActiveAt);

  return {
    dispose(): void {
      if (disposed) {
        return;
      }
      disposed = true;
      for (const unsubscribe of unsubscribers) {
        unsubscribe();
      }
      unsubscribers.length = 0;
    },
    isActive(): boolean {
      return read().status === "active";
    },
    isIdle(): boolean {
      return read().status === "idle";
    },
    isUnknown(): boolean {
      return read().status === "unknown";
    },
    lastActiveAt(): number | undefined {
      return read().lastActiveAt;
    },
    lastInteraction(): number | undefined {
      return read().lastActiveAt;
    },
    idleTime(now: number = Date.now()): number {
      const view = read();
      if (view.status !== "idle" || view.lastActiveAt === undefined) {
        return 0;
      }
      return Math.max(0, now - view.lastActiveAt);
    },
    state(): ActivityView {
      return read();
    },
  };
}
