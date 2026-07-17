---
title: Session Core
description: Browser Lifecycle module documentation for Session Core.
playground: /playground/browser-lifecycle/lifecycle
---

# Session Core

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

It does not yet perform browser observation directly. Future modules will provide raw browser signals and register through the Session Core.

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

lifecycle.subscribe((event, snapshot) => {
  console.log(event.type, snapshot.phase);
});

lifecycle.start();
```

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

The Session Core keeps capability data stable and updates timestamps during lifecycle transitions and future module-driven state updates.

## Module Registration

The public package surface does not expose module registration. Internal modules register through `BrowserLifecycleSession` so future observers can be initialized, started, stopped, and destroyed in deterministic order.

Module ordering rules:

- lower `order` values run first during initialize and start
- teardown runs in reverse order
- duplicate ids throw `ModuleRegistryError`

## SSR Safety

Session Core does not access:

- `window`
- `document`
- `navigator`
- `history`
- `location`

Browser APIs remain deferred to future browser-specific modules.

## Interactive Playground

Explore this topic live in the [Session Core](/playground/browser-lifecycle/lifecycle-playground).
