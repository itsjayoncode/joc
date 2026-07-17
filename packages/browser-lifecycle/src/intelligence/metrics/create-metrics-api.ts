import type {
  AttentionReport,
  MetricsSnapshot,
  MetricsStats,
} from "./types.js";
import type {
  BrowserLifecycle,
  BrowserLifecycleEventMap,
  BrowserLifecycleEventName,
} from "../../core/session/types.js";

export interface CreateMetricsApiOptions {
  /** Defaults to `Date.now`. Inject for tests. */
  readonly timeProvider?: () => number;
}

interface MutableMetrics {
  sessionStartedAt: number;
  visibleMs: number;
  hiddenMs: number;
  focusedMs: number;
  blurredMs: number;
  activeMs: number;
  idleMs: number;
  onlineMs: number;
  offlineMs: number;
  sleepMs: number;
  hiddenCount: number;
  visibilityChangeCount: number;
  focusCount: number;
  blurCount: number;
  idleCount: number;
  reconnectCount: number;
  sleepCount: number;
  primaryTabSwitchCount: number;
}

interface OpenIntervals {
  visibleSince: number | undefined;
  hiddenSince: number | undefined;
  focusedSince: number | undefined;
  blurredSince: number | undefined;
  activeSince: number | undefined;
  idleSince: number | undefined;
  onlineSince: number | undefined;
  offlineSince: number | undefined;
  sleepSince: number | undefined;
}

function emptyMetrics(startedAt: number): MutableMetrics {
  return {
    activeMs: 0,
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
    sessionStartedAt: startedAt,
    sleepCount: 0,
    sleepMs: 0,
    visibilityChangeCount: 0,
    visibleMs: 0,
  };
}

function emptyIntervals(): OpenIntervals {
  return {
    activeSince: undefined,
    blurredSince: undefined,
    focusedSince: undefined,
    hiddenSince: undefined,
    idleSince: undefined,
    offlineSince: undefined,
    onlineSince: undefined,
    sleepSince: undefined,
    visibleSince: undefined,
  };
}

function attentionScore(metrics: MutableMetrics): number {
  const total = metrics.focusedMs + metrics.blurredMs + metrics.hiddenMs;
  if (total <= 0) {
    return 0;
  }
  return Math.round((100 * metrics.focusedMs) / total);
}

function freeze(metrics: MutableMetrics, now: number): MetricsSnapshot {
  const sessionMs = Math.max(0, now - metrics.sessionStartedAt);
  return {
    activeMs: metrics.activeMs,
    attentionScore: attentionScore(metrics),
    blurCount: metrics.blurCount,
    blurredMs: metrics.blurredMs,
    focusCount: metrics.focusCount,
    focusedMs: metrics.focusedMs,
    hiddenCount: metrics.hiddenCount,
    hiddenMs: metrics.hiddenMs,
    idleCount: metrics.idleCount,
    idleMs: metrics.idleMs,
    offlineMs: metrics.offlineMs,
    onlineMs: metrics.onlineMs,
    primaryTabSwitchCount: metrics.primaryTabSwitchCount,
    reconnectCount: metrics.reconnectCount,
    sessionMs,
    sleepCount: metrics.sleepCount,
    sleepMs: metrics.sleepMs,
    visibilityChangeCount: metrics.visibilityChangeCount,
    visibleMs: metrics.visibleMs,
  };
}

function toStats(metrics: MutableMetrics): MetricsStats {
  return {
    blurCount: metrics.blurCount,
    focusCount: metrics.focusCount,
    hiddenCount: metrics.hiddenCount,
    idleCount: metrics.idleCount,
    primaryTabSwitchCount: metrics.primaryTabSwitchCount,
    reconnectCount: metrics.reconnectCount,
    sleepCount: metrics.sleepCount,
    visibilityChangeCount: metrics.visibilityChangeCount,
  };
}

