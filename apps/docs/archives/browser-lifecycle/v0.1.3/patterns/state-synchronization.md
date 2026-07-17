# State Synchronization

Share readonly snapshot fields across tabs with explicit messages.

## Implementation

1. Read `lifecycle.getSnapshot()` in the primary tab
2. Publish diffs through cross-tab messages
3. Apply updates in secondary tabs

## Playground

[State Explorer](/playground/browser-lifecycle/state) · [Cross Tab Playground](/playground/browser-lifecycle/cross-tab)
