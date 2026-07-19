# Cross-tab

Coordinate multiple tabs of the same origin — leader election and a lightweight message bus over `BroadcastChannel`.

**Previous:** [Connectivity](./connectivity.md) · **Next:** [Page lifecycle](./lifecycle.md)

::: tip Playground
[Open Cross-tab playground →](/playground/browser-lifecycle/cross-tab) — open the app in two tabs and watch `tab:primary` / `tab:secondary`.
:::

## Import path

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
```

## Problem → approach

| Without cross-tab module                                     | With cross-tab coordination                                          |
| ------------------------------------------------------------ | -------------------------------------------------------------------- |
| Every open tab runs the same polling / WebSocket / sync work | One tab is `"primary"`; others are `"secondary"` via `snapshot.tab`  |
| Hand-rolled `BroadcastChannel` plumbing per feature          | `tab:primary` / `tab:secondary` / `tab:message` on the lifecycle bus |
| Off by default, easy to forget to enable                     | Explicit `crossTab: true` (or an options object) opt-in              |

```ts
const lifecycle = createBrowserLifecycle({ crossTab: true });

lifecycle.on("tab:primary", () => startSharedPolling());
lifecycle.on("tab:secondary", () => stopSharedPolling());
```

::: warning Disabled by default
`crossTab` defaults to `false`. Pass `true` for defaults, or an options object to override `channelName` / `heartbeatInterval` / `leaderTimeout`.
:::

## Pitfalls

- Requires `BroadcastChannel` support in the browser (`capabilities.broadcastChannel`) — see Browser Compatibility below.
- `crossTab.leaderTimeout` must be strictly greater than `crossTab.heartbeatInterval`, or configuration validation throws `ConfigurationError`.
- `tab:message` also fires for internal heartbeat/leader-claim traffic — filter on `event.metadata.messageType` if you only care about application-level messages.
- Always `dispose()` the session (or unsubscribe) on unmount.

---

## Technical reference

## Overview

The Cross-tab Module coordinates same-origin tabs over `BroadcastChannel` (with a `localStorage` `storage`-event fallback transport, used alongside `BroadcastChannel` when available), tracking a `primary` / `secondary` role per tab and relaying inter-tab messages.

It is responsible only for:

- claiming a role (`primary` by default) on initialization
- publishing periodic heartbeats and reacting to remote heartbeats / leader claims
- relaying received messages to Session Core
- cleaning up the channel, heartbeat timer, and listeners

## Configuration

| Option                       | Type                                                              | Default                         | Notes                                                                      |
| ---------------------------- | ----------------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------- |
| `crossTab`                   | `boolean \| { channelName?, heartbeatInterval?, leaderTimeout? }` | `false`                         | `true` enables with defaults below; an object also enables it.             |
| `crossTab.channelName`       | `string`                                                          | `"jayoncode:browser-lifecycle"` | `BroadcastChannel` name (and `localStorage` key prefix).                   |
| `crossTab.heartbeatInterval` | `number` (ms)                                                     | `1000`                          | How often the current tab publishes a heartbeat.                           |
| `crossTab.leaderTimeout`     | `number` (ms)                                                     | `3000`                          | Must be **greater than** `heartbeatInterval`, or config validation throws. |

```ts
const lifecycle = createBrowserLifecycle({
  crossTab: {
    channelName: "my-app:lifecycle",
    heartbeatInterval: 1_500,
    leaderTimeout: 4_500,
  },
});
```

## Architecture

```text
BroadcastChannel (+ localStorage fallback transport)
  -> cross-tab adapter
  -> Cross-tab Module (role tracking, heartbeat)
  -> Session Core internal event
  -> public BrowserLifecycle events
```

Implementation is split into:

- `src/modules/cross-tab/cross-tab-adapter.ts`
- `src/modules/cross-tab/cross-tab-module.ts`
- `src/modules/cross-tab/types.ts`
- `src/modules/cross-tab/index.ts`

## Session Integration

The Cross-tab Module reports role changes to Session Core through `internal:cross-tab-changed`, and every published or received message through `internal:cross-tab-message`. Session Core then:

- updates `snapshot.tab`
- records event timestamps
- emits `tab:primary` / `tab:secondary` on role change
- emits `tab:message` for every relayed message (sent or received)
- preserves lifecycle-first ordering by flushing startup role events after `session:started`

## Public Events

| Event           | `current`     | Metadata                                               |
| --------------- | ------------- | ------------------------------------------------------ |
| `tab:primary`   | `"primary"`   | `{ reason?, tabId?, transport?: "broadcast-channel" }` |
| `tab:secondary` | `"secondary"` | `{ reason?, tabId?, transport?: "broadcast-channel" }` |
| `tab:message`   | `"message"`   | `{ messageType, senderId, value? }`                    |

```ts
lifecycle.on("tab:message", (event) => {
  if (event.metadata?.messageType === "heartbeat") {
    return; // internal traffic — ignore
  }
  console.log(event.metadata);
});
```

## Role behavior

- Every tab optimistically claims `"primary"` when the module initializes.
- On hearing another tab's `heartbeat` or `leader-claim` message, a tab that is not already the active primary demotes to `"secondary"`.
- A tab already acting as primary keeps that role unless its own heartbeat has gone silent for longer than `leaderTimeout`.
- Each active tab publishes a `heartbeat` message every `heartbeatInterval` ms and a `leader-claim` message once when it starts.

## Snapshot field

```ts
const { tab } = lifecycle.getSnapshot();
// "primary" | "secondary" | "single" | "unknown"
```

`"single"` is used when the module is disabled or unsupported — there is only ever one relevant tab. `"unknown"` only appears before initialization / after disposal.

## SSR Safety

Construction remains SSR-safe:

- no `BroadcastChannel` / `localStorage` access during Session Core construction
- browser APIs are touched only through the adapter during module initialization and start

If cross-tab transport is unavailable, the module disables itself (`snapshot.tab` becomes `"single"`) without throwing.

## Browser Compatibility

This module depends on the `broadcastChannel` capability — `supportsBroadcastChannel()`, which checks for a global `BroadcastChannel` constructor. `localStorage` is used only as a secondary, best-effort transport alongside `BroadcastChannel`; it cannot activate the module on its own.

When `BroadcastChannel` is unavailable:

- `snapshot.tab` remains `"single"`
- no heartbeat timers or channel listeners are attached
- no `tab:*` events are emitted

[Page lifecycle →](./lifecycle.md)
