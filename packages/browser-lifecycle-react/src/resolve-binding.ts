import { createBrowserLifecycle } from "@jayoncode/browser-lifecycle";
import type { BrowserLifecycle, BrowserLifecycleConfig } from "@jayoncode/browser-lifecycle";

export interface BrowserLifecycleAdapterOptions {
  readonly config?: BrowserLifecycleConfig;
  readonly lifecycle?: BrowserLifecycle;
}

export interface ResolvedBrowserLifecycleBinding {
  readonly lifecycle: BrowserLifecycle;
  readonly owns: boolean;
}

/**
 * Resolve an owned or adopted BrowserLifecycle instance.
 * Owned instances are created with `autoStart: false` for SSR-safe client start.
 */
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
