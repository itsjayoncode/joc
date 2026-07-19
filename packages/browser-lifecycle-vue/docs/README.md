# Browser Lifecycle Vue

Official Vue adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic lives here. The adapter owns Vue reactivity (a `shallowRef` snapshot), scope-based cleanup, and safe client-only start; the core package owns everything about visibility, focus, connectivity, idle, and cross-tab detection.

## Install

```bash
npm install @jayoncode/browser-lifecycle @jayoncode/browser-lifecycle-vue
```

## Options — `BrowserLifecycleAdapterOptions`

Every entry point (`provideBrowserLifecycle`, `useOwnedBrowserLifecycle`) accepts the same shape:

```ts
interface BrowserLifecycleAdapterOptions {
  readonly config?: BrowserLifecycleConfig;
  readonly lifecycle?: BrowserLifecycle;
}
```

- `config` — forwarded to `createBrowserLifecycle()` when the adapter creates its own session (ignored if you pass `lifecycle`).
- `lifecycle` — an existing `BrowserLifecycle` instance to adopt instead of creating a new one.

## Ownership: owned vs. adopted

`resolveBrowserLifecycleBinding(options)` decides ownership:

- **Owned** (no `lifecycle` passed): the adapter calls `createBrowserLifecycle({ ...config, autoStart: false })` itself. `autoStart` is always forced to `false` here regardless of what you pass in `config` — the adapter calls `start()` itself at a safe point (see SSR below).
- **Adopted** (`lifecycle` passed): the adapter uses your instance as-is and never calls `start()` or `dispose()` on it. You are responsible for starting and disposing it.

## Dispose rules

- **Owned** sessions are disposed automatically via `onScopeDispose()` — this fires when the enclosing component unmounts, or (for `useOwnedBrowserLifecycle()` called outside a component) when the current effect scope is stopped.
- **Adopted** sessions (passed via `lifecycle`) are **never** disposed by the adapter — dispose them yourself wherever you created them.
- `provideBrowserLifecycle()` and `useOwnedBrowserLifecycle()` each resolve their binding once when called and keep it stable for the life of the scope — calling them again with a different `config` does not recreate or restart the existing session.

## SSR

Owned sessions are created with `autoStart: false` and only started inside `onMounted()`, which never runs during server rendering — so it is safe to call `provideBrowserLifecycle()` / `useOwnedBrowserLifecycle()` in a component that also renders on the server. The session simply will not observe anything until it mounts on the client.

## API surface

| Export                                     | Signature                                                           | Notes                                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `provideBrowserLifecycle(options?)`        | `(options?: BrowserLifecycleAdapterOptions) => BrowserLifecycleApi` | Creates (or adopts) a session and `provide()`s it for descendants; call during `setup()` |
| `useBrowserLifecycle()`                    | `() => BrowserLifecycleApi`                                         | `inject()`s the API provided by an ancestor `provideBrowserLifecycle()`; throws if none  |
| `useOwnedBrowserLifecycle(options?)`       | `(options?: BrowserLifecycleAdapterOptions) => BrowserLifecycleApi` | Owns (or adopts) a session in the current scope — no `provide()`/`inject()` needed       |
| `resolveBrowserLifecycleBinding(options?)` | `(options?) => { lifecycle, owns }`                                 | Lower-level helper the other exports build on; useful for custom wrappers                |

`BrowserLifecycleApi` shape (returned by all three composables):

```ts
interface BrowserLifecycleApi {
  readonly lifecycle: BrowserLifecycle;
  readonly snapshot: Ref<Readonly<BrowserLifecycleSnapshot>>;
}
```

`snapshot` auto-unwraps in templates (`{{ snapshot.visibility }}`); use `snapshot.value` in `<script>`.

## Usage

```ts
import { provideBrowserLifecycle, useBrowserLifecycle } from "@jayoncode/browser-lifecycle-vue";

// in setup()
provideBrowserLifecycle();

const { snapshot, lifecycle } = useBrowserLifecycle();
```

```vue
<template>
  <p>{{ snapshot.visibility }}</p>
</template>
```

### Adopt an existing session

```ts
const lifecycle = createBrowserLifecycle({ autoStart: true });

provideBrowserLifecycle({ lifecycle });
```

Adapters never call `start()` or `dispose()` on an adopted `lifecycle` — manage its lifecycle yourself.

### Single component, no provide/inject

```ts
import { useOwnedBrowserLifecycle } from "@jayoncode/browser-lifecycle-vue";

const { lifecycle, snapshot } = useOwnedBrowserLifecycle({ config: { idleTimeout: 30_000 } });
```

## Ecosystem

Core docs: [Browser Lifecycle](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/).

Interactive demos: [Browser Lifecycle Playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/).
