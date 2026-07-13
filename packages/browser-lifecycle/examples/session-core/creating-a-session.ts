import { createBrowserLifecycle } from "../../src/index.js";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
});

const snapshot = lifecycle.getSnapshot();
const initialPhase = snapshot.phase;
const visibilitySupported = lifecycle.getCapabilities().visibility;

void initialPhase;
void visibilitySupported;

lifecycle.dispose();
