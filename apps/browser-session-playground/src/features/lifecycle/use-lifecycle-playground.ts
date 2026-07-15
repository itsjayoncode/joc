import { useEffect, useRef, useState } from "react";

import type {
  BrowserLifecyclePageState,
  BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

import {
  createLifecyclePlaygroundSession,
  formatLifecycleDuration,
  formatLifecycleEventLogEntry,
  getLifecycleBrowserApiInfo,
  isLifecyclePlaygroundSupported,
  sortLifecycleEventLogNewestFirst,
  type LifecycleEventLogEntry,
  type LifecyclePlaygroundEvent,
} from "../../lib/playground-lifecycle.js";

export function useLifecyclePlayground() {
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventLog, setEventLog] = useState<LifecycleEventLogEntry[]>([]);
  const [freezeCount, setFreezeCount] = useState(0);
  const [resumeCount, setResumeCount] = useState(0);
  const [runtimeState, setRuntimeState] = useState({
    lifecycle: "unknown" as BrowserLifecyclePageState,
    lifecycleSupported: false,
    isRunning: false,
    previousLifecycle: "unknown" as BrowserLifecyclePageState,
    snapshot: undefined as BrowserLifecycleSnapshot | undefined,
    lastTransitionAt: undefined as number | undefined,
    durationSinceTransition: "—",
  });

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const lifecycle = createLifecyclePlaygroundSession();
    let previousLifecycle: BrowserLifecyclePageState = "unknown";
    let lastTransitionAt: number | undefined;

    const syncState = (): void => {
      const snapshot = lifecycle.getSnapshot();
      setRuntimeState({
        durationSinceTransition:
          lastTransitionAt === undefined
            ? "—"
            : formatLifecycleDuration(Date.now() - lastTransitionAt),
        isRunning: lifecycle.isRunning(),
        lastTransitionAt,
        lifecycle: snapshot.lifecycle,
        lifecycleSupported: isLifecyclePlaygroundSupported(snapshot),
        previousLifecycle,
        snapshot,
      });
    };

    const recordEvent = (event: LifecyclePlaygroundEvent): void => {
      if (isPausedRef.current) return;
      const entry = formatLifecycleEventLogEntry(event);
      previousLifecycle =
        event.previous === "active" ||
        event.previous === "frozen" ||
        event.previous === "terminated" ||
        event.previous === "unknown"
          ? event.previous
          : previousLifecycle;
      lastTransitionAt = event.timestamp;
      if (event.type === "page:suspend") setFreezeCount((count) => count + 1);
      if (event.type === "page:resume" || event.type === "session:restored") {
        setResumeCount((count) => count + 1);
      }
      setEventLog((current) => [entry, ...current].slice(0, 100));
      syncState();
    };

    const unsubs = [
      lifecycle.on("page:suspend", recordEvent),
      lifecycle.on("page:resume", recordEvent),
      lifecycle.on("session:restored", recordEvent),
      lifecycle.on("page:hidden", (event) => {
        if (isPausedRef.current) return;
        setEventLog((current) => [formatLifecycleEventLogEntry(event), ...current].slice(0, 100));
      }),
      lifecycle.on("page:visible", (event) => {
        if (isPausedRef.current) return;
        setEventLog((current) => [formatLifecycleEventLogEntry(event), ...current].slice(0, 100));
      }),
      lifecycle.on("session:started", syncState),
    ];

    lifecycle.start();
    syncState();

    return () => {
      for (const unsub of unsubs) unsub();
      lifecycle.dispose();
      setEventLog([]);
    };
  }, []);

  return {
    browserApiInfo: getLifecycleBrowserApiInfo(runtimeState.snapshot),
    clearEvents: () => {
      setEventLog([]);
    },
    durationSinceTransition: runtimeState.durationSinceTransition,
    eventLog: sortLifecycleEventLogNewestFirst(eventLog),
    freezeCount,
    isPaused,
    isRunning: runtimeState.isRunning,
    lifecycle: runtimeState.lifecycle,
    lifecycleSupported: runtimeState.lifecycleSupported,
    pause: () => {
      setIsPaused(true);
    },
    previousLifecycle: runtimeState.previousLifecycle,
    resume: () => {
      setIsPaused(false);
    },
    resumeCount,
    searchQuery,
    setSearchQuery,
    snapshot: runtimeState.snapshot,
  };
}
