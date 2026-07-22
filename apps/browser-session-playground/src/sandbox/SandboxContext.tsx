import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type {
  BrowserLifecycle,
  BrowserLifecycleRuntimeDiagnostics,
  BrowserLifecycleSnapshot,
  MetricsApi,
  MetricsSnapshot,
  TimelineApi,
} from "@jayoncode/browser-lifecycle";
import { createMetricsApi, createTimelineApi } from "@jayoncode/browser-lifecycle";

import { createSandboxSession } from "./build-session.js";
import { copyTextToClipboard, decodeSandboxShareHash } from "./clipboard.js";
import { generateSandboxCode } from "./generate-code.js";
import { runSimulation, type SimulationAction } from "./simulation.js";
import {
  DEFAULT_SANDBOX_CONFIG,
  type InspectorTab,
  type SandboxConfig,
  type SandboxConfigPatch,
  type SandboxConsoleEntry,
  type SandboxEventEntry,
  type SimulatedBrowserState,
  type TimelineEntry,
  type WorkspaceTab,
} from "./types.js";
import { BROWSER_LIFECYCLE_DOCS_URL } from "../lib/playground-links.js";

interface SandboxContextValue {
  readonly config: SandboxConfig;
  readonly session: BrowserLifecycle | null;
  readonly running: boolean;
  readonly snapshot: BrowserLifecycleSnapshot | null;
  readonly previousSnapshot: BrowserLifecycleSnapshot | null;
  readonly diagnostics: BrowserLifecycleRuntimeDiagnostics | null;
  readonly events: readonly SandboxEventEntry[];
  readonly consoleEntries: readonly SandboxConsoleEntry[];
  readonly timeline: readonly TimelineEntry[];
  readonly metricsSnapshot: MetricsSnapshot | null;
  readonly timelineApiEnabled: boolean;
  readonly metricsApiEnabled: boolean;
  readonly simulated: SimulatedBrowserState;
  readonly workspaceTab: WorkspaceTab;
  readonly inspectorTab: InspectorTab;
  readonly generatedCode: string;
  readonly docsBase: string;
  readonly statusMessage: string | null;
  readonly consolePaused: boolean;
  readonly eventFilter: string;
  setConfig: (patch: SandboxConfigPatch) => void;
  patchModules: (patch: Partial<SandboxConfig["modules"]>) => void;
  patchIdle: (patch: Partial<SandboxConfig["idle"]>) => void;
  patchCrossTab: (patch: Partial<SandboxConfig["crossTab"]>) => void;
  patchDiagnostics: (patch: Partial<SandboxConfig["diagnostics"]>) => void;
  replaceConfig: (next: SandboxConfig) => void;
  startSession: () => void;
  stopSession: () => void;
  recreateSession: () => void;
  resetSandbox: () => void;
  copyText: (value: string, label: string) => Promise<void>;
  setWorkspaceTab: (tab: WorkspaceTab) => void;
  setInspectorTab: (tab: InspectorTab) => void;
  clearConsole: () => void;
  clearTimeline: () => void;
  clearEvents: () => void;
  setConsolePaused: (paused: boolean) => void;
  setEventFilter: (value: string) => void;
  exportConfig: () => string;
  importConfig: (raw: string) => void;
  flashStatus: (message: string) => void;
  simulate: (action: SimulationAction) => void;
}

const SandboxContext = createContext<SandboxContextValue | null>(null);

let consoleCounter = 0;
let eventCounter = 0;
let timelineCounter = 0;
let seqCounter = 0;

const DOCS_BASE = BROWSER_LIFECYCLE_DOCS_URL.replace(/\/$/, "");

const EMPTY_SIMULATED: SimulatedBrowserState = {
  visibility: null,
  attention: null,
  connectivity: null,
  lifecycle: null,
};

function isConfigLike(value: unknown): value is Partial<SandboxConfig> {
  return value !== null && typeof value === "object";
}

function mergeConfig(base: SandboxConfig, patch: SandboxConfigPatch): SandboxConfig {
  return {
    ...base,
    ...patch,
    modules: { ...base.modules, ...(patch.modules ?? {}) },
    idle: { ...base.idle, ...(patch.idle ?? {}) },
    crossTab: { ...base.crossTab, ...(patch.crossTab ?? {}) },
    diagnostics: { ...base.diagnostics, ...(patch.diagnostics ?? {}) },
  };
}

