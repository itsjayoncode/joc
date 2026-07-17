# Configuration

## Recommended

Validate configuration before session creation:

```ts
import {
  mergeBrowserLifecycleConfig,
  validateBrowserLifecycleConfig,
} from "@jayoncode/browser-lifecycle";

const config = mergeBrowserLifecycleConfig(defaults, input);
validateBrowserLifecycleConfig(config);
```

## Not recommended

Mutating resolved configuration objects returned from a running session.

## Playground

Use the [Configuration Playground](/playground/browser-lifecycle/configuration) to preview effective settings.
