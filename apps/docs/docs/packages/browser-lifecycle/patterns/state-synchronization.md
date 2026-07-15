# State Synchronization

Share readonly snapshot fields across tabs with explicit messages.

## Implementation

1. Read `lifecycle.getSnapshot()` in the primary tab
2. Publish diffs through cross-tab messages
3. Apply updates in secondary tabs

## Playground

[State Explorer](http://127.0.0.1:4273/state) · [Cross Tab Playground](http://127.0.0.1:4273/cross-tab)
