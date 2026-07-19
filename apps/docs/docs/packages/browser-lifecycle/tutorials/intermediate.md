# Intermediate Tutorial

Combine visibility, idle detection, and plugins in one session.

## Goal

Pause background work when the page is hidden or the user is idle.

## Step 1 — Configure modules

```ts
const lifecycle = createBrowserLifecycle({
  autoStart: false,
  idleTimeout: 30_000,
});
```

## Step 2 — Register a plugin

```ts
lifecycle.use({
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

- [Idle Playground](/playground/browser-lifecycle/idle)
- [Plugin Playground](/playground/browser-lifecycle/plugins)
- [Pattern — Visibility Pause](/packages/browser-lifecycle/patterns/visibility-pause)

## Next tutorial

[Advanced Tutorial](/packages/browser-lifecycle/tutorials/advanced)
