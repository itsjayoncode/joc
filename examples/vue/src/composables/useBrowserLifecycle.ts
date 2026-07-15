import { onScopeDispose, shallowRef } from "vue";

import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

import type { BrowserLifecycle } from "@jayoncode/browser-lifecycle";

export function useBrowserLifecycle() {
  const lifecycle = shallowRef<BrowserLifecycle>(
    createBrowserLifecycle({
      autoStart: false,
      emitInitialState: true,
      idleTimeout: 30_000,
    }),
  );

  lifecycle.value.start();

  onScopeDispose(() => {
    lifecycle.value.dispose();
  });

  return lifecycle;
}
