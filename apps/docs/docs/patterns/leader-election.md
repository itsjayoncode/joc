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

[Cross Tab Playground](http://127.0.0.1:4273/cross-tab)

## Tutorial

[Advanced Tutorial](/tutorials/advanced)
