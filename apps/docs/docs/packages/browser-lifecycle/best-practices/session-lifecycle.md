# Session Lifecycle

## Recommended

Create one `createBrowserLifecycle()` instance per browser tab and drive it through explicit phases:

```ts
const lifecycle = createBrowserLifecycle({ autoStart: false });
lifecycle.start();
// ...
lifecycle.stop();
lifecycle.dispose();
```

## Not recommended

Creating a new session on every render or route change without disposing the previous instance.

## Trade-offs

`autoStart: true` is convenient for demos. `autoStart: false` gives tighter control when registering plugins first.

## Playground

Inspect phase transitions in the [Lifecycle Playground](/playground/browser-lifecycle/lifecycle).
