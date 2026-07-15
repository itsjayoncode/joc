---
title: "@jayoncode/browser-lifecycle | TypeScript Browser Session API"
description: Install and use @jayoncode/browser-lifecycle for typed page visibility, focus, connectivity, idle detection, cross-tab sync, plugins, and SSR-safe browser session lifecycle management.
---

# Browser Lifecycle

`@jayoncode/browser-lifecycle` is the official browser lifecycle manager for the JOC ecosystem.

Construction docs refer to this package as **Browser Session**. The canonical public API is `createBrowserLifecycle()` and the published package name is `@jayoncode/browser-lifecycle`.

## What it provides

- Session lifecycle orchestration (`created`, `running`, `stopped`, `disposed`)
- Readonly runtime snapshots and capability detection
- Typed public events and full event feed subscriptions
- Visibility, focus, connectivity, idle, lifecycle, and cross-tab modules
- Plugin registration, lifecycle hooks, and runtime diagnostics
- Configuration helpers and infrastructure error types
- SSR-safe feature detection utilities

## Quick start

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true });

lifecycle.on("page:visible", () => {
  console.log("Page became visible");
});

lifecycle.on("page:hidden", () => {
  console.log("Page became hidden");
});
```

## Documentation map

| Topic              | Page                                                                   |
| ------------------ | ---------------------------------------------------------------------- |
| Installation       | [Installation](/packages/browser-lifecycle/installation)               |
| Usage              | [Usage Guide](/guides/browser-lifecycle/usage)                         |
| Configuration      | [Configuration](/guides/browser-lifecycle/configuration)               |
| Modules            | [Module docs](/packages/browser-lifecycle/modules/core-infrastructure) |
| API Reference      | [Generated API](/api/browser-lifecycle/)                               |
| Playground         | [Interactive docs](http://127.0.0.1:4273)                              |
| Framework examples | [Examples](/examples/)                                                 |
| Best practices     | [Best Practices](/best-practices/)                                     |
| Patterns           | [Common Patterns](/patterns/)                                          |
| FAQ                | [FAQ](/faq/)                                                           |

## Interactive playground

Every major module has a matching playground page:

- [Visibility](http://127.0.0.1:4273/visibility)
- [Focus](http://127.0.0.1:4273/focus)
- [Connectivity](http://127.0.0.1:4273/connectivity)
- [Idle](http://127.0.0.1:4273/idle)
- [Lifecycle](http://127.0.0.1:4273/lifecycle)
- [Cross Tab](http://127.0.0.1:4273/cross-tab)
- [Plugins](http://127.0.0.1:4273/plugins)
- [Events](http://127.0.0.1:4273/events)
- [State](http://127.0.0.1:4273/state)
- [Configuration](http://127.0.0.1:4273/configuration)
- [Performance](http://127.0.0.1:4273/performance)
- [Developer Tools](http://127.0.0.1:4273/developer-tools)

## Version

Current documentation version: **v0.1.0** (initial pre-release).

See [Migration](/migration/) and [Changelog](/changelog/) for release history.
