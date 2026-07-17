import { InjectionToken, type Signal } from "@angular/core";

import type { BrowserLifecycle, BrowserLifecycleSnapshot } from "@jayoncode/browser-lifecycle";

export interface BrowserLifecycleHandle {
  readonly lifecycle: BrowserLifecycle;
  readonly snapshot: Signal<Readonly<BrowserLifecycleSnapshot>>;
  destroy(): void;
}

export const BROWSER_LIFECYCLE = new InjectionToken<BrowserLifecycleHandle>("BROWSER_LIFECYCLE");
