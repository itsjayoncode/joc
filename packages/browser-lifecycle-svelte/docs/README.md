# Browser Lifecycle Svelte

Official Svelte adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic lives here. The adapter owns Svelte context, a readable snapshot store, and `onDestroy`-based cleanup (for the context helper); the core package owns everything about visibility, focus, connectivity, idle, and cross-tab detection.

## Install

```bash
npm install @jayoncode/browser-lifecycle @jayoncode/browser-lifecycle-svelte
```

## Options — `BrowserLifecycleAdapterOptions`

Every entry point (`createBrowserLifecycleContext`, `createOwnedBrowserLifecycle`) accepts the same shape:

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

- **Owned** (no `lifecycle` passed): the adapter calls `createBrowserLifecycle({ ...config, autoStart: false })` itself. `autoStart` is always forced to `false` here regardless of what you pass in `config` — the adapter calls `start()` itself, guarded for SSR (see below).
- **Adopted** (`lifecycle` passed): the adapter uses your instance as-is and never calls `start()` or `dispose()` on it. You are responsible for starting and disposing it.

## Dispose rules

- **`createBrowserLifecycleContext()`** disposes owned sessions automatically via Svelte's `onDestroy()` — this must be called during component initialization (not inside `onMount` or an event handler), matching Svelte's own `onDestroy` requirement.
- **`createOwnedBrowserLifecycle()`** does **not** register `onDestroy` for you — it returns a `destroy()` you must call yourself (e.g. from your own `onDestroy(() => api.destroy())`) when you need this outside component init, or manage disposal manually.
- **Adopted** sessions (passed via `lifecycle`) are **never** disposed, in either helper — dispose them yourself wherever you created them.

## SSR

Both helpers call `createApi()` synchronously (during Svelte's component script, which also executes during SvelteKit server rendering), so — unlike React/Vue, which defer `start()` to a client-only lifecycle hook — this adapter guards the `start()` call itself with `typeof document !== "undefined"`. Combined with the forced `autoStart: false`, sessions are safe to create during SSR: the session object exists, but nothing observes the DOM until the code runs in a browser.

## API surface

| Export                                     | Signature                                                           | Notes                                                                                                       |
| ------------------------------------------ | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `createBrowserLifecycleContext(options?)`  | `(options?: BrowserLifecycleAdapterOptions) => BrowserLifecycleApi` | Creates (or adopts) a session, `setContext()`s it, and registers `onDestroy()` — call during component init |
| `getBrowserLifecycle()`                    | `() => BrowserLifecycleApi`                                         | `getContext()`s the API set by an ancestor `createBrowserLifecycleContext()`; throws if none                |
| `createOwnedBrowserLifecycle(options?)`    | `(options?: BrowserLifecycleAdapterOptions) => BrowserLifecycleApi` | Owns (or adopts) a session without context — caller must call `.destroy()`                                  |
| `resolveBrowserLifecycleBinding(options?)` | `(options?) => { lifecycle, owns }`                                 | Lower-level helper the other exports build on                                                               |

`BrowserLifecycleApi` shape (returned by all three helpers):

```ts
interface BrowserLifecycleApi {
  readonly lifecycle: BrowserLifecycle;
  readonly snapshot: Readable<Readonly<BrowserLifecycleSnapshot>>;
  destroy(): void;
}
```

## Usage

```svelte
<script>
  import { createBrowserLifecycleContext } from "@jayoncode/browser-lifecycle-svelte";

  const { snapshot, lifecycle } = createBrowserLifecycleContext();
</script>

<p>{$snapshot.visibility}</p>
```

### Reading from a descendant component

```svelte
<script>
  import { getBrowserLifecycle } from "@jayoncode/browser-lifecycle-svelte";

  const { snapshot } = getBrowserLifecycle();
</script>

<p>{$snapshot.visibility}</p>
```

### Adopt an existing session

```ts
const lifecycle = createBrowserLifecycle({ autoStart: true });

createBrowserLifecycleContext({ lifecycle });
```

The adapter will not call `start()` or `dispose()` on an adopted `lifecycle` — manage its lifecycle yourself.

### No context, manual disposal

```ts
import { onDestroy } from "svelte";
import { createOwnedBrowserLifecycle } from "@jayoncode/browser-lifecycle-svelte";

const api = createOwnedBrowserLifecycle({ config: { idleTimeout: 30_000 } });

onDestroy(() => api.destroy());
```

## Ecosystem

Core docs: [Browser Lifecycle](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/).

Interactive demos: [Browser Lifecycle Playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/).
