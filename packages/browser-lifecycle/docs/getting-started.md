# Tutorial — your first session

Get Browser Lifecycle running in five steps.

**Previous:** [Core concepts](/packages/browser-lifecycle/modules/concepts) · **Next:** [Visibility](/packages/browser-lifecycle/modules/visibility)

::: tip Learn by doing
Keep the [Visibility playground](/playground/browser-lifecycle/visibility) open — switch tabs and watch events fire.
:::

---

## Step 1 — Install

```bash
npm install @jayoncode/browser-lifecycle
```

✅ **You now have** the package ready to import.

---

## Step 2 — Create a session

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true });
```

`autoStart: true` begins listening immediately. The session enters the `running` phase.

✅ **You now have** an active lifecycle session.

---

## Step 3 — Subscribe to events

```ts
lifecycle.on("page:visible", () => {
  console.log("Tab is visible — resume work");
});

lifecycle.on("page:hidden", () => {
  console.log("Tab is hidden — pause timers");
});
```

Switch browser tabs to trigger events. Each subscription returns an unsubscribe function.

✅ **You now have** reactive handlers for browser signals.

---

## Step 4 — Read the snapshot

```ts
const snapshot = lifecycle.getSnapshot();
console.log(snapshot.page.visibility); // "visible" | "hidden"
```

The snapshot is **readonly** — always current, no manual bookkeeping.

✅ **You now have** programmatic access to browser state.

---

## Step 5 — Clean up

```ts
await lifecycle.dispose();
```

Call `dispose()` when your app unmounts or the tab navigates away. This removes listeners and frees resources.

✅ **You now have** a complete create → subscribe → dispose flow.

---

## Recap

| Step | API                            | Purpose            |
| ---- | ------------------------------ | ------------------ |
| 1    | `npm install`                  | Add package        |
| 2    | `createBrowserLifecycle()`     | Start session      |
| 3    | `lifecycle.on(event, handler)` | React to signals   |
| 4    | `getSnapshot()`                | Read current state |
| 5    | `dispose()`                    | Tear down          |

## Common mistakes

| Mistake                   | Fix                                        |
| ------------------------- | ------------------------------------------ |
| Multiple sessions per tab | Use one instance, share via context        |
| Forgetting `dispose()`    | Always dispose in cleanup / `onUnmount`    |
| Initializing in SSR       | Guard with `typeof window !== "undefined"` |

## What to learn next

| Goal                        | Guide                                                                          | Playground                                           |
| --------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Visibility module deep dive | [Visibility](/packages/browser-lifecycle/modules/visibility)                   | [Try →](/playground/browser-lifecycle/visibility)    |
| Event subscription patterns | [Events](/packages/browser-lifecycle/modules/events)                           | [Try →](/playground/browser-lifecycle/events)        |
| Configuration & SSR         | [Core infrastructure](/packages/browser-lifecycle/modules/core-infrastructure) | [Try →](/playground/browser-lifecycle/configuration) |

::: info Stuck?
See the [Quick start guide](/packages/browser-lifecycle/guides/quick-start), [FAQ](/packages/browser-lifecycle/faq/), or [beginner tutorial](/packages/browser-lifecycle/tutorials/beginner).
:::
