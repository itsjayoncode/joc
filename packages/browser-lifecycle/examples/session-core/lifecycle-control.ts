import { createBrowserLifecycle } from "../../src/index.js";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
});

lifecycle.start();
const running = lifecycle.isRunning();

lifecycle.stop();
const phaseAfterStop = lifecycle.getSnapshot().phase;

lifecycle.dispose();
const phaseAfterDispose = lifecycle.getSnapshot().phase;

void running;
void phaseAfterStop;
void phaseAfterDispose;
