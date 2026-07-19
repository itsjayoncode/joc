# Browser Lifecycle Solid

Official Solid adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic lives here. The adapter owns a Solid context/signal snapshot and `onCleanup`-based disposal; the core package owns everything about visibility, focus, connectivity, idle, and cross-tab detection.

## Install

```bash
npm install @jayoncode/browser-lifecycle @jayoncode/browser-lifecycle-solid
```

## Options — `BrowserLifecycleAdapterOptions`

Every entry point (`BrowserLifecycleProvider`, `useOwnedBrowserLifecycle`) accepts the same shape:

```ts
interface BrowserLifecycleAdapterOptions {
  readonly config?: BrowserLifecycleConfig;
  readonly lifecycle?: BrowserLifecycle;
}
```

- `config` — forwarded to `createBrowserLifecycle()` when the adapter creates its own session (ignored if you pass `lifecycle`).
- `lifecycle` — an existing `BrowserLifecycle` instance to adopt instead of creating a new one.

`BrowserLifecycleProvider` also accepts `children` (Solid `ParentProps`) alongside `config` / `lifecycle`.

## Ownership: owned vs. adopted

`resolveBrowserLifecycleBinding(options)` decides ownership:

- **Owned** (no `lifecycle` passed): the adapter calls `createBrowserLifecycle({ ...config, autoStart: false })` itself. `autoStart` is always forced to `false` here regardless of what you pass in `config` — the adapter calls `start()` itself, guarded for SSR (see below).
- **Adopted** (`lifecycle` passed): the adapter uses your instance as-is and never calls `start()` or `dispose()` on it. You are responsible for starting and disposing it.

## Dispose rules

- **Owned** sessions are disposed automatically via Solid's `onCleanup()` — this fires when the owning reactive root (component or `useOwnedBrowserLifecycle()` call site) is disposed.
- **Adopted** sessions (passed via `lifecycle`) are **never** disposed by the adapter — dispose them yourself wherever you created them.

## SSR

Both `BrowserLifecycleProvider` and `useOwnedBrowserLifecycle()` call `createApi()` synchronously during component evaluation (which also runs during Solid's server rendering) — so, like the Angular and Svelte adapters, this one guards its own `start()` call with `typeof document !== "undefined"` instead of relying on a client-only lifecycle hook. Combined with the forced `autoStart: false`, sessions are safe to create during SSR: the session object exists, but nothing observes the DOM until it is created in a browser.

## API surface

| Export                                     | Signature                                                              | Notes                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `BrowserLifecycleProvider`                 | `(props: ParentProps & BrowserLifecycleAdapterOptions) => JSX.Element` | Provides a session via context; one session per provider instance            |
| `useBrowserLifecycle()`                    | `() => BrowserLifecycleApi`                                            | Reads the API from the nearest `BrowserLifecycleProvider`; throws if none    |
| `useOwnedBrowserLifecycle(options?)`       | `(options?: BrowserLifecycleAdapterOptions) => BrowserLifecycleApi`    | Owns (or adopts) a session in the current reactive root — no provider needed |
| `resolveBrowserLifecycleBinding(options?)` | `(options?) => { lifecycle, owns }`                                    | Lower-level helper the other exports build on                                |

`BrowserLifecycleApi` shape (returned by both `useBrowserLifecycle()` and `useOwnedBrowserLifecycle()`):

```ts
interface BrowserLifecycleApi {
  readonly lifecycle: BrowserLifecycle;
  readonly snapshot: Accessor<Readonly<BrowserLifecycleSnapshot>>;
}
```

`snapshot` is a Solid `Accessor` — call it (`snapshot()`) inside JSX or a reactive computation to subscribe.

## Usage

```tsx
import { BrowserLifecycleProvider, useBrowserLifecycle } from "@jayoncode/browser-lifecycle-solid";

function Status() {
  const { snapshot } = useBrowserLifecycle();
  return <span>{snapshot().visibility}</span>;
}

export function App() {
  return (
    <BrowserLifecycleProvider>
      <Status />
    </BrowserLifecycleProvider>
  );
}
```

### Adopt an existing session

```tsx
const lifecycle = createBrowserLifecycle({ autoStart: true });

<BrowserLifecycleProvider lifecycle={lifecycle}>
  <App />
</BrowserLifecycleProvider>;
```

The provider will not call `start()` or `dispose()` on an adopted `lifecycle` — manage its lifecycle yourself.

### Single component, no provider

```tsx
function Widget() {
  const { lifecycle, snapshot } = useOwnedBrowserLifecycle({ config: { idleTimeout: 30_000 } });

  createEffect(() => {
    console.log(snapshot().activity);
  });

  return null;
}
```

## Ecosystem

Core docs: [Browser Lifecycle](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/).

Interactive demos: [Browser Lifecycle Playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/).
