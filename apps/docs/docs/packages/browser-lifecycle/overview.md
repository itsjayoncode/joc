---
title: Browser Lifecycle overview
description: "Documentation overview for @jayoncode/browser-lifecycle — guides, modules, intelligence, and adapters."
---

# Package overview

**Observe browser state. Derive session intelligence. React with confidence.**

Browser Lifecycle (`@jayoncode/browser-lifecycle`) normalizes browser session signals into **one session, one snapshot, and one event stream** — with optional session intelligence and DX on top.

> One session. One snapshot. One event stream.  
> Everything else is derived.

## Observe → Understand → React

```text
Browser APIs
    ↓
Normalized Session
    ↓
Session Intelligence (opt-in)
    ↓
Developer APIs (opt-in)
```

| Most libraries        | Browser Lifecycle                                                         |
| --------------------- | ------------------------------------------------------------------------- |
| Browser APIs → Events | Browser APIs → Normalized Session → Session Intelligence → Developer APIs |

| Pillar         | Meaning                                                         |
| -------------- | --------------------------------------------------------------- |
| **Observe**    | Normalize browser lifecycle into one consistent API             |
| **Understand** | Transform signals into meaningful session insights              |
| **React**      | Build resilient apps with Wait, Conditions, Resilience, plugins |

### Five capabilities

| Card                          | Distinction                                                                   |
| ----------------------------- | ----------------------------------------------------------------------------- |
| **Unified Browser Lifecycle** | Foundation — visibility, focus, connectivity, idle, page lifecycle, cross-tab |
| **Session Intelligence**      | **Current** derived state — activity + page-local presence                    |
| **Timeline**                  | **Chronological** session event history                                       |
| **Session Insights**          | **Aggregates** — metrics + reports (not an analytics SDK)                     |
| **Developer Experience**      | **How** you react — Wait, Conditions, Resilience, plugins, playground         |

## When to use

- Pause media/polling when the tab hides; resume on visible
- Idle / session-timeout UX, connectivity-aware sync, cross-tab leadership
- One shared session instead of scattered `document` / `window` listeners
- Opt-in timeline, metrics, or wait helpers when you need them

## When not to use

- You only need a one-off `visibilitychange` in a tiny page (raw API may be enough)
- Server-only Node services with no browser globals — create the session in the client bootstrap
- Product analytics / telemetry SDKs — this is session understanding, not an analytics product
- Multi-user presence — presence here is **page-local** (this browser session)

## Features

- Visibility, focus, connectivity, idle, page lifecycle, and cross-tab behind one session
- Typed `on()` / `subscribe()` events + readonly `getSnapshot()`
- SSR-safe capability detection before modules attach
- Plugins and **opt-in** intelligence / DX factories (zero-cost until you ask)

## Zero-cost until you ask

Core observation stays lightweight. Session intelligence and developer experience allocate only after you call their factories.

```ts
import { createBrowserLifecycle, createTimelineApi } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true });
// lean core only

const timeline = createTimelineApi(lifecycle);
// cost starts here
```

## Single entrypoint

Everything imports from `@jayoncode/browser-lifecycle` (no feature subpaths). Tree-shaking still applies to unused exports.

## Install

```bash
npm install @jayoncode/browser-lifecycle
```

```bash
pnpm add @jayoncode/browser-lifecycle
```

```bash
yarn add @jayoncode/browser-lifecycle
```

## Example: pause work when the tab is hidden

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({ autoStart: true });

lifecycle.on("page:hidden", () => {
  pauseMedia();
  flushTelemetry();
});

lifecycle.on("page:visible", () => {
  resumeMedia();
});

// Form Intelligence composition (optional peer): save drafts when the tab hides —
// see [FI Patterns → Draft on tab hide](/packages/form-intelligence/modules/patterns#composition-draft-on-tab-hide-browser-lifecycle).

const { visibility, attention, connectivity } = lifecycle.getSnapshot();

