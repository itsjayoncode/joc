import { useCallback, useEffect, useRef, useState } from "react";

import type {
  BrowserLifecyclePluginDiagnostic,
  BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

import {
  createLoggerPlugin,
  createPluginsPlaygroundSession,
  formatPluginPublicEvent,
  getPluginArchitectureSteps,
  getPluginSystemInfo,
  LOGGER_PLUGIN_SOURCE,
  mergePluginPlaygroundEvents,
  PLUGIN_DEVELOPER_EXAMPLES,
  PLUGIN_LIFECYCLE_PHASES,
  searchPluginPlaygroundEvents,
  type PluginPlaygroundEventEntry,
} from "../../lib/playground-plugins.js";

export function usePluginPlayground() {
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<PluginPlaygroundEventEntry[]>([]);
  const [plugins, setPlugins] = useState<readonly BrowserLifecyclePluginDiagnostic[]>([]);
  const [loggerOutput, setLoggerOutput] = useState<readonly string[]>([]);
  const [loggerExecutionCount, setLoggerExecutionCount] = useState(0);
  const [snapshot, setSnapshot] = useState<BrowserLifecycleSnapshot | undefined>();
  const [isRunning, setIsRunning] = useState(false);
  const lifecycleRef = useRef<ReturnType<typeof createPluginsPlaygroundSession> | null>(null);
  const unsubsRef = useRef<readonly (() => void)[]>([]);
  const loggerPluginRef = useRef(
    createLoggerPlugin((message) => {
      setLoggerOutput((current) => [message, ...current].slice(0, 50));
    }),
  );

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const syncState = useCallback((): void => {
    const lifecycle = lifecycleRef.current;
    if (!lifecycle) return;
    setPlugins(lifecycle.getPlugins());
    setSnapshot(lifecycle.getSnapshot());
    setIsRunning(lifecycle.isRunning());
    setLoggerExecutionCount(loggerPluginRef.current.getState().executionCount);
    setLoggerOutput(loggerPluginRef.current.getState().consoleOutput);
    const hookLog = lifecycle.getPluginHookLog();
    setEvents((currentPublic) => mergePluginPlaygroundEvents(hookLog, currentPublic).slice(0, 200));
  }, []);

  const bootstrapSession = useCallback((): void => {
    lifecycleRef.current?.dispose();
    const lifecycle = createPluginsPlaygroundSession({
      includeLoggerPlugin: false,
      plugins: [loggerPluginRef.current],
    });
    lifecycleRef.current = lifecycle;

    const recordPublicEvent = (event: Parameters<typeof formatPluginPublicEvent>[0]): void => {
      if (isPausedRef.current) return;
      setEvents((current) => [formatPluginPublicEvent(event), ...current].slice(0, 200));
      syncState();
    };

    const unsubs = [
      lifecycle.on("plugin:registered", recordPublicEvent),
      lifecycle.on("plugin:removed", recordPublicEvent),
      lifecycle.on("plugin:error", recordPublicEvent),
      lifecycle.on("session:started", syncState),
      lifecycle.on("session:stopped", syncState),
    ];
    unsubsRef.current = unsubs;

    lifecycle.start();
    syncState();
  }, [syncState]);

  useEffect(() => {
    bootstrapSession();

    return () => {
      for (const unsub of unsubsRef.current) unsub();
      unsubsRef.current = [];
      lifecycleRef.current?.dispose();
      lifecycleRef.current = null;
    };
  }, [bootstrapSession]);

  const filteredEvents = searchPluginPlaygroundEvents(events, searchQuery);
  const selectedPlugin = plugins.find((plugin) => plugin.id === "playground-logger") ?? plugins[0];

  return {
    architectureSteps: getPluginArchitectureSteps(),
    clearEvents: () => {
      setEvents([]);
    },
    developerExamples: PLUGIN_DEVELOPER_EXAMPLES,
    disablePlugin: (pluginId: string) => {
      lifecycleRef.current?.setPluginEnabled(pluginId, false);
      syncState();
    },
    enablePlugin: (pluginId: string) => {
      lifecycleRef.current?.setPluginEnabled(pluginId, true);
      syncState();
    },
    events: filteredEvents,
    isPaused,
    isRunning,
    lifecyclePhases: PLUGIN_LIFECYCLE_PHASES,
    loggerExecutionCount,
    loggerOutput,
    loggerSource: LOGGER_PLUGIN_SOURCE,
    pause: () => {
      setIsPaused(true);
    },
    plugins,
    reloadSession: () => {
      bootstrapSession();
    },
    resume: () => {
      setIsPaused(false);
    },
    searchQuery,
    selectedPlugin,
    setSearchQuery,
    snapshot,
    stopSession: () => {
      lifecycleRef.current?.stop();
      syncState();
    },
    startSession: () => {
      lifecycleRef.current?.start();
      syncState();
    },
    systemInfo: getPluginSystemInfo(snapshot),
  };
}
