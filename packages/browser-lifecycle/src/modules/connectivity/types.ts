import type { BrowserLifecycleConnectivityState, SessionModule } from "../../core/session/types.js";

/**
 * Normalized connectivity states produced by the Connectivity Module.
 */
export type ConnectivityModuleState = Extract<
  BrowserLifecycleConnectivityState,
  "offline" | "online"
>;

/**
 * Reasons attached to connectivity transitions.
 */
export type ConnectivityChangeReason = "initial" | "offline" | "online";

/**
 * Minimal navigator contract used by the connectivity adapter.
 */
export interface ConnectivityNavigatorLike {
  readonly onLine?: boolean;
}

/**
 * Minimal window contract used by the connectivity adapter.
 */
export interface ConnectivityWindowLike {
  addEventListener(type: "offline" | "online", listener: () => void): void;
  removeEventListener(type: "offline" | "online", listener: () => void): void;
}

/**
 * Minimal runtime environment used by the connectivity adapter.
 */
export interface ConnectivityAdapterEnvironment {
  readonly navigator?: ConnectivityNavigatorLike;
  readonly window?: ConnectivityWindowLike;
}

/**
 * Pure browser interaction layer for connectivity observation.
 */
export interface ConnectivityAdapter {
  isSupported(): boolean;
  read(): ConnectivityModuleState | undefined;
  subscribe(listener: () => void): () => void;
}

/**
 * Constructor options used by the Connectivity Module.
 */
export interface ConnectivityModuleOptions {
  readonly adapter?: ConnectivityAdapter;
  readonly timeProvider?: () => number;
}

/**
 * Internal runtime contract for the Connectivity Module.
 */
export type ConnectivityModule = SessionModule;
