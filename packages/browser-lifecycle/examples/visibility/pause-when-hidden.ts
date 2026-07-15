import { createBrowserLifecycle } from "../../src/index.js";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
});

const workState = {
  paused: false,
};

const unsubscribe = lifecycle.on("page:hidden", () => {
  workState.paused = true;
});

lifecycle.start();

unsubscribe();
lifecycle.dispose();

void workState;
