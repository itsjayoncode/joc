# SSR FAQ

## Can I create a session during server rendering?

No. Initialize on the client after hydration. Capability detection is SSR-safe, but listeners require a browser environment.

## Do I still need `dispose()`?

Yes — on the client, call `await lifecycle.dispose()` when the shell unmounts. Disposed sessions cannot be restarted.

## Example

```ts
import { isBrowser, createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

if (isBrowser()) {
  const lifecycle = createBrowserLifecycle({ autoStart: true });
  // …subscribe…
  // on unmount: await lifecycle.dispose();
}
```

## Related guide

[SSR](/packages/browser-lifecycle/guides/ssr) · [Lifecycle FAQ](/packages/browser-lifecycle/faq/lifecycle) · [Overview](/packages/browser-lifecycle/overview)
