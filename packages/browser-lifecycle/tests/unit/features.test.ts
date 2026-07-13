import {
  detectBrowserLifecycleCapabilities,
  supportsAbortController,
  supportsBroadcastChannel,
  supportsPageLifecycle,
  supportsRequestIdleCallback,
  supportsVisibility,
  type BrowserFeatureEnvironment,
} from "@jayoncode/browser-lifecycle";
import { describe, expect, it } from "vitest";

describe("feature detection", () => {
  it("returns false for missing capabilities", () => {
    const environment: BrowserFeatureEnvironment = {};

    expect(supportsVisibility(environment)).toBe(false);
    expect(supportsBroadcastChannel(environment)).toBe(false);
    expect(supportsPageLifecycle(environment)).toBe(false);
    expect(supportsRequestIdleCallback(environment)).toBe(false);
    expect(supportsAbortController(environment)).toBe(false);
    expect(detectBrowserLifecycleCapabilities(environment)).toEqual({
      abortController: false,
      broadcastChannel: false,
      pageLifecycle: false,
      requestIdleCallback: false,
      visibility: false,
    });
  });

  it("detects a fully capable environment", () => {
    const environment: BrowserFeatureEnvironment = {
      AbortController: function AbortControllerMock() {},
      BroadcastChannel: function BroadcastChannelMock() {},
      document: {
        hidden: false,
        visibilityState: "visible",
      },
      requestIdleCallback: () => 1,
      window: {
        onpagehide: null,
        onpageshow: null,
      },
    };

    expect(supportsVisibility(environment)).toBe(true);
    expect(supportsBroadcastChannel(environment)).toBe(true);
    expect(supportsPageLifecycle(environment)).toBe(true);
    expect(supportsRequestIdleCallback(environment)).toBe(true);
    expect(supportsAbortController(environment)).toBe(true);
    expect(detectBrowserLifecycleCapabilities(environment)).toEqual({
      abortController: true,
      broadcastChannel: true,
      pageLifecycle: true,
      requestIdleCallback: true,
      visibility: true,
    });
  });

  it("uses the default environment when no argument is provided", () => {
    expect(supportsVisibility()).toBe(false);
    expect(supportsPageLifecycle()).toBe(false);
    expect(supportsRequestIdleCallback()).toBe(false);
    expect(supportsAbortController()).toBe(true);
  });
});
