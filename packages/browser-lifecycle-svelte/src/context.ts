import { getContext, onDestroy, setContext } from "svelte";
import { writable, type Readable } from "svelte/store";

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
  readonly snapshot: Readable<Readonly<BrowserLifecycleSnapshot>>;
  destroy(): void;
}

const BROWSER_LIFECYCLE_KEY = Symbol("browser-lifecycle");

function createApi(options: BrowserLifecycleAdapterOptions = {}): BrowserLifecycleApi {
  const { lifecycle, owns } = resolveBrowserLifecycleBinding(options);

  if (typeof document !== "undefined" && !lifecycle.isRunning()) {
    lifecycle.start();
  }

  const store = writable(lifecycle.getSnapshot());
  const unsubscribeSnapshot = lifecycle.subscribe(() => {
    store.set(lifecycle.getSnapshot());
  });

  let destroyed = false;
  const destroy = (): void => {
    if (destroyed) {
      return;
    }
    destroyed = true;
    unsubscribeSnapshot();
    if (owns) {
      lifecycle.dispose();
    }
  };

  return { lifecycle, snapshot: { subscribe: store.subscribe }, destroy };
}

/**
 * Create and set context for a BrowserLifecycle session (call during component init).
 */
export function createBrowserLifecycleContext(
  options: BrowserLifecycleAdapterOptions = {},
): BrowserLifecycleApi {
  const api = createApi(options);
  setContext(BROWSER_LIFECYCLE_KEY, api);
  onDestroy(() => {
    api.destroy();
  });
  return api;
}

/**
 * Read the BrowserLifecycle API from context.
 */
export function getBrowserLifecycle(): BrowserLifecycleApi {
  const api = getContext<BrowserLifecycleApi | undefined>(BROWSER_LIFECYCLE_KEY);
  if (!api) {
    throw new Error(
      "getBrowserLifecycle() requires createBrowserLifecycleContext() in an ancestor.",
    );
  }
  return api;
}

/**
 * Own a BrowserLifecycle session without context (caller must `destroy()`).
 */
export function createOwnedBrowserLifecycle(
  options: BrowserLifecycleAdapterOptions = {},
): BrowserLifecycleApi {
  return createApi(options);
}

export type { BrowserLifecycleAdapterOptions };
