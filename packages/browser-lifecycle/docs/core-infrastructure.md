# Core Infrastructure

Configuration, capability detection, and SSR-safe utilities.

**Previous:** [Plugins](/packages/browser-lifecycle/modules/plugins) · **Back to:** [Overview](/packages/browser-lifecycle/)

::: tip Playground
[Open Configuration playground →](/playground/browser-lifecycle/configuration) — tweak options and inspect capabilities.
:::

## Import path

```ts
import {
  createBrowserLifecycle,
  createBrowserLifecycleConfig,
  supportsVisibility,
  supportsFocus,
  supportsIdle,
  supportsConnectivity,
} from "@jayoncode/browser-lifecycle";
```

Single entry. SSR: probe capabilities and construct the session on the client.

## Problem → approach

| Typical pain                          | Core infrastructure                                         |
| ------------------------------------- | ----------------------------------------------------------- |
| `document is not defined` during SSR  | Capability probes run before modules attach                 |
| Silent failures when APIs are missing | `supportsVisibility()` and friends gate optional behavior   |
| Invalid config discovered at runtime  | `createBrowserLifecycleConfig()` validates options up front |

```ts
import { createBrowserLifecycleConfig, supportsVisibility } from "@jayoncode/browser-lifecycle";

const config = createBrowserLifecycleConfig({ autoStart: true });
if (supportsVisibility()) {
  /* safe to rely on visibility events */
}
```

---

## Technical reference

This document covers the public exports introduced in Phase `2.2.0`.

## Configuration

### `BrowserLifecycleConfig` options

Every field is optional — `createBrowserLifecycleConfig()` fills in the defaults below.

| Option             | Type                                                              | Default                                                                           | Notes                                                                                  |
| ------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `activityDebounce` | `number` (ms)                                                     | `250`                                                                             | Debounce applied to activity signals before the [Idle](./idle.md) module records them. |
| `activityEvents`   | `"default" \| readonly BrowserLifecycleActivityEventName[]`       | `"default"` (`pointerdown`, `keydown`, `touchstart`, `visibilitychange`, `focus`) | See [Idle](./idle.md) for the full allowed event list.                                 |
| `autoStart`        | `boolean`                                                         | `true`                                                                            | Starts the session immediately on construction.                                        |
| `crossTab`         | `boolean \| { channelName?, heartbeatInterval?, leaderTimeout? }` | `false`                                                                           | See [Cross-tab](./cross-tab.md) for the nested defaults and constraints.               |
| `debug`            | `boolean`                                                         | `false`                                                                           | Surfaced on `getRuntimeDiagnostics()`; does not change runtime behavior on its own.    |
| `emitInitialState` | `boolean`                                                         | `false`                                                                           | Replays each module's startup state as a public event once, after `session:started`.   |
| `eventBufferSize`  | `number`                                                          | `0`                                                                               | Surfaced on `getRuntimeDiagnostics()` for event buffering tooling.                     |
| `idleTimeout`      | `false \| number` (ms)                                            | `false`                                                                           | `false` disables the [Idle](./idle.md) module entirely.                                |
| `plugins`          | `readonly BrowserLifecyclePlugin[]`                               | `[]`                                                                              | See [Plugins](./plugins.md) for the full contract.                                     |

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

const lifecycle = createBrowserLifecycle({
  autoStart: false,
  emitInitialState: true,
  idleTimeout: 30_000,
  activityDebounce: 500,
  crossTab: true,
});
```

Passing an unknown key, an out-of-range value, or an invalid `crossTab` / `activityEvents` / `plugins` shape throws `ConfigurationError` with a list of `{ message, path }` issues.

### `createBrowserLifecycleConfig(input?)`

Validates and resolves configuration into an immutable object.

### `getDefaultBrowserLifecycleConfig()`

Returns a fresh immutable copy of the package defaults.

### `mergeBrowserLifecycleConfig(base?, override?)`

Merges two configuration objects, validates the result, and returns the resolved immutable config.

### `validateBrowserLifecycleConfig(input)`

Validates unknown input and throws `ConfigurationError` when the shape is invalid.

### `getPluginIds(config)`

Returns the configured plugin ids from a resolved configuration.

## Feature Detection

### `detectBrowserLifecycleCapabilities(environment?)`

Returns the capability snapshot used by the package's infrastructure layer.

### `supportsVisibility(environment?)`

Returns whether the environment supports the Page Visibility API.

### `supportsBroadcastChannel(environment?)`

Returns whether the environment supports `BroadcastChannel`.

### `supportsPageLifecycle(environment?)`

Returns whether the environment exposes `pagehide` and `pageshow` hooks.

### `supportsRequestIdleCallback(environment?)`

Returns whether the environment supports `requestIdleCallback`.

### `supportsAbortController(environment?)`

Returns whether the environment supports `AbortController`.

### `supportsFocus(environment?)`

Returns whether the environment can observe window focus/blur (`addEventListener` on `window` + `document.hasFocus`). Used by the [Focus](./focus.md) module.

### `supportsIdle(environment?)`

Returns whether the environment can observe activity for idle detection (`window` listeners + `document`). Required when `idleTimeout` is enabled — see [Idle](./idle.md).

### `supportsConnectivity(environment?)`

Returns whether the environment exposes advisory online/offline (`navigator.onLine` + `window` online/offline events). See [Connectivity](./connectivity.md).

`BrowserLifecycleCapabilities` on the session snapshot includes all eight flags: `visibility`, `focus`, `idle`, `connectivity`, `broadcastChannel`, `pageLifecycle`, `requestIdleCallback`, `abortController`.

## Utilities

### `assert(condition, message)`

Throws when a condition is falsy.

### `noop()`

No-op helper for optional callbacks and defaults.

### `isBrowser()`

Returns whether the current runtime looks like a browser environment.

### `isFunction(value)`

Returns whether a value is callable.

### `isObject(value)`

Returns whether a value is a non-null object.

### `deepFreeze(value)`

Recursively freezes an object tree and returns a readonly view.

### `mergeObjects(base, override)`

Recursively merges plain objects while replacing arrays and scalar values.

## Errors

### `BrowserLifecycleError`

Base error for the public infrastructure surface.

### `ConfigurationError`

Thrown for invalid configuration input.

### `UnsupportedFeatureError`

Thrown when a required feature is unavailable.

### `InitializationError`

Thrown when initialization cannot proceed.

### `LifecycleError`

Thrown for invalid session lifecycle transitions (e.g. operating on a disposed session).

### `ModuleRegistryError`

Thrown when module registration fails (duplicate module, missing capability, etc.).

### `PluginError`

Thrown by the [plugin runtime](./plugins.md) — duplicate plugin ids, registering after start, using an unregistered plugin id with `setPluginEnabled()`, etc. Also carried as `previous`/context metadata on the `plugin:error` event when a plugin hook throws.

## Exported Types

The root package currently exports, from `./types/index.js`:

- `BrowserFeatureEnvironment`
- `BrowserLifecycleActivityEventName`
- `BrowserLifecycleCapabilities`
- `BrowserLifecycleConfig`
- `BrowserLifecycleCrossTabConfig`
- `BrowserLifecycleCrossTabConfigInput`
- `BrowserLifecycleErrorCode`
- `BrowserLifecyclePlugin`
- `BrowserLifecyclePluginRuntimeContext`
- `BrowserLifecycleValidationIssue`
- `ResolvedBrowserLifecycleConfig`

See [Plugins](./plugins.md), [Session core](./session-core.md), and [Events](/packages/browser-lifecycle/modules/events) for the module/session/event types exported alongside these.
