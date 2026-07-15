# Configuration

Browser Lifecycle configuration is declarative, validated, and merged with defaults before a session starts.

## Shape

```ts
import {
  createBrowserLifecycle,
  getDefaultBrowserLifecycleConfig,
  mergeBrowserLifecycleConfig,
  validateBrowserLifecycleConfig,
} from "@jayoncode/browser-lifecycle";

const defaults = getDefaultBrowserLifecycleConfig();
const merged = mergeBrowserLifecycleConfig(defaults, {
  idle: { enabled: true, thresholdMs: 120_000 },
});

validateBrowserLifecycleConfig(merged);

const lifecycle = createBrowserLifecycle(merged);
```

## Module toggles

Each observation module can be enabled or disabled independently:

| Module       | Key            | Events                                                                  |
| ------------ | -------------- | ----------------------------------------------------------------------- |
| Visibility   | `visibility`   | `page:visible`, `page:hidden`                                           |
| Focus        | `focus`        | `window:focus`, `window:blur`                                           |
| Connectivity | `connectivity` | `connection:online`, `connection:offline`, `connection:reconnect`       |
| Idle         | `idle`         | `session:active`, `session:idle`, `activity:detected`, `activity:reset` |
| Lifecycle    | `lifecycle`    | page lifecycle transitions                                              |
| Cross Tab    | `crossTab`     | `tab:primary`, `tab:secondary`, `tab:message`                           |

## Applying changes

Configuration is fixed for the lifetime of a running session. To apply new settings:

1. `dispose()` the current session
2. Create a new session with updated configuration

Validate changes interactively in the [Configuration Playground](http://127.0.0.1:4273/configuration).

## Related APIs

- [`mergeBrowserLifecycleConfig`](/packages/browser-lifecycle/api/)
- [`validateBrowserLifecycleConfig`](/packages/browser-lifecycle/api/)
- [`getDefaultBrowserLifecycleConfig`](/packages/browser-lifecycle/api/)

## Related documentation

- [Best Practices — Configuration](/packages/browser-lifecycle/best-practices/configuration)
- [FAQ — Configuration](/packages/browser-lifecycle/faq/configuration)
