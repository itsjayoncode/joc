# Idle FAQ

## What triggers idle state?

Configured thresholds and detected user inactivity.

## Example

```ts
const lifecycle = createBrowserLifecycle({
  idle: { enabled: true, thresholdMs: 60_000 },
});
```

## Playground

[Idle Playground](/playground/browser-lifecycle/idle)
