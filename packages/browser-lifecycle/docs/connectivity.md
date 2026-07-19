# Connectivity

Advisory online/offline signal from `navigator.onLine` — not a real network health check.

**Previous:** [Idle](./idle.md) · **Next:** [Cross-tab](./cross-tab.md)

::: tip Playground
[Open Connectivity playground →](/playground/browser-lifecycle/connectivity) — toggle your network and watch `connection:online` / `connection:offline` / `connection:reconnect`.
:::

## Import path

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
```

## Problem → approach

| Without connectivity module                                      | With connectivity events                                                                 |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Raw `window.addEventListener("online"/"offline", …)` per feature | `connection:online` / `connection:offline` / `connection:reconnect` on the lifecycle bus |
| No shared "how long were we offline" signal                      | `connection:reconnect` carries `offlineDuration`                                         |
| Easy to typo the event namespace                                 | Public events are `connection:*` — **not** `connectivity:*`                              |

```ts
lifecycle.on("connection:offline", () => showOfflineBanner());
lifecycle.on("connection:online", () => hideOfflineBanner());
lifecycle.on("connection:reconnect", (event) => {
  console.log("Back online after", event.metadata?.offlineDuration, "ms");
  flushOfflineQueue();
});
```

::: warning Advisory only
`navigator.onLine` reflects network-adapter connectivity, not internet reachability. A device can report `online` while a captive portal, VPN, or upstream outage blocks real traffic. Every connectivity event's metadata carries `advisory: true` as a reminder — pair this with your own reachability probe for anything critical.
:::

## Pitfalls

- Event names are `connection:online` / `connection:offline` / `connection:reconnect` — **not** `connectivity:online` / `connectivity:offline`.
- Always `dispose()` the session (or unsubscribe) on unmount — connectivity listeners are held by the session.
- On SSR, create/start the session only in the browser; capability detection alone does not attach listeners.

---

## Technical reference

## Overview

The Connectivity Module observes `navigator.onLine` and the `window` `online`/`offline` events to report an advisory connectivity signal.

It is responsible only for:

- reading initial connectivity state via `navigator.onLine`
- listening for `window` `online` and `offline`
- reporting normalized connectivity transitions to Session Core
- cleaning up browser listeners

## Architecture

```text
navigator.onLine / window online|offline
  -> connectivity adapter
  -> Connectivity Module
  -> Session Core internal event
  -> public BrowserLifecycle events (+ derived connection:reconnect)
```

Implementation is split into:

- `src/modules/connectivity/connectivity-adapter.ts`
- `src/modules/connectivity/connectivity-module.ts`
- `src/modules/connectivity/types.ts`
- `src/modules/connectivity/index.ts`

## Session Integration

The Connectivity Module reports changes to Session Core through the internal `internal:connectivity-changed` event. Session Core then:

- updates `snapshot.connectivity`
- records event timestamps
- emits `connection:online` or `connection:offline`
- derives and emits `connection:reconnect` when transitioning from `offline` back to `online`, computing `offlineDuration` from the timestamp of the last `connection:offline`
- preserves lifecycle-first ordering by flushing startup connectivity events after `session:started`

## Public Events

| Event                  | `current`   | Metadata                                                                       |
| ---------------------- | ----------- | ------------------------------------------------------------------------------ |
| `connection:online`    | `"online"`  | `{ advisory: true, reason?: "initial" \| "online" }`                           |
| `connection:offline`   | `"offline"` | `{ advisory: true, reason?: "initial" \| "offline" }`                          |
| `connection:reconnect` | `"online"`  | `{ advisory: true, offlineDuration: number }` (previous is always `"offline"`) |

`connection:reconnect` is derived by Session Core, not emitted directly by the module — it always fires immediately after a `connection:online` that followed a `connection:offline`.

## Snapshot field

```ts
const { connectivity } = lifecycle.getSnapshot();
// "online" | "offline" | "unknown"
```

## Initial State and Duplicates

Initial connectivity is detected during module initialization and stored in the snapshot.

When `emitInitialState` is `true`, the module replays that startup connectivity as a public event after `session:started`.

Duplicate browser callbacks that do not change normalized state are suppressed.

## SSR Safety

Construction remains SSR-safe:

- no `navigator` / `window` access during Session Core construction
- browser APIs are touched only through the adapter during module initialization and start

If connectivity observation is unavailable, the module disables itself without throwing.

## Browser Compatibility

This module depends on the `connectivity` capability detected by the package feature detection layer — `supportsConnectivity()`, which requires `navigator.onLine` to be a boolean **and** `window.addEventListener`/`removeEventListener`.

When that capability is unavailable:

- `snapshot.connectivity` remains `"unknown"`
- no connectivity listeners are attached
- no `connection:*` events are emitted

[Cross-tab →](./cross-tab.md)
