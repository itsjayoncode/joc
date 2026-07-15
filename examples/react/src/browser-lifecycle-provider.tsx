import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

import type { BrowserLifecycle, BrowserLifecycleSnapshot } from "@jayoncode/browser-lifecycle";
import type { PropsWithChildren } from "react";

const BrowserLifecycleContext = createContext<BrowserLifecycle | null>(null);

export function BrowserLifecycleProvider({ children }: PropsWithChildren) {
  const lifecycle = useMemo(
    () =>
      createBrowserLifecycle({
        autoStart: false,
        emitInitialState: true,
        idleTimeout: 30_000,
      }),
    [],
  );

  useEffect(() => {
    lifecycle.start();
    return () => {
      lifecycle.dispose();
    };
  }, [lifecycle]);

  return (
    <BrowserLifecycleContext.Provider value={lifecycle}>
      {children}
    </BrowserLifecycleContext.Provider>
  );
}

export function useBrowserLifecycle(): BrowserLifecycle {
  const lifecycle = useContext(BrowserLifecycleContext);
  if (!lifecycle) {
    throw new Error("useBrowserLifecycle must be used within BrowserLifecycleProvider.");
  }
  return lifecycle;
}

export function useBrowserLifecycleSnapshot(): BrowserLifecycleSnapshot {
  const lifecycle = useBrowserLifecycle();
  const [snapshot, setSnapshot] = useState(lifecycle.getSnapshot());

  useEffect(() => {
    const unsubscribe = lifecycle.subscribe((_event, nextSnapshot) => {
      setSnapshot(nextSnapshot);
    });
    return unsubscribe;
  }, [lifecycle]);

  return snapshot;
}
