# Browser Lifecycle Svelte

Svelte adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic. Context helpers + readable snapshot store. Owned sessions dispose automatically via `createBrowserLifecycleContext()`'s `onDestroy()`; `createOwnedBrowserLifecycle()` requires calling `.destroy()` yourself; adopted sessions are never disposed. Start is guarded with `typeof document !== "undefined"` (SSR-safe).

## Install

```bash
npm install @jayoncode/browser-lifecycle @jayoncode/browser-lifecycle-svelte
```

## Usage

```svelte
<script>
  import { createBrowserLifecycleContext } from "@jayoncode/browser-lifecycle-svelte";

  const { snapshot, lifecycle } = createBrowserLifecycleContext();
</script>

<p>{$snapshot.visibility}</p>
```

Or adopt an existing session: `createBrowserLifecycleContext({ lifecycle })`.

## Options — `{ config?, lifecycle? }`

`createBrowserLifecycleContext()` and `createOwnedBrowserLifecycle()` both accept `config` (forwarded to `createBrowserLifecycle()`) or `lifecycle` (an existing session to adopt). Adopted sessions are never started or disposed by the adapter.

Owned sessions are always created with `autoStart: false` internally, and the adapter guards its own `start()` call with `typeof document !== "undefined"` since component scripts also run during SvelteKit SSR.

See the [full adapter guide](./docs/README.md) for the complete API surface, dispose-rule differences between `createBrowserLifecycleContext()` and `createOwnedBrowserLifecycle()`, and more examples.

## Docs

Core docs: [Browser Lifecycle](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/) · Interactive demos: [Playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/)

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
