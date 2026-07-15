import { useEffect, useMemo, useRef, useState } from "react";

import {
  buildPerformanceDiagnosticsWarnings,
  buildPerformanceMetricsSnapshot,
  createPerformancePlaygroundSession,
  exportPerformanceMetrics,
  incrementCategoryCount,
  measureDispatchDuration,
  PERFORMANCE_SAMPLE_LIMIT,
  percentile,
  type PerformanceDispatchSample,
  type PerformanceMetricsSnapshot,
} from "../../lib/playground-performance.js";

export function usePerformancePlayground() {
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);
  const [dispatchSamples, setDispatchSamples] = useState<PerformanceDispatchSample[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [droppedEvents, setDroppedEvents] = useState(0);
  const [peakEventRate, setPeakEventRate] = useState(0);
  const [diagnosticsTick, setDiagnosticsTick] = useState(0);
  const lifecycleRef = useRef<ReturnType<typeof createPerformancePlaygroundSession> | null>(null);
  const eventsInLastSecondRef = useRef(0);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const lifecycle = createPerformancePlaygroundSession();
    lifecycleRef.current = lifecycle;

    const unsubscribe = lifecycle.subscribe((event, snapshot) => {
      if (isPausedRef.current) {
        return;
      }

      const startedAt = performance.now();
      queueMicrotask(() => {
        const durationMs = measureDispatchDuration(startedAt, performance.now());
        const sample: PerformanceDispatchSample = {
          durationMs,
          event: event.type,
          id: `${event.type}-${String(event.timestamp)}-${String(startedAt)}`,
          timestamp: Date.now(),
        };

        setDispatchSamples((current) => {
          const next = [sample, ...current];
          if (next.length > PERFORMANCE_SAMPLE_LIMIT) {
            setDroppedEvents((count) => count + (next.length - PERFORMANCE_SAMPLE_LIMIT));
            return next.slice(0, PERFORMANCE_SAMPLE_LIMIT);
          }
          return next;
        });
        setCategoryCounts((counts) => incrementCategoryCount(counts, event.type));
        eventsInLastSecondRef.current += 1;
        setDiagnosticsTick((tick) => tick + 1);
        void snapshot;
      });
    });

    lifecycle.start();

    const intervalId = window.setInterval(() => {
      setPeakEventRate((peak) => Math.max(peak, eventsInLastSecondRef.current));
      eventsInLastSecondRef.current = 0;
      setDiagnosticsTick((tick) => tick + 1);
    }, 1_000);

    return () => {
      window.clearInterval(intervalId);
      unsubscribe();
      lifecycle.dispose();
      lifecycleRef.current = null;
    };
  }, []);

  const metrics = useMemo((): PerformanceMetricsSnapshot | undefined => {
    void diagnosticsTick;
    const lifecycle = lifecycleRef.current;
    if (!lifecycle) {
      return undefined;
    }
    return buildPerformanceMetricsSnapshot({
      diagnostics: lifecycle.getRuntimeDiagnostics(),
      dispatchSamples,
      droppedEvents,
      eventCounts: categoryCounts,
      peakEventRate,
      snapshotJson: lifecycle.getSnapshot(),
    });
  }, [categoryCounts, diagnosticsTick, dispatchSamples, droppedEvents, peakEventRate]);

  const warnings = useMemo(
    () => (metrics ? buildPerformanceDiagnosticsWarnings(metrics) : []),
    [metrics],
  );

  const dispatchPercentile95 = useMemo(
    () => percentile(metrics?.dispatchSamples.map((sample) => sample.durationMs) ?? [], 0.95),
    [metrics],
  );

  return {
    clear: () => {
      setDispatchSamples([]);
      setCategoryCounts({});
      setDroppedEvents(0);
      setPeakEventRate(0);
    },
    dispatchPercentile95,
    exportMetrics: (format: "csv" | "json" | "txt") =>
      metrics ? exportPerformanceMetrics(metrics, format) : "",
    isPaused,
    metrics,
    pause: () => {
      setIsPaused(true);
    },
    resume: () => {
      setIsPaused(false);
    },
    warnings,
  };
}
