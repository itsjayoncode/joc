# Shared WebSocket

Maintain one WebSocket connection in the primary tab.

## Architecture

```mermaid
flowchart TD
  Primary[Primary Tab] --> WS[WebSocket]
  Secondary[Secondary Tabs] --> CT[Cross Tab Messages]
  CT --> Primary
```

## Related

- [Leader Election](/packages/browser-lifecycle/patterns/leader-election)
- [Cross Tab Playground](http://127.0.0.1:4273/cross-tab)
