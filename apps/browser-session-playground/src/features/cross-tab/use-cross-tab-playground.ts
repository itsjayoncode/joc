import { useEffect, useRef, useState } from "react";

import type {
  BrowserLifecycleSnapshot,
  BrowserLifecycleTabState,
} from "@jayoncode/browser-lifecycle";

import {
  createCrossTabPlaygroundSession,
  formatCrossTabDuration,
  formatCrossTabEventLogEntry,
  getCrossTabBrowserApiInfo,
  isCrossTabPlaygroundSupported,
  sortCrossTabEventLogNewestFirst,
  type CrossTabEventLogEntry,
  type CrossTabPlaygroundEvent,
} from "../../lib/playground-cross-tab.js";

export function useCrossTabPlayground() {
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<CrossTabEventLogEntry[]>([]);
  const [electionCount, setElectionCount] = useState(0);
  const [runtimeState, setRuntimeState] = useState({
    crossTabSupported: false,
    isRunning: false,
    primarySince: undefined as number | undefined,
    snapshot: undefined as BrowserLifecycleSnapshot | undefined,
    tab: "unknown" as BrowserLifecycleTabState,
    leadershipDuration: "—",
  });

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const lifecycle = createCrossTabPlaygroundSession();
    let primarySince: number | undefined;

    const syncState = (): void => {
      const snapshot = lifecycle.getSnapshot();
      setRuntimeState({
        crossTabSupported: isCrossTabPlaygroundSupported(snapshot),
        isRunning: lifecycle.isRunning(),
        leadershipDuration:
          primarySince === undefined ? "—" : formatCrossTabDuration(Date.now() - primarySince),
        primarySince,
        snapshot,
        tab: snapshot.tab,
      });
    };

    const recordEvent = (event: CrossTabPlaygroundEvent): void => {
      if (isPausedRef.current) return;
      const entry = formatCrossTabEventLogEntry(event);
      if (event.type === "tab:primary") {
        primarySince = event.timestamp;
        setElectionCount((count) => count + 1);
      }
      setMessages((current) => [entry, ...current].slice(0, 200));
      syncState();
    };

    const unsubs = [
      lifecycle.on("tab:primary", recordEvent),
      lifecycle.on("tab:secondary", recordEvent),
      lifecycle.on("tab:message", recordEvent),
      lifecycle.on("session:started", syncState),
    ];

    lifecycle.start();
    syncState();

    const intervalId = window.setInterval(syncState, 1_000);

    return () => {
      window.clearInterval(intervalId);
      for (const unsub of unsubs) unsub();
      lifecycle.dispose();
      setMessages([]);
    };
  }, []);

  return {
    browserApiInfo: getCrossTabBrowserApiInfo(runtimeState.snapshot),
    clearMessages: () => {
      setMessages([]);
    },
    electionCount,
    isPaused,
    isRunning: runtimeState.isRunning,
    leadershipDuration: runtimeState.leadershipDuration,
    messages: sortCrossTabEventLogNewestFirst(messages),
    pause: () => {
      setIsPaused(true);
    },
    primarySince: runtimeState.primarySince,
    resume: () => {
      setIsPaused(false);
    },
    searchQuery,
    setSearchQuery,
    snapshot: runtimeState.snapshot,
    tab: runtimeState.tab,
    crossTabSupported: runtimeState.crossTabSupported,
  };
}
