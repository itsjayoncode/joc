import type { BrowserLifecycleAttentionState, SessionModule } from "../../core/session/types.js";

/**
 * Normalized focus states produced by the Focus Module.
 */
export type FocusModuleState = Extract<BrowserLifecycleAttentionState, "focused" | "unfocused">;

/**
 * Reasons attached to focus transitions.
 */
export type FocusChangeReason = "blur" | "focus" | "initial";

/**
 * Minimal window contract used by the focus adapter.
 */
export interface FocusWindowLike {
  addEventListener(type: "blur" | "focus", listener: () => void): void;
  removeEventListener(type: "blur" | "focus", listener: () => void): void;
}

/**
 * Minimal document contract used by the focus adapter.
 */
export interface FocusDocumentLike {
  hasFocus?(): boolean;
}

/**
 * Minimal runtime environment used by the focus adapter.
 */
export interface FocusAdapterEnvironment {
  readonly document?: FocusDocumentLike;
  readonly window?: FocusWindowLike;
}

/**
 * Pure browser interaction layer for focus observation.
 */
export interface FocusAdapter {
  isSupported(): boolean;
  read(): FocusModuleState | undefined;
  subscribe(listener: () => void): () => void;
}

/**
 * Constructor options used by the Focus Module.
 */
export interface FocusModuleOptions {
  readonly adapter?: FocusAdapter;
  readonly timeProvider?: () => number;
}

/**
 * Internal runtime contract for the Focus Module.
 */
export type FocusModule = SessionModule;
