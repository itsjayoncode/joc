# 012 Session Core

## Why This Document Exists

This document records the implementation shape of Session Core introduced in Phase `2.2.2`. The Phase `2.1` engineering documents remain the source of truth; this file explains how the approved design was realized in code.

## Implemented Components

Session Core is implemented in:

- `src/browser-lifecycle.ts`
- `src/core/session/browser-lifecycle-session.ts`
- `src/core/session/session-state.ts`
- `src/core/session/module-registry.ts`
- `src/core/session/session-context.ts`
- `src/core/session/types.ts`
- `src/core/session/index.ts`

Related shared updates:

- `src/index.ts`
- `src/errors/index.ts`
- `src/types/index.ts`

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

Responsibilities:

- `createBrowserLifecycle()`: public instance creation
- `BrowserLifecycleSession`: lifecycle orchestration, event ownership, module ownership, plugin registration guards
- `SessionStateStore`: immutable snapshot updates and lifecycle transition validation
- `ModuleRegistry`: deterministic ordering and duplicate protection
- `createSessionContext()`: internal context shared with future modules
- `types.ts`: public session contracts plus internal session/module contracts

## Implementation Decisions

### Public Factory Over Public Class

The public package export stays aligned to the approved `createBrowserLifecycle()` factory. The internal runtime remains class-based through `BrowserLifecycleSession`.

### Immutable Snapshot Model

Snapshots are frozen through the shared `deepFreeze()` helper so public reads and module reads observe the same immutable state object.

### Narrow Lifecycle Phases

The implemented phase model follows the frozen Browser Lifecycle design:

- `created`
- `running`
- `stopped`
- `disposed`

The older Browser Session construction text referenced a larger state list, but the frozen package design narrowed that model before implementation.

### Session Core Owns Public Event Dispatch

Modules receive only internal session context. They do not emit public package events directly. Session Core remains the only public event dispatch boundary.

### Module Ordering

Modules initialize and start in ascending order. Stop and destroy run in reverse order. This keeps startup predictable and teardown dependency-safe for future observers.

### Dispose Semantics

`dispose()` is terminal and idempotent. Reads remain valid after dispose, but lifecycle control, listener registration, and plugin registration are no longer allowed.

## Current Scope

Implemented now:

- factory creation
- lifecycle start, stop, and dispose
- capability ownership
- readonly snapshot reads
- public event subscriptions
- full event feed subscriptions
- internal module registration
- internal session context
- plugin metadata registration guards

Deferred to later phases:

- browser observation modules
- browser-driven state updates
- cross-tab coordination
- full plugin execution hooks
- normalized browser event production beyond core lifecycle events

## Testing Summary

Implemented tests cover:

- session creation
- auto-start behavior
- valid lifecycle transitions
- invalid disposed usage
- public event integration
- module ordering
- duplicate module protection
- module removal
- state updates through session context
- initialization failure wrapping
- SSR-safe construction assumptions

## Improvements to Keep in Mind

- wire future observer modules through `registerModule()` instead of direct peer-to-peer communication
- expand public event coverage as browser-specific modules begin emitting normalized signals
- decide whether internal testing helpers on `BrowserLifecycleSession` should stay package-internal or move to dedicated test utilities later
