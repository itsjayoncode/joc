import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { BrowserLifecycleEventMap } from "@jayoncode/browser-lifecycle";

import {
  buildDeveloperRuntimeInspector,
  createDeveloperLogEntry,
  createDeveloperToolsSession,
  filterDeveloperLogs,
  getBrowserApiInspectorEntries,
  readDebugPreference,
  writeDebugPreference,
  type DeveloperLogEntry,
  type DeveloperRuntimeInspector,
} from "../../lib/playground-developer-tools.js";

const MAX_LOG_ENTRIES = 5_000;

export function useDeveloperToolsPlayground() {
  const [debugEnabled, setDebugEnabled] = useState(readDebugPreference);
  const [logs, setLogs] = useState<DeveloperLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [inspector, setInspector] = useState<DeveloperRuntimeInspector | undefined>();
  const isPausedRef = useRef(isPaused);
  const lifecycleRef = useRef<ReturnType<typeof createDeveloperToolsSession> | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const appendLog = useCallback((entry: DeveloperLogEntry): void => {
    if (isPausedRef.current) {
      return;
    }
    setLogs((current) => [entry, ...current].slice(0, MAX_LOG_ENTRIES));
  }, []);

  const bootstrap = useCallback(
    (enabled: boolean): void => {
      lifecycleRef.current?.dispose();
      const lifecycle = createDeveloperToolsSession(enabled);
      lifecycleRef.current = lifecycle;

      const record = (
        event: BrowserLifecycleEventMap[keyof BrowserLifecycleEventMap],
        level: DeveloperLogEntry["level"],
      ): void => {
        appendLog(
          createDeveloperLogEntry({
            category: event.type.split(":")[0] ?? "session",
            level,
            message: `${event.type} · current=${event.current}`,
            module: event.source,
            source: "browser-lifecycle",
            timestamp: event.timestamp,
          }),
        );
        setInspector(buildDeveloperRuntimeInspector(lifecycle));
      };

      const unsubs = [
        lifecycle.subscribe((event) => {
          record(event, debugEnabled ? "trace" : "info");
        }),
        lifecycle.on("plugin:error", (event) => {
          record(event, "error");
        }),
      ];

      lifecycle.start();
      setInspector(buildDeveloperRuntimeInspector(lifecycle));

      cleanupRef.current = () => {
        for (const unsub of unsubs) {
          unsub();
        }
      };
    },
    [appendLog, debugEnabled],
  );

  useEffect(() => {
    bootstrap(debugEnabled);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
      lifecycleRef.current?.dispose();
      lifecycleRef.current = null;
    };
  }, [bootstrap, debugEnabled]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (lifecycleRef.current) {
        setInspector(buildDeveloperRuntimeInspector(lifecycleRef.current));
      }
    }, 1_000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const filteredLogs = useMemo(() => filterDeveloperLogs(logs, searchQuery), [logs, searchQuery]);

  return {
    browserApis: getBrowserApiInspectorEntries(),
    clearLogs: () => {
      setLogs([]);
    },
    debugEnabled,
    disableDebug: () => {
      setDebugEnabled(false);
      writeDebugPreference(false);
    },
    enableDebug: () => {
      setDebugEnabled(true);
      writeDebugPreference(true);
    },
    filteredLogs,
    inspector,
    isPaused,
    pause: () => {
      setIsPaused(true);
    },
    restartDebug: () => {
      bootstrap(debugEnabled);
    },
    resume: () => {
      setIsPaused(false);
    },
    searchQuery,
    setSearchQuery,
  };
}
