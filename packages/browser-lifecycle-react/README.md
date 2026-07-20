# Browser Lifecycle React

[![Become a Sponsor](https://img.shields.io/badge/Become%20a%20Sponsor-%23ea4aaa?style=flat&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/jayoncoding)

React adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic. One session per provider/scope; owned sessions dispose on unmount, adopted sessions never do. Client-only `start()` (SSR-safe).

## Install

```bash
npm install @jayoncode/browser-lifecycle @jayoncode/browser-lifecycle-react
```

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

## Options — `{ config?, lifecycle? }`

Both `BrowserLifecycleProvider` and `useOwnedBrowserLifecycle()` accept `config` (forwarded to `createBrowserLifecycle()`) or `lifecycle` (an existing session to adopt). Passing `lifecycle` means the adapter never calls `start()` or `dispose()` on it — adopt an existing session with `lifecycle={existing}` when you want to manage it yourself.

Owned sessions are always created with `autoStart: false` internally; the adapter calls `start()` itself inside a `useEffect`, so it never runs during server rendering. For a single component without a provider, use `useOwnedBrowserLifecycle()`.

See the [full adapter guide](./docs/README.md) for the complete API surface, ownership/dispose rules, and more examples.

## Docs

Core docs: [Browser Lifecycle](https://itsjayoncode.github.io/joc/packages/browser-lifecycle/) · Interactive demos: [Playground](https://itsjayoncode.github.io/joc/playground/browser-lifecycle/)

## License

MIT © [JayOnCode](https://github.com/itsjayoncode)
