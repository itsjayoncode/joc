# Advanced Tutorial

Build cross-tab leader election with shared messaging.

## Goal

Elect a primary tab that owns background sync while secondary tabs stay passive.

## Architecture

```mermaid
flowchart LR
  TabA[Tab A] --> BL[Browser Lifecycle]
  TabB[Tab B] --> BL
  BL --> CT[Cross Tab Module]
  CT --> BC[BroadcastChannel]
```

## Step 1 — Enable cross-tab coordination

```ts
const lifecycle = createBrowserLifecycle({
  autoStart: true,
  crossTab: { enabled: true },
});
```

## Step 2 — React to leadership changes

```ts
lifecycle.on("tab:primary", () => {
  startBackgroundSync();
});

lifecycle.on("tab:secondary", () => {
  stopBackgroundSync();
});
```

## Step 3 — Broadcast messages

```ts
lifecycle.on("tab:message", (event) => {
  console.log("message from", event.metadata.tabId, event.metadata.payload);
});
```

Use the session API exposed by the cross-tab module to publish messages from the primary tab.

## Testing recommendations

- Open two tabs locally and verify only one receives `tab:primary`
- Close the primary tab and confirm promotion
- Use the [Cross Tab Playground](/playground/browser-lifecycle/cross-tab)

## Related patterns

- [Leader Election](/packages/browser-lifecycle/patterns/leader-election)
- [Shared WebSocket](/packages/browser-lifecycle/patterns/shared-websocket)
- [State Synchronization](/packages/browser-lifecycle/patterns/state-synchronization)
