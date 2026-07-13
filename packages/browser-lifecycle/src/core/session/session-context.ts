/* v8 ignore next */
import { noop } from "../../utils/index.js";

import type {
  BrowserLifecycleSnapshot,
  InternalSessionEventMap,
  SessionContext,
  SessionLogger,
} from "./types.js";
import type { TypedEventEmitter } from "../../events/index.js";
import type {
  BrowserLifecycleCapabilities,
  ResolvedBrowserLifecycleConfig,
} from "../../types/index.js";

/**
 * Creates the internal no-op logger placeholder used by Session Core.
 */
export function createSessionLogger(): SessionLogger {
  return {
    debug: noopLogger,
    error: noopLogger,
    warn: noopLogger,
  };
}

/**
 * Creates the internal Session Context shared with modules.
 */
export function createSessionContext(options: {
  readonly capabilities: BrowserLifecycleCapabilities;
  readonly configuration: ResolvedBrowserLifecycleConfig;
  readonly events: TypedEventEmitter<InternalSessionEventMap>;
  readonly getSnapshot: () => Readonly<BrowserLifecycleSnapshot>;
  readonly logger?: SessionLogger;
  readonly updateSnapshot: (
    updater: (snapshot: Readonly<BrowserLifecycleSnapshot>) => BrowserLifecycleSnapshot,
  ) => Readonly<BrowserLifecycleSnapshot>;
}): SessionContext {
  return {
    capabilities: options.capabilities,
    configuration: options.configuration,
    events: options.events,
    getSnapshot: options.getSnapshot,
    logger: options.logger ?? createSessionLogger(),
    updateSnapshot: options.updateSnapshot,
  };
}

function noopLogger(): void {
  noop();
}
