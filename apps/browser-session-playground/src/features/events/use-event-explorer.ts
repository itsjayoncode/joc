import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { BrowserLifecycleEventMap } from "@jayoncode/browser-lifecycle";

import {
  calculateEventExplorerStats,
  createEventExplorerRecord,
  createEventsPlaygroundSession,
  exportEventRecords,
  filterEventExplorerRecords,
  getAvailableEventCategories,
  getAvailableEventModules,
  getAvailableEventSources,
  getDefaultEventExplorerFilters,
  formatEventMetadataTable,
  type EventExplorerFilters,
  type EventExplorerRecord,
} from "../../lib/playground-events.js";

export function useEventExplorer() {
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);
  const [autoScroll, setAutoScroll] = useState(true);
  const [records, setRecords] = useState<EventExplorerRecord[]>([]);
  const [droppedEvents, setDroppedEvents] = useState(0);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [filters, setFilters] = useState<EventExplorerFilters>(getDefaultEventExplorerFilters());
  const [payloadQuery, setPayloadQuery] = useState("");
  const sequenceRef = useRef(0);
  const sessionIdRef = useRef(`session-${String(Date.now())}`);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const appendEvent = useCallback(
    (
      event: BrowserLifecycleEventMap[keyof BrowserLifecycleEventMap],
      snapshot: Parameters<typeof createEventExplorerRecord>[1],
    ): void => {
      if (isPausedRef.current) return;
      sequenceRef.current += 1;
      const record = createEventExplorerRecord(
        event,
        snapshot,
        sequenceRef.current,
        sessionIdRef.current,
      );

      setRecords((current) => {
        const next = [record, ...current];
        if (next.length > 1_000) {
          setDroppedEvents((count) => count + (next.length - 1_000));
          return next.slice(0, 1_000);
        }
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    const lifecycle = createEventsPlaygroundSession();
    const unsubscribe = lifecycle.subscribe((event, snapshot) => {
      appendEvent(event, snapshot);
    });

    lifecycle.start();

    return () => {
      unsubscribe();
      lifecycle.dispose();
      setRecords([]);
      sequenceRef.current = 0;
    };
  }, [appendEvent]);

  const filteredRecords = useMemo(
    () => filterEventExplorerRecords(records, filters),
    [filters, records],
  );

  const selectedRecord =
    filteredRecords.find((record) => record.id === selectedId) ?? filteredRecords[0];
  const stats = useMemo(
    () => calculateEventExplorerStats(records, droppedEvents, isPaused),
    [droppedEvents, isPaused, records],
  );

  return {
    autoScroll,
    availableCategories: getAvailableEventCategories(records),
    availableModules: getAvailableEventModules(records),
    availableSources: getAvailableEventSources(records),
    clear: () => {
      setRecords([]);
      setDroppedEvents(0);
      sequenceRef.current = 0;
      setSelectedId(undefined);
    },
    exportRecords: (format: "csv" | "json" | "ndjson" | "txt") =>
      exportEventRecords(filteredRecords, format),
    filters,
    formatMetadata: formatEventMetadataTable,
    isPaused,
    pause: () => {
      setIsPaused(true);
    },
    payloadQuery,
    records: filteredRecords,
    resume: () => {
      setIsPaused(false);
    },
    selectedRecord,
    setAutoScroll,
    setPayloadQuery,
    setFilters,
    setSelectedId,
    stats,
    toggleCategory: (category: EventExplorerFilters["categories"][number]) => {
      setFilters((current) => ({
        ...current,
        categories: current.categories.includes(category)
          ? current.categories.filter((value) => value !== category)
          : [...current.categories, category],
      }));
    },
    toggleModule: (module: string) => {
      setFilters((current) => ({
        ...current,
        modules: current.modules.includes(module)
          ? current.modules.filter((value) => value !== module)
          : [...current.modules, module],
      }));
    },
    toggleSource: (source: string) => {
      setFilters((current) => ({
        ...current,
        sources: current.sources.includes(source)
          ? current.sources.filter((value) => value !== source)
          : [...current.sources, source],
      }));
    },
    updateQuery: (query: string) => {
      setFilters((current) => ({ ...current, query }));
    },
  };
}
