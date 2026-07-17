---
title: Presence
description: Browser Lifecycle module documentation for Presence.
---

# Presence

Page-local availability: is this tab present for interactive work?

**Previous:** [Activity](/packages/browser-lifecycle/modules/activity) · **Next:** [Timeline](/packages/browser-lifecycle/modules/timeline)

::: warning Not multi-user presence
This is **not** chat/collab “who is online”. It answers whether _this page_ is visible, focused, and online.
:::

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

[Timeline →](/packages/browser-lifecycle/modules/timeline)