function toAttention(metrics: MutableMetrics): AttentionReport {
  const focusedMs = metrics.focusedMs;
  const blurredMs = metrics.blurredMs;
  const hiddenMs = metrics.hiddenMs;
  const total = focusedMs + blurredMs + hiddenMs;
  const ratio = (value: number): number => (total <= 0 ? 0 : value / total);
  return {
    blurredMs,
    blurredRatio: ratio(blurredMs),
    focusedMs,
    focusedRatio: ratio(focusedMs),
    hiddenMs,
    hiddenRatio: ratio(hiddenMs),
    score: attentionScore(metrics),
  };
}

/**
 * Creates an opt-in Metrics reducer over public lifecycle events.
 *
 * - Live O(1) reducers — **Timeline is not required** (ADR A6).
 * - Does **not** attach browser DOM listeners.
 * - Allocates nothing on `createBrowserLifecycle()` — only when this factory is called.
 */
export function createMetricsApi(
  lifecycle: Pick<BrowserLifecycle, "getSnapshot" | "subscribe">,
  options: CreateMetricsApiOptions = {},
): import("./types.js").MetricsApi {
  const timeProvider = options.timeProvider ?? Date.now;
  let metrics = emptyMetrics(timeProvider());
  let intervals = emptyIntervals();
  let disposed = false;

  const seedOpenIntervals = (at: number): void => {
    const snapshot = lifecycle.getSnapshot();
    intervals = emptyIntervals();
    if (snapshot.visibility === "visible") {
      intervals.visibleSince = at;
    } else if (snapshot.visibility === "hidden") {
      intervals.hiddenSince = at;
    }
    if (snapshot.attention === "focused") {
      intervals.focusedSince = at;
    } else if (snapshot.attention === "unfocused") {
      intervals.blurredSince = at;
    }
    if (snapshot.activity === "active") {
      intervals.activeSince = at;
    } else if (snapshot.activity === "idle") {
      intervals.idleSince = at;
    }
    if (snapshot.connectivity === "online") {
      intervals.onlineSince = at;
    } else if (snapshot.connectivity === "offline") {
      intervals.offlineSince = at;
    }
  };

  const addInterval = (
    since: number | undefined,
    at: number,
    field: keyof Pick<
      MutableMetrics,
      | "visibleMs"
      | "hiddenMs"
      | "focusedMs"
      | "blurredMs"
      | "activeMs"
      | "idleMs"
      | "onlineMs"
      | "offlineMs"
      | "sleepMs"
    >,
  ): void => {
    if (since !== undefined) {
      metrics[field] += Math.max(0, at - since);
    }
  };

  const flushOpenIntervals = (at: number): void => {
    addInterval(intervals.visibleSince, at, "visibleMs");
    addInterval(intervals.hiddenSince, at, "hiddenMs");
    addInterval(intervals.focusedSince, at, "focusedMs");
    addInterval(intervals.blurredSince, at, "blurredMs");
    addInterval(intervals.activeSince, at, "activeMs");
    addInterval(intervals.idleSince, at, "idleMs");
    addInterval(intervals.onlineSince, at, "onlineMs");
    addInterval(intervals.offlineSince, at, "offlineMs");
    addInterval(intervals.sleepSince, at, "sleepMs");

    if (intervals.visibleSince !== undefined) {
      intervals.visibleSince = at;
    }
    if (intervals.hiddenSince !== undefined) {
      intervals.hiddenSince = at;
    }
    if (intervals.focusedSince !== undefined) {
      intervals.focusedSince = at;
    }
    if (intervals.blurredSince !== undefined) {
      intervals.blurredSince = at;
    }
    if (intervals.activeSince !== undefined) {
      intervals.activeSince = at;
    }
    if (intervals.idleSince !== undefined) {
      intervals.idleSince = at;
    }
    if (intervals.onlineSince !== undefined) {
      intervals.onlineSince = at;
    }
    if (intervals.offlineSince !== undefined) {
      intervals.offlineSince = at;
    }
    if (intervals.sleepSince !== undefined) {
      intervals.sleepSince = at;
    }
  };

  seedOpenIntervals(timeProvider());

  const unsubscribe = lifecycle.subscribe((event) => {
    if (disposed) {
      return;
    }

    const typed = event as BrowserLifecycleEventMap[BrowserLifecycleEventName];
    const at = typed.timestamp;

    switch (typed.type) {
      case "page:visible": {
        addInterval(intervals.hiddenSince, at, "hiddenMs");
        intervals.hiddenSince = undefined;
        if (intervals.visibleSince === undefined) {
          intervals.visibleSince = at;
        }
        metrics.visibilityChangeCount += 1;
        break;
      }
      case "page:hidden": {
        addInterval(intervals.visibleSince, at, "visibleMs");
        intervals.visibleSince = undefined;
        if (intervals.hiddenSince === undefined) {
          intervals.hiddenSince = at;
        }
        metrics.hiddenCount += 1;
        metrics.visibilityChangeCount += 1;
        break;
      }
      case "window:focus": {
        addInterval(intervals.blurredSince, at, "blurredMs");
        intervals.blurredSince = undefined;
        if (intervals.focusedSince === undefined) {
          intervals.focusedSince = at;
        }
        metrics.focusCount += 1;
        break;
      }
      case "window:blur": {
        addInterval(intervals.focusedSince, at, "focusedMs");
        intervals.focusedSince = undefined;
        if (intervals.blurredSince === undefined) {
          intervals.blurredSince = at;
        }
        metrics.blurCount += 1;
        break;
      }
      case "session:idle": {
        addInterval(intervals.activeSince, at, "activeMs");
        intervals.activeSince = undefined;
        if (intervals.idleSince === undefined) {
          intervals.idleSince = at;
        }
        metrics.idleCount += 1;
        break;
      }
      case "session:active": {
        addInterval(intervals.idleSince, at, "idleMs");
        intervals.idleSince = undefined;
        if (intervals.activeSince === undefined) {
          intervals.activeSince = at;
        }
        break;
      }
      case "connection:online": {
        addInterval(intervals.offlineSince, at, "offlineMs");
        intervals.offlineSince = undefined;
        if (intervals.onlineSince === undefined) {
          intervals.onlineSince = at;
        }
        break;
      }
      case "connection:offline": {
        addInterval(intervals.onlineSince, at, "onlineMs");
        intervals.onlineSince = undefined;
        if (intervals.offlineSince === undefined) {
          intervals.offlineSince = at;
        }
        break;
      }
      case "connection:reconnect": {
        metrics.reconnectCount += 1;
        break;
      }
      case "page:suspend": {
        if (intervals.sleepSince === undefined) {
          intervals.sleepSince = at;
        }
        metrics.sleepCount += 1;
        break;
      }
      case "page:resume": {
        addInterval(intervals.sleepSince, at, "sleepMs");
        intervals.sleepSince = undefined;
        break;
      }
      case "tab:primary": {
        metrics.primaryTabSwitchCount += 1;
        break;
      }
      default:
        break;
    }
  });

  const read = (): MetricsSnapshot => {
    flushOpenIntervals(timeProvider());
    return freeze(metrics, timeProvider());
  };

  return {
    activeDuration(): number {
      return read().activeMs;
    },
    attention(): Readonly<AttentionReport> {
      flushOpenIntervals(timeProvider());
      return toAttention(metrics);
    },
    dispose(): void {
      if (disposed) {
        return;
      }
      disposed = true;
      flushOpenIntervals(timeProvider());
      unsubscribe();
      intervals = emptyIntervals();
    },
    focusedDuration(): number {
      return read().focusedMs;
    },
    hiddenDuration(): number {
      return read().hiddenMs;
    },
    idleDuration(): number {
      return read().idleMs;
    },
    offlineDuration(): number {
      return read().offlineMs;
    },
    reset(): void {
      const at = timeProvider();
      metrics = emptyMetrics(at);
      seedOpenIntervals(at);
    },
    sessionDuration(): number {
      return read().sessionMs;
    },
    sleepDuration(): number {
      return read().sleepMs;
    },
    snapshot(): Readonly<MetricsSnapshot> {
      return read();
    },
    stats(): Readonly<MetricsStats> {
      flushOpenIntervals(timeProvider());
      return toStats(metrics);
    },
    visibleDuration(): number {
      return read().visibleMs;
    },
  };
}
