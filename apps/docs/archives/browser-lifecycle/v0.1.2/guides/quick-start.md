# Quick Start

Get a Browser Lifecycle session running in under five minutes.

## 1. Install

```bash
pnpm add @jayoncode/browser-lifecycle
```

## 2. Create a session

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true });
```

**Expected output:** No console output yet. The session starts in the `running` phase.

## 3. React to visibility

```ts
lifecycle.on("page:visible", () => {
  console.log("visible");
});

lifecycle.on("page:hidden", () => {
  console.log("hidden");
});
```

Switch browser tabs to trigger events. Try the [Visibility Playground](http://127.0.0.1:4273/visibility) to inspect ordering and metadata.

## 4. Read snapshot state

```ts
const snapshot = lifecycle.getSnapshot();
console.log(snapshot.page.visibility);
```

## 5. Clean up

```ts
await lifecycle.dispose();
```

## Common mistakes

| Mistake                                         | Fix                                       |
| ----------------------------------------------- | ----------------------------------------- |
| Creating multiple sessions per tab              | Use one lifecycle instance per tab        |
| Forgetting `dispose()` on unmount               | Always dispose in framework cleanup hooks |
| Subscribing in SSR                              | Initialize only in browser code paths     |
| Passing resolved config back into merge helpers | Use input-shaped configuration objects    |

## Next steps

- [Usage Guide](/packages/browser-lifecycle/guides/usage)
- [Beginner Tutorial](/packages/browser-lifecycle/tutorials/beginner)
- [Framework Examples](/packages/browser-lifecycle/examples/)
