# 013 Visibility Module

## Why This Document Exists

This document records the implementation shape of the Visibility Module introduced in Phase `2.2.3`. The Phase `2.1` engineering documents remain the source of truth; this file explains how the approved design was realized in code.

## Implemented Components

The Visibility Module is implemented in:

- `src/modules/visibility/visibility-adapter.ts`
- `src/modules/visibility/visibility-module.ts`
- `src/modules/visibility/types.ts`
- `src/modules/visibility/index.ts`

Related integration changes:

- `src/core/session/browser-lifecycle-session.ts`
- `src/core/session/types.ts`
- `src/index.ts`

## Architecture

Implemented flow:

```text
document.visibilityState / document.hidden
  -> visibility adapter
  -> BrowserVisibilityModule
  -> internal:visibility-changed
  -> BrowserLifecycleSession
  -> page:visible / page:hidden
```

Responsibilities:

- adapter: browser interaction only
- module: normalization, duplicate suppression, listener lifecycle
- Session Core: snapshot mutation, event ordering, public dispatch

## Implementation Decisions

### Adapter and Module Split

The adapter owns direct browser APIs. The module owns business logic. This keeps browser interaction isolated and testable.

### Session Core Owns Public Dispatch

The module emits only internal visibility signals. Public `page:visible` and `page:hidden` events are emitted by Session Core so modules do not bypass core-owned ordering or snapshot logic.

### Startup Ordering

Visibility startup events are queued while Session Core is still entering the running phase. They flush only after `session:started` so lifecycle control remains the first public transition.

### Capability-Gated Degradation

If the `visibility` capability is unavailable, the module disables itself without throwing. Snapshot visibility stays `unknown`.

### Re-Start Synchronization

When the instance restarts after `stop()`, the module re-reads current visibility and emits a transition only if the state changed while observation was paused.

## Browser API Boundaries

Direct browser usage is limited to:

- `document.hidden`
- `document.visibilityState`
- `visibilitychange` listener registration

No browser logic was added outside the adapter.

## Testing Summary

Implemented tests cover:

- adapter support detection
- initial visibility detection
- visible to hidden transitions
- hidden to visible transitions
- duplicate suppression
- startup initial-state replay
- capability-unavailable degradation
- listener cleanup
- destroy behavior
- restart synchronization
- Session Core integration
- SSR-safe construction

## Improvements to Keep in Mind

- keep visibility as the strongest baseline page truth for later focus and lifecycle modules
- avoid leaking raw browser visibility strings into the public contract
- preserve Session Core as the single public event authority as more modules are added
