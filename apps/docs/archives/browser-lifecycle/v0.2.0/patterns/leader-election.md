# Leader Election

Elect one tab to own background work.

## Implementation

```ts
lifecycle.on("tab:primary", () => becomeLeader());
lifecycle.on("tab:secondary", () => resignLeadership());
```

## Testing

Open multiple tabs and verify promotion when the leader closes.

## Playground

[Cross Tab Playground](/playground/browser-lifecycle/cross-tab)

## Tutorial

[Advanced Tutorial](/packages/browser-lifecycle/tutorials/advanced)
