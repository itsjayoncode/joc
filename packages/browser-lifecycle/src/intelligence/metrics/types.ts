export interface MetricsSnapshot {
  /** Wall-clock ms since this metrics instance started tracking. */
  readonly sessionMs: number;

  /** Cumulative durations (ms). */
  readonly visibleMs: number;
  readonly hiddenMs: number;
  readonly focusedMs: number;
  readonly blurredMs: number;
  readonly activeMs: number;
  readonly idleMs: number;
  readonly onlineMs: number;
  readonly offlineMs: number;
  /** Time between `page:suspend` and `page:resume`. */
  readonly sleepMs: number;

  /** Event counts. */
  readonly hiddenCount: number;
  readonly visibilityChangeCount: number;
  readonly focusCount: number;
  readonly blurCount: number;
  readonly idleCount: number;
  readonly reconnectCount: number;
  readonly sleepCount: number;
  readonly primaryTabSwitchCount: number;

  /**
   * 0–100 attention score:
   * `round(100 * focusedMs / (focusedMs + blurredMs + hiddenMs))`
   * when the denominator is > 0; otherwise 0.
   */
  readonly attentionScore: number;
}

/** Count-focused view (ChatGPT “browser statistics”). */
export interface MetricsStats {
  readonly focusCount: number;
  readonly blurCount: number;
  readonly visibilityChangeCount: number;
  readonly hiddenCount: number;
  readonly idleCount: number;
  readonly sleepCount: number;
  readonly reconnectCount: number;
  readonly primaryTabSwitchCount: number;
}

/** Attention breakdown (ChatGPT `session.attention.report()`). */
export interface AttentionReport {
  readonly score: number;
  readonly focusedMs: number;
  readonly blurredMs: number;
  readonly hiddenMs: number;
  readonly focusedRatio: number;
  readonly blurredRatio: number;
  readonly hiddenRatio: number;
}

export interface MetricsApi {
  snapshot(): Readonly<MetricsSnapshot>;
  /** Count statistics subset. */
  stats(): Readonly<MetricsStats>;
  /** Attention score + duration breakdown. */
  attention(): Readonly<AttentionReport>;

  sessionDuration(): number;
  activeDuration(): number;
  hiddenDuration(): number;
  focusedDuration(): number;
  idleDuration(): number;
  offlineDuration(): number;
  sleepDuration(): number;
  visibleDuration(): number;

  reset(): void;
  /**
   * Stop reducing and release subscriptions.
   * Does not dispose the underlying session.
   */
  dispose(): void;
}
