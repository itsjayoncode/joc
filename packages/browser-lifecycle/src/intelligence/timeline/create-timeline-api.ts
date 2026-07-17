import { TimelineRingBuffer } from "./ring-buffer.js";

import type { TimelineApi, TimelineEntry, TimelineSnapshotFields } from "./types.js";
import type {
  BrowserLifecycle,
  BrowserLifecycleEventMap,
  BrowserLifecycleEventName,
  BrowserLifecycleSnapshot,
} from "../../core/session/types.js";

export interface CreateTimelineApiOptions {
  /**
   * Hard cap on retained events. Required.
   * Overflow drops the oldest entry (O(1)).
   */
  readonly maxEvents: number;
  /**
   * When true (default), store a slim snapshot subset on each entry.
   * Set false to retain only type + timestamp (lowest memory).
   */
  readonly includeSnapshot?: boolean;
  /** Called when an entry is dropped due to capacity overflow. */
  readonly onOverflow?: (dropped: TimelineEntry) => void;
}

function slimSnapshot(snapshot: Readonly<BrowserLifecycleSnapshot>): TimelineSnapshotFields {
  return {
    activity: snapshot.activity,
    attention: snapshot.attention,
    connectivity: snapshot.connectivity,
    lifecycle: snapshot.lifecycle,
    phase: snapshot.phase,
    tab: snapshot.tab,
    visibility: snapshot.visibility,
  };
}

/**
 * Creates an opt-in Timeline recorder over a BrowserLifecycle instance.
 *
 * - Does **not** attach browser DOM listeners.
 * - Subscribes to the public event feed only while the timeline exists.
 * - Allocates nothing on `createBrowserLifecycle()` — only when this factory is called.
 * - Bounded memory: `maxEvents` hard cap with drop-oldest overflow.
 */
export function createTimelineApi(
  lifecycle: Pick<BrowserLifecycle, "subscribe">,
  options: CreateTimelineApiOptions,
): TimelineApi {
  const includeSnapshot = options.includeSnapshot !== false;
  const buffer = new TimelineRingBuffer(options.maxEvents);
  let disposed = false;
  let sequence = 0;

  const unsubscribe = lifecycle.subscribe((event) => {
    if (disposed) {
      return;
    }

    const typed = event as BrowserLifecycleEventMap[BrowserLifecycleEventName];
    sequence += 1;
    const entry: TimelineEntry = {
      id: `${String(typed.timestamp)}-${String(sequence)}`,
      timestamp: typed.timestamp,
      type: typed.type,
      ...(includeSnapshot ? { snapshot: slimSnapshot(typed.snapshot) } : {}),
    };

    const dropped = buffer.push(entry);
    if (dropped !== undefined) {
      options.onOverflow?.(dropped);
    }
  });

  return {
    clear(): void {
      buffer.clear();
    },
    dispose(): void {
      if (disposed) {
        return;
      }
      disposed = true;
      unsubscribe();
      buffer.clear();
    },
    events(): readonly TimelineEntry[] {
      return buffer.toArray();
    },
    format(options?: import("./types.js").FormatTimelineOptions): readonly string[] {
      const locale = options?.locale;
      const timeZone = options?.timeZone;
      return buffer.toArray().map((entry) => {
        const when = new Date(entry.timestamp).toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          ...(timeZone === undefined ? {} : { timeZone }),
        });
        return `${when} ${entry.type}`;
      });
    },
    maxEvents(): number {
      return buffer.maxEvents;
    },
    record(): readonly TimelineEntry[] {
      return buffer.toArray();
    },
    size(): number {
      return buffer.size;
    },
  };
}
