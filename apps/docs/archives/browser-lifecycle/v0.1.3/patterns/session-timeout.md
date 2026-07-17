# Session Timeout

Warn users before an authenticated session expires.

## Implementation

Combine idle detection with application timers:

```ts
lifecycle.on("session:idle", () => showTimeoutWarning());
lifecycle.on("session:active", () => hideTimeoutWarning());
```

## Best practices

Reset the warning when the user interacts; do not rely on idle alone for security logout.

## Playground

[Idle Playground](/playground/browser-lifecycle/idle)
