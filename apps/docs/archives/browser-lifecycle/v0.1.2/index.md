---
title: "@jayoncode/browser-lifecycle | TypeScript Browser Session API"
description: Install and use @jayoncode/browser-lifecycle for typed page visibility, focus, connectivity, idle detection, cross-tab sync, plugins, and SSR-safe browser session lifecycle management.
---

> [!NOTE]
> **Archived documentation (v0.1.2)** — You are viewing a frozen snapshot for `@jayoncode/browser-lifecycle@0.1.2`. See the [latest docs](/packages/browser-lifecycle/) for the current release.

# Browser Lifecycle

<BrowserLifecycleVersion />

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
| Usage              | [Usage Guide](/packages/browser-lifecycle/guides/usage)                |
| Configuration      | [Configuration](/packages/browser-lifecycle/guides/configuration)      |
| Modules            | [Module docs](/packages/browser-lifecycle/modules/core-infrastructure) |
| API Reference      | [Generated API](/packages/browser-lifecycle/api/)                      |
| Playground         | [Interactive docs](/playground/browser-lifecycle)                      |
| Framework examples | [Examples](/packages/browser-lifecycle/examples/)                      |
| Best practices     | [Best Practices](/packages/browser-lifecycle/best-practices/)          |
| Patterns           | [Common Patterns](/packages/browser-lifecycle/patterns/)               |
| FAQ                | [FAQ](/packages/browser-lifecycle/faq/)                                |

## Interactive playground

Every major module has a matching playground page:

- [Visibility](/playground/browser-lifecycle/visibility)
- [Focus](/playground/browser-lifecycle/focus)
- [Connectivity](/playground/browser-lifecycle/connectivity)
- [Idle](/playground/browser-lifecycle/idle)
- [Lifecycle](/playground/browser-lifecycle/lifecycle)
- [Cross Tab](/playground/browser-lifecycle/cross-tab)
- [Plugins](/playground/browser-lifecycle/plugins)
- [Events](/playground/browser-lifecycle/events)
- [State](/playground/browser-lifecycle/state)
- [Configuration](/playground/browser-lifecycle/configuration)
- [Performance](/playground/browser-lifecycle/performance)
- [Developer Tools](/playground/browser-lifecycle/developer-tools)

## Version

<BrowserLifecycleVersion mode="overview" />
