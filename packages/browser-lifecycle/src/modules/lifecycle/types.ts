import type { BrowserLifecyclePageState, SessionModule } from "../../core/session/types.js";

export type LifecycleModuleState = Extract<
  BrowserLifecyclePageState,
  "active" | "frozen" | "hidden" | "passive"
>;

export type LifecycleChangeReason =
  "freeze" | "initial" | "pagehide" | "pageshow" | "resume" | "visibilitychange";

export interface LifecycleWindowLike {
  addEventListener(type: "pagehide" | "pageshow", listener: () => void): void;
  removeEventListener(type: "pagehide" | "pageshow", listener: () => void): void;
}

export interface LifecycleDocumentLike {
  addEventListener?(type: "freeze" | "resume" | "visibilitychange", listener: () => void): void;
  hidden?: boolean;
  removeEventListener?(type: "freeze" | "resume" | "visibilitychange", listener: () => void): void;
  visibilityState?: string;
}

export interface LifecycleAdapterEnvironment {
  readonly document?: LifecycleDocumentLike;
  readonly window?: LifecycleWindowLike;
}

export interface LifecycleAdapterSnapshot {
  readonly lifecycle: LifecycleModuleState;
  readonly reason: LifecycleChangeReason;
}

export interface LifecycleAdapter {
  isSupported(): boolean;
  read(): LifecycleAdapterSnapshot | undefined;
  subscribe(listener: () => void): () => void;
}

export interface LifecycleModuleOptions {
  readonly adapter?: LifecycleAdapter;
  readonly timeProvider?: () => number;
}

export type LifecycleModule = SessionModule;
