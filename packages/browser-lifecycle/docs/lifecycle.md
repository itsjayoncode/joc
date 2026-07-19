# Page lifecycle

React to browser-initiated page suspend/resume — `pagehide`/`pageshow` and (where supported) freeze/resume — distinct from the Session Core's `created`/`running`/`stopped`/`disposed` phases.

**Previous:** [Cross-tab](./cross-tab.md) · **Next:** [Events](/packages/browser-lifecycle/modules/events)

::: tip Playground
[Open Lifecycle playground →](/playground/browser-lifecycle/lifecycle) — navigate away and back to observe `page:suspend` / `page:resume` / `session:restored`.
:::

::: tip Not the same as Session Core phases
This page covers the **Page Lifecycle Module** (`snapshot.lifecycle`, browser bfcache-style suspend/resume). For the session's own `created` → `running` → `stopped` → `disposed` phases, see [Session core](./session-core.md).
:::

## Import path

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
```

## Problem → approach

| Without page lifecycle module                                       | With page lifecycle events                                               |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Raw `window.addEventListener("pagehide"/"pageshow", …)` per feature | `page:suspend` / `page:resume` / `session:restored` on the lifecycle bus |
| Back-forward cache (bfcache) restores silently reuse stale state    | `session:restored` signals a `pageshow` restore explicitly               |
| No normalized "is this page about to be discarded" signal           | `snapshot.lifecycle` — normalized page state                             |

```ts
lifecycle.on("page:suspend", () => flushPendingWrites());
lifecycle.on("page:resume", () => refreshStaleData());
lifecycle.on("session:restored", () => rehydrateUi());
```

## Pitfalls

- `freeze` / `resume` document events are non-standard and only fire in some Chromium builds — treat `"frozen"` as best-effort, not guaranteed.
- `session:restored` and `page:resume` can both fire for the same `pageshow` event — see below.
- Always `dispose()` the session (or unsubscribe) on unmount.

---

## Technical reference

## Overview

The Page Lifecycle Module observes `window` `pagehide`/`pageshow` and, when present, `document` `freeze`/`resume`/`visibilitychange` to report normalized page suspend/resume transitions.

It is responsible only for:

- reading initial page state
- listening for the above browser signals
- reporting normalized lifecycle transitions to Session Core
- cleaning up browser listeners

## Architecture

```text
pagehide / pageshow / freeze / resume
  -> lifecycle adapter
  -> Page Lifecycle Module
  -> Session Core internal event
  -> public BrowserLifecycle events
```

Implementation is split into:

- `src/modules/lifecycle/lifecycle-adapter.ts`
- `src/modules/lifecycle/lifecycle-module.ts`
- `src/modules/lifecycle/types.ts`
- `src/modules/lifecycle/index.ts`

## Session Integration

The Page Lifecycle Module reports changes to Session Core through the internal `internal:lifecycle-changed` event. Session Core then:

- updates `snapshot.lifecycle`
- records event timestamps
- emits `page:suspend`, `page:resume`, and/or `session:restored`
- preserves lifecycle-first ordering by flushing startup lifecycle events after `session:started`

## Public Events

| Event              | Fires when                                                             | Metadata                                          |
| ------------------ | ---------------------------------------------------------------------- | ------------------------------------------------- |
| `page:suspend`     | `pagehide` (→ `"hidden"`) or `freeze` (→ `"frozen"`)                   | `{ lifecycleSignal, reason }`                     |
| `page:resume`      | `pageshow`, `resume`, or a `visibilitychange` that reports `"active"`  | `{ reason, resumeSource }`                        |
| `session:restored` | Specifically a `pageshow` — fires **immediately before** `page:resume` | `{ persisted: false, restoreSource: "pageshow" }` |

```ts
lifecycle.on("session:restored", () => {
  // Runs first for a pageshow (e.g. back/forward navigation, bfcache restore)
});
lifecycle.on("page:resume", () => {
  // Runs for every resume, including the same pageshow
});
```

## Snapshot field

```ts
const { lifecycle: pageState } = lifecycle.getSnapshot();
// "active" | "discarded" | "frozen" | "hidden" | "passive" | "terminated" | "unknown"
```

The current adapter only ever produces `"active"`, `"frozen"`, `"hidden"`, or `"unknown"` — `"discarded"`, `"passive"`, and `"terminated"` are reserved type members for future adapter coverage and are not emitted by this module today.

## Initial State and Duplicates

Initial page state is detected during module initialization and stored in the snapshot.

When `emitInitialState` is `true`, the module replays that startup state as a public event after `session:started` (with `reason: "initial"`).

Duplicate browser callbacks that do not change normalized state are suppressed.

## SSR Safety

Construction remains SSR-safe:

- no `window` / `document` access during Session Core construction
- browser APIs are touched only through the adapter during module initialization and start

If page lifecycle observation is unavailable, the module disables itself without throwing.

## Browser Compatibility

This module depends on the `pageLifecycle` capability — `supportsPageLifecycle()`, which requires `window` to expose `onpagehide` and `onpageshow`.

When that capability is unavailable:

- `snapshot.lifecycle` remains `"unknown"`
- no lifecycle listeners are attached
- no `page:suspend` / `page:resume` / `session:restored` events are emitted

[Events →](/packages/browser-lifecycle/modules/events)
