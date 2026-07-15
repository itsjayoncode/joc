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
  visibility: { enabled: true },
  focus: { enabled: true },
  connectivity: { enabled: true },
  idle: { enabled: true, thresholdMs: 60_000 },
  crossTab: { enabled: true },
});
```

Configuration changes require a session restart. Validate pending configuration in the [Configuration Playground](http://127.0.0.1:4273/configuration).

## Lifecycle control

```ts
await lifecycle.start();
await lifecycle.stop();
await lifecycle.dispose();
```

`dispose()` is terminal. After disposal, the instance must not be reused.

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
lifecycle.onEvent((event) => {
  console.log(event.name, event.timestamp);
});
```

Explore event ordering in the [Event Explorer](http://127.0.0.1:4273/events).

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

- [Configuration](/guides/browser-lifecycle/configuration)
- [SSR](/guides/browser-lifecycle/ssr)
- [Error Handling](/guides/browser-lifecycle/error-handling)
- [Deployment](/guides/browser-lifecycle/deployment)
- [Best Practices](/best-practices/)
- [FAQ](/faq/)
