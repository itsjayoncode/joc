# Events

Subscribe to typed lifecycle events with a small, framework-agnostic API.

**Previous:** [Page lifecycle](/packages/browser-lifecycle/modules/lifecycle) · **Next:** [Session core](/packages/browser-lifecycle/modules/session-core)

::: tip Playground
[Open Event explorer →](/playground/browser-lifecycle/events) — watch the live event feed as you interact.
:::

## Import path

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
```

Main package only. Prefer `lifecycle.on()` / returned `unsub()` over holding raw emitters in app code.

## Problem → approach

| Typical pain                                               | Event API                                                |
| ---------------------------------------------------------- | -------------------------------------------------------- |
| Custom `EventTarget` or ad-hoc callback arrays per feature | `lifecycle.on(event, handler)` with typed event names    |
| Leaked listeners after route changes                       | `on()` returns `unsub()` — call on teardown              |
| Untyped string events and loose payloads                   | Synchronous, typed handlers aligned with `getSnapshot()` |

```ts
const unsub = lifecycle.on("page:visible", () => console.log("visible"));
// later: unsub();
```

## Pitfalls

- Forgetting `unsub()` **or** `dispose()` leaks handlers across SPA routes.
- Do not subscribe before `start()` / `autoStart` if you expect immediate browser signals.

---

## Technical reference

This document covers the generic typed event infrastructure introduced in Phase `2.2.1`.

## Overview

The event infrastructure is:

- generic
- synchronous
- SSR-safe
- framework agnostic
- free of browser-specific logic

It exists to support Browser Lifecycle modules without embedding browser semantics into the event layer itself.

## Event catalog

`createBrowserLifecycle()` reserves the full `BrowserLifecycleEventName` union below. Each module page has the full metadata shape for its own events — this table is the at-a-glance index.

| Event                  | Source module                                                                              | `current`                              |
| ---------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------- |
| `page:visible`         | [Visibility](/packages/browser-lifecycle/modules/visibility)                               | `"visible"`                            |
| `page:hidden`          | [Visibility](/packages/browser-lifecycle/modules/visibility)                               | `"hidden"`                             |
| `window:focus`         | [Focus](/packages/browser-lifecycle/modules/focus)                                         | `"focused"`                            |
| `window:blur`          | [Focus](/packages/browser-lifecycle/modules/focus)                                         | `"unfocused"`                          |
| `connection:online`    | [Connectivity](/packages/browser-lifecycle/modules/connectivity)                           | `"online"`                             |
| `connection:offline`   | [Connectivity](/packages/browser-lifecycle/modules/connectivity)                           | `"offline"`                            |
| `connection:reconnect` | [Connectivity](/packages/browser-lifecycle/modules/connectivity) (derived by Session Core) | `"online"`                             |
| `activity:detected`    | [Idle](/packages/browser-lifecycle/modules/idle)                                           | `"active"`                             |
| `activity:reset`       | [Idle](/packages/browser-lifecycle/modules/idle)                                           | `"active"`                             |
| `session:active`       | [Idle](/packages/browser-lifecycle/modules/idle)                                           | `"active"`                             |
| `session:idle`         | [Idle](/packages/browser-lifecycle/modules/idle)                                           | `"idle"`                               |
| `page:suspend`         | [Page lifecycle](/packages/browser-lifecycle/modules/lifecycle)                            | `"hidden" \| "frozen" \| "terminated"` |
| `page:resume`          | [Page lifecycle](/packages/browser-lifecycle/modules/lifecycle)                            | `"active"`                             |
| `session:restored`     | [Page lifecycle](/packages/browser-lifecycle/modules/lifecycle)                            | `"running" \| "stopped"`               |
| `tab:primary`          | [Cross-tab](/packages/browser-lifecycle/modules/cross-tab)                                 | `"primary"`                            |
| `tab:secondary`        | [Cross-tab](/packages/browser-lifecycle/modules/cross-tab)                                 | `"secondary"`                          |
| `tab:message`          | [Cross-tab](/packages/browser-lifecycle/modules/cross-tab)                                 | `"message"`                            |
| `plugin:registered`    | [Plugins](/packages/browser-lifecycle/modules/plugins)                                     | `"registered"`                         |
| `plugin:removed`       | [Plugins](/packages/browser-lifecycle/modules/plugins)                                     | `"removed"`                            |
| `plugin:error`         | [Plugins](/packages/browser-lifecycle/modules/plugins)                                     | `"error"`                              |
| `session:started`      | [Session core](/packages/browser-lifecycle/modules/session-core)                           | `"running"`                            |
| `session:stopped`      | [Session core](/packages/browser-lifecycle/modules/session-core)                           | `"stopped"`                            |

::: warning Naming
Connectivity events are `connection:online` / `connection:offline` / `connection:reconnect` — **not** `connectivity:*`.
:::

Every event payload shares the same envelope (`BrowserLifecycleEvent<TType, TCurrent, TPrevious, TMetadata>`):

```ts
interface BrowserLifecycleEvent<TType, TCurrent, TPrevious, TMetadata> {
  readonly type: TType;
  readonly current: TCurrent;
  readonly previous: TPrevious;
  readonly metadata: TMetadata;
  readonly snapshot: BrowserLifecycleSnapshot; // full snapshot at emission time
  readonly source:
    | "activity"
    | "connectivity"
    | "focus"
    | "internal"
    | "lifecycle"
    | "plugin"
    | "transport"
    | "visibility";
  readonly timestamp: number;
}
```

## Public API

### `TypedEventEmitter<TEventMap>`

The public emitter surface is intentionally small:

- `on(event, listener)`
- `off(event, listener)`
- `once(event, listener)`
- `emit(event, payload, options?)`
- `listeners(event)`
- `listenerCount(event?)`
- `hasListeners(event?)`
- `removeAll(event?)`
- `destroy()`

## Constructor Options

### `definitions`

Optional event definitions stored by the internal registry for diagnostics and statistics.

### `onListenerError`

Optional error-isolation callback invoked when a listener throws during synchronous dispatch.

### `timeProvider`

Optional timestamp provider used for deterministic tests and custom time sources.

## Metadata

Each dispatch produces metadata with:

- `type`
- `timestamp`
- `source`
- `dispatchId`
- `listenerCount`
- `internal`

The metadata is created by the dispatcher and passed to every listener for the current emission.

## Internal Architecture

The implementation is split into:

- `listener-collection.ts`
- `event-registry.ts`
- `subscription-manager.ts`
- `event-dispatcher.ts`
- `typed-event-emitter.ts`

Event flow is:

```text
module or caller
  -> TypedEventEmitter.emit()
  -> EventDispatcher
  -> EventRegistry
  -> ListenerCollection
  -> developer callback
