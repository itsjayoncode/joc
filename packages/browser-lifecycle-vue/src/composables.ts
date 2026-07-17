import {
  inject,
  onMounted,
  onScopeDispose,
  provide,
  shallowRef,
  type InjectionKey,
  type Ref,
} from "vue";

import type {
  BrowserLifecycle,
  BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

import {
  resolveBrowserLifecycleBinding,
  type BrowserLifecycleAdapterOptions,
} from "./resolve-binding.js";

export interface BrowserLifecycleApi {
  readonly lifecycle: BrowserLifecycle;
  readonly snapshot: Ref<Readonly<BrowserLifecycleSnapshot>>;
}

const BROWSER_LIFECYCLE_KEY: InjectionKey<BrowserLifecycleApi> = Symbol(
  "browser-lifecycle",
);

function createBrowserLifecycleApi(
  options: BrowserLifecycleAdapterOptions = {},
): BrowserLifecycleApi {
  const { lifecycle, owns } = resolveBrowserLifecycleBinding(options);
  const snapshot = shallowRef(lifecycle.getSnapshot());

  const unsubscribe = lifecycle.subscribe(() => {
    snapshot.value = lifecycle.getSnapshot();
  });

  onMounted(() => {
    if (!lifecycle.isRunning()) {
      lifecycle.start();
    }
  });

  onScopeDispose(() => {
    unsubscribe();
    if (owns) {
      lifecycle.dispose();
    }
  });

  return { lifecycle, snapshot };
}

/**
 * Create and provide a BrowserLifecycle session for descendants.
 */
export function provideBrowserLifecycle(
  options: BrowserLifecycleAdapterOptions = {},
): BrowserLifecycleApi {
  const api = createBrowserLifecycleApi(options);
  provide(BROWSER_LIFECYCLE_KEY, api);
  return api;
}

/**
 * Read the BrowserLifecycle API from the nearest provider.
 */
export function useBrowserLifecycle(): BrowserLifecycleApi {
  const api = inject(BROWSER_LIFECYCLE_KEY);
  if (!api) {
    throw new Error("useBrowserLifecycle() requires provideBrowserLifecycle() in an ancestor.");
  }
  return api;
}

/**
 * Own a BrowserLifecycle session in the current scope (no provide required).
 */
export function useOwnedBrowserLifecycle(
  options: BrowserLifecycleAdapterOptions = {},
): BrowserLifecycleApi {
  return createBrowserLifecycleApi(options);
}

export type { BrowserLifecycleAdapterOptions };
