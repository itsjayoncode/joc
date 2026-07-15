import {
  createBrowserLifecycle,
  type BrowserLifecycle,
  type BrowserLifecycleConfig,
  type BrowserLifecycleEventName,
  type BrowserLifecycleRuntimeDiagnostics,
} from "@jayoncode/browser-lifecycle";

import { categorizeEvent } from "./playground-events.js";

export const PERFORMANCE_SAMPLE_LIMIT = 500;
export const PERFORMANCE_TIMELINE_LIMIT = 120;

export interface PerformanceDispatchSample {
  readonly durationMs: number;
  readonly event: BrowserLifecycleEventName;
  readonly id: string;
  readonly timestamp: number;
}

export interface PerformanceEventCategoryStat {
  readonly category: string;
  readonly count: number;
}

export interface PerformanceMemoryInfo {
  readonly estimatedStateBytes: number;
  readonly eventBufferSize: number;
  readonly heapLimitMb?: number;
  readonly heapTotalMb?: number;
  readonly heapUsedMb?: number;
  readonly supported: boolean;
}

export interface PerformanceMetricsSnapshot {
  readonly averageDispatchMs: number;
  readonly categories: readonly PerformanceEventCategoryStat[];
  readonly diagnostics: BrowserLifecycleRuntimeDiagnostics;
  readonly dispatchSamples: readonly PerformanceDispatchSample[];
  readonly droppedEvents: number;
  readonly eventsPerMinute: number;
  readonly eventsPerSecond: number;
  readonly fastestDispatchMs: number;
  readonly memory: PerformanceMemoryInfo;
  readonly peakEventRate: number;
  readonly slowestDispatchMs: number;
  readonly totalEvents: number;
}

export const PERFORMANCE_PLAYGROUND_CONFIG: BrowserLifecycleConfig = {
  autoStart: false,
  crossTab: {
    channelName: "jayoncode:performance-playground",
    heartbeatInterval: 1_000,
    leaderTimeout: 3_000,
  },
  debug: true,
  emitInitialState: true,
  idleTimeout: 30_000,
};

export function createPerformancePlaygroundSession(): BrowserLifecycle {
  return createBrowserLifecycle(PERFORMANCE_PLAYGROUND_CONFIG);
}

export function measureDispatchDuration(startedAt: number, endedAt: number): number {
  return Math.max(0, endedAt - startedAt);
}

export function estimateJsonBytes(value: unknown): number {
  return new TextEncoder().encode(JSON.stringify(value)).length;
}

export function getBrowserMemoryInfo(stateBytes: number, eventBufferSize: number): PerformanceMemoryInfo {
  const memory = (performance as Performance & { memory?: { jsHeapSizeLimit: number; totalJSHeapSize: number; usedJSHeapSize: number } }).memory;

  if (!memory) {
    return {
      estimatedStateBytes: stateBytes,
      eventBufferSize,
      supported: false,
    };
  }

  return {
    estimatedStateBytes: stateBytes,
    eventBufferSize,
    heapLimitMb: Number((memory.jsHeapSizeLimit / 1_048_576).toFixed(2)),
    heapTotalMb: Number((memory.totalJSHeapSize / 1_048_576).toFixed(2)),
    heapUsedMb: Number((memory.usedJSHeapSize / 1_048_576).toFixed(2)),
    supported: true,
  };
}

export function percentile(values: readonly number[], ratio: number): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(ratio * sorted.length) - 1));
  return sorted[index] ?? 0;
}

export function buildPerformanceMetricsSnapshot(input: {
  readonly diagnostics: BrowserLifecycleRuntimeDiagnostics;
  readonly dispatchSamples: readonly PerformanceDispatchSample[];
  readonly droppedEvents: number;
  readonly eventCounts: Readonly<Record<string, number>>;
  readonly peakEventRate: number;
  readonly snapshotJson: unknown;
}): PerformanceMetricsSnapshot {
  const durations = input.dispatchSamples.map((sample) => sample.durationMs);
  const totalEvents = Object.values(input.eventCounts).reduce((total, count) => total + count, 0);
  const now = Date.now();
  const recent = input.dispatchSamples.filter((sample) => now - sample.timestamp <= 60_000);
  const recentSecond = input.dispatchSamples.filter((sample) => now - sample.timestamp <= 1_000);

  const categories = Object.entries(input.eventCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((left, right) => right.count - left.count);

  return {
    averageDispatchMs:
      durations.length === 0
        ? 0
        : Number((durations.reduce((total, value) => total + value, 0) / durations.length).toFixed(3)),
    categories,
    diagnostics: input.diagnostics,
    dispatchSamples: input.dispatchSamples,
    droppedEvents: input.droppedEvents,
    eventsPerMinute: recent.length,
    eventsPerSecond: recentSecond.length,
    fastestDispatchMs: durations.length === 0 ? 0 : Math.min(...durations),
    memory: getBrowserMemoryInfo(
      estimateJsonBytes(input.snapshotJson),
      input.diagnostics.eventBufferSize,
    ),
    peakEventRate: input.peakEventRate,
    slowestDispatchMs: durations.length === 0 ? 0 : Math.max(...durations),
    totalEvents,
  };
}

export function incrementCategoryCount(
  counts: Record<string, number>,
  event: BrowserLifecycleEventName,
): Record<string, number> {
  const category = categorizeEvent(event);
  return {
    ...counts,
    [category]: (counts[category] ?? 0) + 1,
  };
}

export function buildPerformanceDiagnosticsWarnings(
  metrics: PerformanceMetricsSnapshot,
): readonly { readonly message: string; readonly severity: "error" | "info" | "warning" }[] {
  const warnings: { message: string; severity: "error" | "info" | "warning" }[] = [];

  if (metrics.slowestDispatchMs > 16) {
    warnings.push({
      message: `Slowest dispatch is ${String(metrics.slowestDispatchMs)}ms, which may affect frame budgets.`,
      severity: "warning",
    });
  }
  if (metrics.diagnostics.totalListenerCount > 50) {
    warnings.push({
      message: "High listener count detected. Review duplicate subscriptions.",
      severity: "warning",
    });
  }
  if (metrics.droppedEvents > 0) {
    warnings.push({
      message: `${String(metrics.droppedEvents)} events were dropped from the performance sample buffer.`,
      severity: "info",
    });
  }
  if (!metrics.diagnostics.capabilities.broadcastChannel) {
    warnings.push({
      message: "BroadcastChannel is unavailable; cross-tab metrics will be limited.",
      severity: "info",
    });
  }

  return warnings;
}

export function exportPerformanceMetrics(
  metrics: PerformanceMetricsSnapshot,
  format: "csv" | "json" | "txt",
): string {
  if (format === "json") {
    return JSON.stringify(metrics, null, 2);
  }
  if (format === "csv") {
    return [
      "metric,value",
      `totalEvents,${String(metrics.totalEvents)}`,
      `eventsPerSecond,${String(metrics.eventsPerSecond)}`,
      `averageDispatchMs,${String(metrics.averageDispatchMs)}`,
      `slowestDispatchMs,${String(metrics.slowestDispatchMs)}`,
      `totalListeners,${String(metrics.diagnostics.totalListenerCount)}`,
    ].join("\n");
  }
  return [
    `Total events: ${String(metrics.totalEvents)}`,
    `Events/sec: ${String(metrics.eventsPerSecond)}`,
    `Average dispatch: ${String(metrics.averageDispatchMs)}ms`,
    `Listeners: ${String(metrics.diagnostics.totalListenerCount)}`,
    `Modules: ${String(metrics.diagnostics.moduleCount)}`,
  ].join("\n");
}
