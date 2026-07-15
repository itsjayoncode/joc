# Intermediate Tutorial

Combine visibility, idle detection, and plugins in one session.

## Goal

Pause background work when the page is hidden or the user is idle.

## Step 1 — Configure modules

```ts
const lifecycle = createBrowserLifecycle({
  autoStart: false,
  visibility: { enabled: true },
  idle: { enabled: true, thresholdMs: 30_000 },
});
```

## Step 2 — Register a plugin

```ts
lifecycle.registerPlugin({
  id: "background-worker",
  onStart() {
    console.log("worker started");
  },
  onStop() {
    console.log("worker stopped");
  },
});
```

## Step 3 — Coordinate pause and resume

```ts
let paused = false;

function pause() {
  if (paused) return;
  paused = true;
  void lifecycle.stop();
}

function resume() {
  if (!paused) return;
  paused = false;
  void lifecycle.start();
}

lifecycle.on("page:hidden", pause);
lifecycle.on("session:idle", pause);
lifecycle.on("page:visible", resume);
lifecycle.on("session:active", resume);
```

## Step 4 — Start the session

```ts
await lifecycle.start();
```

## Expected behavior

- Switching away from the tab pauses the session
- Thirty seconds without interaction triggers idle pause
- Returning to the tab or interacting resumes work

## Explore further

- [Idle Playground](http://127.0.0.1:4273/idle)
- [Plugin Playground](http://127.0.0.1:4273/plugins)
- [Pattern — Visibility Pause](/packages/browser-lifecycle/patterns/visibility-pause)

## Next tutorial

[Advanced Tutorial](/packages/browser-lifecycle/tutorials/advanced)
