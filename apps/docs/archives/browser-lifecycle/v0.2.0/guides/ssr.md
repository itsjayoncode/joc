# SSR Safety

Browser Lifecycle is a browser-only runtime. Keep initialization on the client.

## Recommended pattern

```ts
import { isBrowser } from "@jayoncode/browser-lifecycle";

let lifecycle: ReturnType<typeof createBrowserLifecycle> | undefined;

export function getLifecycle() {
  if (!isBrowser()) {
    return undefined;
  }

  lifecycle ??= createBrowserLifecycle({ autoStart: true });
  return lifecycle;
}
```

## Framework notes

| Framework | Guidance                                            |
| --------- | --------------------------------------------------- |
| React     | Initialize in `useEffect` or a client-only provider |
| Next.js   | Use a client component boundary (`"use client"`)    |
| Vue       | Initialize in `onMounted`                           |
| Angular   | Initialize in `ngOnInit` after platform check       |
| Svelte    | Initialize in `onMount`                             |

See [Framework Examples](/packages/browser-lifecycle/examples/) for reference implementations.

## What not to do

- Do not import Browser Lifecycle in server-only modules that run during SSR
- Do not read `window` or `document` before checking `isBrowser()`
- Do not assume connectivity or visibility state exists on the server

## Related documentation

- [Deployment](/packages/browser-lifecycle/guides/deployment)
- [Best Practices — SSR Safety](/packages/browser-lifecycle/best-practices/ssr-safety)
