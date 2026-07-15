import { describe, expect, it } from "vitest";

import {
  filterFocusEventLog,
  CONNECTIVITY_PLAYGROUND_CONFIG,
  filterConnectivityEventLog,
  FOCUS_PLAYGROUND_CONFIG,
  formatConnectivityDuration,
  formatConnectivityEventLogEntry,
  formatFocusDuration,
  formatFocusEventLogEntry,
  formatVisibilityEventLogEntry,
  getConnectivityBrowserApiInfo,
  getConnectivityStatusLabel,
  getFocusBrowserApiInfo,
  getFocusStatusLabel,
  getVisibilityStatusLabel,
  isConnectivityPlaygroundSupported,
  isFocusPlaygroundSupported,
  isVisibilityPlaygroundSupported,
  serializeConnectivityEventLogEntry,
  serializeFocusEventLogEntry,
  sortConnectivityEventLogNewestFirst,
  sortFocusEventLogNewestFirst,
  sortVisibilityEventLog,
  VISIBILITY_PLAYGROUND_CONFIG,
} from "./browser-lifecycle.js";

describe("browser lifecycle integration", () => {
  it("uses a connectivity-focused playground config", () => {
    expect(CONNECTIVITY_PLAYGROUND_CONFIG).toEqual({
      autoStart: false,
      crossTab: false,
      emitInitialState: true,
    });
  });

  it("formats connectivity events for the playground log", () => {
    const entry = formatConnectivityEventLogEntry(
      {
        current: "offline",
        metadata: { advisory: true, reason: "offline" },
        previous: "online",
        snapshot: {} as never,
        source: "connectivity",
        timestamp: 1_700_000_000_000,
        type: "connection:offline",
      },
      {
        formatTimestamp: () => "12:00:00",
        id: "connectivity-1",
      },
    );

    expect(entry.type).toBe("connection:offline");
    expect(entry.reason).toBe("offline");
    expect(getConnectivityStatusLabel("online")).toBe("Online");
  });

  it("formats reconnect events with offline duration", () => {
    const entry = formatConnectivityEventLogEntry(
      {
        current: "online",
        metadata: { advisory: true, offlineDuration: 2_500 },
        previous: "offline",
        snapshot: {} as never,
        source: "connectivity",
        timestamp: 1_700_000_002_500,
        type: "connection:reconnect",
      },
      {
        formatTimestamp: () => "12:00:02",
      },
    );

    expect(entry.offlineDuration).toBe(2_500);
    expect(formatConnectivityDuration(2_500)).toBe("2s");
  });

  it("detects unsupported connectivity environments from snapshot capabilities", () => {
    expect(
      isConnectivityPlaygroundSupported({
        capabilities: {
          abortController: true,
          broadcastChannel: true,
          connectivity: false,
          idle: false,
          focus: false,
          pageLifecycle: false,
          requestIdleCallback: true,
          visibility: true,
        },
      }),
    ).toBe(false);
  });

  it("filters and sorts connectivity logs", () => {
    const sorted = sortConnectivityEventLogNewestFirst([
      {
        current: "online",
        id: "a",
        label: "connection:online",
        payloadSummary: "a",
        previous: "offline",
        source: "connectivity",
        timestamp: 10,
        timestampLabel: "00:10",
        type: "connection:online",
      },
      {
        current: "offline",
        id: "b",
        label: "connection:offline",
        payloadSummary: "b",
        previous: "online",
        source: "connectivity",
        timestamp: 20,
        timestampLabel: "00:20",
        type: "connection:offline",
      },
    ]);

    expect(sorted.map((entry) => entry.id)).toEqual(["b", "a"]);
    expect(
      filterConnectivityEventLog(sorted, "connection:offline").map((entry) => entry.id),
    ).toEqual(["b"]);
    expect(serializeConnectivityEventLogEntry(sorted[0]!)).toContain('"type": "connection:offline"');
  });

  it("reads connectivity browser API information from the integration layer", () => {
    const info = getConnectivityBrowserApiInfo({
      capabilities: {
        abortController: true,
        broadcastChannel: false,
        connectivity: true,
        focus: false,
        idle: false,
        pageLifecycle: false,
        requestIdleCallback: false,
        visibility: true,
      },
    });

    expect(info.connectivityCapability).toBe(true);
    expect(info.mappings).toHaveLength(4);
    expect(info.networkInformation.supported).toBe(false);
  });

  it("uses a focus-focused playground config", () => {
    expect(FOCUS_PLAYGROUND_CONFIG).toEqual({
      autoStart: false,
      crossTab: false,
      emitInitialState: true,
    });
  });

  it("formats focus events for the playground log", () => {
    const entry = formatFocusEventLogEntry(
      {
        current: "unfocused",
        metadata: { reason: "blur" },
        previous: "focused",
        snapshot: {} as never,
        source: "focus",
        timestamp: 1_700_000_000_000,
        type: "window:blur",
      },
      {
        formatTimestamp: () => "12:00:00",
        id: "focus-1",
      },
    );

    expect(entry).toEqual({
      current: "unfocused",
      id: "focus-1",
      label: "window:blur (blur)",
      payloadSummary: "focused → unfocused · source=focus · reason=blur",
      previous: "focused",
      reason: "blur",
      source: "focus",
      timestamp: 1_700_000_000_000,
      timestampLabel: "12:00:00",
      type: "window:blur",
    });
  });

  it("formats focus duration labels", () => {
    expect(formatFocusDuration(500)).toBe("500ms");
    expect(formatFocusDuration(4_500)).toBe("4s");
    expect(formatFocusDuration(65_000)).toBe("1m 5s");
  });

  it("detects unsupported focus environments from snapshot capabilities", () => {
    expect(
      isFocusPlaygroundSupported({
        capabilities: {
          abortController: true,
          broadcastChannel: true,
          connectivity: false,
          idle: false,
          focus: false,
          pageLifecycle: false,
          requestIdleCallback: true,
          visibility: true,
        },
      }),
    ).toBe(false);
  });

  it("sorts focus events newest first", () => {
    const sorted = sortFocusEventLogNewestFirst([
      {
        current: "focused",
        id: "a",
        label: "window:focus",
        payloadSummary: "a",
        previous: "unfocused",
        source: "focus",
        timestamp: 10,
        timestampLabel: "00:10",
        type: "window:focus",
      },
      {
        current: "unfocused",
        id: "b",
        label: "window:blur",
        payloadSummary: "b",
        previous: "focused",
        source: "focus",
        timestamp: 20,
        timestampLabel: "00:20",
        type: "window:blur",
      },
    ]);

    expect(sorted.map((entry) => entry.id)).toEqual(["b", "a"]);
  });

  it("filters focus event logs by query", () => {
    const filtered = filterFocusEventLog(
      [
        {
          current: "unfocused",
          id: "blur",
          label: "window:blur (blur)",
          payloadSummary: "focused → unfocused",
          previous: "focused",
          reason: "blur",
          source: "focus",
          timestamp: 1,
          timestampLabel: "00:01",
          type: "window:blur",
        },
      ],
      "window:blur",
    );

    expect(filtered).toHaveLength(1);
    expect(getFocusStatusLabel("focused")).toBe("Focused");
    expect(serializeFocusEventLogEntry(filtered[0]!)).toContain('"type": "window:blur"');
  });

  it("reads focus browser API information from the integration layer", () => {
    const info = getFocusBrowserApiInfo({
      capabilities: {
        abortController: true,
        broadcastChannel: false,
        connectivity: false,
        idle: false,
        focus: true,
        pageLifecycle: false,
        requestIdleCallback: false,
        visibility: true,
      },
    });

    expect(info.focusCapability).toBe(true);
    expect(info.mappings).toHaveLength(3);
  });

  it("uses a visibility-focused playground config", () => {
    expect(VISIBILITY_PLAYGROUND_CONFIG).toEqual({
      autoStart: false,
      crossTab: false,
      emitInitialState: true,
    });
  });

  it("formats visible events for the playground log", () => {
    const entry = formatVisibilityEventLogEntry(
      {
        current: "visible",
        metadata: { reason: "visibilitychange" },
        previous: "hidden",
        snapshot: {} as never,
        source: "visibility",
        timestamp: 1_700_000_000_000,
        type: "page:visible",
      },
      {
        formatTimestamp: () => "12:00:00",
        id: "event-1",
      },
    );

    expect(entry).toEqual({
      current: "visible",
      id: "event-1",
      label: "page:visible (visibilitychange)",
      previous: "hidden",
      reason: "visibilitychange",
      timestamp: 1_700_000_000_000,
      timestampLabel: "12:00:00",
      type: "page:visible",
    });
  });

  it("formats hidden events for the playground log", () => {
    const entry = formatVisibilityEventLogEntry(
      {
        current: "hidden",
        metadata: { likelyLastSignal: true, reason: "visibilitychange" },
        previous: "visible",
        snapshot: {} as never,
        source: "visibility",
        timestamp: 1_700_000_000_500,
        type: "page:hidden",
      },
      {
        formatTimestamp: () => "12:00:01",
        id: "event-2",
      },
    );

    expect(entry.likelyLastSignal).toBe(true);
    expect(entry.type).toBe("page:hidden");
    expect(getVisibilityStatusLabel("hidden")).toBe("Hidden");
  });

  it("detects unsupported visibility environments from snapshot capabilities", () => {
    expect(
      isVisibilityPlaygroundSupported({
        capabilities: {
          abortController: true,
          broadcastChannel: true,
          connectivity: false,
          idle: false,
          focus: false,
          pageLifecycle: false,
          requestIdleCallback: true,
          visibility: false,
        },
      }),
    ).toBe(false);
  });

  it("sorts event log entries chronologically", () => {
    const sorted = sortVisibilityEventLog([
      {
        current: "hidden",
        id: "b",
        label: "page:hidden",
        previous: "visible",
        timestamp: 20,
        timestampLabel: "00:20",
        type: "page:hidden",
      },
      {
        current: "visible",
        id: "a",
        label: "page:visible",
        previous: "unknown",
        timestamp: 10,
        timestampLabel: "00:10",
        type: "page:visible",
      },
    ]);

    expect(sorted.map((entry) => entry.id)).toEqual(["a", "b"]);
  });
});
