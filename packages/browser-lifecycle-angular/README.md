# Browser Lifecycle Angular

Angular adapter for [`@jayoncode/browser-lifecycle`](../browser-lifecycle/README.md).

Thin wrappers only — no browser observation logic. Provide/inject + signal snapshot. Dispose via `DestroyRef`.

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
