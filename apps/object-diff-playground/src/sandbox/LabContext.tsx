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

import { copyTextToClipboard, decodeLabShareHash } from "./clipboard.js";
import { computeLab, type LabComputeResult } from "./compute.js";
import { generateLabCode } from "./generate-code.js";
import {
  generateArrayReorderPair,
  generateDatasetPair,
  getLabTemplate,
  prettyJson,
  templateToJson,
} from "./templates.js";
import {
  DEFAULT_LAB_CONFIG,
  type InspectorTab,
  type LabBenchmarkRun,
  type LabConfig,
  type LabConsoleEntry,
  type SnapshotTemplateId,
  type WorkspaceTab,
} from "./types.js";
import { OBJECT_DIFF_DOCS_URL } from "../lib/playground-links.js";

interface LabContextValue {
  readonly config: LabConfig;
  readonly compute: LabComputeResult;
  readonly workspaceTab: WorkspaceTab;
  readonly inspectorTab: InspectorTab;
  readonly consoleEntries: readonly LabConsoleEntry[];
  readonly generatedCode: string;
  readonly docsBase: string;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly benchmarkHistory: readonly LabBenchmarkRun[];
  readonly statusMessage: string | null;
  setConfig: (patch: Partial<LabConfig>) => void;
  patchDiff: (patch: Partial<LabConfig["diff"]>) => void;
  patchPatch: (patch: Partial<LabConfig["patch"]>) => void;
  patchMerge: (patch: Partial<LabConfig["merge"]>) => void;
  patchPerformance: (patch: Partial<LabConfig["performance"]>) => void;
  replaceConfig: (next: LabConfig) => void;
  loadTemplate: (templateId: SnapshotTemplateId) => void;
  setSnapshotA: (value: string) => void;
  setSnapshotB: (value: string) => void;
  swapSnapshots: () => void;
  copyAtoB: () => void;
  resetLab: () => void;
  undo: () => void;
  redo: () => void;
  copyText: (value: string, label: string) => Promise<void>;
  setWorkspaceTab: (tab: WorkspaceTab) => void;
  setInspectorTab: (tab: InspectorTab) => void;
  clearConsole: () => void;
  exportExperiment: () => string;
  importExperiment: (raw: string) => void;
  flashStatus: (message: string) => void;
  runExperiment: (kind: ExperimentKind) => void;
  runBenchmark: (label: string) => void;
}

export type ExperimentKind =
  | "objects-100"
  | "objects-1000"
  | "objects-10000"
  | "large-arrays"
  | "nested"
  | "circular"
  | "random-changes"
  | "array-reorder"
  | "identity-changes"
  | "merge-conflicts"
  | "broken-json"
  | "stress";

const LabContext = createContext<LabContextValue | null>(null);

let consoleCounter = 0;
let benchCounter = 0;

const DOCS_BASE = OBJECT_DIFF_DOCS_URL.replace(/\/$/, "");
const HISTORY_LIMIT = 40;

function buildInitialConfig(): LabConfig {
  const template = getLabTemplate(DEFAULT_LAB_CONFIG.templateId);
  const json = templateToJson(template);
  return {
    ...DEFAULT_LAB_CONFIG,
    snapshotA: json.snapshotA,
    snapshotB: json.snapshotB,
    merge: { ...DEFAULT_LAB_CONFIG.merge, baseJson: json.baseJson },
  };
}

function isLabConfigLike(value: unknown): value is Partial<LabConfig> {
  return value !== null && typeof value === "object";
}

