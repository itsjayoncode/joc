import type { BrowserLifecycle, BrowserLifecycleSnapshot } from "../../core/session/types.js";

export interface SessionHealth {
  readonly active: boolean;
  readonly healthy: boolean;
  readonly recovering: boolean;
  readonly degraded: boolean;
  readonly online: boolean;
  readonly focused: boolean;
  readonly visible: boolean;
  readonly idle: boolean;
}

export interface SessionHealthApi {
  health(): Readonly<SessionHealth>;
  dispose(): void;
}

function projectHealth(snapshot: Readonly<BrowserLifecycleSnapshot>): SessionHealth {
  const visible = snapshot.visibility === "visible";
  const focused = snapshot.attention === "focused";
  const online = snapshot.connectivity === "online";
  const idle = snapshot.activity === "idle";
  const active = snapshot.activity === "active";
  const recovering = snapshot.lifecycle === "frozen" || snapshot.phase === "stopped";
  const degraded =
    snapshot.visibility === "unknown" ||
    snapshot.attention === "unknown" ||
    snapshot.connectivity === "unknown" ||
    snapshot.connectivity === "offline";
  const healthy = visible && focused && online && !idle && !recovering;

  return {
    active,
    degraded,
    focused,
    healthy,
    idle,
    online,
    recovering,
    visible,
  };
}

/**
 * Derive a single session-health view from the core snapshot.
 * No subscriptions; no browser APIs.
 */
export function createSessionHealthApi(
  lifecycle: Pick<BrowserLifecycle, "getSnapshot">,
): SessionHealthApi {
  return {
    dispose(): void {
      // Pure facade.
    },
    health(): Readonly<SessionHealth> {
      return projectHealth(lifecycle.getSnapshot());
    },
  };
}
