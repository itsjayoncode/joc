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
const { visibility, focus, connectivity } = lifecycle.getSnapshot();

// Teardown on route unmount or app shutdown
await lifecycle.dispose();
```

One instance per tab replaces scattered `document` / `window` listeners with typed events and a readonly snapshot.

[Verify event ordering →](/playground/browser-lifecycle/visibility)

## Problem → approach

| Typical pain                                                              | Browser Lifecycle                                                     |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `document`, `window`, and `navigator` listeners scattered across features | One `createBrowserLifecycle()` session with typed `on()` handlers     |
| Tab visibility, focus, and connectivity each wired differently            | Modules normalize signals; `getSnapshot()` exposes consolidated state |
| SSR crashes or silent no-ops when APIs are missing                        | Capability detection and SSR-safe defaults before modules attach      |

## Overview

`createBrowserLifecycle()` orchestrates browser signals through a module pipeline. Consumers subscribe to events or poll `getSnapshot()`; modules (visibility, focus, connectivity, idle, cross-tab) compose behind a single session boundary.

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

| #   | Guide                                                           | Topics                               | Playground                                   |
| --- | --------------------------------------------------------------- | ------------------------------------ | -------------------------------------------- |
| 1   | [Tutorial](/packages/browser-lifecycle/modules/getting-started) | Install, session, subscribe, dispose | [Dashboard](/playground/browser-lifecycle/)  |
| 2   | [Core concepts](/packages/browser-lifecycle/modules/concepts)   | Session, snapshot, events, modules   | [State](/playground/browser-lifecycle/state) |

### Core modules

| #   | Guide                                                            | Topics                | Playground                                             |
| --- | ---------------------------------------------------------------- | --------------------- | ------------------------------------------------------ |
| 3   | [Visibility](/packages/browser-lifecycle/modules/visibility)     | Page Visibility API   | [Visibility](/playground/browser-lifecycle/visibility) |
| 4   | [Events](/packages/browser-lifecycle/modules/events)             | Subscription model    | [Events](/playground/browser-lifecycle/events)         |
| 5   | [Session core](/packages/browser-lifecycle/modules/session-core) | Phases, startup order | [Lifecycle](/playground/browser-lifecycle/lifecycle)   |

### Configuration and extension

| #   | Guide                                                                          | Topics                    | Playground                                                       |
| --- | ------------------------------------------------------------------------------ | ------------------------- | ---------------------------------------------------------------- |
| 6   | [Core infrastructure](/packages/browser-lifecycle/modules/core-infrastructure) | Config, capabilities, SSR | [Configuration](/playground/browser-lifecycle/configuration)     |
| 7   | [Usage guide](/packages/browser-lifecycle/guides/usage)                        | Production patterns       | [Developer tools](/playground/browser-lifecycle/developer-tools) |
| 8   | Plugins                                                                        | Module registration       | [Plugins](/playground/browser-lifecycle/plugins)                 |

### Intelligence & DX (experimental)

| #   | Guide                                                                             | Topics                                 |
| --- | --------------------------------------------------------------------------------- | -------------------------------------- |
| 9   | [Intelligence overview](./intelligence.md)                                        | Opt-in factories, observe vs interpret |
| 10  | [Activity](./activity.md)                                                         | Active / idle facade                   |
| 11  | [Presence](./presence.md)                                                         | Page-local present / away              |
| 12  | [Timeline](./timeline.md)                                                         | Bounded event history                  |
| 13  | [Metrics](./metrics.md)                                                           | Durations, counts, attention           |
| 14  | [Reports](./reports.md)                                                           | On-demand session summary              |
| 15  | [Wait](./wait.md) / [Conditions](./conditions.md) / [Resilience](./resilience.md) | DX helpers                             |
| 16  | [Framework adapters](./adapters.md)                                               | React, Vue, Svelte, Solid, Angular     |

## Package fit

| Requirement                       | Module / event                 |
| --------------------------------- | ------------------------------ |
| Pause background work on tab hide | `page:hidden` / `page:visible` |
| React to window focus             | `window:focus` / `window:blur` |
| Offline-aware UI                  | `connectivity:*`               |
| Idle timeout / autosave triggers  | Idle module                    |
| Session duration / attention      | [Metrics](./metrics.md)        |
| Event audit log                   | [Timeline](./timeline.md)      |
| Reconnect / wake / restore        | [Resilience](./resilience.md)  |
| React / Vue / etc. bindings       | [Adapters](./adapters.md)      |
| Cross-tab coordination            | Cross-tab sync                 |
| SSR / capability guards           | Core infrastructure            |

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
