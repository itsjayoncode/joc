import { useEffect, useRef, useState } from "react";

import type {
  BrowserLifecycleActivityState,
  BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

import {
  createIdlePlaygroundSession,
  formatIdleDuration,
  formatIdleEventLogEntry,
  getIdleBrowserApiInfo,
  IDLE_TIMEOUT_PRESETS,
  isIdlePlaygroundSupported,
  sortIdleEventLogNewestFirst,
  type IdleEventLogEntry,
  type IdlePlaygroundEvent,
} from "../../lib/playground-idle.js";

const MAX_ACTIVITY_HISTORY = 100;
const MAX_LIVE_EVENTS = 100;

export function useIdlePlayground(initialTimeoutMs = 30_000) {
  const [idleTimeoutMs, setIdleTimeoutMs] = useState(initialTimeoutMs);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);
  const [searchQuery, setSearchQuery] = useState("");
  const [activityHistory, setActivityHistory] = useState<IdleEventLogEntry[]>([]);
  const [liveEvents, setLiveEvents] = useState<IdleEventLogEntry[]>([]);
  const [transitionCount, setTransitionCount] = useState(0);
  const [runtimeState, setRuntimeState] = useState({
    activity: "unknown" as BrowserLifecycleActivityState,
    browserApiInfo: getIdleBrowserApiInfo(undefined, idleTimeoutMs),
    durationSinceLastChange: "—",
    elapsedMs: 0,
    idleSupported: false,
    isRunning: false,
    lastActivityAt: undefined as number | undefined,
    lastIdleAt: undefined as number | undefined,
    previousActivity: "unknown" as BrowserLifecycleActivityState,
    remainingMs: idleTimeoutMs,
    sessionKey: 0,
    snapshot: undefined as BrowserLifecycleSnapshot | undefined,
  });

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const lifecycle = createIdlePlaygroundSession(idleTimeoutMs);
    let previousActivity: BrowserLifecycleActivityState = "unknown";
    let lastActivityAt: number | undefined;
    let lastIdleAt: number | undefined;
    let lastChangeAt: number | undefined;

    const syncState = (): void => {
      const snapshot = lifecycle.getSnapshot();
      const now = Date.now();
      const elapsedMs = lastActivityAt === undefined ? 0 : now - lastActivityAt;
      const remainingMs = Math.max(0, idleTimeoutMs - elapsedMs);

      setRuntimeState((current) => ({
        ...current,
        activity: snapshot.activity,
        browserApiInfo: getIdleBrowserApiInfo(snapshot, idleTimeoutMs),
        durationSinceLastChange:
          lastChangeAt === undefined ? "—" : formatIdleDuration(now - lastChangeAt),
        elapsedMs,
        idleSupported: isIdlePlaygroundSupported(snapshot, idleTimeoutMs),
        isRunning: lifecycle.isRunning(),
        lastActivityAt,
        lastIdleAt,
        previousActivity,
        remainingMs,
        snapshot,
      }));
    };

    const recordEvent = (event: IdlePlaygroundEvent): void => {
      if (isPausedRef.current) return;
      const entry = formatIdleEventLogEntry(event);
      previousActivity = event.previous;
      lastChangeAt = event.timestamp;
      if (event.type === "session:idle") lastIdleAt = event.timestamp;
      if (event.type === "session:active" || event.type === "activity:detected") {
        lastActivityAt = event.timestamp;
      }
      if (event.type === "session:active" || event.type === "session:idle") {
        setTransitionCount((count) => count + 1);
      }
      if (event.type === "activity:detected" || event.type === "activity:reset") {
        setActivityHistory((current) => [entry, ...current].slice(0, MAX_ACTIVITY_HISTORY));
      }
      setLiveEvents((current) => [entry, ...current].slice(0, MAX_LIVE_EVENTS));
      syncState();
    };

    const unsubs = [
      lifecycle.on("session:active", recordEvent),
      lifecycle.on("session:idle", recordEvent),
      lifecycle.on("activity:detected", recordEvent),
      lifecycle.on("activity:reset", recordEvent),
      lifecycle.on("session:started", syncState),
      lifecycle.on("session:stopped", syncState),
    ];

    lifecycle.start();
    lastActivityAt = Date.now();
    syncState();

    const intervalId = window.setInterval(syncState, 1_000);

    return () => {
      window.clearInterval(intervalId);
      for (const unsub of unsubs) unsub();
      lifecycle.dispose();
      setActivityHistory([]);
      setLiveEvents([]);
      setTransitionCount(0);
    };
  }, [idleTimeoutMs, runtimeState.sessionKey]);

  return {
    activityHistory: sortIdleEventLogNewestFirst(activityHistory),
    browserApiInfo: runtimeState.browserApiInfo,
    clearActivityHistory: () => {
      setActivityHistory([]);
    },
    clearLiveEvents: () => {
      setLiveEvents([]);
    },
    durationSinceLastChange: runtimeState.durationSinceLastChange,
    elapsedMs: runtimeState.elapsedMs,
    idleSupported: runtimeState.idleSupported,
    idleTimeoutMs,
    isPaused,
    isRunning: runtimeState.isRunning,
    lastActivityAt: runtimeState.lastActivityAt,
    lastIdleAt: runtimeState.lastIdleAt,
    liveEvents,
    pause: () => {
      setIsPaused(true);
    },
    presets: IDLE_TIMEOUT_PRESETS,
    previousActivity: runtimeState.previousActivity,
    remainingMs: runtimeState.remainingMs,
    resetSession: () => {
      setRuntimeState((current) => ({ ...current, sessionKey: current.sessionKey + 1 }));
    },
    resume: () => {
      setIsPaused(false);
    },
    searchQuery,
    setIdleTimeoutMs,
    setSearchQuery,
    snapshot: runtimeState.snapshot,
    transitionCount,
    activity: runtimeState.activity,
  };
}
