# Tutorial — your first session

Install, start a session, subscribe to events, read snapshot state, dispose.

**Previous:** [Core concepts](/packages/browser-lifecycle/modules/concepts) · **Next:** [Visibility](/packages/browser-lifecycle/modules/visibility)

::: info Playground
[Visibility explorer](/playground/browser-lifecycle/visibility) — switch tabs and observe event order.
:::

**Prerequisites:** Node 20+, browser or SSR-aware bootstrap.

---

## Step 1 — Install

```bash
npm install @jayoncode/browser-lifecycle
```

**Outcome:** Package available for import.

---

## Step 2 — Create a session

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true });
```

**Outcome:** Session in `running` phase with modules attached per configuration.

---

## Step 3 — Subscribe to events

```ts
lifecycle.on("page:visible", () => {
  resumePolling();
});

lifecycle.on("page:hidden", () => {
  pausePolling();
});
```

**Outcome:** Handlers run on normalized visibility transitions. Unsubscribe via returned function.

---

## Step 4 — Read snapshot

```ts
const snapshot = lifecycle.getSnapshot();
console.log(snapshot.page.visibility); // "visible" | "hidden"
```

**Outcome:** Readonly view of current session state without manual listener bookkeeping.

---

## Step 5 — Dispose

```ts
await lifecycle.dispose();
```

**Outcome:** Listeners removed; instance must not be reused.

---

## Recap

| Step | API                        | Result               |
| ---- | -------------------------- | -------------------- |
| 1    | `npm install`              | Dependency installed |
| 2    | `createBrowserLifecycle()` | Active session       |
| 3    | `on(event, handler)`       | Typed subscriptions  |
| 4    | `getSnapshot()`            | Current state        |
| 5    | `dispose()`                | Clean teardown       |

## Pitfalls

| Issue                     | Mitigation                            |
| ------------------------- | ------------------------------------- |
| Multiple sessions per tab | Single shared instance                |
| Missing teardown          | Call `dispose()` on unmount           |
| SSR access                | Guard `typeof window !== "undefined"` |

## Continue

| Topic             | Guide                                                                          | Playground                                                   |
| ----------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| Visibility module | [Visibility](/packages/browser-lifecycle/modules/visibility)                   | [Visibility](/playground/browser-lifecycle/visibility)       |
| Event patterns    | [Events](/packages/browser-lifecycle/modules/events)                           | [Events](/playground/browser-lifecycle/events)               |
| Config & SSR      | [Core infrastructure](/packages/browser-lifecycle/modules/core-infrastructure) | [Configuration](/playground/browser-lifecycle/configuration) |

[Quick start](/packages/browser-lifecycle/guides/quick-start) · [FAQ](/packages/browser-lifecycle/faq/)
