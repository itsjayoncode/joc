import type { SessionModule } from "../../core/session/types.js";
import type { BrowserLifecycleActivityEventName } from "../../types/index.js";

export type IdleModuleActivityState = "active" | "idle";

export type IdleActivitySource = BrowserLifecycleActivityEventName;

export interface ActivityTargetLike {
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
}

export interface IdleAdapterEnvironment {
  readonly document?: ActivityTargetLike;
  readonly window?: ActivityTargetLike;
}

export interface IdleAdapter {
  isSupported(events: readonly IdleActivitySource[]): boolean;
  subscribe(
    events: readonly IdleActivitySource[],
    listener: (source: IdleActivitySource) => void,
  ): () => void;
}

export interface IdleModuleOptions {
  readonly adapter?: IdleAdapter;
  readonly timeProvider?: () => number;
}

export type IdleModule = SessionModule;
