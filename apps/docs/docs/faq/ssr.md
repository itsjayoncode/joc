# SSR FAQ

## Can I create a session during server rendering?

No. Initialize on the client after hydration.

## Example

```ts
import { isBrowser } from "@jayoncode/browser-lifecycle";

if (isBrowser()) {
  createBrowserLifecycle();
}
```

## Related guide

[SSR](/guides/browser-lifecycle/ssr)
