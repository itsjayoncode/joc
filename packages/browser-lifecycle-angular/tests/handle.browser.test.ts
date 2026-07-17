// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

import {
  createBrowserLifecycleHandle,
  resolveBrowserLifecycleBinding,
} from "@jayoncode/browser-lifecycle-angular";

describe("browser-lifecycle-angular", () => {
  it("owns a session and disposes on destroy", () => {
    const handle = createBrowserLifecycleHandle();
    expect(handle.lifecycle.isRunning()).toBe(true);
    const dispose = vi.spyOn(handle.lifecycle, "dispose");
    handle.destroy();
    expect(dispose).toHaveBeenCalled();
  });

  it("does not dispose an adopted lifecycle", () => {
    const lifecycle = createBrowserLifecycle({ autoStart: false });
    const dispose = vi.spyOn(lifecycle, "dispose");
    const handle = createBrowserLifecycleHandle({ lifecycle });
    handle.destroy();
    expect(dispose).not.toHaveBeenCalled();
    lifecycle.dispose();
  });

  it("updates snapshot signal when visibility changes", () => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });

    const handle = createBrowserLifecycleHandle();
    expect(handle.snapshot().visibility).toBe("visible");

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));

    expect(handle.snapshot().visibility).toBe("hidden");
    handle.destroy();
  });

  it("creates binding without starting when autoStart is false", () => {
    const binding = resolveBrowserLifecycleBinding({
      config: { autoStart: false },
    });
    expect(binding.owns).toBe(true);
    expect(binding.lifecycle.isRunning()).toBe(false);
    binding.lifecycle.dispose();
  });
});
