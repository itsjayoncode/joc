---
title: Events
description: Browser Lifecycle module documentation for Events.
playground: /playground/browser-lifecycle/event
---

# Events

This document covers the generic typed event infrastructure introduced in Phase `2.2.1`.

## Overview

The event infrastructure is:

- generic
- synchronous
- SSR-safe
- framework agnostic
- free of browser-specific logic

It exists to support Browser Lifecycle Manager modules without embedding browser semantics into the event layer itself.

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

## Interactive Playground

Explore this topic live in the [Events](/playground/browser-lifecycle/event-explorer).
