# Visibility Pause

Pause expensive work when the document is hidden.

## Import path

```ts
import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
```

Single package entry. Dispose the session when the shell unmounts.

## Implementation

```ts
const lifecycle = createBrowserLifecycle({ autoStart: true });

lifecycle.on("page:hidden", () => worker.pause());
lifecycle.on("page:visible", () => worker.resume());

// later
await lifecycle.dispose();
```

## Performance

Reduces CPU, network, and battery use for background tabs.

## Playground

[Visibility Playground](/playground/browser-lifecycle/visibility)

## Related

- [Visibility module](/packages/browser-lifecycle/modules/visibility)
- [SSR](/packages/browser-lifecycle/guides/ssr)
