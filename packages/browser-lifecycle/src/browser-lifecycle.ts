/* v8 ignore next */
import { BrowserLifecycleSession } from "./core/session/index.js";

import type { BrowserLifecycle } from "./core/session/index.js";
import type { BrowserLifecycleConfig } from "./types/index.js";

/**
 * Creates a BrowserLifecycle runtime instance.
 */
export function createBrowserLifecycle(config: BrowserLifecycleConfig = {}): BrowserLifecycle {
  return new BrowserLifecycleSession(config);
}
