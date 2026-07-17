/**
 * Activity facade types (Browser Intelligence — derive-only).
 *
 * Spec: `_constuction/browser-lifecycle/03-browser-intelligence/API_CONTRACTS.md`
 */
export type ActivityStatus = "active" | "idle" | "unknown";

export interface ActivityView {
  readonly status: ActivityStatus;
  readonly lastActiveAt: number | undefined;
}

export interface ActivityApi {
  /** Current core-backed activity view. */
  state(): ActivityView;
  isActive(): boolean;
  isIdle(): boolean;
  isUnknown(): boolean;
  lastActiveAt(): number | undefined;
  /** Alias for `lastActiveAt()` (ChatGPT `lastInteraction`). */
  lastInteraction(): number | undefined;
  /**
   * Current idle streak in ms (0 when active/unknown).
   * Uses wall clock vs `lastActiveAt` when idle.
   */
  idleTime(now?: number): number;
  /**
   * Detach optional event tracking used for `lastActiveAt`.
   * Safe to call multiple times. Does not dispose the underlying session.
   */
  dispose(): void;
}
