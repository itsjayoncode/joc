# Session Core

The orchestration layer behind `createBrowserLifecycle()`.

**Previous:** [Events](/packages/browser-lifecycle/modules/events) · **Next:** [Plugins](/packages/browser-lifecycle/modules/plugins)

::: tip Playground
[Open Lifecycle playground →](/playground/browser-lifecycle/lifecycle) — inspect session phases and startup ordering.
:::

## Import path

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
```

Session Core is reached only through the public factory — not a separate import path.

## Problem → approach

| Without session orchestration                       | Session Core                                           |
| --------------------------------------------------- | ------------------------------------------------------ |
| Modules start/stop in undefined order               | Phases: `created` → `running` → `stopped` → `disposed` |
| Each module exposes different state shapes          | `getSnapshot()` — one readonly view across modules     |
| Debugging “why didn’t my handler run?” is guesswork | Phase and module status visible on the snapshot        |

```ts
const snapshot = lifecycle.getSnapshot();
console.log(snapshot.phase); // "running"
```

## Pitfalls

- After `dispose()`, the instance is dead — create a new session; do not call `start()` again.
- One session per tab; sharing via context beats per-component factories.

---

## Technical reference

This document covers the Session Core introduced in Phase `2.2.2`.

## Overview

Session Core is the orchestration layer behind `createBrowserLifecycle()`.

It owns:

- lifecycle control
- configuration ownership
- capability ownership
- readonly snapshot state
- public event dispatch
- internal module coordination

Session Core itself does not touch browser globals directly — it delegates that to the six modules it registers and orchestrates: [Visibility](./visibility.md), [Focus](./focus.md), [Connectivity](./connectivity.md), [Idle](./idle.md), [Page lifecycle](./lifecycle.md), and [Cross-tab](./cross-tab.md), plus any [Plugins](./plugins.md) you register.

## Architecture

Implemented runtime flow:

```text
createBrowserLifecycle()
  -> BrowserLifecycleSession
  -> SessionStateStore
  -> ModuleRegistry
  -> internal TypedEventEmitter
  -> public TypedEventEmitter
```

Responsibilities are split across:

- `browser-lifecycle.ts`: public factory
- `core/session/browser-lifecycle-session.ts`: orchestrator implementation
- `core/session/session-state.ts`: lifecycle phase and snapshot store
- `core/session/module-registry.ts`: deterministic module ordering
- `core/session/session-context.ts`: internal module context
- `core/session/types.ts`: public and internal Session Core contracts

## Lifecycle

Supported phases:

- `created`
- `running`
- `stopped`
- `disposed`

Valid transitions:

```text
created -> running -> stopped -> running -> disposed
created -> disposed
stopped -> disposed
running -> disposed
```

Invalid transitions throw `LifecycleError`.

`dispose()` is terminal. Repeated `dispose()` calls are ignored.

## Public API

### Create an Instance

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
});
```

### Start and Stop

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
});

lifecycle.start();
lifecycle.stop();
lifecycle.dispose();
```

### Read Snapshot State

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle();
const snapshot = lifecycle.getSnapshot();

console.log(snapshot.phase);
console.log(snapshot.capabilities.visibility);
```

### Listen for Events

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
});

lifecycle.on("session:started", (event) => {
  console.log(event.type, event.current, event.previous);
});

lifecycle.once("session:started", () => {
  console.log("fires only for the first session:started");
});

lifecycle.subscribe((event, snapshot) => {
  console.log(event.type, snapshot.phase);
});

lifecycle.start();
```

`on()` / `once()` return an unsubscribe function; `off(event, listener)` is also available. `subscribe()` receives every public event plus the snapshot at emission time, and also returns an unsubscribe function.

### Query Capabilities and Runtime State

```ts
lifecycle.getCapabilities(); // Readonly<BrowserLifecycleCapabilities>
lifecycle.isRunning(); // boolean — true only while phase === "running"
```

### Runtime Diagnostics

```ts
const diagnostics = lifecycle.getRuntimeDiagnostics();
// { capabilities, debug, eventBufferSize, eventStats, isRunning,
//   moduleCount, phase, pluginCount, subscriberCount,
//   totalEmissionCount, totalListenerCount }

diagnostics.eventStats; // per-event { event, emissionCount, errorCount, listenerCount, lastDispatchedAt? }
```

Useful for developer tooling and the [Plugins](./plugins.md) playground — no browser globals are touched to compute it.

## State Management

The public snapshot is immutable and always includes:

- lifecycle phase
- visibility
- attention
- activity
- connectivity
- lifecycle page state
- tab role
- capabilities
- timestamps

All of these are flat, top-level properties on the snapshot (`snapshot.phase`, `snapshot.visibility`, …) — there is no nested `snapshot.session` or `snapshot.page` object.

The Session Core keeps capability data stable and updates timestamps during lifecycle transitions and module-driven state updates.

## Module Registration

The public package surface does not expose module registration. The six built-in modules (Visibility, Focus, Connectivity, Idle, Page lifecycle, Cross-tab) register internally through `BrowserLifecycleSession` so each can be initialized, started, stopped, and destroyed in deterministic order. Consumers extend the session via [Plugins](./plugins.md) instead of registering raw modules.

Module ordering rules (internal `order` values — lowest first): Visibility (`10`) → Focus (`20`) → Connectivity (`30`) → Idle (`40`) → Page lifecycle (`50`) → Cross-tab (`60`).

- lower `order` values run first during initialize and start
- teardown runs in reverse order
- duplicate ids throw `ModuleRegistryError`

## SSR Safety

Session Core itself does not access:

- `window`
- `document`
- `navigator`
- `history`
- `location`

Browser API access is delegated to the browser-specific modules it orchestrates ([Visibility](./visibility.md), [Focus](./focus.md), [Connectivity](./connectivity.md), [Idle](./idle.md), [Page lifecycle](./lifecycle.md), [Cross-tab](./cross-tab.md)) — each of those touches browser globals only through its own adapter, during module initialization and start, never during construction.
