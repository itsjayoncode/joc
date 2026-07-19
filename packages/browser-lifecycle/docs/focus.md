# Focus

React when the browser window gains or loses focus — separate from tab visibility.

**Previous:** [Visibility](./visibility.md) · **Next:** [Idle](./idle.md)

::: tip Playground
[Open Focus playground →](/playground/browser-lifecycle/focus) — switch windows and watch `window:focus` / `window:blur` events.
:::

## Import path

Single package entry — no subpaths:

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
```

## Problem → approach

| Without focus module                                         | With focus events                                              |
| ------------------------------------------------------------ | -------------------------------------------------------------- |
| Raw `window.addEventListener("blur"/"focus", …)` per feature | `window:focus` / `window:blur` on the lifecycle bus            |
| No normalized "does the user have this window active" signal | `snapshot.attention` — `"focused" \| "unfocused" \| "unknown"` |
| Hard to test or mock browser globals                         | Module abstracts window focus behind typed events              |

```ts
lifecycle.on("window:blur", () => dimAvatar());
lifecycle.on("window:focus", () => brightenAvatar());
```

::: tip Focus vs. visibility
A tab can be **visible** but **unfocused** (e.g. the user alt-tabbed to another app while this browser window is still on screen). Use visibility for "should I render/poll?" decisions and focus for "does the user have this window active?" decisions.
:::

## Pitfalls

- Always `dispose()` the session (or unsubscribe) on unmount — focus listeners are held by the session.
- On SSR, create/start the session only in the browser; capability detection alone does not attach listeners.

---

## Technical reference

## Overview

The Focus Module observes `window` focus and blur to report window-level attention, independent of page visibility.

It is responsible only for:

- reading initial focus state via `document.hasFocus()`
- listening for `window` `focus` and `blur`
- reporting normalized attention transitions to Session Core
- cleaning up browser listeners

It does not expose native browser APIs through the public package surface.

## Architecture

```text
window focus / blur
  -> focus adapter
  -> Focus Module
  -> Session Core internal event
  -> public BrowserLifecycle event
```

Implementation is split into:

- `src/modules/focus/focus-adapter.ts`
- `src/modules/focus/focus-module.ts`
- `src/modules/focus/types.ts`
- `src/modules/focus/index.ts`

## Browser APIs

The module uses:

- `document.hasFocus()`
- `window.addEventListener("focus" | "blur", …)`
- `window.removeEventListener("focus" | "blur", …)`

The adapter owns all direct browser interaction. The module owns normalization and lifecycle behavior.

## Session Integration

The Focus Module does not dispatch public events directly.

It reports changes to Session Core through the internal `internal:focus-changed` event. Session Core then:

- updates `snapshot.attention`
- records event timestamps
- emits `window:focus` or `window:blur`
- preserves lifecycle-first ordering by flushing startup focus events after `session:started`

## Public Events

The module powers:

- `window:focus` — `current: "focused"`
- `window:blur` — `current: "unfocused"`

Event metadata includes `reason`: `"focus" | "blur" | "initial"`.

## Snapshot field

```ts
const { attention } = lifecycle.getSnapshot();
// "focused" | "unfocused" | "unknown"
```

There is no `snapshot.focus` field — the field is named `attention`.

## Initial State and Duplicates

Initial focus is detected during module initialization (via `document.hasFocus()`) and stored in the snapshot.

When `emitInitialState` is `true`, the module replays that startup state as a public event after `session:started`.

Duplicate browser callbacks that do not change normalized state are suppressed.

## SSR Safety

Construction remains SSR-safe:

- no `window` / `document` access during Session Core construction
- browser APIs are touched only through the adapter during module initialization and start

If window focus observation is unavailable, the module disables itself without throwing.

## Browser Compatibility

This module depends on the `focus` capability detected by the package feature detection layer — `supportsFocus()`, which requires `window.addEventListener` / `removeEventListener` **and** `document.hasFocus`.

When that capability is unavailable:

- `snapshot.attention` remains `"unknown"`
- no focus listeners are attached
- no `window:focus` / `window:blur` events are emitted

## Relationship to other modules

Focus is independent from Visibility, Idle, and Page Lifecycle — each owns its own browser signal and its own snapshot field. Combine them by reading `getSnapshot()` or composing handlers, for example via [Presence](./presence.md) (`visibility ∧ attention ∧ connectivity`).

[Idle →](./idle.md)
