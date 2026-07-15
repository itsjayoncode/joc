# Focus Resume

Resume attention-sensitive UI when the window regains focus.

## Implementation

```ts
lifecycle.on("window:focus", () => refreshStaleData());
lifecycle.on("window:blur", () => cancelTooltips());
```

## Playground

[Focus Playground](http://127.0.0.1:4273/focus)
