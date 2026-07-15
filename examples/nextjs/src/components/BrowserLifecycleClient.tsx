"use client";

import { useEffect, useState } from "react";

import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";

import type { BrowserLifecycleSnapshot } from "@jayoncode/browser-lifecycle";

export function BrowserLifecycleClient() {
  const [snapshot, setSnapshot] = useState<BrowserLifecycleSnapshot | null>(null);

  useEffect(() => {
    const lifecycle = createBrowserLifecycle({
      autoStart: false,
      emitInitialState: true,
    });

    const unsubscribe = lifecycle.subscribe((_event, nextSnapshot) => {
      setSnapshot(nextSnapshot);
    });

    lifecycle.start();
    setSnapshot(lifecycle.getSnapshot());

    return () => {
      unsubscribe();
      lifecycle.dispose();
    };
  }, []);

  return <pre>{JSON.stringify(snapshot, null, 2)}</pre>;
}
