---
title: Adapters
description: Browser Lifecycle module documentation for Adapters.
---

# Framework adapters

Thin wrappers over the public core API. Each framework ships as a **separate package** so peer dependencies stay accurate.

**Previous:** [Resilience](/packages/browser-lifecycle/modules/resilience) · **Next:** [Overview](/packages/browser-lifecycle/overview)

## Packages

| Package                                | Status                   |
| -------------------------------------- | ------------------------ |
| `@jayoncode/browser-lifecycle-react`   | Experimental (workspace) |
| `@jayoncode/browser-lifecycle-vue`     | Experimental (workspace) |
| `@jayoncode/browser-lifecycle-svelte`  | Experimental (workspace) |
| `@jayoncode/browser-lifecycle-solid`   | Experimental (workspace) |
| `@jayoncode/browser-lifecycle-angular` | Experimental (workspace) |

Install core + one adapter:

```bash
npm install @jayoncode/browser-lifecycle @jayoncode/browser-lifecycle-react
```

## Shared rules

- One session per provider / scope
- Owned sessions use `autoStart: false` then **client** `start()`
- Adopted `lifecycle` instances are **not** disposed by the adapter
- No browser observation inside adapters

## React

```tsx
import {
  BrowserLifecycleProvider,
  useBrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle-react";

function Status() {
  const visibility = useBrowserLifecycleSnapshot((s) => s.visibility);
  return <span>{visibility}</span>;
}

export function App() {
  return (
    <BrowserLifecycleProvider>
      <Status />
    </BrowserLifecycleProvider>
  );
}
```

Also: `useBrowserLifecycle()`, `useOwnedBrowserLifecycle()`.

## Vue

```ts
import { provideBrowserLifecycle, useBrowserLifecycle } from "@jayoncode/browser-lifecycle-vue";

provideBrowserLifecycle();
const { snapshot, lifecycle } = useBrowserLifecycle();
```

## Svelte

```svelte
<script>
  import { createBrowserLifecycleContext } from "@jayoncode/browser-lifecycle-svelte";
  const { snapshot } = createBrowserLifecycleContext();
</script>

<p>{$snapshot.visibility}</p>
```

## Solid

```tsx
import { BrowserLifecycleProvider, useBrowserLifecycle } from "@jayoncode/browser-lifecycle-solid";

function Status() {
  const { snapshot } = useBrowserLifecycle();
  return <span>{snapshot().visibility}</span>;
}
```

## Angular

```ts
import {
  provideBrowserLifecycle,
  injectBrowserLifecycle,
} from "@jayoncode/browser-lifecycle-angular";

@Component({
  providers: [provideBrowserLifecycle()],
})
export class AppComponent {
  private readonly handle = injectBrowserLifecycle();
}
```

## Related

- Package READMEs under `packages/browser-lifecycle-*`
- [Framework integration](/packages/browser-lifecycle/best-practices/framework-integration)
- [Frameworks FAQ](/packages/browser-lifecycle/faq/frameworks)
