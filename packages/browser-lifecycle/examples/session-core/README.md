# Session Core Examples

These examples cover the Session Core introduced in Phase `2.2.2`.

## Create a Session

See [`creating-a-session.ts`](./creating-a-session.ts).

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
});
```

## Start, Stop, and Dispose

See [`lifecycle-control.ts`](./lifecycle-control.ts).

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
});

lifecycle.start();
lifecycle.stop();
lifecycle.dispose();
```

## Listen for Session Events

See [`listening-for-events.ts`](./listening-for-events.ts).

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
});

lifecycle.on("session:started", (event) => {
  console.log(event.current);
});

lifecycle.subscribe((event, snapshot) => {
  console.log(event.type, snapshot.phase);
});
```

## Register a Mock Module

See [`registering-a-mock-module.ts`](./registering-a-mock-module.ts).

This example uses internal session files because module registration is an internal extension point for future Browser Lifecycle modules, not a public root export.
