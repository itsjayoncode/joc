import { inject, DestroyRef, type Provider } from "@angular/core";

import { BrowserLifecycleHandleImpl } from "./browser-lifecycle-handle.js";
import {
  resolveBrowserLifecycleBinding,
  type BrowserLifecycleAdapterOptions,
} from "./resolve-binding.js";
import { BROWSER_LIFECYCLE, type BrowserLifecycleHandle } from "./tokens.js";

export function provideBrowserLifecycle(
  options: BrowserLifecycleAdapterOptions = {},
): Provider {
  return {
    provide: BROWSER_LIFECYCLE,
    useFactory: (destroyRef: DestroyRef) =>
      new BrowserLifecycleHandleImpl(options, destroyRef),
    deps: [DestroyRef],
  };
}

export function injectBrowserLifecycle(): BrowserLifecycleHandle {
  const handle = inject(BROWSER_LIFECYCLE, { optional: true });
  if (!handle) {
    throw new Error(
      "injectBrowserLifecycle() requires provideBrowserLifecycle() in the component providers.",
    );
  }
  return handle;
}

export function createBrowserLifecycleHandle(
  options: BrowserLifecycleAdapterOptions = {},
  destroyRef?: DestroyRef,
): BrowserLifecycleHandle {
  return new BrowserLifecycleHandleImpl(options, destroyRef);
}

export type { BrowserLifecycleAdapterOptions, BrowserLifecycleHandle };
export { resolveBrowserLifecycleBinding };
