# Idle FAQ

## What triggers idle state?

A positive `idleTimeout` (milliseconds) and no matching activity events for that duration. Default `idleTimeout: false` means idle observation is off.

## Example

```ts
const lifecycle = createBrowserLifecycle({
  idleTimeout: 60_000,
  activityDebounce: 250,
});
```

See [Idle](/packages/browser-lifecycle/modules/idle) for `activityEvents`, `session:idle` / `session:active`, and snapshot fields.

## Playground

[Idle Playground](/playground/browser-lifecycle/idle)