export function SandboxProvider({ children }: { readonly children: ReactNode }) {
  const [config, setConfigState] = useState<SandboxConfig>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SANDBOX_CONFIG;
    }
    const shared = decodeSandboxShareHash(window.location.hash);
    if (isConfigLike(shared)) {
      return mergeConfig(DEFAULT_SANDBOX_CONFIG, shared);
    }
    return DEFAULT_SANDBOX_CONFIG;
  });

  const [session, setSession] = useState<BrowserLifecycle | null>(null);
  const [running, setRunning] = useState(false);
  const [snapshot, setSnapshot] = useState<BrowserLifecycleSnapshot | null>(null);
  const [previousSnapshot, setPreviousSnapshot] = useState<BrowserLifecycleSnapshot | null>(null);
  const [diagnostics, setDiagnostics] = useState<BrowserLifecycleRuntimeDiagnostics | null>(null);
  const [events, setEvents] = useState<readonly SandboxEventEntry[]>([]);
  const [consoleEntries, setConsoleEntries] = useState<readonly SandboxConsoleEntry[]>([]);
  const [timeline, setTimeline] = useState<readonly TimelineEntry[]>([]);
  const [metricsSnapshot, setMetricsSnapshot] = useState<MetricsSnapshot | null>(null);
  const [simulated, setSimulated] = useState<SimulatedBrowserState>(EMPTY_SIMULATED);
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("dashboard");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("runtime");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [consolePaused, setConsolePaused] = useState(false);
  const [eventFilter, setEventFilter] = useState("");
  const [recreateNonce, setRecreateNonce] = useState(0);
  const sessionRef = useRef<BrowserLifecycle | null>(null);
  const timelineApiRef = useRef<TimelineApi | null>(null);
  const metricsApiRef = useRef<MetricsApi | null>(null);
  const consolePausedRef = useRef(false);
  const configRef = useRef(config);

  useEffect(() => {
    consolePausedRef.current = consolePaused;
  }, [consolePaused]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const pushConsole = useCallback(
    (
      message: string,
      level: SandboxConsoleEntry["level"] = "info",
      module = "sandbox",
      payload?: string,
    ) => {
      if (consolePausedRef.current) {
        return;
      }
      const entry: SandboxConsoleEntry = {
        id: `c-${String(++consoleCounter)}`,
        at: new Date().toLocaleTimeString(),
        level,
        module,
        message,
        ...(payload !== undefined ? { payload } : {}),
      };
      setConsoleEntries((current) => [entry, ...current].slice(0, 200));
    },
    [],
  );

  const flashStatus = useCallback((message: string) => {
    setStatusMessage(message);
    window.setTimeout(() => {
      setStatusMessage((current) => (current === message ? null : current));
    }, 2200);
  }, []);

  const attachSession = useCallback(
    (next: BrowserLifecycle, cfg: SandboxConfig) => {
      return next.subscribe((event, nextSnapshot) => {
        setSnapshot((prev) => {
          setPreviousSnapshot(prev);
          return nextSnapshot;
        });

        try {
          setDiagnostics(next.getRuntimeDiagnostics());
        } catch {
          // diagnostics optional
        }

        const seq = ++seqCounter;
        const entry: SandboxEventEntry = {
          id: `e-${String(++eventCounter)}`,
          seq,
          at: new Date().toLocaleTimeString(),
          timestamp: event.timestamp,
          type: event.type,
          source: event.source,
          summary: `${event.type} · ${event.source}`,
          payload: JSON.stringify(
            {
              current: event.current,
              previous: event.previous,
              metadata: event.metadata,
            },
            null,
            2,
          ),
        };
        setEvents((current) => [entry, ...current].slice(0, 250));

        const packageTimeline = timelineApiRef.current;
        if (configRef.current.modules.timeline && packageTimeline) {
          const mapped = [...packageTimeline.events()]
            .reverse()
            .map((item) => ({
              id: item.id,
              at: new Date(item.timestamp).toLocaleTimeString(),
              label: item.type,
              type: item.type,
            }));
          setTimeline(mapped);
        } else {
          setTimeline((current) =>
            [
              {
                id: `t-${String(++timelineCounter)}`,
                at: entry.at,
                label: event.type,
                type: event.type,
              },
              ...current,
            ].slice(0, 80),
          );
        }

        if (metricsApiRef.current) {
          setMetricsSnapshot(metricsApiRef.current.snapshot());
        }

        if (cfg.diagnostics.eventLogging) {
          pushConsole(event.type, "info", event.source, entry.summary);
        }
        if (cfg.diagnostics.snapshotLogging) {
          pushConsole("Snapshot updated", "info", "snapshot");
        }
      });
    },
    [pushConsole],
  );

  const disposeCurrent = useCallback(() => {
    timelineApiRef.current?.dispose();
    metricsApiRef.current?.dispose();
    timelineApiRef.current = null;
    metricsApiRef.current = null;
    setMetricsSnapshot(null);

    const current = sessionRef.current;
    if (!current) {
      return;
    }
    try {
      if (current.isRunning()) {
        current.stop();
      }
      current.dispose();
    } catch {
      // ignore dispose races
    }
    sessionRef.current = null;
    setSession(null);
    setRunning(false);
  }, []);

  // Opt-in Session Insights / Timeline factories — zero cost until toggled
  useEffect(() => {
    const current = sessionRef.current;
    timelineApiRef.current?.dispose();
    metricsApiRef.current?.dispose();
    timelineApiRef.current = null;
    metricsApiRef.current = null;

    if (!current) {
      setMetricsSnapshot(null);
      return;
    }

    if (config.modules.timeline) {
      timelineApiRef.current = createTimelineApi(current, { maxEvents: 80 });
      pushConsole("createTimelineApi attached", "success", "insights");
    }

    if (config.modules.metrics) {
      const metrics = createMetricsApi(current);
      metricsApiRef.current = metrics;
      setMetricsSnapshot(metrics.snapshot());
      pushConsole("createMetricsApi attached", "success", "insights");
    } else {
      setMetricsSnapshot(null);
    }

    return () => {
      timelineApiRef.current?.dispose();
      metricsApiRef.current?.dispose();
      timelineApiRef.current = null;
      metricsApiRef.current = null;
    };
  }, [session, config.modules.timeline, config.modules.metrics, pushConsole]);

  // Recreate when structural config changes
  useEffect(() => {
    disposeCurrent();
    const next = createSandboxSession(config);
    sessionRef.current = next;
    setSession(next);
    setSnapshot(next.getSnapshot());
    setPreviousSnapshot(null);
    setEvents([]);
    setTimeline([
      {
        id: `t-${String(++timelineCounter)}`,
        at: new Date().toLocaleTimeString(),
        label: "Session created",
        type: "session:created",
      },
    ]);
    try {
      setDiagnostics(next.getRuntimeDiagnostics());
    } catch {
      setDiagnostics(null);
    }
    pushConsole("Session created", "success", "runtime");

    const unsub = attachSession(next, config);

    if (config.autoStart) {
      next.start();
      setRunning(true);
      setSnapshot(next.getSnapshot());
      pushConsole("Session started", "success", "runtime");
    } else {
      setRunning(false);
    }

    return () => {
      unsub();
      disposeCurrent();
    };
    // Structural config only — avoid recreate on pure UI toggles
  }, [
    config.modules.idle,
    config.modules.crossTab,
    config.idle.timeoutMs,
    config.idle.debounceMs,
    config.idle.useDefaultEvents,
    config.crossTab.channelName,
    config.crossTab.heartbeatInterval,
    config.crossTab.leaderTimeout,
    config.diagnostics.debug,
    config.emitInitialState,
    config.loggerPlugin,
    config.eventBufferSize,
    config.autoStart,
    recreateNonce,
  ]);

  const recreateSession = useCallback(() => {
    setRecreateNonce((n) => n + 1);
    pushConsole("Session recreate requested", "info", "runtime");
  }, [pushConsole]);

  const setConfig = useCallback((patch: SandboxConfigPatch) => {
    setConfigState((current) => mergeConfig(current, patch));
  }, []);

  const patchModules = useCallback((patch: Partial<SandboxConfig["modules"]>) => {
    setConfigState((current) => mergeConfig(current, { modules: patch }));
  }, []);

  const patchIdle = useCallback((patch: Partial<SandboxConfig["idle"]>) => {
    setConfigState((current) => mergeConfig(current, { idle: patch }));
  }, []);

  const patchCrossTab = useCallback((patch: Partial<SandboxConfig["crossTab"]>) => {
    setConfigState((current) => mergeConfig(current, { crossTab: patch }));
  }, []);

  const patchDiagnostics = useCallback((patch: Partial<SandboxConfig["diagnostics"]>) => {
    setConfigState((current) => mergeConfig(current, { diagnostics: patch }));
  }, []);

  const replaceConfig = useCallback((next: SandboxConfig) => {
    setConfigState(next);
  }, []);

  const startSession = useCallback(() => {
    const current = sessionRef.current;
    if (!current) {
      return;
    }
    if (!current.isRunning()) {
      current.start();
      setRunning(true);
      setSnapshot(current.getSnapshot());
      pushConsole("Session started", "success", "runtime");
      flashStatus("Started");
    }
  }, [flashStatus, pushConsole]);

  const stopSession = useCallback(() => {
    const current = sessionRef.current;
    if (!current) {
      return;
    }
    if (current.isRunning()) {
      current.stop();
      setRunning(false);
      setSnapshot(current.getSnapshot());
      pushConsole("Session stopped", "warn", "runtime");
      flashStatus("Stopped");
    }
  }, [flashStatus, pushConsole]);

  const resetSandbox = useCallback(() => {
    setSimulated(EMPTY_SIMULATED);
    setConfigState(DEFAULT_SANDBOX_CONFIG);
    pushConsole("Sandbox reset", "success", "sandbox");
    flashStatus("Reset");
  }, [flashStatus, pushConsole]);

  const copyText = useCallback(
    async (value: string, label: string) => {
      const ok = await copyTextToClipboard(value);
      pushConsole(
        ok ? `${label} copied` : `Copy failed: ${label}`,
        ok ? "success" : "error",
        "clipboard",
      );
      flashStatus(ok ? `${label} copied` : "Copy failed");
    },
    [flashStatus, pushConsole],
  );

  const clearConsole = useCallback(() => {
    setConsoleEntries([]);
  }, []);

  const clearTimeline = useCallback(() => {
    timelineApiRef.current?.clear();
    setTimeline([]);
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const exportConfig = useCallback(() => JSON.stringify(config, null, 2), [config]);

  const importConfig = useCallback(
    (raw: string) => {
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (!isConfigLike(parsed)) {
          throw new Error("Not a sandbox config object.");
        }
        setConfigState(mergeConfig(DEFAULT_SANDBOX_CONFIG, parsed));
        pushConsole("Imported configuration", "success", "import");
      } catch (caught) {
        pushConsole(caught instanceof Error ? caught.message : "Import failed", "error", "import");
      }
    },
    [pushConsole],
  );

  const simulate = useCallback(
    (action: SimulationAction) => {
      const result = runSimulation(action, config.mockSimulation);
      if (result.simulated) {
        setSimulated((current) => ({ ...current, ...result.simulated }));
      }
      pushConsole(result.message, result.ok ? "warn" : "error", "simulation");
      flashStatus(result.mode === "mock" ? "Simulated (mock)" : "Simulated");
    },
    [config.mockSimulation, flashStatus, pushConsole],
  );

  const generatedCode = useMemo(() => generateSandboxCode(config), [config]);

  const value: SandboxContextValue = {
    config,
    session,
    running,
    snapshot,
    previousSnapshot,
    diagnostics,
    events,
    consoleEntries,
    timeline,
    metricsSnapshot,
    timelineApiEnabled: config.modules.timeline,
    metricsApiEnabled: config.modules.metrics,
    simulated,
    workspaceTab,
    inspectorTab,
    generatedCode,
    docsBase: DOCS_BASE,
    statusMessage,
    consolePaused,
    eventFilter,
    setConfig,
    patchModules,
    patchIdle,
    patchCrossTab,
    patchDiagnostics,
    replaceConfig,
    startSession,
    stopSession,
    recreateSession,
    resetSandbox,
    copyText,
    setWorkspaceTab,
    setInspectorTab,
    clearConsole,
    clearTimeline,
    clearEvents,
    setConsolePaused,
    setEventFilter,
    exportConfig,
    importConfig,
    flashStatus,
    simulate,
  };

  return <SandboxContext.Provider value={value}>{children}</SandboxContext.Provider>;
}

export function useSandbox(): SandboxContextValue {
  const ctx = useContext(SandboxContext);
  if (!ctx) {
    throw new Error("useSandbox must be used within SandboxProvider");
  }
  return ctx;
}
