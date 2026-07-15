import { createBrowserLifecycle } from "../../src/index.js";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
});

const workState = {
  paused: true,
};

const unsubscribe = lifecycle.on("page:visible", () => {
  workState.paused = false;
});

lifecycle.start();

unsubscribe();
lifecycle.dispose();

void workState;
