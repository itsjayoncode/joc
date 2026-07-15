# Plugin Architecture

Extend Browser Lifecycle with focused plugins.

## Implementation

```ts
lifecycle.registerPlugin({
  id: "telemetry",
  onStart(ctx) {
    ctx.log("telemetry started");
  },
  onEvent(event) {
    if (event.name === "page:hidden") {
      flushTelemetry();
    }
  },
});
```

## Best practices

[Plugin Development](/best-practices/plugin-development)

## Playground

[Plugin Playground](http://127.0.0.1:4273/plugins)
