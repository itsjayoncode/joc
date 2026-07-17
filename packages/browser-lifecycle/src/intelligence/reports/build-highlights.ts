import type { MetricsSnapshot } from "../metrics/types.js";

function formatDuration(ms: number): string {
  if (ms < 1_000) {
    return `${String(ms)}ms`;
  }
  const seconds = ms / 1_000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = seconds / 60;
  return `${minutes.toFixed(1)}m`;
}

/**
 * Pure formatter: MetricsSnapshot → human-readable highlights.
 * Never touches browser APIs or Timeline.
 */
export function buildMetricHighlights(metrics: Readonly<MetricsSnapshot>): readonly string[] {
  const highlights: string[] = [];

  if (metrics.sessionMs > 0) {
    highlights.push(`Session ${formatDuration(metrics.sessionMs)}`);
  }
  if (metrics.attentionScore > 0) {
    highlights.push(`Attention ${String(metrics.attentionScore)}%`);
  }
  if (metrics.hiddenCount > 0) {
    highlights.push(`Hidden ${String(metrics.hiddenCount)} time(s)`);
  }
  if (metrics.visibleMs > 0) {
    highlights.push(`Visible for ${formatDuration(metrics.visibleMs)}`);
  }
  if (metrics.focusedMs > 0) {
    highlights.push(`Focused for ${formatDuration(metrics.focusedMs)}`);
  }
  if (metrics.hiddenMs > 0) {
    highlights.push(`Hidden for ${formatDuration(metrics.hiddenMs)}`);
  }
  if (metrics.idleCount > 0) {
    highlights.push(
      `Idle ${String(metrics.idleCount)} time(s) (${formatDuration(metrics.idleMs)} total)`,
    );
  } else if (metrics.idleMs > 0) {
    highlights.push(`Idle for ${formatDuration(metrics.idleMs)}`);
  }
  if (metrics.offlineMs > 0) {
    highlights.push(`Offline for ${formatDuration(metrics.offlineMs)}`);
  }
  if (metrics.sleepCount > 0) {
    highlights.push(
      `Sleep ${String(metrics.sleepCount)} time(s) (${formatDuration(metrics.sleepMs)} total)`,
    );
  }
  if (metrics.reconnectCount > 0) {
    highlights.push(`Reconnected ${String(metrics.reconnectCount)} time(s)`);
  }
  if (metrics.focusCount > 0) {
    highlights.push(`Focus changes ${String(metrics.focusCount)}`);
  }

  if (highlights.length === 0) {
    return ["No notable lifecycle activity recorded yet."];
  }

  return highlights;
}

/** Zeroed metrics snapshot for tests and empty reports. */
export function emptyMetricsSnapshot(): MetricsSnapshot {
  return {
    activeMs: 0,
    attentionScore: 0,
    blurCount: 0,
    blurredMs: 0,
    focusCount: 0,
    focusedMs: 0,
    hiddenCount: 0,
    hiddenMs: 0,
    idleCount: 0,
    idleMs: 0,
    offlineMs: 0,
    onlineMs: 0,
    primaryTabSwitchCount: 0,
    reconnectCount: 0,
    sessionMs: 0,
    sleepCount: 0,
    sleepMs: 0,
    visibilityChangeCount: 0,
    visibleMs: 0,
  };
}
