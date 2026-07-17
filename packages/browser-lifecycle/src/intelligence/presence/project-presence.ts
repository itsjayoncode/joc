import type { PresenceReason, PresenceStatus, PresenceView } from "./types.js";
import type { BrowserLifecycleSnapshot } from "../../core/session/types.js";

export interface ProjectPresenceOptions {
  /**
   * When true, `activity === "idle"` counts as away, and `activity === "unknown"`
   * makes presence unknown. Default false (idle not part of default policy).
   */
  readonly requireActive?: boolean;
}

/**
 * Pure projector: snapshot → page-local PresenceView.
 * Never reads browser globals. O(1).
 *
 * Default policy: present iff visible ∧ focused ∧ online.
 * Any required input `unknown` ⇒ unknown.
 */
export function projectPresenceView(
  snapshot: Readonly<BrowserLifecycleSnapshot>,
  options: ProjectPresenceOptions = {},
): PresenceView {
  const requireActive = options.requireActive === true;
  const reasons: PresenceReason[] = [];

  const { visibility, attention, connectivity, activity } = snapshot;

  if (visibility === "unknown") {
    reasons.push("visibility-unknown");
  } else if (visibility === "hidden") {
    reasons.push("hidden");
  }

  if (attention === "unknown") {
    reasons.push("attention-unknown");
  } else if (attention === "unfocused") {
    reasons.push("blurred");
  }

  if (connectivity === "unknown") {
    reasons.push("connectivity-unknown");
  } else if (connectivity === "offline") {
    reasons.push("offline");
  }

  if (requireActive) {
    if (activity === "unknown") {
      reasons.push("activity-unknown");
    } else if (activity === "idle") {
      reasons.push("idle");
    }
  }

  const hasUnknown = reasons.some((reason) => reason.endsWith("-unknown"));
  if (hasUnknown) {
    return { reasons, status: "unknown" };
  }

  const awayReasons = reasons.filter((reason) => !reason.endsWith("-unknown"));
  if (awayReasons.length > 0) {
    return { reasons: awayReasons, status: "away" };
  }

  const status: PresenceStatus = "present";
  return { reasons: [], status };
}
