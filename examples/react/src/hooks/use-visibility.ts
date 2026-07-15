import { useEffect, useState } from "react";

import { useBrowserLifecycle } from "./browser-lifecycle-provider.js";

import type { BrowserLifecycleSnapshot } from "@jayoncode/browser-lifecycle";

export function useVisibility(): BrowserLifecycleSnapshot["visibility"] {
  const lifecycle = useBrowserLifecycle();
  const [visibility, setVisibility] = useState(lifecycle.getSnapshot().visibility);

  useEffect(() => {
    const unsubs = [
      lifecycle.on("page:visible", () => setVisibility("visible")),
      lifecycle.on("page:hidden", () => setVisibility("hidden")),
    ];
    return () => {
      for (const unsub of unsubs) unsub();
    };
  }, [lifecycle]);

  return visibility;
}
