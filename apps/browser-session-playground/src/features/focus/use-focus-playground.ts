import { useEffect, useRef, useState } from "react";

import type {
  BrowserLifecycleAttentionState,
  BrowserLifecyclePhase,
  BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

import {
  createFocusPlaygroundSession,
  formatFocusDuration,
  formatFocusEventLogEntry,
  getFocusBrowserApiInfo,
  isFocusPlaygroundSupported,
  sortFocusEventLogNewestFirst,
  type FocusBrowserApiInfo,
  type FocusEventLogEntry,
  type FocusPlaygroundEvent,
} from "../../lib/browser-lifecycle.js";

const MAX_BLUR_HISTORY_ENTRIES = 100;
const MAX_LIVE_STREAM_ENTRIES = 100;

export interface FocusPlaygroundState {
  readonly blurHistory: readonly FocusEventLogEntry[];
  readonly browserApiInfo: FocusBrowserApiInfo;
  readonly durationSinceLastChange: string;
  readonly focusSupported: boolean;
  readonly isPaused: boolean;
  readonly isRunning: boolean;
  readonly lastFocusChangeAt: number | undefined;
  readonly liveStream: readonly FocusEventLogEntry[];
  readonly attention: BrowserLifecycleAttentionState;
  readonly phase: BrowserLifecyclePhase;
  readonly previousAttention: BrowserLifecycleAttentionState;
  readonly searchQuery: string;
  readonly snapshot: BrowserLifecycleSnapshot | undefined;
}

export interface FocusPlaygroundControls {
  readonly clearBlurHistory: () => void;
  readonly pause: () => void;
  readonly resume: () => void;
  readonly setSearchQuery: (query: string) => void;
}

export function useFocusPlayground(): FocusPlaygroundState & FocusPlaygroundControls {
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);
  const [searchQuery, setSearchQuery] = useState("");
  const [blurHistory, setBlurHistory] = useState<FocusEventLogEntry[]>([]);
  const [liveStream, setLiveStream] = useState<FocusEventLogEntry[]>([]);
  const [runtimeState, setRuntimeState] = useState<
    Pick<
      FocusPlaygroundState,
      | "attention"
      | "durationSinceLastChange"
      | "focusSupported"
      | "isRunning"
      | "lastFocusChangeAt"
      | "phase"
      | "previousAttention"
      | "snapshot"
    >
  >({
    attention: "unknown",
    durationSinceLastChange: "—",
    focusSupported: false,
    isRunning: false,
    lastFocusChangeAt: undefined,
    phase: "created",
    previousAttention: "unknown",
    snapshot: undefined,
  });

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const lifecycle = createFocusPlaygroundSession();
    let previousAttention: BrowserLifecycleAttentionState = "unknown";
    let lastFocusChangeAt: number | undefined;

    const syncState = (): void => {
      const snapshot = lifecycle.getSnapshot();

      setRuntimeState({
        attention: snapshot.attention,
        durationSinceLastChange:
          lastFocusChangeAt === undefined
            ? "—"
            : formatFocusDuration(Date.now() - lastFocusChangeAt),
        focusSupported: isFocusPlaygroundSupported(snapshot),
        isRunning: lifecycle.isRunning(),
        lastFocusChangeAt,
        phase: snapshot.phase,
        previousAttention,
        snapshot,
      });
    };

    const recordEvent = (event: FocusPlaygroundEvent): void => {
      if (isPausedRef.current) {
        return;
      }

      const entry = formatFocusEventLogEntry(event);

      previousAttention = event.previous;
      lastFocusChangeAt = event.timestamp;

      setLiveStream((current) => {
        const next = [entry, ...current];

        if (next.length > MAX_LIVE_STREAM_ENTRIES) {
          return next.slice(0, MAX_LIVE_STREAM_ENTRIES);
        }

        return next;
      });

      if (event.type === "window:blur") {
        setBlurHistory((current) => {
          const next = [entry, ...current];

          if (next.length > MAX_BLUR_HISTORY_ENTRIES) {
            return next.slice(0, MAX_BLUR_HISTORY_ENTRIES);
          }

          return next;
        });
      }

      syncState();
    };

    const unsubscribeFocus = lifecycle.on("window:focus", recordEvent);
    const unsubscribeBlur = lifecycle.on("window:blur", recordEvent);
    const unsubscribeStarted = lifecycle.on("session:started", syncState);
    const unsubscribeStopped = lifecycle.on("session:stopped", syncState);

    lifecycle.start();
    syncState();

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      unsubscribeStarted();
      unsubscribeStopped();
      lifecycle.dispose();
      setBlurHistory([]);
      setLiveStream([]);
      setRuntimeState({
        attention: "unknown",
        durationSinceLastChange: "—",
        focusSupported: false,
        isRunning: false,
        lastFocusChangeAt: undefined,
        phase: "created",
        previousAttention: "unknown",
        snapshot: undefined,
      });
    };
  }, []);

  useEffect(() => {
    if (runtimeState.lastFocusChangeAt === undefined) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRuntimeState((current) => ({
        ...current,
        durationSinceLastChange: formatFocusDuration(
          Date.now() - (current.lastFocusChangeAt ?? Date.now()),
        ),
      }));
    }, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [runtimeState.lastFocusChangeAt]);

  return {
    blurHistory: sortFocusEventLogNewestFirst(blurHistory),
    browserApiInfo: getFocusBrowserApiInfo(runtimeState.snapshot),
    clearBlurHistory: () => {
      setBlurHistory([]);
    },
    durationSinceLastChange: runtimeState.durationSinceLastChange,
    focusSupported: runtimeState.focusSupported,
    isPaused,
    isRunning: runtimeState.isRunning,
    lastFocusChangeAt: runtimeState.lastFocusChangeAt,
    liveStream,
    attention: runtimeState.attention,
    pause: () => {
      setIsPaused(true);
    },
    phase: runtimeState.phase,
    previousAttention: runtimeState.previousAttention,
    resume: () => {
      setIsPaused(false);
    },
    searchQuery,
    setSearchQuery,
    snapshot: runtimeState.snapshot,
  };
}

export const focusPlaygroundLimits = {
  maxBlurHistoryEntries: MAX_BLUR_HISTORY_ENTRIES,
  maxLiveStreamEntries: MAX_LIVE_STREAM_ENTRIES,
} as const;
