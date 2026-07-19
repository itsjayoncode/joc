# Plugins

Cross-cutting extension points that observe the session without owning browser signals themselves.

**Previous:** [Session core](/packages/browser-lifecycle/modules/session-core) · **Next:** [Core infrastructure](/packages/browser-lifecycle/modules/core-infrastructure)

::: tip Playground
[Open Plugin playground →](/playground/browser-lifecycle/plugins) — register a plugin and inspect its hook log live.
:::

## Import path

Plugins are plain objects — no factory import needed:

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

import type { BrowserLifecyclePlugin } from "@jayoncode/browser-lifecycle";
```

## Problem → approach

| Without plugins                                        | With the plugin runtime                                                |
| ------------------------------------------------------ | ---------------------------------------------------------------------- |
| Cross-cutting logging/telemetry duplicated per feature | One `BrowserLifecyclePlugin` observes every public event via `onEvent` |
| No visibility into what ran, when, or how long it took | `getPluginHookLog()` records every hook execution                      |
| A throwing handler can crash the whole app             | Hook errors are isolated and reported as `plugin:error`                |

```ts
const telemetryPlugin: BrowserLifecyclePlugin = {
  id: "telemetry",
  onEvent(event, payload) {
    sendBeacon(event, payload);
  },
};

const lifecycle = createBrowserLifecycle({ plugins: [telemetryPlugin] });
// or, before start():
lifecycle.use(telemetryPlugin);
```

## Pitfalls

- Plugins must be registered before the session starts — `use()` throws `PluginError` once the phase is `"running"`.
- Duplicate plugin `id`s throw `PluginError`, both via `plugins: []` config and via `use()`.
- `dependencies` is metadata only today — it is exposed on plugin diagnostics but **not** resolved or enforced by the runtime.

---

## Technical reference

## Overview

The plugin runtime lets you observe (and react to) the full public event feed and session lifecycle without registering a browser-facing module. It is created lazily — only when `plugins` is configured or `use()` is called — so plugin-free sessions pay no cost.

## The `BrowserLifecyclePlugin` contract

```ts
interface BrowserLifecyclePlugin {
  readonly id: string;
  readonly name?: string;
  readonly version?: string;
  readonly author?: string;
  readonly description?: string;
  readonly enabled?: boolean; // default true
  readonly priority?: number; // default 0, higher runs first
  readonly dependencies?: readonly string[]; // metadata only, not enforced

  onRegister?(context: BrowserLifecyclePluginContext): void;
  onStart?(context: BrowserLifecyclePluginContext): void;
  onEvent?(event: BrowserLifecycleEventName, payload: unknown): void;
  onStop?(context: BrowserLifecyclePluginContext): void;
  onDestroy?(context: BrowserLifecyclePluginContext): void;
}
```

Only `id` is required. Every hook is optional — implement only what you need.

### `BrowserLifecyclePluginContext`

Passed to every lifecycle hook (not `onEvent`, which receives the raw event name and payload instead):

```ts
interface BrowserLifecyclePluginContext {
  readonly capabilities: BrowserLifecycleCapabilities;
  readonly configuration: ResolvedBrowserLifecycleConfig;
  getSnapshot(): Readonly<BrowserLifecycleSnapshot>;
}
```

## Registering plugins

### Via configuration

```ts
const lifecycle = createBrowserLifecycle({
  plugins: [telemetryPlugin, analyticsPlugin],
});
```

### Via `use()`

```ts
const lifecycle = createBrowserLifecycle({ autoStart: false });

lifecycle.use(telemetryPlugin);
lifecycle.start();
```

`use()` throws `PluginError` if:

- called after the session has started (`"Plugins must be registered before BrowserLifecycle starts."`)
- called on a disposed session
- a plugin with the same `id` is already registered

## Plugin lifecycle

```text
registered -> initialized -> started -> running -> stopped -> destroyed
```

| Hook         | Runs during                                       | Ordering                                         |
| ------------ | ------------------------------------------------- | ------------------------------------------------ |
| `onRegister` | Session initialization (before first `start`)     | Higher `priority` first, then registration order |
| `onStart`    | Every `start()` call                              | Higher `priority` first, then registration order |
| `onEvent`    | Every public event, while `enabled` and `running` | Higher `priority` first, then registration order |
| `onStop`     | `stop()` and `dispose()`                          | Reverse of start order                           |
| `onDestroy`  | `dispose()`                                       | Reverse of start order                           |

Plugins never receive `plugin:*` events through `onEvent` (no self-referential loops).

## Runtime controls

```ts
lifecycle.setPluginEnabled("telemetry", false); // skip onEvent without unregistering
lifecycle.getPlugins(); // BrowserLifecyclePluginDiagnostic[]
lifecycle.getPluginHookLog(); // BrowserLifecyclePluginHookLogEntry[] (most recent 200)
```

`getPlugins()` returns, per plugin: `id`, `enabled`, `lifecycle` phase, `priority`, `hookCount`, `registeredAt`, `registrationOrder`, `transitions` (with `durationMs` between phase changes), plus any of `author` / `description` / `name` / `version` / `loadedAt` that were provided.

`getPluginHookLog()` returns, per execution: `id`, `pluginId`, `hook`, `durationMs`, `timestamp`, and `eventType` (for `onEvent` executions).

## Public Events

| Event               | Fires when                                           | Metadata                                            |
| ------------------- | ---------------------------------------------------- | --------------------------------------------------- |
| `plugin:registered` | A plugin finishes `onRegister`                       | `{ pluginId }`                                      |
| `plugin:removed`    | A plugin is stopped (manual `stop()` or `dispose()`) | `{ pluginId, reason?: "dispose" \| "manual-stop" }` |
| `plugin:error`      | A hook throws                                        | `{ hook?, pluginId }`                               |

```ts
lifecycle.on("plugin:error", (event) => {
  console.error(event.metadata?.pluginId, event.metadata?.hook);
});
```

A throwing hook does **not** stop other plugins from running, and does not tear down the session — the error is caught, reported via `plugin:error`, and execution continues.

## SSR Safety

Plugin registration and the plugin runtime itself touch no browser globals — only your plugin's own hook implementations might.

[Core infrastructure →](/packages/browser-lifecycle/modules/core-infrastructure)
