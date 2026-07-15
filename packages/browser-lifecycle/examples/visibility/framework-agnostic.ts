import { createBrowserLifecycle } from "../../src/index.js";

function createVisibilityController() {
  const lifecycle = createBrowserLifecycle({
    autoStart: false,
    emitInitialState: true,
  });
  let latestVisibility = lifecycle.getSnapshot().visibility;

  const unsubscribe = lifecycle.subscribe((event, snapshot) => {
    if (event.type === "page:visible" || event.type === "page:hidden") {
      latestVisibility = snapshot.visibility;
    }
  });

  return {
    dispose(): void {
      unsubscribe();
      lifecycle.dispose();
    },
    readVisibility(): string {
      return latestVisibility;
    },
    start(): void {
      lifecycle.start();
    },
    stop(): void {
      lifecycle.stop();
    },
  };
}

const controller = createVisibilityController();

controller.start();
const latestVisibility = controller.readVisibility();
controller.dispose();

void latestVisibility;
