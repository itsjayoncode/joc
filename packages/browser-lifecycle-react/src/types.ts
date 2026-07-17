import type {
  BrowserLifecycle,
  BrowserLifecycleConfig,
  BrowserLifecycleSnapshot,
} from "@jayoncode/browser-lifecycle";

import type { ReactNode } from "react";

export type {
  BrowserLifecycleAdapterOptions,
  ResolvedBrowserLifecycleBinding,
} from "./resolve-binding.js";

export interface BrowserLifecycleProviderProps {
  readonly children: ReactNode;
  readonly config?: BrowserLifecycleConfig;
  readonly lifecycle?: BrowserLifecycle;
}

export type SnapshotSelector<TSelected> = (
  snapshot: Readonly<BrowserLifecycleSnapshot>,
) => TSelected;

export interface OwnedBrowserLifecycle {
  readonly lifecycle: BrowserLifecycle;
}
