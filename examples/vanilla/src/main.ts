import { startBrowserSession } from "./session.js";

const status = document.querySelector<HTMLElement>("#status");

const lifecycle = startBrowserSession();
status?.replaceChildren(
  document.createTextNode(`Browser Lifecycle phase: ${lifecycle.getSnapshot().phase}`),
);

lifecycle.subscribe((_event, snapshot) => {
  status?.replaceChildren(document.createTextNode(`Browser Lifecycle phase: ${snapshot.phase}`));
});
