import type { BrowserLifecycleEventName, BrowserLifecyclePhase } from "../core/session/types.js";
import type { BrowserLifecycleCapabilities } from "../types/index.js";

/**
 * Per-event dispatch statistics exposed for diagnostics tooling.
 */
export interface BrowserLifecycleEventStat {
  readonly emissionCount: number;
  readonly errorCount: number;
  readonly event: BrowserLifecycleEventName;
  readonly lastDispatchedAt?: number;
  readonly listenerCount: number;
}

/**
 * Runtime diagnostics snapshot for performance and developer tooling.
 */
export interface BrowserLifecycleRuntimeDiagnostics {
  readonly capabilities: Readonly<BrowserLifecycleCapabilities>;
  readonly debug: boolean;
  readonly eventBufferSize: number;
  readonly eventStats: readonly BrowserLifecycleEventStat[];
  readonly isRunning: boolean;
  readonly moduleCount: number;
  readonly phase: BrowserLifecyclePhase;
  readonly pluginCount: number;
  readonly subscriberCount: number;
  readonly totalEmissionCount: number;
  readonly totalListenerCount: number;
}
