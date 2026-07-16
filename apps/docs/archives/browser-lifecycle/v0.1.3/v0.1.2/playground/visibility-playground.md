---
title: Visibility Playground
description: Interactive playground documentation for Visibility Playground.
playground: http://127.0.0.1:4273/visibility
---

# Visibility Playground

## Purpose

The Visibility Playground demonstrates the Browser Lifecycle Visibility module inside the Browser Session Playground.

It teaches developers:

- what page visibility means in browser applications
- how Browser Lifecycle normalizes visibility state
- how `page:visible` and `page:hidden` events are ordered and delivered

## Route

- `/visibility`

## Architecture

```text
VisibilityPage
  -> useVisibilityPlayground()
    -> createVisibilityPlaygroundSession() in lib/browser-lifecycle.ts
      -> @jayoncode/browser-lifecycle
    -> page:visible / page:hidden listeners
    -> snapshot reads for visibility fields
```

UI components never attach browser listeners directly. All Browser Lifecycle access stays behind `src/lib/browser-lifecycle.ts`.

## Page Sections

### Visibility Status

Shows normalized page visibility state, previous state, last change timestamp, duration since the last transition, and session phase.

### Browser API Information

Documents the browser APIs mapped into Browser Lifecycle:

- `document.visibilityState`
- `visibilitychange` events

### Event Timeline

Records ordered `page:visible` and `page:hidden` events with timestamps and metadata for manual QA.

## Related Documentation

- [Visibility Module](/packages/browser-lifecycle/modules/visibility)
- [Session Core](/packages/browser-lifecycle/modules/session-core)
- [Events](/packages/browser-lifecycle/modules/events)

## Interactive Playground

Explore this topic live in the [Visibility Playground](http://127.0.0.1:4273/visibility).
