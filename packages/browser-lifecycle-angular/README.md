# Browser Lifecycle Angular

Angular adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic. Provide/inject + signal snapshot. Owned sessions dispose via `DestroyRef`; adopted sessions never do. Start is guarded with `typeof document !== "undefined"` (SSR-safe).

## Install

```bash
npm install @jayoncode/browser-lifecycle @jayoncode/browser-lifecycle-angular
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
}
```

## Options — `{ config?, lifecycle? }`

`provideBrowserLifecycle()` and `createBrowserLifecycleHandle()` both accept `config` (forwarded to `createBrowserLifecycle()`) or `lifecycle` (an existing session to adopt). Pass `lifecycle` to adopt an existing session — the adapter will not call `start()` or `dispose()` on it.

Owned sessions are always created with `autoStart: false` internally. Because Angular DI factories can run during server rendering, the adapter guards its own `start()` call with `typeof document !== "undefined"` rather than deferring to a client-only lifecycle hook — safe either way.

See the [full adapter guide](./docs/README.md) for the complete API surface (including the `BROWSER_LIFECYCLE` token and headless `createBrowserLifecycleHandle()` usage) and more examples.

## Docs

Core docs: [Browser Lifecycle](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/) · Interactive demos: [Playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/)

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
