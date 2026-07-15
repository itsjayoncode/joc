import { describe, expect, it } from "vitest";

import {
  categorizeEvent,
  createEventExplorerRecord,
  exportEventRecords,
  filterEventExplorerRecords,
  getDefaultEventExplorerFilters,
} from "./playground-events.js";
import {
  formatPluginPublicEvent,
  mergePluginPlaygroundEvents,
  searchPluginPlaygroundEvents as searchPluginEvents,
} from "./playground-plugins.js";

import type { BrowserLifecycleEventMap, BrowserLifecycleSnapshot } from "@jayoncode/browser-lifecycle";

function createSnapshot(): BrowserLifecycleSnapshot {
  return {
    activity: "unknown",
    attention: "unknown",
    capabilities: {
      abortController: true,
      broadcastChannel: false,
      connectivity: true,
      focus: true,
      idle: true,
      pageLifecycle: false,
      requestIdleCallback: false,
      visibility: true,
    },
    connectivity: "unknown",
    lifecycle: "active",
    phase: "running",
    tab: "unknown",
    timestamps: {
      createdAt: 0,
      startedAt: 1,
      updatedAt: 0,
    },
    visibility: "visible",
  };
}

describe("playground-events", () => {
  it("categorizes and filters event records", () => {
    const event: BrowserLifecycleEventMap["page:visible"] = {
      current: "visible",
      metadata: { reason: "initial" },
      previous: "unknown",
      snapshot: createSnapshot(),
      source: "visibility",
      timestamp: 100,
      type: "page:visible",
    };
    const record = createEventExplorerRecord(event, createSnapshot(), 1, "session-1");

    expect(categorizeEvent("page:visible")).toBe("visibility");
    expect(record.module).toBe("visibility");

    const filtered = filterEventExplorerRecords([record], {
      ...getDefaultEventExplorerFilters(),
      categories: ["visibility"],
      query: "visible",
    });

    expect(filtered).toHaveLength(1);
    expect(exportEventRecords(filtered, "txt")).toContain("page:visible");
  });
});

describe("playground-plugins", () => {
  it("formats plugin events and supports search", () => {
    const event: BrowserLifecycleEventMap["plugin:registered"] = {
      current: "registered",
      metadata: { pluginId: "logger" },
      previous: undefined,
      snapshot: createSnapshot(),
      source: "plugin",
      timestamp: 200,
      type: "plugin:registered",
    };

    const formatted = formatPluginPublicEvent(event);
    const merged = mergePluginPlaygroundEvents([], [formatted]);
    const results = searchPluginEvents(merged, "logger");

    expect(results).toHaveLength(1);
    expect(formatted.type).toBe("Plugin Registered");
  });
});

describe("playground-state", () => {
  it("computes state diffs and module cards", async () => {
    const { computeStateDiff, getModuleStateCards, getSessionOverview } = await import("./playground-state.js");
    const previous = createSnapshot();
    const current = {
      ...createSnapshot(),
      visibility: "hidden" as const,
    };

    const diff = computeStateDiff(previous, current);
    expect(diff.some((entry) => entry.path.includes("visibility"))).toBe(true);
    expect(getModuleStateCards(current, { visibility: 2 }, previous)[0]?.current).toBe("hidden");
    expect(getSessionOverview(current, "session-1", true).moduleCount).toBeGreaterThan(0);
  });
});

describe("playground-performance", () => {
  it("builds performance metrics from runtime diagnostics", async () => {
    const { buildPerformanceMetricsSnapshot, incrementCategoryCount, percentile } = await import(
      "./playground-performance.js"
    );
    const { createBrowserLifecycle } = await import("@jayoncode/browser-lifecycle");

    const lifecycle = createBrowserLifecycle({ autoStart: false });
    lifecycle.start();
    const metrics = buildPerformanceMetricsSnapshot({
      diagnostics: lifecycle.getRuntimeDiagnostics(),
      dispatchSamples: [{ durationMs: 2, event: "session:started", id: "1", timestamp: Date.now() }],
      droppedEvents: 0,
      eventCounts: incrementCategoryCount({}, "session:started"),
      peakEventRate: 1,
      snapshotJson: lifecycle.getSnapshot(),
    });

    expect(metrics.totalEvents).toBe(1);
    expect(percentile([1, 2, 10], 0.95)).toBeGreaterThan(0);
    lifecycle.dispose();
  });
});

describe("playground-developer-tools", () => {
  it("exposes browser api inspector entries", async () => {
    const { getBrowserApiInspectorEntries } = await import("./playground-developer-tools.js");
    expect(getBrowserApiInspectorEntries().length).toBeGreaterThan(5);
  });
});

describe("playground-configuration", () => {
  it("validates and diffs configuration", async () => {
    const {
      buildPendingConfigurationInput,
      computeConfigurationDiff,
      getDefaultConfiguration,
      toConfigurationInput,
      validatePlaygroundConfiguration,
    } = await import("./playground-configuration.js");

    const defaults = getDefaultConfiguration();
    expect(validatePlaygroundConfiguration({ autoStart: false }).valid).toBe(true);
    expect(validatePlaygroundConfiguration({ eventBufferSize: -1 }).valid).toBe(false);
    expect(validatePlaygroundConfiguration(buildPendingConfigurationInput(defaults, {})).valid).toBe(true);

    const diff = computeConfigurationDiff(defaults, {
      ...defaults,
      debug: true,
    });
    expect(diff.some((entry) => entry.path.includes("debug"))).toBe(true);
    expect(toConfigurationInput(defaults).crossTab).not.toHaveProperty("enabled");
  });
});
