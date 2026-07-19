# Browser Lifecycle React

Official React adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic lives here. The adapter owns React subscription (`useSyncExternalStore`), instance lifecycle, and safe client-only start; the core package owns everything about visibility, focus, connectivity, idle, and cross-tab detection.

## Install

```bash
npm install @jayoncode/browser-lifecycle @jayoncode/browser-lifecycle-react
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

## Ownership: owned vs. adopted

`resolveBrowserLifecycleBinding(options)` decides ownership:

- **Owned** (no `lifecycle` passed): the adapter calls `createBrowserLifecycle({ ...config, autoStart: false })` itself. `autoStart` is always forced to `false` here regardless of what you pass in `config` — the adapter calls `start()` itself at a safe point (see SSR below).
- **Adopted** (`lifecycle` passed): the adapter uses your instance as-is and never calls `start()` or `dispose()` on it. You are responsible for starting and disposing it.

## Dispose rules

- **Owned** sessions are disposed automatically:
  - `BrowserLifecycleProvider` disposes on unmount (`useEffect` cleanup).
  - `useOwnedBrowserLifecycle()` disposes on unmount (`useEffect` cleanup).
- **Adopted** sessions (passed via `lifecycle`) are **never** disposed by the adapter — dispose them yourself wherever you created them.
- Both `BrowserLifecycleProvider` and `useOwnedBrowserLifecycle()` resolve their binding once (via `useRef`) and keep it stable across re-renders, so passing a new `config` object on a later render does not recreate or restart the session.

## SSR

Owned sessions are created with `autoStart: false` and only started inside a `useEffect`, which never runs during server rendering — so it is safe to render `BrowserLifecycleProvider` / call `useOwnedBrowserLifecycle()` on the server. The session simply will not observe anything until the effect runs on the client.

## API surface

| Export                                     | Signature                                                      | Notes                                                                                                      |
| ------------------------------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `BrowserLifecycleProvider`                 | `(props: { children, config?, lifecycle? }) => ReactElement`   | Provides a session via context; one session per provider instance                                          |
| `useBrowserLifecycle()`                    | `() => BrowserLifecycle`                                       | Reads the session from the nearest `BrowserLifecycleProvider`; throws if none                              |
| `useBrowserLifecycleSnapshot(selector?)`   | `<TSelected>(selector?: (snapshot) => TSelected) => TSelected` | Subscribes via `useSyncExternalStore`; requires a provider ancestor; omit `selector` for the full snapshot |
| `useOwnedBrowserLifecycle(options?)`       | `(options?: BrowserLifecycleAdapterOptions) => { lifecycle }`  | Owns (or adopts) a session in a single component — no provider needed                                      |
| `resolveBrowserLifecycleBinding(options?)` | `(options?) => { lifecycle, owns }`                            | Lower-level helper the other exports build on; useful for custom wrappers                                  |

## Usage

```tsx
import {
  BrowserLifecycleProvider,
  useBrowserLifecycle,
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
  const { lifecycle } = useOwnedBrowserLifecycle({ config: { idleTimeout: 30_000 } });

  useEffect(() => lifecycle.on("session:idle", () => console.log("idle")), [lifecycle]);

  return null;
}
```

### React events directly on the session

```tsx
const { lifecycle } = useOwnedBrowserLifecycle();

useEffect(
  () =>
    lifecycle.on("connection:reconnect", () => {
      flushOfflineQueue();
    }),
  [lifecycle],
);
```

## Ecosystem

Core docs: [Browser Lifecycle](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/).

Interactive demos: [Browser Lifecycle Playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/).
