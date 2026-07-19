# Browser Lifecycle Solid

Solid adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic. Provider + reactive snapshot accessor. Owned sessions dispose via `onCleanup()`; adopted sessions never do. Start is guarded with `typeof document !== "undefined"` (SSR-safe).

## Install

```bash
npm install @jayoncode/browser-lifecycle @jayoncode/browser-lifecycle-solid
```

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

## Options — `{ config?, lifecycle? }`

`BrowserLifecycleProvider` and `useOwnedBrowserLifecycle()` both accept `config` (forwarded to `createBrowserLifecycle()`) or `lifecycle` (an existing session to adopt). Pass `lifecycle` to adopt an existing session — the adapter will not call `start()` or `dispose()` on it.

Owned sessions are always created with `autoStart: false` internally, and the adapter guards its own `start()` call with `typeof document !== "undefined"` since components also evaluate during Solid's server rendering.

See the [full adapter guide](./docs/README.md) for the complete API surface and more examples.

## Docs

Core docs: [Browser Lifecycle](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/) · Interactive demos: [Playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/)

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
