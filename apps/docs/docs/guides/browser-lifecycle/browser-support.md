# Browser Support

Browser Lifecycle uses capability detection instead of user-agent sniffing.

## Capability helpers

```ts
import {
  detectBrowserLifecycleCapabilities,
  supportsVisibility,
  supportsFocus,
  supportsConnectivity,
  supportsBroadcastChannel,
  supportsPageLifecycle,
  supportsRequestIdleCallback,
  supportsAbortController,
} from "@jayoncode/browser-lifecycle";

const capabilities = detectBrowserLifecycleCapabilities();
```

## Module requirements

| Module       | Primary APIs                                   | Notes                               |
| ------------ | ---------------------------------------------- | ----------------------------------- |
| Visibility   | `document.visibilityState`, `visibilitychange` | Widely supported                    |
| Focus        | `window` focus/blur                            | Widely supported                    |
| Connectivity | `navigator.onLine`, `online`/`offline`         | Advisory only                       |
| Idle         | user input events, timers                      | Configurable thresholds             |
| Cross Tab    | `BroadcastChannel`                             | Optional; degrades when unavailable |

Disable modules when capabilities are missing rather than branching in application code.

## Testing unsupported environments

Use `detectBrowserLifecycleCapabilities()` in unit tests and mock browser globals in jsdom when needed.

## Related documentation

- [SSR](/guides/browser-lifecycle/ssr)
- [FAQ — Browser Support](/faq/browser-support)
