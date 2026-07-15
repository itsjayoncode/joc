import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { BrowserLifecycleSnapshot } from "@jayoncode/browser-lifecycle";

import {
  appendStateSnapshot,
  computeStateDiff,
  createStateExplorerSession,
  createStateSnapshotRecord,
  exportStateSnapshot,
  getModuleStateCards,
  getSessionOverview,
  incrementTransitionCount,
  snapshotsAreEqual,
  type StateDiffEntry,
  type StateSnapshotRecord,
} from "../../lib/playground-state.js";

export function useStateExplorer() {
  const [snapshot, setSnapshot] = useState<BrowserLifecycleSnapshot | undefined>();
  const [history, setHistory] = useState<StateSnapshotRecord[]>([]);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | undefined>();
  const [compareSnapshotId, setCompareSnapshotId] = useState<string | undefined>();
  const [isRunning, setIsRunning] = useState(false);
  const [transitionCounts, setTransitionCounts] = useState<Record<string, number>>({});
  const [payloadQuery, setPayloadQuery] = useState("");
  const sequenceRef = useRef(0);
  const sessionIdRef = useRef(`state-session-${String(Date.now())}`);

  const recordSnapshot = useCallback((nextSnapshot: BrowserLifecycleSnapshot): void => {
    setSnapshot((current) => {
      if (current && snapshotsAreEqual(current, nextSnapshot)) {
        return current;
      }
      sequenceRef.current += 1;
      const record = createStateSnapshotRecord(
        nextSnapshot,
        sequenceRef.current,
        sessionIdRef.current,
      );
      setHistory((currentHistory) => appendStateSnapshot(currentHistory, record));
      return nextSnapshot;
    });
  }, []);

  useEffect(() => {
    const lifecycle = createStateExplorerSession();
    const sync = (): void => {
      recordSnapshot(lifecycle.getSnapshot());
      setIsRunning(lifecycle.isRunning());
    };

    const unsubscribe = lifecycle.subscribe((event, nextSnapshot) => {
      setTransitionCounts((counts) => incrementTransitionCount(counts, event.type));
      recordSnapshot(nextSnapshot);
      setIsRunning(lifecycle.isRunning());
    });

    lifecycle.start();
    sync();

    const intervalId = window.setInterval(sync, 1_000);

    return () => {
      window.clearInterval(intervalId);
      unsubscribe();
      lifecycle.dispose();
      setSnapshot(undefined);
      setHistory([]);
      sequenceRef.current = 0;
    };
  }, [recordSnapshot]);

  const overview = useMemo(
    () => (snapshot ? getSessionOverview(snapshot, sessionIdRef.current, isRunning) : undefined),
    [isRunning, snapshot],
  );

  const selectedSnapshot = history.find((entry) => entry.id === selectedSnapshotId) ?? history[0];
  const compareSnapshot = history.find((entry) => entry.id === compareSnapshotId) ?? history[1];

  const diff = useMemo((): StateDiffEntry[] => {
    if (!selectedSnapshot || !compareSnapshot) {
      return [];
    }
    return computeStateDiff(compareSnapshot.snapshot, selectedSnapshot.snapshot);
  }, [compareSnapshot, selectedSnapshot]);

  const moduleCards = useMemo(
    () =>
      snapshot ? getModuleStateCards(snapshot, transitionCounts, compareSnapshot?.snapshot) : [],
    [compareSnapshot?.snapshot, snapshot, transitionCounts],
  );

  const filteredJson = useMemo(() => {
    if (!snapshot) {
      return "";
    }
    const json = exportStateSnapshot(snapshot);
    if (!payloadQuery.trim()) {
      return json;
    }
    return json
      .split("\n")
      .filter((line) => line.toLowerCase().includes(payloadQuery.trim().toLowerCase()))
      .join("\n");
  }, [payloadQuery, snapshot]);

  return {
    clearHistory: () => {
      setHistory([]);
      setSelectedSnapshotId(undefined);
      setCompareSnapshotId(undefined);
    },
    compareSnapshot,
    compareSnapshotId,
    diff,
    exportSnapshot: () => (snapshot ? exportStateSnapshot(snapshot) : "{}"),
    filteredJson,
    history,
    isRunning,
    moduleCards,
    overview,
    payloadQuery,
    selectedSnapshot,
    selectedSnapshotId,
    setCompareSnapshotId,
    setPayloadQuery,
    setSelectedSnapshotId,
    snapshot,
  };
}
