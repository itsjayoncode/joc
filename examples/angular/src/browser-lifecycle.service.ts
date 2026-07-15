import { DestroyRef, Injectable, inject } from "@angular/core";

import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

import type { BrowserLifecycle } from "@jayoncode/browser-lifecycle";

@Injectable({ providedIn: "root" })
export class BrowserLifecycleService {
  private readonly destroyRef = inject(DestroyRef);
  readonly lifecycle: BrowserLifecycle = createBrowserLifecycle({
    autoStart: false,
    emitInitialState: true,
    idleTimeout: 30_000,
  });

  constructor() {
    this.lifecycle.start();
    this.destroyRef.onDestroy(() => {
      this.lifecycle.dispose();
    });
  }
}
