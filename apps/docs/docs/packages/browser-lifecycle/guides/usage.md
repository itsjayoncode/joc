# Usage Guide

This guide explains how to adopt Browser Lifecycle in production applications.

## Installation

See [Installation](/packages/browser-lifecycle/installation).

## Initialization

Create a single lifecycle instance per browser context (tab or embedded surface):

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({
  autoStart: true,
});
```

Use `autoStart: false` when you need to register plugins or listeners before the session begins observing browser signals.

## Configuration

Pass a partial configuration object. Browser Lifecycle merges it with defaults and validates the result:

```ts
const lifecycle = createBrowserLifecycle({
  autoStart: true,
  idleTimeout: 60_000, // enable idle (default false = off)
  crossTab: true,
});
```

Configuration changes require a session restart. Full option table: [Core infrastructure](/packages/browser-lifecycle/modules/core-infrastructure). Validate pending configuration in the [Configuration Playground](/playground/browser-lifecycle/configuration).

## Lifecycle control

```ts
lifecycle.start();
lifecycle.stop();
lifecycle.dispose();
```

`start()`, `stop()`, and `dispose()` are synchronous. `dispose()` is terminal — after disposal, the instance must not be reused.

## Event subscriptions

Subscribe to named public events:

```ts
const unsubscribe = lifecycle.on("page:visible", (event) => {
  console.log(event.metadata);
});

unsubscribe();
```

Subscribe to the full event feed for debugging:

```ts
lifecycle.subscribe((event, snapshot) => {
  console.log(event.type, event.timestamp, snapshot.visibility);
});
```

Explore event ordering in the [Event Explorer](/playground/browser-lifecycle/events).

## Cleanup

Always unsubscribe listeners and dispose the session when the owning surface unmounts:

```ts
const stopVisible = lifecycle.on("page:visible", handler);
const stopHidden = lifecycle.on("page:hidden", handler);

function cleanup() {
  stopVisible();
  stopHidden();
  void lifecycle.dispose();
}
```

## SSR

Do not call `createBrowserLifecycle()` during server rendering. Initialize on the client after hydration. Use `isBrowser()` and `detectBrowserLifecycleCapabilities()` to branch safely.

## Error handling

Browser Lifecycle throws typed errors:

- `ConfigurationError` — invalid configuration
- `LifecycleError` — invalid lifecycle transitions
- `InitializationError` — startup failures
- `PluginError` — plugin hook failures

Wrap initialization in application-level error boundaries and log plugin failures through `plugin:error` events.

## Related documentation

- [Configuration](/packages/browser-lifecycle/guides/configuration)
- [SSR](/packages/browser-lifecycle/guides/ssr)
- [Error Handling](/packages/browser-lifecycle/guides/error-handling)
- [Deployment](/packages/browser-lifecycle/guides/deployment)
- [Best Practices](/packages/browser-lifecycle/best-practices/)
- [FAQ](/packages/browser-lifecycle/faq/)
