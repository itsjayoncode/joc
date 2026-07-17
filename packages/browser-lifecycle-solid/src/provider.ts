import {
  createComponent,
  createContext,
  createSignal,
  onCleanup,
  useContext,
  type Accessor,
  type JSX,
  type ParentProps,
} from "solid-js";

import type { BrowserLifecycle, BrowserLifecycleSnapshot } from "@jayoncode/browser-lifecycle";

import {
  resolveBrowserLifecycleBinding,
  type BrowserLifecycleAdapterOptions,
} from "./resolve-binding.js";

export interface BrowserLifecycleApi {
  readonly lifecycle: BrowserLifecycle;
  readonly snapshot: Accessor<Readonly<BrowserLifecycleSnapshot>>;
}

const BrowserLifecycleContext = createContext<BrowserLifecycleApi>();

function createApi(options: BrowserLifecycleAdapterOptions = {}): BrowserLifecycleApi {
  const { lifecycle, owns } = resolveBrowserLifecycleBinding(options);
  const [snapshot, setSnapshot] = createSignal(lifecycle.getSnapshot());

  const unsubscribe = lifecycle.subscribe(() => {
    setSnapshot(() => lifecycle.getSnapshot());
  });

  if (typeof document !== "undefined" && !lifecycle.isRunning()) {
    lifecycle.start();
  }

  onCleanup(() => {
    unsubscribe();
    if (owns) {
      lifecycle.dispose();
    }
  });

  return { lifecycle, snapshot };
}

export type BrowserLifecycleProviderProps = ParentProps & BrowserLifecycleAdapterOptions;

/**
 * Provide a BrowserLifecycle session to descendants.
 */
export function BrowserLifecycleProvider(props: BrowserLifecycleProviderProps): JSX.Element {
  const api = createApi({
    ...(props.config !== undefined ? { config: props.config } : {}),
    ...(props.lifecycle !== undefined ? { lifecycle: props.lifecycle } : {}),
  });

  return createComponent(BrowserLifecycleContext.Provider, {
    value: api,
    get children() {
      return props.children;
    },
  });
}

/**
 * Read the BrowserLifecycle API from context.
 */
export function useBrowserLifecycle(): BrowserLifecycleApi {
  const api = useContext(BrowserLifecycleContext);
  if (!api) {
    throw new Error("useBrowserLifecycle() requires a BrowserLifecycleProvider ancestor.");
  }
  return api;
}

/**
 * Own a BrowserLifecycle session in the current reactive root (no Provider).
 */
export function useOwnedBrowserLifecycle(
  options: BrowserLifecycleAdapterOptions = {},
): BrowserLifecycleApi {
  return createApi(options);
}

export type { BrowserLifecycleAdapterOptions };
