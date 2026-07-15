# Analytics

Emit analytics only when the page is visible and the user is active.

## Implementation

```ts
function track(name: string, payload: Record<string, unknown>) {
  const snapshot = lifecycle.getSnapshot();
  if (snapshot.page.visibility !== "visible") return;
  if (snapshot.session.activity === "idle") return;
  analytics.track(name, payload);
}
```

## Playground

[Visibility Playground](http://127.0.0.1:4273/visibility) · [Idle Playground](http://127.0.0.1:4273/idle)
