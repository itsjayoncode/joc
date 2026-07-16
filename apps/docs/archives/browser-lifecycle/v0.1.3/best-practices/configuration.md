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

Use the [Configuration Playground](http://127.0.0.1:4273/configuration) to preview effective settings.
