import { useEffect, useState } from "react";

import type { BrowserLifecyclePhase, BrowserLifecycleSnapshot } from "@jayoncode/browser-lifecycle";

import {
  createVisibilityPlaygroundSession,
  formatVisibilityEventLogEntry,
  isVisibilityPlaygroundSupported,
  sortVisibilityEventLog,
  type BrowserLifecycleVisibilityState,
  type VisibilityEventLogEntry,
  type VisibilityPlaygroundEvent,
} from "../../lib/browser-lifecycle.js";

const MAX_EVENT_LOG_ENTRIES = 50;

export interface VisibilityPlaygroundState {
  readonly eventLog: readonly VisibilityEventLogEntry[];
  readonly isRunning: boolean;
  readonly phase: BrowserLifecyclePhase;
  readonly snapshot: BrowserLifecycleSnapshot | undefined;
  readonly visibility: BrowserLifecycleVisibilityState;
  readonly visibilitySupported: boolean;
}

const initialState: VisibilityPlaygroundState = {
  eventLog: [],
  isRunning: false,
  phase: "created",
  snapshot: undefined,
  visibility: "unknown",
  visibilitySupported: false,
};

export function useVisibilityPlayground(): VisibilityPlaygroundState {
  const [state, setState] = useState<VisibilityPlaygroundState>(initialState);

  useEffect(() => {
    const lifecycle = createVisibilityPlaygroundSession();
    const eventLog: VisibilityEventLogEntry[] = [];

    const syncState = (): void => {
      const snapshot = lifecycle.getSnapshot();

      setState({
        eventLog: sortVisibilityEventLog(eventLog),
        isRunning: lifecycle.isRunning(),
        phase: snapshot.phase,
        snapshot,
        visibility: snapshot.visibility,
        visibilitySupported: isVisibilityPlaygroundSupported(snapshot),
      });
    };

    const recordEvent = (event: VisibilityPlaygroundEvent): void => {
      eventLog.push(formatVisibilityEventLogEntry(event));

      if (eventLog.length > MAX_EVENT_LOG_ENTRIES) {
        eventLog.splice(0, eventLog.length - MAX_EVENT_LOG_ENTRIES);
      }

      syncState();
    };

    const unsubscribeVisible = lifecycle.on("page:visible", recordEvent);
    const unsubscribeHidden = lifecycle.on("page:hidden", recordEvent);
    const unsubscribeStarted = lifecycle.on("session:started", syncState);
    const unsubscribeStopped = lifecycle.on("session:stopped", syncState);

    lifecycle.start();
    syncState();

    return () => {
      unsubscribeVisible();
      unsubscribeHidden();
      unsubscribeStarted();
      unsubscribeStopped();
      lifecycle.dispose();
      setState(initialState);
    };
  }, []);

  return state;
}

export const visibilityPlaygroundLimits = {
  maxEventLogEntries: MAX_EVENT_LOG_ENTRIES,
} as const;
