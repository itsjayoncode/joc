import { BrowserLifecycleSession } from "../../src/core/session/index.js";

import type { SessionModule } from "../../src/core/session/index.js";

const lifecycle = new BrowserLifecycleSession({
  autoStart: false,
});

const mockModule: SessionModule = {
  id: "mock-visibility-module",
  initialize(context) {
    context.logger.debug("initialize mock module", {
      phase: context.getSnapshot().phase,
    });
  },
  start(context) {
    context.updateSnapshot((snapshot) => ({
      ...snapshot,
      visibility: "visible",
      timestamps: {
        ...snapshot.timestamps,
        lastEventAt: snapshot.timestamps.updatedAt,
      },
    }));
  },
  stop(context) {
    context.logger.debug("stop mock module", {
      phase: context.getSnapshot().phase,
    });
  },
};

lifecycle.registerModule(mockModule);
lifecycle.start();

const visibility = lifecycle.getSnapshot().visibility;

lifecycle.dispose();

void visibility;
