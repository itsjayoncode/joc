// @vitest-environment jsdom

import { get } from "svelte/store";
import { describe, expect, it, vi } from "vitest";

import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
import {
  createOwnedBrowserLifecycle,
  resolveBrowserLifecycleBinding,
} from "@jayoncode/browser-lifecycle-svelte";

describe("browser-lifecycle-svelte", () => {
  it("owns a session and disposes on destroy", () => {
    const api = createOwnedBrowserLifecycle();
    expect(api.lifecycle.isRunning()).toBe(true);
    const dispose = vi.spyOn(api.lifecycle, "dispose");
    api.destroy();
    expect(dispose).toHaveBeenCalled();
  });

  it("does not dispose an adopted lifecycle", () => {
    const lifecycle = createBrowserLifecycle({ autoStart: false });
    const dispose = vi.spyOn(lifecycle, "dispose");
    const api = createOwnedBrowserLifecycle({ lifecycle });
    api.destroy();
    expect(dispose).not.toHaveBeenCalled();
    lifecycle.dispose();
  });

  it("updates snapshot store when visibility changes", () => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });

    const api = createOwnedBrowserLifecycle();
    expect(get(api.snapshot).visibility).toBe("visible");

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));

    expect(get(api.snapshot).visibility).toBe("hidden");
    api.destroy();
  });

  it("creates binding without starting when autoStart is false", () => {
    const binding = resolveBrowserLifecycleBinding({ config: { autoStart: false } });
    expect(binding.lifecycle.isRunning()).toBe(false);
    binding.lifecycle.dispose();
  });
});
