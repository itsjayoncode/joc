import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

export function createPwaBrowserLifecycle() {
  const lifecycle = createBrowserLifecycle({
    autoStart: false,
    emitInitialState: true,
    idleTimeout: 60_000,
  });

  lifecycle.on("connection:offline", () => {
    console.log("queue writes until online");
  });

  lifecycle.on("connection:online", () => {
    console.log("flush queued writes");
  });

  lifecycle.on("page:visible", () => {
    console.log("refresh stale client state");
  });

  lifecycle.start();
  return lifecycle;
}
