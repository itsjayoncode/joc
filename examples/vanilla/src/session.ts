import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

import type { BrowserLifecycle } from "@jayoncode/browser-lifecycle";

let lifecycle: BrowserLifecycle | undefined;

export function startBrowserSession(): BrowserLifecycle {
  lifecycle = createBrowserLifecycle({
    autoStart: false,
    crossTab: true,
    emitInitialState: true,
    idleTimeout: 30_000,
  });

  lifecycle.subscribe((event, snapshot) => {
    console.log(event.type, snapshot.phase);
  });

  lifecycle.on("page:visible", () => {
    console.log("resume work");
  });

  lifecycle.on("page:hidden", () => {
    console.log("pause work");
  });

  lifecycle.start();
  return lifecycle;
}

export function stopBrowserSession(): void {
  lifecycle?.stop();
  lifecycle?.dispose();
  lifecycle = undefined;
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    stopBrowserSession();
  });
}
