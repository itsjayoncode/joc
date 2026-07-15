---
title: Visibility
description: Browser Lifecycle module documentation for Visibility.
playground: http://127.0.0.1:4273/visibility
---

# Visibility

This document covers the Visibility Module introduced in Phase `2.2.3`.

## Overview

The Visibility Module is the first browser-facing module in Browser Lifecycle Manager.

It is responsible only for:

- reading page visibility state
- listening for `visibilitychange`
- reporting normalized visibility transitions to Session Core
- cleaning up browser listeners

It does not expose native browser APIs through the public package surface.

## Architecture

Implemented flow:

```text
Page Visibility API
  -> visibility adapter
  -> Visibility Module
  -> Session Core internal event
  -> public BrowserLifecycle event
```

Implementation is split into:

- `src/modules/visibility/visibility-adapter.ts`
- `src/modules/visibility/visibility-module.ts`
- `src/modules/visibility/types.ts`
- `src/modules/visibility/index.ts`

## Browser APIs

The module uses the Page Visibility API only:

- `document.visibilityState`
- `document.hidden`
- `document.addEventListener("visibilitychange", ...)`
- `document.removeEventListener("visibilitychange", ...)`

The adapter owns all direct browser interaction. The module owns normalization and lifecycle behavior.

## Session Integration

The Visibility Module does not dispatch public events directly.

It reports changes to Session Core through the internal `internal:visibility-changed` event. Session Core then:

- updates the readonly snapshot
- records event timestamps
- emits `page:visible` or `page:hidden`
- preserves lifecycle-first ordering by flushing startup visibility events after `session:started`

## Public Events

The module currently powers:

- `page:visible`
- `page:hidden`

Event metadata currently includes:

- `reason`
- `likelyLastSignal` for hidden transitions

## Initial State and Duplicates

Initial visibility is detected during module initialization and stored in the snapshot.

When `emitInitialState` is `true`, the module replays that startup visibility as a public event after `session:started`.

Duplicate browser callbacks that do not change normalized state are suppressed.

## SSR Safety

Construction remains SSR-safe:

- no `window` access during construction
- no `document` access during Session Core construction
- browser APIs are touched only through the adapter during module initialization and start

If the Page Visibility API is unavailable, the module disables itself without throwing.

## Limitations

Current scope is intentionally narrow:

- only `visible` and `hidden` are normalized
- no focus integration yet
- no lifecycle suspend or resume integration yet
- no activity or idle coordination yet

## Browser Compatibility

This module depends on the existing `visibility` capability detected by the package feature detection layer.

When that capability is unavailable:

- the snapshot visibility remains `unknown`
- no visibility listeners are attached
- no visibility events are emitted

## Examples

See:

- [examples/visibility/README.md](https://github.com/itsjayoncode/joc/tree/main/packages/browser-lifecycle/examples/visibility/README.md)

## Interactive Playground

Explore this topic live in the [Visibility](http://127.0.0.1:4273/visibility-playground).

