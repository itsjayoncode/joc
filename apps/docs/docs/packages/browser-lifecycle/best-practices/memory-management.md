# Memory Management

## Recommended

Store unsubscribe handles and call them during cleanup:

```ts
const stops = [lifecycle.on("page:visible", onVisible), lifecycle.on("page:hidden", onHidden)];

function cleanup() {
  for (const stop of stops) stop();
  void lifecycle.dispose();
}
```

## Not recommended

Registering anonymous listeners without a matching unsubscribe path.

## Production recommendation

Wire cleanup into framework teardown (`useEffect` return, `onUnmounted`, `ngOnDestroy`).
