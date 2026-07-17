---
title: State Explorer
description: Interactive playground documentation for State Explorer.
playground: "/playground/browser-lifecycle/state"
---

# State Explorer

The State Explorer inspects live `BrowserLifecycleSnapshot` values from `@jayoncode/browser-lifecycle`.

## Integration

- Route: `/state`
- Integration layer: `src/lib/playground-state.ts`
- Hook: `src/features/state/use-state-explorer.ts`

The page subscribes to the public event feed and polls session snapshots so module state, history, and diffs always reflect the running Browser Lifecycle instance.

## Capabilities

- Session overview (phase, uptime, module count)
- Module state cards for visibility, focus, connectivity, idle, lifecycle, and cross-tab
- Snapshot history up to 100 records
- State diff between selected snapshots
- JSON viewer with search and export

## Interactive Playground

Explore this topic live in the [State Explorer](/playground/browser-lifecycle/state).
