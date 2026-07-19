# Configuration

Browser Lifecycle configuration is declarative, validated, and merged with defaults before a session starts.

Canonical option table: [Core infrastructure](/packages/browser-lifecycle/modules/core-infrastructure).

## Shape

```ts
import {
  createBrowserLifecycle,
  mergeBrowserLifecycleConfig,
  validateBrowserLifecycleConfig,
} from "@jayoncode/browser-lifecycle";

// Prefer plain input objects — do not round-trip a resolved config or getSnapshot()
const merged = mergeBrowserLifecycleConfig(
  { autoStart: true },
  {
    idleTimeout: 120_000, // false = off (default); positive ms enables idle
    activityDebounce: 250,
    crossTab: true, // or { channelName, heartbeatInterval, leaderTimeout }
  },
);

validateBrowserLifecycleConfig(merged);

const lifecycle = createBrowserLifecycle(merged);
```

There are **no per-module `{ enabled }` toggles**. Signal modules start with the session; idle observation turns on only when `idleTimeout` is a positive number, and cross-tab turns on when `crossTab` is truthy.

## Common options

| Option             | Default               | Effect                                                        |
| ------------------ | --------------------- | ------------------------------------------------------------- |
| `autoStart`        | `true`                | Start observing on create                                     |
| `idleTimeout`      | `false`               | Idle detection off, or timeout in ms                          |
| `activityDebounce` | `250`                 | Debounce for activity → idle reset                            |
| `activityEvents`   | `"default"` allowlist | Which DOM events count as activity                            |
| `crossTab`         | `false`               | `true` or `{ channelName, heartbeatInterval, leaderTimeout }` |
| `emitInitialState` | `false`               | Emit initial signal events on start                           |
| `eventBufferSize`  | package default       | Ring size for recent events                                   |
| `debug`            | `false`               | Extra diagnostics                                             |
| `plugins`          | `[]`                  | Plugins registered at create time                             |

Signal modules (visibility, focus, connectivity, page lifecycle) always participate when the session is running — see [Focus](/packages/browser-lifecycle/modules/focus), [Idle](/packages/browser-lifecycle/modules/idle), [Connectivity](/packages/browser-lifecycle/modules/connectivity), [Cross-tab](/packages/browser-lifecycle/modules/cross-tab), [Page lifecycle](/packages/browser-lifecycle/modules/lifecycle).

## Applying changes

Configuration is fixed for the lifetime of a running session. To apply new settings:

1. `dispose()` the current session
2. Create a new session with updated configuration

Validate changes interactively in the [Configuration Playground](/playground/browser-lifecycle/configuration).

## Related APIs

- [`mergeBrowserLifecycleConfig`](/packages/browser-lifecycle/api/)
- [`validateBrowserLifecycleConfig`](/packages/browser-lifecycle/api/)
- [`getDefaultBrowserLifecycleConfig`](/packages/browser-lifecycle/api/)

## Related documentation

- [Core infrastructure](/packages/browser-lifecycle/modules/core-infrastructure)
- [Best Practices — Configuration](/packages/browser-lifecycle/best-practices/configuration)
- [FAQ — Configuration](/packages/browser-lifecycle/faq/configuration)
