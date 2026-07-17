import { projectPresenceView } from "./project-presence.js";

import type { ProjectPresenceOptions } from "./project-presence.js";
import type { PresenceApi, PresenceView } from "./types.js";
import type { BrowserLifecycle } from "../../core/session/types.js";

export type CreatePresenceApiOptions = ProjectPresenceOptions;

/**
 * Creates a Presence facade over an existing BrowserLifecycle instance.
 *
 * Page-local availability only (not multi-user presence).
 *
 * - Does **not** attach browser DOM listeners.
 * - Pure snapshot projection on each read (zero subscriptions).
 * - Allocates nothing on `createBrowserLifecycle()` — only when this factory is called.
 */
export function createPresenceApi(
  lifecycle: Pick<BrowserLifecycle, "getSnapshot">,
  options: CreatePresenceApiOptions = {},
): PresenceApi {
  const read = (): PresenceView => projectPresenceView(lifecycle.getSnapshot(), options);

  return {
    dispose(): void {
      // Pure facade — nothing to detach.
    },
    isAway(): boolean {
      return read().status === "away";
    },
    isPresent(): boolean {
      return read().status === "present";
    },
    isUnknown(): boolean {
      return read().status === "unknown";
    },
    label() {
      const status = read().status;
      if (status === "present") {
        return "ACTIVE" as const;
      }
      if (status === "away") {
        return "AWAY" as const;
      }
      return "UNKNOWN" as const;
    },
    state(): PresenceView {
      return read();
    },
  };
}
