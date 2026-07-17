import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
import type {
  BrowserLifecycle,
  BrowserLifecycleConfig,
} from "@jayoncode/browser-lifecycle";

export interface BrowserLifecycleAdapterOptions {
  readonly config?: BrowserLifecycleConfig;
  readonly lifecycle?: BrowserLifecycle;
}

export interface ResolvedBrowserLifecycleBinding {
  readonly lifecycle: BrowserLifecycle;
  readonly owns: boolean;
}

export function resolveBrowserLifecycleBinding(
  options: BrowserLifecycleAdapterOptions = {},
): ResolvedBrowserLifecycleBinding {
  if (options.lifecycle) {
    return {
      lifecycle: options.lifecycle,
      owns: false,
    };
  }

  return {
    lifecycle: createBrowserLifecycle({
      ...options.config,
      autoStart: false,
    }),
    owns: true,
  };
}
