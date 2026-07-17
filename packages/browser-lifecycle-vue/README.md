# Browser Lifecycle Vue

Vue adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic. One session per provide scope; dispose on scope teardown. Client-only `start()` (SSR-safe).

## Install

```bash
npm install @jayoncode/browser-lifecycle @jayoncode/browser-lifecycle-vue
```

## Usage

```ts
import { provideBrowserLifecycle, useBrowserLifecycle } from "@jayoncode/browser-lifecycle-vue";

// in setup()
provideBrowserLifecycle();

const { snapshot, lifecycle } = useBrowserLifecycle();
```

Adopt an existing session with `{ lifecycle: existing }` (adapter will not dispose it).
