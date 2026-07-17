# Browser Lifecycle React

React adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic. One session per provider/scope; dispose on unmount. Client-only `start()` (SSR-safe).

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

Adopt an existing session with `lifecycle={existing}` (adapter will not dispose it).
For a single component without a provider, use `useOwnedBrowserLifecycle()`.
