import { createBrowserLifecycle } from "../../src/index.js";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
});

lifecycle.start();

const phase = lifecycle.getSnapshot().phase;
const visibility = lifecycle.getSnapshot().visibility;

lifecycle.dispose();

void phase;
void visibility;
