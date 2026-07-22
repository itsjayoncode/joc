# Core concepts

Terminology and session model for `@jayoncode/browser-lifecycle`.

**Previous:** [Overview](/packages/browser-lifecycle/overview) · **Next:** [Tutorial](/packages/browser-lifecycle/modules/getting-started)

## Observe → Understand → React

```text
Browser APIs
    ↓
Normalized Session   ← Observe (core)
    ↓
Session Intelligence ← Understand (opt-in factories)
    ↓
Developer APIs       ← React (Wait, Conditions, Resilience)
```

> **One session. One snapshot. One event stream.**  
> Everything else is derived. Core observation stays lightweight — intelligence and DX allocate only when you call their factories.

| Pillar         | Meaning                                                          |
| -------------- | ---------------------------------------------------------------- |
| **Observe**    | Visibility, focus, connectivity, idle, page lifecycle, cross-tab |
| **Understand** | Activity, presence, timeline, session metrics & reports          |
| **React**      | Wait, conditions, resilience, plugins                            |

## Glossary

| Term                     | Meaning                                                               |
| ------------------------ | --------------------------------------------------------------------- |
| **Session**              | Instance from `createBrowserLifecycle()` — one per tab                |
| **Visibility**           | Page Visibility API → `page:visible` / `page:hidden`                  |
| **Idle**                 | No user activity past a threshold → idle / active events              |
| **Snapshot**             | Readonly consolidated state from `getSnapshot()`                      |
| **Dispose**              | Teardown listeners, timers, plugins — session becomes unusable (sync) |
| **SSR-safe**             | Missing browser APIs detected; modules no-op until client start       |
| **Session Intelligence** | Opt-in current derived state (activity, page-local presence)          |
| **Session Insights**     | Opt-in metrics and reports — not an analytics SDK                     |

## Problem → approach

| Scattered browser listeners                                         | With Browser Lifecycle                                   |
| ------------------------------------------------------------------- | -------------------------------------------------------- |
| `document.addEventListener("visibilitychange", …)` in every feature | One session, typed `page:visible` / `page:hidden` events |
| Duplicate online/offline handlers across modules                    | Normalized `connection:*` events + snapshot              |
| No single place to read “current tab state”                         | `getSnapshot()` — readonly consolidated state            |
| Leaked listeners on SPA route changes                               | `dispose()` tears down modules and subscriptions         |

## Session

```ts
const lifecycle = createBrowserLifecycle({ autoStart: true });
```

One instance per browser tab. Share it via app context — do not create one per component.

## API map

| Concept   | Responsibility                | API                              |
| --------- | ----------------------------- | -------------------------------- |
| Session   | Lifecycle boundary            | `createBrowserLifecycle()`       |
| Event     | Normalized browser signal     | `lifecycle.on("page:hidden", …)` |
| Snapshot  | Current module state          | `getSnapshot()`                  |
| Full feed | All events                    | `lifecycle.subscribe(…)`         |
| Module    | Visibility, focus, idle, etc. | Configuration + typed events     |
| Plugin    | Cross-cutting extension       | Plugin registration API          |

## Session phases

| Phase      | Meaning                    |
| ---------- | -------------------------- |
| `created`  | Constructed, not listening |
| `running`  | Active listeners           |
| `stopped`  | Paused                     |
| `disposed` | Torn down — do not reuse   |

::: warning Dispose on unmount
Leaked listeners on SPA navigations are the most common footgun. Always `dispose()` in the same scope that created the session.
:::

## Next steps

| Goal                    | Guide                                                                 |
| ----------------------- | --------------------------------------------------------------------- |
| Integration walkthrough | [Tutorial](/packages/browser-lifecycle/modules/getting-started)       |
| Page visibility         | [Visibility](/packages/browser-lifecycle/modules/visibility)          |
| Window focus            | [Focus](/packages/browser-lifecycle/modules/focus)                    |
| Idle detection          | [Idle](/packages/browser-lifecycle/modules/idle)                      |
| Online/offline          | [Connectivity](/packages/browser-lifecycle/modules/connectivity)      |
| Multi-tab coordination  | [Cross-tab](/packages/browser-lifecycle/modules/cross-tab)            |
| Event subscription      | [Events](/packages/browser-lifecycle/modules/events)                  |
| Extension points        | [Plugins](/packages/browser-lifecycle/modules/plugins)                |
| Opt-in intelligence     | [Intelligence & DX](/packages/browser-lifecycle/modules/intelligence) |

[State explorer →](/playground/browser-lifecycle/state)
