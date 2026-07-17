import type { ActivityStatus, ActivityView } from "./types.js";
import type { BrowserLifecycleSnapshot } from "../../core/session/types.js";

/**
 * Pure projector: snapshot.activity → ActivityView.
 * Never reads browser globals. O(1).
 */
export function projectActivityView(
  snapshot: Readonly<BrowserLifecycleSnapshot>,
  lastActiveAt?: number,
): ActivityView {
  const status: ActivityStatus = snapshot.activity;

  if (status === "unknown") {
    return {
      lastActiveAt: undefined,
      status,
    };
  }

  return {
    lastActiveAt:
      lastActiveAt ?? (status === "active" ? snapshot.timestamps.lastEventAt : undefined),
    status,
  };
}
