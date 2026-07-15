# Polling

Pause polling when the page is hidden.

## Implementation

```ts
let interval: ReturnType<typeof setInterval> | undefined;

function startPolling() {
  interval ??= setInterval(fetchLatest, 5_000);
}

function stopPolling() {
  if (interval) clearInterval(interval);
  interval = undefined;
}

lifecycle.on("page:visible", startPolling);
lifecycle.on("page:hidden", stopPolling);
```

## Playground

[Visibility Playground](http://127.0.0.1:4273/visibility)
