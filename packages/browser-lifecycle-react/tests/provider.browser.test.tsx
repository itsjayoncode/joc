// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

import {
  BrowserLifecycleProvider,
  useBrowserLifecycle,
  useBrowserLifecycleSnapshot,
  useOwnedBrowserLifecycle,
} from "@jayoncode/browser-lifecycle-react";

function SnapshotProbe() {
  const visibility = useBrowserLifecycleSnapshot((s) => s.visibility);
  const lifecycle = useBrowserLifecycle();
  return (
    <div>
      <span data-testid="visibility">{visibility}</span>
      <span data-testid="running">{String(lifecycle.isRunning())}</span>
    </div>
  );
}

function OwnedProbe({
  onReady,
}: {
  onReady: (lifecycle: ReturnType<typeof createBrowserLifecycle>) => void;
}) {
  const { lifecycle } = useOwnedBrowserLifecycle();
  onReady(lifecycle);
  return <span data-testid="owned-running">{String(lifecycle.isRunning())}</span>;
}

describe("browser-lifecycle-react", () => {
  afterEach(() => {
    cleanup();
  });

  it("owns a session, starts on mount, and disposes on unmount", async () => {
    const { unmount } = render(
      <BrowserLifecycleProvider>
        <SnapshotProbe />
      </BrowserLifecycleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("running").textContent).toBe("true");
    });

    unmount();
  });

  it("does not dispose an adopted lifecycle", () => {
    const lifecycle = createBrowserLifecycle({ autoStart: false });
    const dispose = vi.spyOn(lifecycle, "dispose");

    const { unmount } = render(
      <BrowserLifecycleProvider lifecycle={lifecycle}>
        <SnapshotProbe />
      </BrowserLifecycleProvider>,
    );

    unmount();
    expect(dispose).not.toHaveBeenCalled();
    lifecycle.dispose();
  });

  it("updates snapshot when visibility changes", async () => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "visible",
    });

    render(
      <BrowserLifecycleProvider>
        <SnapshotProbe />
      </BrowserLifecycleProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("visibility").textContent).toBe("visible");
    });

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));

    await waitFor(() => {
      expect(screen.getByTestId("visibility").textContent).toBe("hidden");
    });
  });

  it("supports owned hook without provider", async () => {
    let owned: ReturnType<typeof createBrowserLifecycle> | undefined;
    const { unmount } = render(
      <OwnedProbe
        onReady={(lifecycle) => {
          owned = lifecycle;
        }}
      />,
    );

    await waitFor(() => {
      expect(owned?.isRunning()).toBe(true);
    });

    const dispose = vi.spyOn(owned!, "dispose");
    unmount();
    expect(dispose).toHaveBeenCalled();
  });
});
