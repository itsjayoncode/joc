# Core Infrastructure Examples

These examples cover the shared infrastructure introduced in Phase `2.2.0`.

## Configuration

```ts
import { createBrowserLifecycleConfig } from "@jayoncode/browser-lifecycle";

const config = createBrowserLifecycleConfig({
  crossTab: true,
  debug: true,
  idleTimeout: 60_000,
});
```

## Validation

```ts
import { ConfigurationError, validateBrowserLifecycleConfig } from "@jayoncode/browser-lifecycle";

try {
  validateBrowserLifecycleConfig({
    idleTimeout: 0,
  });
} catch (error) {
  if (error instanceof ConfigurationError) {
    console.error(error.details);
  }
}
```

## Feature Detection

```ts
import { detectBrowserLifecycleCapabilities } from "@jayoncode/browser-lifecycle";

const capabilities = detectBrowserLifecycleCapabilities();
```

## Utilities

```ts
import { deepFreeze, mergeObjects } from "@jayoncode/browser-lifecycle";

const merged = mergeObjects({ debug: false, nested: { enabled: true } }, { debug: true });

const frozen = deepFreeze(merged);
```

## Error Handling

```ts
import { InitializationError } from "@jayoncode/browser-lifecycle";

throw new InitializationError("Initialization cannot proceed.");
```