export function LabProvider({ children }: { readonly children: ReactNode }) {
  const [config, setConfigState] = useState<LabConfig>(() => {
    if (typeof window === "undefined") {
      return buildInitialConfig();
    }
    const shared = decodeLabShareHash(window.location.hash);
    if (isLabConfigLike(shared)) {
      const base = buildInitialConfig();
      return {
        ...base,
        ...shared,
        diff: { ...base.diff, ...(shared.diff ?? {}) },
        patch: { ...base.patch, ...(shared.patch ?? {}) },
        merge: { ...base.merge, ...(shared.merge ?? {}) },
        performance: { ...base.performance, ...(shared.performance ?? {}) },
      };
    }
    return buildInitialConfig();
  });

  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("raw");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("diff");
  const [consoleEntries, setConsoleEntries] = useState<readonly LabConsoleEntry[]>([]);
  const [benchmarkHistory, setBenchmarkHistory] = useState<readonly LabBenchmarkRun[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<readonly LabConfig[]>(() => [buildInitialConfig()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const skipHistory = useRef(false);

  const pushConsole = useCallback(
    (
      message: string,
      level: LabConsoleEntry["level"] = "info",
      category = "lab",
      extra?: { durationMs?: number; payload?: string },
    ) => {
      const entry: LabConsoleEntry = {
        id: `c-${String(++consoleCounter)}`,
        at: new Date().toLocaleTimeString(),
        level,
        category,
        message,
        ...(extra?.durationMs !== undefined ? { durationMs: extra.durationMs } : {}),
        ...(extra?.payload !== undefined ? { payload: extra.payload } : {}),
      };
      setConsoleEntries((current) => [entry, ...current].slice(0, 150));
    },
    [],
  );

  const flashStatus = useCallback((message: string) => {
    setStatusMessage(message);
    window.setTimeout(() => {
      setStatusMessage((current) => (current === message ? null : current));
    }, 2200);
  }, []);

  const commitConfig = useCallback(
    (next: LabConfig) => {
      setConfigState(next);
      if (skipHistory.current) {
        skipHistory.current = false;
        return;
      }
      setHistory((current) => {
        const trimmed = current.slice(0, historyIndex + 1);
        const updated = [...trimmed, next].slice(-HISTORY_LIMIT);
        setHistoryIndex(updated.length - 1);
        return updated;
      });
    },
    [historyIndex],
  );

  const setConfig = useCallback(
    (patch: Partial<LabConfig>) => {
      commitConfig({ ...config, ...patch });
    },
    [commitConfig, config],
  );

  const patchDiff = useCallback(
    (patch: Partial<LabConfig["diff"]>) => {
      commitConfig({ ...config, diff: { ...config.diff, ...patch } });
    },
    [commitConfig, config],
  );

  const patchPatch = useCallback(
    (patch: Partial<LabConfig["patch"]>) => {
      commitConfig({ ...config, patch: { ...config.patch, ...patch } });
    },
    [commitConfig, config],
  );

  const patchMerge = useCallback(
    (patch: Partial<LabConfig["merge"]>) => {
      commitConfig({ ...config, merge: { ...config.merge, ...patch } });
    },
    [commitConfig, config],
  );

  const patchPerformance = useCallback(
    (patch: Partial<LabConfig["performance"]>) => {
      commitConfig({ ...config, performance: { ...config.performance, ...patch } });
    },
    [commitConfig, config],
  );

  const replaceConfig = useCallback(
    (next: LabConfig) => {
      commitConfig(next);
    },
    [commitConfig],
  );

  const loadTemplate = useCallback(
    (templateId: SnapshotTemplateId) => {
      const template = getLabTemplate(templateId);
      const json = templateToJson(template);
      commitConfig({
        ...config,
        templateId,
        snapshotA: json.snapshotA,
        snapshotB: json.snapshotB,
        injectCircular: false,
        merge: { ...config.merge, baseJson: json.baseJson },
      });
      pushConsole(`Loaded template: ${template.label}`, "success", "template");
    },
    [commitConfig, config, pushConsole],
  );

  const setSnapshotA = useCallback(
    (value: string) => {
      commitConfig({ ...config, snapshotA: value });
    },
    [commitConfig, config],
  );

  const setSnapshotB = useCallback(
    (value: string) => {
      commitConfig({ ...config, snapshotB: value });
    },
    [commitConfig, config],
  );

  const swapSnapshots = useCallback(() => {
    commitConfig({
      ...config,
      snapshotA: config.snapshotB,
      snapshotB: config.snapshotA,
    });
    pushConsole("Swapped Snapshot A ↔ B", "info", "snapshot");
  }, [commitConfig, config, pushConsole]);

  const copyAtoB = useCallback(() => {
    commitConfig({ ...config, snapshotB: config.snapshotA });
    pushConsole("Copied Snapshot A → B", "info", "snapshot");
  }, [commitConfig, config, pushConsole]);

  const resetLab = useCallback(() => {
    const next = buildInitialConfig();
    commitConfig(next);
    pushConsole("Lab reset to default template", "success", "lab");
  }, [commitConfig, pushConsole]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) {
      return;
    }
    const nextIndex = historyIndex - 1;
    const entry = history[nextIndex];
    if (entry === undefined) {
      return;
    }
    skipHistory.current = true;
    setHistoryIndex(nextIndex);
    setConfigState(entry);
    pushConsole("Undo", "info", "history");
  }, [history, historyIndex, pushConsole]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) {
      return;
    }
    const nextIndex = historyIndex + 1;
    const entry = history[nextIndex];
    if (entry === undefined) {
      return;
    }
    skipHistory.current = true;
    setHistoryIndex(nextIndex);
    setConfigState(entry);
    pushConsole("Redo", "info", "history");
  }, [history, historyIndex, pushConsole]);

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

  const exportExperiment = useCallback(() => JSON.stringify(config, null, 2), [config]);

  const importExperiment = useCallback(
    (raw: string) => {
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (!isLabConfigLike(parsed)) {
          throw new Error("Not a lab config object.");
        }
        const base = buildInitialConfig();
        commitConfig({
          ...base,
          ...parsed,
          diff: { ...base.diff, ...(parsed.diff ?? {}) },
          patch: { ...base.patch, ...(parsed.patch ?? {}) },
          merge: { ...base.merge, ...(parsed.merge ?? {}) },
          performance: { ...base.performance, ...(parsed.performance ?? {}) },
        });
        pushConsole("Imported experiment JSON", "success", "import");
      } catch (caught) {
        pushConsole(caught instanceof Error ? caught.message : "Import failed", "error", "import");
      }
    },
    [commitConfig, pushConsole],
  );

  const runExperiment = useCallback(
    (kind: ExperimentKind) => {
      switch (kind) {
        case "objects-100":
        case "objects-1000":
        case "objects-10000": {
          const count = kind === "objects-100" ? 100 : kind === "objects-1000" ? 1000 : 10_000;
          const pair = generateDatasetPair(count);
          commitConfig({
            ...config,
            snapshotA: prettyJson(pair.before),
            snapshotB: prettyJson(pair.after),
            injectCircular: false,
            performance: {
              ...config.performance,
              largeDataset: count >= 1000,
              stressTest: count >= 10_000,
            },
          });
          pushConsole(`Generated ${String(count)} objects`, "success", "experiment");
          break;
        }
        case "large-arrays": {
          const before = { items: Array.from({ length: 500 }, (_, i) => i) };
          const after = {
            items: Array.from({ length: 500 }, (_, i) => (i % 9 === 0 ? i + 1 : i)).reverse(),
          };
          commitConfig({
            ...config,
            snapshotA: prettyJson(before),
            snapshotB: prettyJson(after),
            diff: { ...config.diff, detectMoves: true },
            injectCircular: false,
          });
          pushConsole("Generated large array reorder", "success", "experiment");
          break;
        }
        case "nested": {
          loadTemplate("deep-nested");
          break;
        }
        case "circular": {
          commitConfig({
            ...config,
            injectCircular: true,
            diff: { ...config.diff, circular: "skip" },
          });
          pushConsole("Circular refs injected (circular: skip)", "warn", "experiment");
          break;
        }
        case "random-changes": {
          try {
            const before = JSON.parse(config.snapshotA) as Record<string, unknown>;
            const after = structuredClone(before);
            after.__random = Math.random();
            after.stamp = Date.now();
            commitConfig({
              ...config,
              snapshotB: prettyJson(after),
              injectCircular: false,
            });
            pushConsole("Applied random changes to Snapshot B", "success", "experiment");
          } catch {
            pushConsole("Snapshot A must be valid JSON", "error", "experiment");
          }
          break;
        }
        case "array-reorder": {
          const pair = generateArrayReorderPair();
          commitConfig({
            ...config,
            snapshotA: prettyJson(pair.before),
            snapshotB: prettyJson(pair.after),
            diff: { ...config.diff, detectMoves: true, identityKey: "id" },
            injectCircular: false,
          });
          pushConsole("Array reorder with identityKey=id", "success", "experiment");
          break;
        }
        case "identity-changes": {
          const template = getLabTemplate("invoice");
          const json = templateToJson(template);
          commitConfig({
            ...config,
            templateId: "invoice",
            snapshotA: json.snapshotA,
            snapshotB: json.snapshotB,
            injectCircular: false,
            diff: { ...config.diff, identityKey: "id", detectMoves: true },
            merge: { ...config.merge, baseJson: json.baseJson },
          });
          pushConsole("Invoice template + identity matching", "success", "experiment");
          break;
        }
        case "merge-conflicts": {
          const base = { name: "Alex", score: 10, city: "Manila" };
          const left = { name: "Alex", score: 12, city: "Manila" };
          const right = { name: "Alexa", score: 10, city: "Cebu" };
          commitConfig({
            ...config,
            snapshotA: prettyJson(left),
            snapshotB: prettyJson(right),
            merge: {
              enabled: true,
              strategy: "manual",
              baseJson: prettyJson(base),
            },
            injectCircular: false,
          });
          setWorkspaceTab("merge");
          pushConsole("Merge conflict scenario loaded", "warn", "experiment");
          break;
        }
        case "broken-json": {
          commitConfig({
            ...config,
            snapshotB: '{ "broken": true,',
            injectCircular: false,
          });
          pushConsole("Injected broken JSON into Snapshot B", "warn", "experiment");
          break;
        }
        case "stress": {
          const pair = generateDatasetPair(5000);
          commitConfig({
            ...config,
            snapshotA: prettyJson(pair.before),
            snapshotB: prettyJson(pair.after),
            performance: { ...config.performance, stressTest: true, benchmarkMode: true },
            injectCircular: false,
          });
          pushConsole("Stress dataset (5,000 records)", "warn", "experiment");
          break;
        }
        default:
          break;
      }
    },
    [commitConfig, config, loadTemplate, pushConsole],
  );

  const compute = useMemo(() => computeLab(config), [config]);

  const runBenchmark = useCallback(
    (label: string) => {
      const result = computeLab(config);
      if (!result.ok) {
        pushConsole(`Benchmark failed: ${result.error}`, "error", "benchmark");
        return;
      }
      const run: LabBenchmarkRun = {
        id: `b-${String(++benchCounter)}`,
        at: new Date().toLocaleTimeString(),
        label,
        compareMs: result.timings.compareMs,
        patchMs: result.timings.patchMs,
        nodes: result.result.changes.length,
        ops: result.patchOps.length,
      };
      setBenchmarkHistory((current) => [run, ...current].slice(0, 30));
      pushConsole(
        `Benchmark ${label}: ${result.timings.compareMs.toFixed(2)}ms compare`,
        "success",
        "benchmark",
        { durationMs: result.timings.totalMs },
      );
    },
    [config, pushConsole],
  );

  const lastLogKey = useRef<string>("");

  useEffect(() => {
    const key = compute.ok
      ? `ok:${String(compute.result.metadata.changeCount)}:${compute.timings.compareMs.toFixed(2)}:${String(compute.patchOps.length)}`
      : `err:${compute.stage}:${compute.error}`;
    if (key === lastLogKey.current) {
      return;
    }
    lastLogKey.current = key;

    if (!compute.ok) {
      pushConsole(`${compute.stage}: ${compute.error}`, "error", compute.stage);
      return;
    }
    pushConsole(
      `Comparison complete — ${String(compute.result.metadata.changeCount)} changes`,
      "success",
      "diff",
      { durationMs: compute.timings.compareMs },
    );
    pushConsole(`Patch generated — ${String(compute.patchOps.length)} ops`, "info", "patch", {
      durationMs: compute.timings.patchMs,
    });
    if (compute.mergeResult) {
      const mergeExtra =
        compute.timings.mergeMs !== null ? { durationMs: compute.timings.mergeMs } : undefined;
      pushConsole(
        `Merge complete — ${String(compute.mergeResult.conflicts.length)} conflicts`,
        compute.mergeResult.conflicts.length > 0 ? "warn" : "success",
        "merge",
        mergeExtra,
      );
    }
  }, [compute, pushConsole]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const shared = decodeLabShareHash(window.location.hash);
    if (shared !== null) {
      pushConsole("Restored lab from share URL", "success", "share");
    }
  }, [pushConsole]);

  const generatedCode = useMemo(() => generateLabCode(config), [config]);

  const value: LabContextValue = {
    config,
    compute,
    workspaceTab,
    inspectorTab,
    consoleEntries,
    generatedCode,
    docsBase: DOCS_BASE,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    benchmarkHistory,
    statusMessage,
    setConfig,
    patchDiff,
    patchPatch,
    patchMerge,
    patchPerformance,
    replaceConfig,
    loadTemplate,
    setSnapshotA,
    setSnapshotB,
    swapSnapshots,
    copyAtoB,
    resetLab,
    undo,
    redo,
    copyText,
    setWorkspaceTab,
    setInspectorTab,
    clearConsole,
    exportExperiment,
    importExperiment,
    flashStatus,
    runExperiment,
    runBenchmark,
  };

  return <LabContext.Provider value={value}>{children}</LabContext.Provider>;
}

export function useLab(): LabContextValue {
  const ctx = useContext(LabContext);
  if (!ctx) {
    throw new Error("useLab must be used within LabProvider");
  }
  return ctx;
}
