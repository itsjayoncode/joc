# Idle

Detect "no user interaction for N ms" without wiring pointer/keyboard listeners yourself.

**Previous:** [Focus](./focus.md) · **Next:** [Connectivity](./connectivity.md)

::: tip Playground
[Open Idle playground →](/playground/browser-lifecycle/idle) — stop interacting and watch `session:idle` fire after the configured timeout.
:::

## Import path

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
```

## Problem → approach

| Without idle module                                            | With idle events                                                |
| -------------------------------------------------------------- | --------------------------------------------------------------- |
| Manual `pointerdown` / `keydown` listeners plus a `setTimeout` | `idleTimeout` config + `session:idle` / `session:active` events |
| Debounce logic duplicated per feature                          | Built-in `activityDebounce` (default `250`ms)                   |
| No shared "is the user idle right now" signal                  | `snapshot.activity` — `"active" \| "idle" \| "unknown"`         |

```ts
const lifecycle = createBrowserLifecycle({ idleTimeout: 30_000 });

lifecycle.on("session:idle", () => pauseAutosave());
lifecycle.on("session:active", () => resumeAutosave());
```

With Form Intelligence drafts, prefer [draft on tab hide](/packages/form-intelligence/modules/patterns#composition-draft-on-tab-hide-browser-lifecycle) for `page:hidden`; use idle events for longer inactivity UX (lock screen, pause remote sync).

::: warning Off by default
`idleTimeout` defaults to `false` — the Idle module is disabled until you set an explicit millisecond timeout.
:::

## Pitfalls

- `idleTimeout: false` (the default) means no idle detection at all — no timers, no listeners.
- Idle detection needs its own `activityEvents` to fire; if you narrow the list too much, real interaction may go unnoticed.
- Always `dispose()` the session (or unsubscribe) on unmount — activity listeners are held by the session.

---

## Technical reference

## Overview

The Idle Module derives an `active` / `idle` activity state from configured DOM interaction events, gated entirely behind the `idleTimeout` option.

It is responsible only for:

- listening for configured activity events (debounced)
- tracking the time since the last activity
- scheduling an idle timer that fires after `idleTimeout` of inactivity
- reporting normalized activity transitions to Session Core
- cleaning up browser listeners and timers

## Configuration

| Option             | Type                                                        | Default                                                                               | Notes                                                                     |
| ------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `idleTimeout`      | `false \| number`                                           | `false`                                                                               | `false` disables the module entirely. A positive integer (ms) enables it. |
| `activityEvents`   | `"default" \| readonly BrowserLifecycleActivityEventName[]` | `"default"` → `["pointerdown", "keydown", "touchstart", "visibilitychange", "focus"]` | Non-empty array of allowed activity event names (see below).              |
| `activityDebounce` | `number` (ms)                                               | `250`                                                                                 | Debounce applied before an activity signal is recorded.                   |

Allowed `activityEvents` values (`BrowserLifecycleActivityEventName`): `"focus"`, `"keydown"`, `"mousedown"`, `"mousemove"`, `"pointerdown"`, `"pointermove"`, `"touchmove"`, `"touchstart"`, `"visibilitychange"`.

```ts
const lifecycle = createBrowserLifecycle({
  idleTimeout: 60_000,
  activityEvents: ["pointerdown", "keydown"],
  activityDebounce: 500,
});
```

`visibilitychange` is observed on `document`; every other activity event is observed on `window`.

## Architecture

```text
activity DOM events
  -> activity adapter
  -> Idle Module (debounce + idle timer)
  -> Session Core internal event
  -> public BrowserLifecycle event
```

Implementation is split into:

- `src/modules/idle/activity-adapter.ts`
- `src/modules/idle/idle-module.ts`
- `src/modules/idle/types.ts`
- `src/modules/idle/index.ts`

## Session Integration

The Idle Module reports changes to Session Core through `internal:activity-detected`, `internal:activity-reset`, and `internal:activity-changed`. Session Core then:

- updates `snapshot.activity`
- records event timestamps
- emits the corresponding public event
- preserves lifecycle-first ordering by flushing startup activity events after `session:started`

## Public Events

| Event               | Fires when                                                                        | Metadata                                                   |
| ------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `activity:detected` | An activity event clears the debounce window (regardless of current state)        | `activitySource` — the triggering event name               |
| `activity:reset`    | Activity is recorded while already `active` (idle timer restarted, no transition) | `activitySource`                                           |
| `session:active`    | Activity is recorded while `idle` — transition back to active                     | `activitySource`, `idleDuration?` (ms since last activity) |
| `session:idle`      | No activity for `idleTimeout` ms                                                  | `idleTimeout`, `lastActivityAt`                            |

```ts
lifecycle.on("session:idle", (event) => {
  console.log(event.metadata?.idleTimeout, event.metadata?.lastActivityAt);
});

lifecycle.on("session:active", (event) => {
  console.log(event.metadata?.idleDuration);
});
```

## Snapshot field

```ts
const { activity } = lifecycle.getSnapshot();
// "active" | "idle" | "unknown"
```

Starts `"active"` as soon as the module initializes (when enabled); stays `"unknown"` when disabled or unsupported.

## SSR Safety

Construction remains SSR-safe:

- no `window` / `document` access during Session Core construction
- browser APIs are touched only through the adapter during module initialization and start

If activity observation is unavailable for the configured events, the module disables itself without throwing.

## Browser Compatibility

This module depends on:

- `idleTimeout` being set to a positive integer (it is `false` by default)
- the `idle` capability (`supportsIdle()` — `window` with `addEventListener`/`removeEventListener` and a `document`)
- every configured `activityEvents` entry resolving to a valid target (`window` or `document`)

When any of these are unmet:

- `snapshot.activity` remains `"unknown"`
- no activity listeners or idle timers are attached
- no activity/idle events are emitted

[Connectivity →](./connectivity.md)
