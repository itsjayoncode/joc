import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
  emitInitialState: true,
});

lifecycle.on("window:focus", () => {
  console.log("renderer focused");
});

lifecycle.on("window:blur", () => {
  console.log("renderer blurred");
});

lifecycle.start();

window.addEventListener("beforeunload", () => {
  lifecycle.dispose();
});
