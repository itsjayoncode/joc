# Beginner Tutorial

Learn Browser Lifecycle by building a visibility-aware logger.

## Goal

Log when the page becomes visible or hidden and clean up when the demo unmounts.

## Step 1 — Create the session

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true });
```

## Step 2 — Subscribe to events

```ts
const logs: string[] = [];

const stopVisible = lifecycle.on("page:visible", () => {
  logs.push(`visible @ ${Date.now()}`);
});

const stopHidden = lifecycle.on("page:hidden", () => {
  logs.push(`hidden @ ${Date.now()}`);
});
```

**Expected output:** Switching tabs appends timestamped entries to `logs`.

## Step 3 — Inspect state

```ts
console.log(lifecycle.getSnapshot().page.visibility);
```

## Step 4 — Clean up

```ts
stopVisible();
stopHidden();
await lifecycle.dispose();
```

## Common mistakes

- Creating the session during SSR
- Forgetting to call unsubscribe functions
- Assuming `page:hidden` means the user left the site (it may be another tab)

## Try it live

Open the [Visibility Playground](http://127.0.0.1:4273/visibility).

## Next tutorial

[Intermediate Tutorial](/tutorials/intermediate)
