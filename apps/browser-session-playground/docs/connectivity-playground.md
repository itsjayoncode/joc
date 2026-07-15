# Connectivity Playground

## Purpose

The Connectivity Playground demonstrates the Browser Lifecycle Connectivity module inside the Browser Session Playground.

It teaches developers:

- advisory online and offline detection
- reconnect cycle events
- `navigator.onLine` limitations
- optional Network Information API fields

## Route

- `/connectivity`

## Architecture

```text
ConnectivityPage
  -> useConnectivityPlayground()
    -> createConnectivityPlaygroundSession() in lib/browser-lifecycle.ts
      -> @jayoncode/browser-lifecycle
    -> connection:online / connection:offline / connection:reconnect listeners
    -> snapshot reads for connectivity fields
```

Browser API information is read only inside `src/lib/browser-lifecycle.ts`. UI components never attach `online`/`offline` listeners directly.

## Page Sections

### Online Status

Shows normalized connectivity state, previous state, last change timestamp, duration since the last transition, and session phase.

### Network Information

Documents `navigator.onLine`, online/offline event support, Network Information API fields when available, and browser-to-session event mapping.

### Reconnect Timeline

Streams `connection:online`, `connection:offline`, and `connection:reconnect` events with reconnect count, last offline duration, and time since reconnect.

### Offline History

Records `connection:offline` events only, newest first, capped at 100 entries. Supports search, clear, pause, resume, and copy.

### Developer Examples

Copy-ready examples that use `createBrowserLifecycle()` for polling pause, retry, offline banners, and guarded network actions.

## Manual QA

1. Open `/connectivity` and confirm the status reads Online.
2. Use browser devtools to simulate offline mode.
3. Return online and confirm offline, online, and reconnect events appear in the timeline.

## Related Docs

- [Playground foundation](./playground.md)
- [Focus playground](./focus-playground.md)
