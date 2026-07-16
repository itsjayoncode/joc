# Background Sync

Resume synchronization when connectivity returns.

## Implementation

```ts
lifecycle.on("connection:offline", () => pauseSync());
lifecycle.on("connection:online", () => resumeSync());
lifecycle.on("connection:reconnect", () => flushQueue());
```

## Playground

[Connectivity Playground](http://127.0.0.1:4273/connectivity)
