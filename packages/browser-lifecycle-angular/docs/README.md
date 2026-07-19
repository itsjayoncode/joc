# Browser Lifecycle Angular

Official Angular adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic lives here. The adapter owns Angular DI (an `InjectionToken`), a signal snapshot, and `DestroyRef`-based cleanup; the core package owns everything about visibility, focus, connectivity, idle, and cross-tab detection.

## Install

```bash
npm install @jayoncode/browser-lifecycle @jayoncode/browser-lifecycle-angular
```

## Options — `BrowserLifecycleAdapterOptions`

Every entry point (`provideBrowserLifecycle`, `createBrowserLifecycleHandle`) accepts the same shape:

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

- **Owned** (no `lifecycle` passed): the adapter calls `createBrowserLifecycle({ ...config, autoStart: false })` itself. `autoStart` is always forced to `false` here regardless of what you pass in `config` — the adapter calls `start()` itself at construction time, guarded for SSR (see below).
- **Adopted** (`lifecycle` passed): the adapter uses your instance as-is and never calls `start()` or `dispose()` on it. You are responsible for starting and disposing it.

## Dispose rules

- **Owned** sessions are disposed automatically: `provideBrowserLifecycle()` wires its `useFactory` with `deps: [DestroyRef]`, and `BrowserLifecycleHandleImpl` registers `destroyRef.onDestroy(() => this.destroy())` — disposal fires when the providing component/service is destroyed.
- `createBrowserLifecycleHandle(options, destroyRef?)` only hooks `destroyRef.onDestroy()` when you pass a `destroyRef` — call `handle.destroy()` yourself if you construct it without one.
- **Adopted** sessions (passed via `lifecycle`) are **never** disposed by the adapter, regardless of `destroyRef` — dispose them yourself wherever you created them.

## SSR

Unlike the other framework adapters, `BrowserLifecycleHandleImpl`'s constructor runs eagerly (Angular DI factories execute during component/service construction, which also happens during Angular Universal server rendering) — so the adapter explicitly guards the start call with `typeof document !== "undefined"` instead of relying on a client-only lifecycle hook. Combined with the forced `autoStart: false`, this makes owned sessions safe to construct on the server: the session object exists, but nothing observes the DOM until it is constructed in a browser.

## API surface

| Export                                                | Signature                                                       | Notes                                                                                                                                                         |
| ----------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provideBrowserLifecycle(options?)`                   | `(options?: BrowserLifecycleAdapterOptions) => Provider`        | Registers `BROWSER_LIFECYCLE` in a component's/route's `providers` array                                                                                      |
| `injectBrowserLifecycle()`                            | `() => BrowserLifecycleHandle`                                  | `inject(BROWSER_LIFECYCLE, { optional: true })` + throws if none was provided                                                                                 |
| `createBrowserLifecycleHandle(options?, destroyRef?)` | `(options?, destroyRef?: DestroyRef) => BrowserLifecycleHandle` | Imperative construction outside DI — pass `inject(DestroyRef)` for auto-dispose                                                                               |
| `BROWSER_LIFECYCLE`                                   | `InjectionToken<BrowserLifecycleHandle>`                        | The token behind `provideBrowserLifecycle()` / `injectBrowserLifecycle()`; inject directly (with `{ optional: true }`) to avoid the throw-if-missing behavior |
| `BrowserLifecycleHandleImpl`                          | `class implements BrowserLifecycleHandle`                       | The concrete handle class, exported for typing/`instanceof` checks                                                                                            |
| `resolveBrowserLifecycleBinding(options?)`            | `(options?) => { lifecycle, owns }`                             | Lower-level helper the other exports build on                                                                                                                 |

`BrowserLifecycleHandle` shape:

```ts
interface BrowserLifecycleHandle {
  readonly lifecycle: BrowserLifecycle;
  readonly snapshot: Signal<Readonly<BrowserLifecycleSnapshot>>;
  destroy(): void;
}
```

## Usage

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
  readonly snapshot = this.handle.snapshot;
}
```

```html
<p>{{ snapshot().visibility }}</p>
```

### Adopt an existing session

```ts
providers: [provideBrowserLifecycle({ lifecycle: existingLifecycle })],
```

The adapter will not call `start()` or `dispose()` on an adopted `lifecycle` — manage its lifecycle yourself.

### Headless, without DI

```ts
export class Widget {
  private readonly handle = createBrowserLifecycleHandle(
    { config: { idleTimeout: 30_000 } },
    inject(DestroyRef),
  );
}
```

### Injecting the token directly

```ts
import { BROWSER_LIFECYCLE } from "@jayoncode/browser-lifecycle-angular";

readonly handle = inject(BROWSER_LIFECYCLE, { optional: true });
```

## Ecosystem

Core docs: [Browser Lifecycle](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/).

Interactive demos: [Browser Lifecycle Playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/).