// Sync teardown — disposed sessions must not be reused
lifecycle.dispose();
```

One instance per tab replaces scattered `document` / `window` listeners with typed events and a readonly snapshot.

[Verify event ordering →](/playground/browser-lifecycle/)

## Problem → approach

| Typical pain                                                              | Browser Lifecycle                                                     |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `document`, `window`, and `navigator` listeners scattered across features | One `createBrowserLifecycle()` session with typed `on()` handlers     |
| Tab visibility, focus, and connectivity each wired differently            | Modules normalize signals; `getSnapshot()` exposes consolidated state |
| SSR crashes or silent no-ops when APIs are missing                        | Capability detection and SSR-safe defaults before modules attach      |

## Overview

`createBrowserLifecycle()` orchestrates browser signals through a module pipeline. Consumers subscribe to events or poll `getSnapshot()`; modules compose behind a single session boundary.

| Concern     | API surface                                                     |
| ----------- | --------------------------------------------------------------- |
| Lifecycle   | `start()`, `stop()`, `dispose()`, phase events                  |
| Signals     | `on(event, handler)`, `once()`, `subscribe()` for the full feed |
| State       | `getSnapshot()` — readonly session state                        |
| Extension   | Plugin hooks (`onEvent` on plugins), module configuration       |
| Diagnostics | `getRuntimeDiagnostics()` for development                       |

Designed for SSR-safe capability detection and framework-agnostic integration (React, Vue, vanilla, etc.).

::: warning Always dispose
Call `lifecycle.dispose()` on route unmount or app shutdown (`dispose` is synchronous). Disposed sessions must not be reused — create a new instance.
:::

::: tip SSR
Construct and `start()` only in the browser (or after hydration). Capability detection avoids crashing when `document` / `window` are missing; listeners still need a client environment.
:::

## Documentation path

### Foundation

| #   | Guide                                                           | Topics                               | Playground                                                                               |
| --- | --------------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------- |
| 1   | [Tutorial](/packages/browser-lifecycle/modules/getting-started) | Install, session, subscribe, dispose | [Sandbox](/playground/browser-lifecycle/)                                                |
| 2   | [Core concepts](/packages/browser-lifecycle/modules/concepts)   | Session, snapshot, events, modules   | [Sandbox](/playground/browser-lifecycle/) / [State](/playground/browser-lifecycle/state) |

### Core modules (Observe)

| #   | Guide                                                            | Topics                        | Playground                                                 |
| --- | ---------------------------------------------------------------- | ----------------------------- | ---------------------------------------------------------- |
| 3   | [Visibility](/packages/browser-lifecycle/modules/visibility)     | Page Visibility API           | [Visibility](/playground/browser-lifecycle/visibility)     |
| 4   | [Focus](/packages/browser-lifecycle/modules/focus)               | Window focus / blur           | [Focus](/playground/browser-lifecycle/focus)               |
| 5   | [Idle](/packages/browser-lifecycle/modules/idle)                 | Activity + idle timeout       | [Idle](/playground/browser-lifecycle/idle)                 |
| 6   | [Connectivity](/packages/browser-lifecycle/modules/connectivity) | Advisory online/offline       | [Connectivity](/playground/browser-lifecycle/connectivity) |
| 7   | [Cross-tab](/packages/browser-lifecycle/modules/cross-tab)       | Leader election, tab messages | [Cross Tab](/playground/browser-lifecycle/cross-tab)       |
| 8   | [Page lifecycle](/packages/browser-lifecycle/modules/lifecycle)  | Suspend / resume / restore    | [Lifecycle](/playground/browser-lifecycle/lifecycle)       |
| 9   | [Events](/packages/browser-lifecycle/modules/events)             | Subscription model            | [Events](/playground/browser-lifecycle/events)             |
| 10  | [Session core](/packages/browser-lifecycle/modules/session-core) | Phases, startup order         | [Lifecycle](/playground/browser-lifecycle/lifecycle)       |

### Configuration and extension

| #   | Guide                                                                          | Topics                       | Playground                                                       |
| --- | ------------------------------------------------------------------------------ | ---------------------------- | ---------------------------------------------------------------- |
| 11  | [Plugins](/packages/browser-lifecycle/modules/plugins)                         | Hooks, priority, diagnostics | [Plugins](/playground/browser-lifecycle/plugins)                 |
| 12  | [Core infrastructure](/packages/browser-lifecycle/modules/core-infrastructure) | Config, capabilities, SSR    | [Configuration](/playground/browser-lifecycle/configuration)     |
| 13  | [Usage guide](/packages/browser-lifecycle/guides/usage)                        | Production patterns          | [Developer tools](/playground/browser-lifecycle/developer-tools) |

### Understand & React (opt-in)

| #   | Guide                                                                                                                                                                          | Topics                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| 14  | [Intelligence overview](/packages/browser-lifecycle/modules/intelligence)                                                                                                      | Observe → Understand → React; factories      |
| 15  | [Activity](/packages/browser-lifecycle/modules/activity) / [Presence](/packages/browser-lifecycle/modules/presence)                                                            | Session Intelligence (current derived state) |
| 16  | [Timeline](/packages/browser-lifecycle/modules/timeline)                                                                                                                       | Chronological history                        |
| 17  | [Metrics](/packages/browser-lifecycle/modules/metrics) / [Reports](/packages/browser-lifecycle/modules/reports)                                                                | Session Insights (aggregates)                |
| 18  | [Wait](/packages/browser-lifecycle/modules/wait) / [Conditions](/packages/browser-lifecycle/modules/conditions) / [Resilience](/packages/browser-lifecycle/modules/resilience) | Developer Experience                         |
| 19  | [Framework adapters](/packages/browser-lifecycle/modules/adapters)                                                                                                             | React, Vue, Svelte, Solid, Angular           |

## Package fit

| Requirement                       | Module / event                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------ |
| Pause background work on tab hide | `page:hidden` / `page:visible`                                                 |
| React to window focus             | `window:focus` / `window:blur`                                                 |
| Offline-aware UI                  | `connection:*` (advisory)                                                      |
| Idle timeout / autosave triggers  | Idle module                                                                    |
| Session duration / attention      | [Metrics](/packages/browser-lifecycle/modules/metrics) (Session Insights)      |
| Event audit log                   | [Timeline](/packages/browser-lifecycle/modules/timeline)                       |
| Reconnect / wake / restore        | [Resilience](/packages/browser-lifecycle/modules/resilience)                   |
| React / Vue / etc. bindings       | [Adapters](/packages/browser-lifecycle/modules/adapters)                       |
| Cross-tab coordination            | [Cross-tab](/packages/browser-lifecycle/modules/cross-tab)                     |
| Cross-cutting observation         | [Plugins](/packages/browser-lifecycle/modules/plugins)                         |
| SSR / capability guards           | [Core infrastructure](/packages/browser-lifecycle/modules/core-infrastructure) |

## Reference

| Resource           | Link                                                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| API (TypeDoc)      | [/packages/browser-lifecycle/api/](/packages/browser-lifecycle/api/)                                              |
| Framework adapters | [/packages/browser-lifecycle/modules/adapters](/packages/browser-lifecycle/modules/adapters)                      |
| Framework examples | [/packages/browser-lifecycle/examples/](/packages/browser-lifecycle/examples/)                                    |
| Best practices     | [/packages/browser-lifecycle/best-practices/](/packages/browser-lifecycle/best-practices/)                        |
| Patterns           | [/packages/browser-lifecycle/patterns/](/packages/browser-lifecycle/patterns/)                                    |
| FAQ                | [/packages/browser-lifecycle/faq/](/packages/browser-lifecycle/faq/)                                              |
| Playground guide   | [/packages/browser-lifecycle/playground/playground](/packages/browser-lifecycle/playground/playground)            |
| Draft Desk         | [Official reference app — online/offline & session signals in a live form flow](https://jayoncode.com/draft-desk) |

## Version

<BrowserLifecycleVersion mode="overview" />
