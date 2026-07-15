import { useEffect, useRef, useState } from "react";

import type {
  BrowserLifecycleConnectivityState,
  BrowserLifecyclePhase,
  BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

import {
  createConnectivityPlaygroundSession,
  formatConnectivityDuration,
  formatConnectivityEventLogEntry,
  getConnectivityBrowserApiInfo,
  isConnectivityPlaygroundSupported,
  sortConnectivityEventLogNewestFirst,
  type ConnectivityBrowserApiInfo,
  type ConnectivityEventLogEntry,
  type ConnectivityPlaygroundEvent,
} from "../../lib/browser-lifecycle.js";

const MAX_OFFLINE_HISTORY_ENTRIES = 100;
const MAX_RECONNECT_TIMELINE_ENTRIES = 100;

export interface ConnectivityPlaygroundState {
  readonly browserApiInfo: ConnectivityBrowserApiInfo;
  readonly connectivity: BrowserLifecycleConnectivityState;
  readonly connectivitySupported: boolean;
  readonly durationSinceLastChange: string;
  readonly isPaused: boolean;
  readonly isRunning: boolean;
  readonly lastConnectivityChangeAt: number | undefined;
  readonly lastReconnectAt: number | undefined;
  readonly lastReconnectDuration: string;
  readonly offlineHistory: readonly ConnectivityEventLogEntry[];
  readonly phase: BrowserLifecyclePhase;
  readonly previousConnectivity: BrowserLifecycleConnectivityState;
  readonly reconnectCount: number;
  readonly reconnectTimeline: readonly ConnectivityEventLogEntry[];
  readonly searchQuery: string;
  readonly snapshot: BrowserLifecycleSnapshot | undefined;
  readonly timeSinceReconnect: string;
}

export interface ConnectivityPlaygroundControls {
  readonly clearOfflineHistory: () => void;
  readonly pause: () => void;
  readonly resume: () => void;
  readonly setSearchQuery: (query: string) => void;
}

export function useConnectivityPlayground(): ConnectivityPlaygroundState &
  ConnectivityPlaygroundControls {
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);
  const [searchQuery, setSearchQuery] = useState("");
  const [offlineHistory, setOfflineHistory] = useState<ConnectivityEventLogEntry[]>([]);
  const [reconnectTimeline, setReconnectTimeline] = useState<ConnectivityEventLogEntry[]>([]);
  const [reconnectCount, setReconnectCount] = useState(0);
  const [lastReconnectDurationMs, setLastReconnectDurationMs] = useState<number | undefined>();
  const [runtimeState, setRuntimeState] = useState<
    Pick<
      ConnectivityPlaygroundState,
      | "connectivity"
      | "connectivitySupported"
      | "durationSinceLastChange"
      | "isRunning"
      | "lastConnectivityChangeAt"
      | "lastReconnectAt"
      | "phase"
      | "previousConnectivity"
      | "snapshot"
      | "timeSinceReconnect"
    >
  >({
    connectivity: "unknown",
    connectivitySupported: false,
    durationSinceLastChange: "—",
    isRunning: false,
    lastConnectivityChangeAt: undefined,
    lastReconnectAt: undefined,
    phase: "created",
    previousConnectivity: "unknown",
    snapshot: undefined,
    timeSinceReconnect: "—",
  });

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const lifecycle = createConnectivityPlaygroundSession();
    let previousConnectivity: BrowserLifecycleConnectivityState = "unknown";
    let lastConnectivityChangeAt: number | undefined;
    let lastReconnectAt: number | undefined;

    const syncState = (): void => {
      const snapshot = lifecycle.getSnapshot();

      setRuntimeState({
        connectivity: snapshot.connectivity,
        connectivitySupported: isConnectivityPlaygroundSupported(snapshot),
        durationSinceLastChange:
          lastConnectivityChangeAt === undefined
            ? "—"
            : formatConnectivityDuration(Date.now() - lastConnectivityChangeAt),
        isRunning: lifecycle.isRunning(),
        lastConnectivityChangeAt,
        lastReconnectAt,
        phase: snapshot.phase,
        previousConnectivity,
        snapshot,
        timeSinceReconnect:
          lastReconnectAt === undefined
            ? "—"
            : formatConnectivityDuration(Date.now() - lastReconnectAt),
      });
    };

    const recordEvent = (event: ConnectivityPlaygroundEvent): void => {
      if (isPausedRef.current) {
        return;
      }

      const entry = formatConnectivityEventLogEntry(event);

      previousConnectivity = event.previous;
      lastConnectivityChangeAt = event.timestamp;

      setReconnectTimeline((current) => {
        const next = [entry, ...current];

        if (next.length > MAX_RECONNECT_TIMELINE_ENTRIES) {
          return next.slice(0, MAX_RECONNECT_TIMELINE_ENTRIES);
        }

        return next;
      });

      if (event.type === "connection:offline") {
        setOfflineHistory((current) => {
          const next = [entry, ...current];

          if (next.length > MAX_OFFLINE_HISTORY_ENTRIES) {
            return next.slice(0, MAX_OFFLINE_HISTORY_ENTRIES);
          }

          return next;
        });
      }

      if (event.type === "connection:reconnect") {
        const offlineDuration = event.metadata?.offlineDuration ?? 0;

        setReconnectCount((current) => current + 1);
        setLastReconnectDurationMs(offlineDuration);
        lastReconnectAt = event.timestamp;
      }

      syncState();
    };

    const unsubscribeOnline = lifecycle.on("connection:online", recordEvent);
    const unsubscribeOffline = lifecycle.on("connection:offline", recordEvent);
    const unsubscribeReconnect = lifecycle.on("connection:reconnect", recordEvent);
    const unsubscribeStarted = lifecycle.on("session:started", syncState);
    const unsubscribeStopped = lifecycle.on("session:stopped", syncState);

    lifecycle.start();
    syncState();

    return () => {
      unsubscribeOnline();
      unsubscribeOffline();
      unsubscribeReconnect();
      unsubscribeStarted();
      unsubscribeStopped();
      lifecycle.dispose();
      setOfflineHistory([]);
      setReconnectTimeline([]);
      setReconnectCount(0);
      setLastReconnectDurationMs(undefined);
      setRuntimeState({
        connectivity: "unknown",
        connectivitySupported: false,
        durationSinceLastChange: "—",
        isRunning: false,
        lastConnectivityChangeAt: undefined,
        lastReconnectAt: undefined,
        phase: "created",
        previousConnectivity: "unknown",
        snapshot: undefined,
        timeSinceReconnect: "—",
      });
    };
  }, []);

  useEffect(() => {
    if (
      runtimeState.lastConnectivityChangeAt === undefined &&
      runtimeState.lastReconnectAt === undefined
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRuntimeState((current) => ({
        ...current,
        durationSinceLastChange:
          current.lastConnectivityChangeAt === undefined
            ? "—"
            : formatConnectivityDuration(Date.now() - current.lastConnectivityChangeAt),
        timeSinceReconnect:
          current.lastReconnectAt === undefined
            ? "—"
            : formatConnectivityDuration(Date.now() - current.lastReconnectAt),
      }));
    }, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [runtimeState.lastConnectivityChangeAt, runtimeState.lastReconnectAt]);

  return {
    browserApiInfo: getConnectivityBrowserApiInfo(runtimeState.snapshot),
    clearOfflineHistory: () => {
      setOfflineHistory([]);
    },
    connectivity: runtimeState.connectivity,
    connectivitySupported: runtimeState.connectivitySupported,
    durationSinceLastChange: runtimeState.durationSinceLastChange,
    isPaused,
    isRunning: runtimeState.isRunning,
    lastConnectivityChangeAt: runtimeState.lastConnectivityChangeAt,
    lastReconnectAt: runtimeState.lastReconnectAt,
    lastReconnectDuration:
      lastReconnectDurationMs === undefined
        ? "—"
        : formatConnectivityDuration(lastReconnectDurationMs),
    offlineHistory: sortConnectivityEventLogNewestFirst(offlineHistory),
    pause: () => {
      setIsPaused(true);
    },
    phase: runtimeState.phase,
    previousConnectivity: runtimeState.previousConnectivity,
    reconnectCount,
    reconnectTimeline,
    resume: () => {
      setIsPaused(false);
    },
    searchQuery,
    setSearchQuery,
    snapshot: runtimeState.snapshot,
    timeSinceReconnect: runtimeState.timeSinceReconnect,
  };
}

export const connectivityPlaygroundLimits = {
  maxOfflineHistoryEntries: MAX_OFFLINE_HISTORY_ENTRIES,
  maxReconnectTimelineEntries: MAX_RECONNECT_TIMELINE_ENTRIES,
} as const;
