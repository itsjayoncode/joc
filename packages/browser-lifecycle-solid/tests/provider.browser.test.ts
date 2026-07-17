// @vitest-environment jsdom

import { createRoot } from "solid-js";
import { describe, expect, it, vi } from "vitest";

import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
import {
  resolveBrowserLifecycleBinding,
  useOwnedBrowserLifecycle,
} from "@jayoncode/browser-lifecycle-solid";

describe("browser-lifecycle-solid", () => {
  it("owns a session and disposes on root dispose", () => {
    let disposeSpy: ReturnType<typeof vi.spyOn> | undefined;

    const dispose = createRoot((disposeRoot) => {
      const api = useOwnedBrowserLifecycle();
      expect(api.lifecycle.isRunning()).toBe(true);
      disposeSpy = vi.spyOn(api.lifecycle, "dispose");
      return disposeRoot;
    });

    dispose();
    expect(disposeSpy).toHaveBeenCalled();
  });

  it("does not dispose an adopted lifecycle", () => {
    const lifecycle = createBrowserLifecycle({ autoStart: false });
    const disposeSpy = vi.spyOn(lifecycle, "dispose");

    const dispose = createRoot((disposeRoot) => {
      useOwnedBrowserLifecycle({ lifecycle });
      return disposeRoot;
    });

    dispose();
    expect(disposeSpy).not.toHaveBeenCalled();
    lifecycle.dispose();
  });

  it("updates snapshot when visibility changes", () => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });

    const dispose = createRoot((disposeRoot) => {
      const api = useOwnedBrowserLifecycle();
      expect(api.snapshot().visibility).toBe("visible");

      Object.defineProperty(document, "visibilityState", {
        configurable: true,
        get: () => "hidden",
      });
      document.dispatchEvent(new Event("visibilitychange"));

      expect(api.snapshot().visibility).toBe("hidden");
      return disposeRoot;
    });

    dispose();
  });

  it("creates binding without starting", () => {
    const binding = resolveBrowserLifecycleBinding({ config: { autoStart: false } });
    expect(binding.lifecycle.isRunning()).toBe(false);
    binding.lifecycle.dispose();
  });
});
