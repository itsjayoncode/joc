import { createBrowserLifecycle } from "../../src/index.js";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
});
const namedEvents: string[] = [];
const feedEvents: string[] = [];

const unsubscribeStarted = lifecycle.on("session:started", (event) => {
  namedEvents.push(`${event.type}:${event.current}:${event.previous}`);
});

const unsubscribeFeed = lifecycle.subscribe((event, snapshot) => {
  feedEvents.push(`${event.type}:${snapshot.phase}`);
});

lifecycle.start();
lifecycle.stop();

unsubscribeStarted();
unsubscribeFeed();
lifecycle.dispose();

void namedEvents;
void feedEvents;
