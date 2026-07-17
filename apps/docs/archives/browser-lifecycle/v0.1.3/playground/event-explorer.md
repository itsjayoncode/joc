---
title: Event Explorer
description: Interactive playground documentation for Event Explorer.
playground: "/playground/browser-lifecycle/events"
---

# Event Explorer

The Event Explorer is the live debugging console for `@jayoncode/browser-lifecycle` public events.

## Integration

- Route: `/events`
- Integration layer: `src/lib/playground-events.ts`
- Hook: `src/features/events/use-event-explorer.ts`

The page subscribes to the full public event feed through `lifecycle.subscribe()`. No parallel event bus is created in the playground.

## Capabilities

- Live stream up to 1,000 events
- Pause, resume, and clear
- Search and category filters
- Event details, metadata, and payload inspection
- Export to JSON, CSV, TXT, and NDJSON

## Session setup

The explorer starts a full Browser Lifecycle session with visibility, focus, connectivity, idle, lifecycle, and cross-tab modules enabled so developers can observe a rich event feed immediately.

## Interactive Playground

Explore this topic live in the [Event Explorer](/playground/browser-lifecycle/events).
