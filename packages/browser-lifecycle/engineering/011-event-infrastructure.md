# 011 Event Infrastructure

## Why This Document Exists

This document records the implementation shape of the typed event infrastructure introduced in Phase `2.2.1`. The design documents remain the source of truth; this file explains how that design was realized in code without introducing browser-specific behavior.

## Implemented Components

The event infrastructure is implemented in:

- `src/events/types.ts`
- `src/events/listener-collection.ts`
- `src/events/event-registry.ts`
- `src/events/subscription-manager.ts`
- `src/events/event-dispatcher.ts`
- `src/events/typed-event-emitter.ts`
- `src/events/index.ts`

## Architecture

Implemented event flow:

```text
module or caller
  -> TypedEventEmitter.emit()
  -> EventDispatcher
  -> EventRegistry
  -> ListenerCollection
  -> developer callback
```

Responsibilities:

- `TypedEventEmitter`: public API surface
- `EventDispatcher`: metadata creation, synchronous dispatch, error isolation
- `EventRegistry`: definitions, listener lookup, statistics
- `SubscriptionManager`: subscription creation and cleanup
- `ListenerCollection`: ordered per-event listener storage
- `types.ts`: generic event contracts

## Public API Shape

The emitter instance exposes:

- `on()`
- `off()`
- `once()`
- `emit()`
- `listeners()`
- `listenerCount()`
- `hasListeners()`
- `removeAll()`
- `destroy()`

Additional diagnostics helpers exposed for implementation and tests:

- `definitions()`
- `stats()`

## Implementation Decisions

### Synchronous Dispatch

Dispatch is synchronous and preserves registration order.

### Error Isolation

Listener errors are isolated. The dispatcher records them in registry statistics and forwards them to the optional `onListenerError` callback when configured.

### Duplicate Listeners

Duplicate listener functions are allowed and tracked as separate registrations. `off()` removes the first matching active registration, while subscription handles remove their exact registration.

### Once Listener Semantics

Once listeners are removed before invocation so re-entrant emits do not trigger them twice.

### Destroy Semantics

`destroy()` clears listener state and makes future registration or emission invalid. Read-only inspection methods become inert after destruction.

## SSR Safety

The event infrastructure contains no references to:

- `window`
- `document`
- `navigator`
- `location`
- `history`

## Testing Summary

Implemented tests cover:

- `on()`
- `off()`
- `once()`
- `emit()`
- listener ordering
- duplicate listeners
- `removeAll()`
- `destroy()`
- `listenerCount()`
- `hasListeners()`
- registry behavior
- metadata generation
- subscription cleanup
- error isolation
- listener collection cleanup

## Improvements to Keep in Mind

- align future Browser Lifecycle event payload types directly with the generic emitter surface once Session Core exists
- decide whether the diagnostics helpers `definitions()` and `stats()` should remain public long term or move behind internal exports
- keep the emitter generic and avoid leaking Browser Lifecycle-specific assumptions into the event layer
