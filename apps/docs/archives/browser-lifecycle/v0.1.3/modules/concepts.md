---
title: Concepts
description: Browser Lifecycle module documentation for Concepts.
---

# Core concepts

Terminology and session model for `@jayoncode/browser-lifecycle`.

**Previous:** [Overview](/packages/browser-lifecycle/) · **Next:** [Tutorial](/packages/browser-lifecycle/modules/getting-started)

## Problem → approach

| Scattered browser listeners                                         | With Browser Lifecycle                                   |
| ------------------------------------------------------------------- | -------------------------------------------------------- |
| `document.addEventListener("visibilitychange", …)` in every feature | One session, typed `page:visible` / `page:hidden` events |
| Duplicate online/offline handlers across modules                    | Normalized `connectivity:*` events + snapshot            |
| No single place to read “current tab state”                         | `getSnapshot()` — readonly consolidated state            |
| Leaked listeners on SPA route changes                               | `dispose()` tears down modules and subscriptions         |

## Session

```ts
const lifecycle = createBrowserLifecycle({ autoStart: true });
```

One instance per browser tab. Share it via app context — do not create one per component.

## API map

| Concept  | Responsibility                | API                              |
| -------- | ----------------------------- | -------------------------------- |
| Session  | Lifecycle boundary            | `createBrowserLifecycle()`       |
| Event    | Normalized browser signal     | `lifecycle.on("page:hidden", …)` |
| Snapshot | Current module state          | `lifecycle.getSnapshot()`        |
| Module   | Visibility, focus, idle, etc. | Configuration + typed events     |
| Plugin   | Cross-cutting extension       | Plugin registration API          |

## Session phases

| Phase      | Meaning                    |
| ---------- | -------------------------- |
| `created`  | Constructed, not listening |
| `running`  | Active listeners           |
| `stopped`  | Paused                     |
| `disposed` | Torn down — do not reuse   |

## Next steps

| Goal                    | Guide                                                           |
| ----------------------- | --------------------------------------------------------------- |
| Integration walkthrough | [Tutorial](/packages/browser-lifecycle/modules/getting-started) |
| Page visibility         | [Visibility](/packages/browser-lifecycle/modules/visibility)    |
| Event subscription      | [Events](/packages/browser-lifecycle/modules/events)            |

[State explorer →](/playground/browser-lifecycle/state)
