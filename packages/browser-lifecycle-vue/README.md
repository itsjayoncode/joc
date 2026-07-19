# Browser Lifecycle Vue

Vue adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic. One session per provide scope; owned sessions dispose on scope teardown, adopted sessions never do. Client-only `start()` (SSR-safe).

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

## Options — `{ config?, lifecycle? }`

`provideBrowserLifecycle()` and `useOwnedBrowserLifecycle()` both accept `config` (forwarded to `createBrowserLifecycle()`) or `lifecycle` (an existing session to adopt). Adopt an existing session with `{ lifecycle: existing }` — the adapter will not call `start()` or `dispose()` on it.

Owned sessions are always created with `autoStart: false` internally; the adapter calls `start()` itself inside `onMounted()`, so it never runs during server rendering.

See the [full adapter guide](./docs/README.md) for the complete API surface, ownership/dispose rules, and more examples.

## Docs

Core docs: [Browser Lifecycle](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/) · Interactive demos: [Playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/)

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
