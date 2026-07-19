---
title: Browser Lifecycle overview
description: "Documentation overview for @jayoncode/browser-lifecycle — guides, modules, intelligence, and adapters."
---

# Package overview

Typed browser session lifecycle — visibility, focus, connectivity, idle detection, cross-tab sync, and plugins in one headless API.

## When to use

- Pause media/polling when the tab hides; resume on visible
- Idle / session-timeout UX, connectivity-aware sync, cross-tab leadership
- One shared session instead of scattered `document` / `window` listeners

## When not to use

- You only need a one-off `visibilitychange` in a tiny page (raw API may be enough)
- Server-only Node services with no browser globals — create the session in the client bootstrap
- Full product analytics SDKs — this normalizes lifecycle signals; export metrics yourself

## Features

- Visibility, focus, connectivity, idle, and cross-tab modules behind one session
- Typed `on()` events + readonly `getSnapshot()`
- SSR-safe capability detection before modules attach
- Plugins and opt-in intelligence modules (activity, presence, timeline, …)

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

// Read consolidated state at any time
const { visibility, attention, connectivity } = lifecycle.getSnapshot();

// Teardown on route unmount or app shutdown
await lifecycle.dispose();
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

`createBrowserLifecycle()` orchestrates browser signals through a module pipeline. Consumers subscribe to events or poll `getSnapshot()`; modules (visibility, focus, connectivity, idle, page lifecycle, cross-tab) compose behind a single session boundary.

| Concern     | API surface                               |
| ----------- | ----------------------------------------- |
| Lifecycle   | `start()`, `dispose()`, phase events      |
| Signals     | `on(event, handler)`, `onEvent(handler)`  |
| State       | `getSnapshot()` — readonly session state  |
| Extension   | Plugin hooks, module configuration        |
| Diagnostics | `getRuntimeDiagnostics()` for development |

Designed for SSR-safe capability detection and framework-agnostic integration (React, Vue, vanilla, etc.).

::: warning Always dispose
Call `await lifecycle.dispose()` on route unmount or app shutdown. Disposed sessions must not be reused — create a new instance.
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

### Core modules

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

### Intelligence & DX (experimental)

| #   | Guide                                                                                                                                                                          | Topics                                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| 14  | [Intelligence overview](/packages/browser-lifecycle/modules/intelligence)                                                                                                      | Opt-in factories, observe vs interpret |
| 15  | [Activity](/packages/browser-lifecycle/modules/activity)                                                                                                                       | Active / idle facade                   |
| 16  | [Presence](/packages/browser-lifecycle/modules/presence)                                                                                                                       | Page-local present / away              |
| 17  | [Timeline](/packages/browser-lifecycle/modules/timeline)                                                                                                                       | Bounded event history                  |
| 18  | [Metrics](/packages/browser-lifecycle/modules/metrics)                                                                                                                         | Durations, counts, attention           |
| 19  | [Reports](/packages/browser-lifecycle/modules/reports)                                                                                                                         | On-demand session summary              |
| 20  | [Wait](/packages/browser-lifecycle/modules/wait) / [Conditions](/packages/browser-lifecycle/modules/conditions) / [Resilience](/packages/browser-lifecycle/modules/resilience) | DX helpers                             |
| 21  | [Framework adapters](/packages/browser-lifecycle/modules/adapters)                                                                                                             | React, Vue, Svelte, Solid, Angular     |

## Package fit

| Requirement                           | Module / event                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| Pause background work on tab hide     | `page:hidden` / `page:visible`                                                 |
| React to window focus                 | `window:focus` / `window:blur`                                                 |
| Offline-aware UI                      | `connection:*`                                                                 |
| Idle timeout / autosave triggers      | Idle module                                                                    |
| Session duration / attention          | [Metrics](/packages/browser-lifecycle/modules/metrics)                         |
| Event audit log                       | [Timeline](/packages/browser-lifecycle/modules/timeline)                       |
| Reconnect / wake / restore            | [Resilience](/packages/browser-lifecycle/modules/resilience)                   |
| React / Vue / etc. bindings           | [Adapters](/packages/browser-lifecycle/modules/adapters)                       |
| Cross-tab coordination                | [Cross-tab](/packages/browser-lifecycle/modules/cross-tab)                     |
| Cross-cutting observation / telemetry | [Plugins](/packages/browser-lifecycle/modules/plugins)                         |
| SSR / capability guards               | [Core infrastructure](/packages/browser-lifecycle/modules/core-infrastructure) |

## Reference

| Resource           | Link                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| API (TypeDoc)      | [/packages/browser-lifecycle/api/](/packages/browser-lifecycle/api/)                                   |
| Framework adapters | [/packages/browser-lifecycle/modules/adapters](/packages/browser-lifecycle/modules/adapters)           |
| Framework examples | [/packages/browser-lifecycle/examples/](/packages/browser-lifecycle/examples/)                         |
| Best practices     | [/packages/browser-lifecycle/best-practices/](/packages/browser-lifecycle/best-practices/)             |
| Patterns           | [/packages/browser-lifecycle/patterns/](/packages/browser-lifecycle/patterns/)                         |
| FAQ                | [/packages/browser-lifecycle/faq/](/packages/browser-lifecycle/faq/)                                   |
| Playground guide   | [/packages/browser-lifecycle/playground/playground](/packages/browser-lifecycle/playground/playground) |

## Version

<BrowserLifecycleVersion mode="overview" />
