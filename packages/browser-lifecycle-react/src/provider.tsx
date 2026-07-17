import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactElement,
} from "react";

import type {
  BrowserLifecycle,
  BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

import { resolveBrowserLifecycleBinding } from "./resolve-binding.js";

import type {
  BrowserLifecycleAdapterOptions,
  BrowserLifecycleProviderProps,
  OwnedBrowserLifecycle,
  SnapshotSelector,
} from "./types.js";

const BrowserLifecycleContext = createContext<BrowserLifecycle | null>(null);

/**
 * Provide a BrowserLifecycle session to descendants.
 * Owns the session by default; pass `lifecycle` to adopt an existing instance.
 */
export function BrowserLifecycleProvider(
  props: BrowserLifecycleProviderProps,
): ReactElement {
  const { children, config, lifecycle: adopted } = props;
  const bindingRef = useRef<ReturnType<typeof resolveBrowserLifecycleBinding> | null>(null);

  if (bindingRef.current === null) {
    bindingRef.current = resolveBrowserLifecycleBinding({
      ...(config !== undefined ? { config } : {}),
      ...(adopted !== undefined ? { lifecycle: adopted } : {}),
    });
  }

  const lifecycle = bindingRef.current.lifecycle;
  const owns = bindingRef.current.owns;

  useEffect(() => {
    if (!lifecycle.isRunning()) {
      lifecycle.start();
    }

    return () => {
      if (owns) {
        lifecycle.dispose();
        bindingRef.current = null;
      }
    };
  }, [lifecycle, owns]);

  return (
    <BrowserLifecycleContext.Provider value={lifecycle}>
      {children}
    </BrowserLifecycleContext.Provider>
  );
}

/**
 * Read the BrowserLifecycle session from the nearest provider.
 */
export function useBrowserLifecycle(): BrowserLifecycle {
  const lifecycle = useContext(BrowserLifecycleContext);
  if (!lifecycle) {
    throw new Error(
      "useBrowserLifecycle() requires a BrowserLifecycleProvider ancestor.",
    );
  }
  return lifecycle;
}

/**
 * Subscribe to the lifecycle snapshot (optionally projected).
 */
export function useBrowserLifecycleSnapshot<TSelected = Readonly<BrowserLifecycleSnapshot>>(
  selector?: SnapshotSelector<TSelected>,
): TSelected {
  const lifecycle = useBrowserLifecycle();
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const subscribe = useMemo(
    () => (onStoreChange: () => void) => lifecycle.subscribe(() => onStoreChange()),
    [lifecycle],
  );

  const getSnapshot = useMemo(
    () => () => {
      const snapshot = lifecycle.getSnapshot();
      const select = selectorRef.current;
      return (select ? select(snapshot) : snapshot) as TSelected;
    },
    [lifecycle],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Own a BrowserLifecycle session in a single component (no Provider required).
 */
export function useOwnedBrowserLifecycle(
  options: BrowserLifecycleAdapterOptions = {},
): OwnedBrowserLifecycle {
  const bindingRef = useRef<ReturnType<typeof resolveBrowserLifecycleBinding> | null>(null);

  if (bindingRef.current === null) {
    bindingRef.current = resolveBrowserLifecycleBinding(options);
  }

  const lifecycle = bindingRef.current.lifecycle;
  const owns = bindingRef.current.owns;

  useEffect(() => {
    if (!lifecycle.isRunning()) {
      lifecycle.start();
    }

    return () => {
      if (owns) {
        lifecycle.dispose();
        bindingRef.current = null;
      }
    };
  }, [lifecycle, owns]);

  return { lifecycle };
}
