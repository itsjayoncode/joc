# Page Tracking

Measure how long users spend with the page visible.

## Implementation

```ts
let visibleSince: number | undefined;

lifecycle.on("page:visible", () => {
  visibleSince = Date.now();
});

lifecycle.on("page:hidden", () => {
  if (visibleSince) {
    trackDuration(Date.now() - visibleSince);
    visibleSince = undefined;
  }
});
```

## Playground

[Visibility Playground](/playground/browser-lifecycle/visibility)
