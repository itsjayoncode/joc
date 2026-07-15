# 016 Connectivity Playground

## Why This Document Exists

This document records the implementation shape of the Connectivity Playground introduced in Phase `3.6`.

## Implemented Surface

- Route: `/connectivity`
- Page: `src/pages/ConnectivityPage.tsx`
- Hook: `src/features/connectivity/use-connectivity-playground.ts`
- Integration boundary: `src/lib/browser-lifecycle.ts`

## Architecture

```text
ConnectivityPage
  -> useConnectivityPlayground()
    -> createConnectivityPlaygroundSession() in lib/browser-lifecycle.ts
      -> @jayoncode/browser-lifecycle
    -> connection:online / connection:offline / connection:reconnect listeners
    -> snapshot reads for connectivity fields
```

## User-Facing Behavior

- Creates and starts a Browser Lifecycle session when the page mounts
- Displays normalized snapshot connectivity state
- Streams connection events and reconnect cycle statistics
- Maintains offline-only history with search, clear, pause, resume, and copy actions
- Documents browser API mapping, `navigator.onLine` limitations, and Network Information API fields when available
- Provides copy-ready developer examples using `createBrowserLifecycle()`
- Degrades to a placeholder state when the connectivity capability is unavailable

## Package Dependency

Phase `3.6` required the Connectivity module in `@jayoncode/browser-lifecycle`:

- `packages/browser-lifecycle/src/modules/connectivity/`
- public events: `connection:online`, `connection:offline`, `connection:reconnect`
- snapshot field: `connectivity`

## Tests

- `src/lib/browser-lifecycle.test.ts` covers connectivity integration helpers and event-log formatting
