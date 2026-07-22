# Tutorial — your first session

**Observe browser state** first — install, start a session, subscribe to events, read the snapshot, dispose. Optional session intelligence and DX come later (zero-cost until you ask).

Progressive path: **Basic** (this page) → [Concepts](/packages/browser-lifecycle/modules/concepts) → [Visibility](/packages/browser-lifecycle/modules/visibility) / [Events](/packages/browser-lifecycle/modules/events).

**Previous:** [Core concepts](/packages/browser-lifecycle/modules/concepts) · **Next:** [Visibility](/packages/browser-lifecycle/modules/visibility)

::: info Playground
[Visibility explorer](/playground/browser-lifecycle/visibility) — switch tabs and observe event order.
:::

**Prerequisites:** Node 20+, browser or SSR-aware bootstrap.

### Learning path

| Level        | Doc                                                                                                                                | Playground                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Basic        | This tutorial                                                                                                                      | [Visibility](/playground/browser-lifecycle/visibility)                                                |
| Intermediate | [Events](/packages/browser-lifecycle/modules/events) · [Session core](/packages/browser-lifecycle/modules/session-core)            | [Events](/playground/browser-lifecycle/events) · [Lifecycle](/playground/browser-lifecycle/lifecycle) |
| Production   | [Core infrastructure](/packages/browser-lifecycle/modules/core-infrastructure) · [Usage](/packages/browser-lifecycle/guides/usage) | [Configuration](/playground/browser-lifecycle/configuration)                                          |

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
console.log(snapshot.visibility); // "visible" | "hidden" | "unknown"
```

**Outcome:** Readonly view of current session state without manual listener bookkeeping.

---

## UI structure (framework shell)

Browser Lifecycle has no form markup — mount **one shared session** and dispose on unmount.

### React JSX

```tsx
import { useEffect, useMemo } from "react";
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

export function AppShell({ children }: { children: React.ReactNode }) {
  const lifecycle = useMemo(() => createBrowserLifecycle({ autoStart: true }), []);

  useEffect(() => {
    const offVisible = lifecycle.on("page:visible", () => resumeWork());
    const offHidden = lifecycle.on("page:hidden", () => pauseWork());

    return () => {
      offVisible();
      offHidden();
      lifecycle.dispose();
    };
  }, [lifecycle]);

  return <>{children}</>;
}
```

### Vanilla HTML + module script

```html
<body>
  <main id="app"><!-- your UI --></main>
  <script type="module">
    import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

    const lifecycle = createBrowserLifecycle({ autoStart: true });
    lifecycle.on("page:hidden", () => console.log("tab hidden"));

    window.addEventListener("pagehide", () => {
      lifecycle.dispose();
    });
  </script>
</body>
```

---

## Step 5 — Dispose

```ts
lifecycle.dispose();
```

**Outcome:** Listeners removed (sync); instance must not be reused.

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