```

## Error Isolation

Listener execution is synchronous and ordered, but one failing listener does not prevent later listeners from running. The registry records the isolated error, and the optional `onListenerError` hook receives the error context.

## Examples

### Basic Subscription

```ts
import { TypedEventEmitter } from "@jayoncode/browser-lifecycle";

interface AppEvents {
  "app:ready": { readonly id: string };
}

const emitter = new TypedEventEmitter<AppEvents>();

emitter.on("app:ready", (payload) => {
  console.log(payload.id);
});

emitter.emit("app:ready", { id: "session-1" });
```

### One-Time Listener

```ts
import { TypedEventEmitter } from "@jayoncode/browser-lifecycle";

interface AppEvents {
  "app:ready": { readonly id: string };
}

const emitter = new TypedEventEmitter<AppEvents>();

emitter.once("app:ready", (payload) => {
  console.log(payload.id);
});
```

### Removing Listeners

```ts
import { TypedEventEmitter } from "@jayoncode/browser-lifecycle";

interface AppEvents {
  "app:ready": { readonly id: string };
}

const emitter = new TypedEventEmitter<AppEvents>();
const listener = (payload: AppEvents["app:ready"]) => {
  console.log(payload.id);
};

emitter.on("app:ready", listener);
emitter.off("app:ready", listener);
```

### Destroying an Emitter

```ts
import { TypedEventEmitter } from "@jayoncode/browser-lifecycle";

interface AppEvents {
  "app:ready": { readonly id: string };
}

const emitter = new TypedEventEmitter<AppEvents>();

emitter.destroy();
```
