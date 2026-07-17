# Browser Lifecycle Solid

Solid adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic. Provider + reactive snapshot accessor.

## Install

```bash
npm install @jayoncode/browser-lifecycle @jayoncode/browser-lifecycle-solid
```

## Usage

```tsx
import {
  BrowserLifecycleProvider,
  useBrowserLifecycle,
} from "@jayoncode/browser-lifecycle-solid";

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
