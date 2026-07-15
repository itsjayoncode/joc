import type { BrowserLifecycleVisibilityState, SessionModule } from "../../core/session/types.js";

/**
 * Normalized visibility states produced by the Visibility Module.
 */
export type VisibilityModuleState = Extract<BrowserLifecycleVisibilityState, "hidden" | "visible">;

/**
 * Reasons attached to visibility transitions.
 */
export type VisibilityChangeReason = "initial" | "visibilitychange";

/**
 * Minimal document contract used by the browser adapter.
 */
export interface VisibilityDocumentLike {
  readonly hidden?: boolean;
  readonly visibilityState?: string;
  addEventListener(type: "visibilitychange", listener: () => void): void;
  removeEventListener(type: "visibilitychange", listener: () => void): void;
}

/**
 * Minimal runtime environment used by the browser adapter.
 */
export interface VisibilityAdapterEnvironment {
  readonly document?: VisibilityDocumentLike;
}

/**
 * Raw document state returned by the browser adapter.
 */
export interface VisibilityAdapterSnapshot {
  readonly hidden: boolean | undefined;
  readonly visibilityState: string | undefined;
}

/**
 * Pure browser interaction layer for visibility observation.
 */
export interface VisibilityAdapter {
  isSupported(): boolean;
  read(): VisibilityAdapterSnapshot | undefined;
  subscribe(listener: () => void): () => void;
}

/**
 * Constructor options used by the Visibility Module.
 */
export interface VisibilityModuleOptions {
  readonly adapter?: VisibilityAdapter;
  readonly timeProvider?: () => number;
}

/**
 * Internal runtime contract for the Visibility Module.
 */
export type VisibilityModule = SessionModule;
