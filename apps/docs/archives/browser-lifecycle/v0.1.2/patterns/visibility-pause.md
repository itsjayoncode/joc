# Visibility Pause

Pause expensive work when the document is hidden.

## Implementation

```ts
lifecycle.on("page:hidden", () => worker.pause());
lifecycle.on("page:visible", () => worker.resume());
```

## Performance

Reduces CPU, network, and battery use for background tabs.

## Playground

[Visibility Playground](/playground/browser-lifecycle/visibility)
