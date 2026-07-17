# Background Sync

Resume synchronization when connectivity returns.

## Implementation

```ts
lifecycle.on("connection:offline", () => pauseSync());
lifecycle.on("connection:online", () => resumeSync());
lifecycle.on("connection:reconnect", () => flushQueue());
```

## Playground

[Connectivity Playground](/playground/browser-lifecycle/connectivity)
