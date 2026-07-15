import { createBrowserLifecycle } from "../../src/index.js";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
  emitInitialState: true,
});
const eventLog: string[] = [];

const unsubscribeVisible = lifecycle.on("page:visible", (event) => {
  eventLog.push(`${event.type}:${event.metadata.reason}`);
});
const unsubscribeHidden = lifecycle.on("page:hidden", (event) => {
  eventLog.push(`${event.type}:${String(event.metadata.likelyLastSignal)}`);
});

lifecycle.start();

unsubscribeVisible();
unsubscribeHidden();
lifecycle.dispose();

void eventLog;
