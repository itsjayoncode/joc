/**
 * Presence facade types (page-local availability — not multi-user presence).
 *
 * Spec: `_constuction/browser-lifecycle/03-browser-intelligence/API_CONTRACTS.md`
 */
export type PresenceStatus = "present" | "away" | "unknown";

export type PresenceReason =
  | "hidden"
  | "blurred"
  | "offline"
  | "idle"
  | "visibility-unknown"
  | "attention-unknown"
  | "connectivity-unknown"
  | "activity-unknown";

export interface PresenceView {
  readonly status: PresenceStatus;
  /** Machine-readable reasons, e.g. ["hidden", "blurred", "offline"] */
  readonly reasons: readonly PresenceReason[];
}

export type PresenceLabel = "ACTIVE" | "AWAY" | "UNKNOWN";

export interface PresenceApi {
  state(): PresenceView;
  isPresent(): boolean;
  isAway(): boolean;
  isUnknown(): boolean;
  /** Uppercase label for ChatGPT-style `ACTIVE` / `AWAY` / `UNKNOWN`. */
  label(): PresenceLabel;
  /**
   * No-op today (pure snapshot reads). Kept for symmetry with ActivityApi
   * and future optional subscriptions.
   */
  dispose(): void;
}
