# Presence

Page-local availability: is this tab present for interactive work?

**Previous:** [Activity](./activity.md) · **Next:** [Timeline](./timeline.md)

::: warning Not multi-user presence
This is **not** chat/collab “who is online”. It answers whether _this page_ is visible, focused, and online.
:::

## Import path

```ts
import { createBrowserLifecycle, createPresenceApi } from "@jayoncode/browser-lifecycle";
```

Main package only.

## Usage

```ts
import { createBrowserLifecycle, createPresenceApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle();
const presence = createPresenceApi(lifecycle);

presence.isPresent();
presence.isAway();
presence.label(); // "ACTIVE" | "AWAY" | "UNKNOWN"
presence.state().reasons; // e.g. ["hidden", "blurred"]
```

## Default policy

`present` when `visibility === "visible"` **and** `attention === "focused"` **and** `connectivity === "online"`.

Any required input `unknown` ⇒ `unknown`.

Pure snapshot reads — no subscriptions until you opt into other APIs.

## `requireActive`

Idle time is **not** part of the default policy — a visible, focused, online tab is `present` even while idle. Pass `requireActive: true` to also require `activity === "active"`:

```ts
const presence = createPresenceApi(lifecycle, { requireActive: true });
```

With `requireActive: true`:

- `activity === "idle"` adds `"idle"` to `reasons` and reports `away`
- `activity === "unknown"` adds `"activity-unknown"` and reports `unknown`

Requires the [Idle](./idle.md) module to be enabled (`idleTimeout` set) — otherwise `activity` stays `"unknown"` and presence reports `unknown` whenever `requireActive` is on.

[Timeline →](./timeline.md)
