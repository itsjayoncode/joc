import type { BrowserLifecycleTabState, SessionModule } from "../../core/session/types.js";

export type CrossTabRole = Extract<BrowserLifecycleTabState, "primary" | "secondary">;

export type CrossTabMessageType = "broadcast" | "heartbeat" | "leader-claim" | "ping";

export interface CrossTabMessagePayload {
  readonly senderId: string;
  readonly timestamp: number;
  readonly type: CrossTabMessageType;
  readonly value?: string;
}

export interface CrossTabChannelLike {
  addEventListener(type: "message", listener: (event: { readonly data: unknown }) => void): void;
  close(): void;
  postMessage(message: unknown): void;
  removeEventListener(type: "message", listener: (event: { readonly data: unknown }) => void): void;
}

export interface CrossTabBroadcastChannelConstructor {
  new (name: string): CrossTabChannelLike;
}

export interface CrossTabStorageLike {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

export interface CrossTabAdapterEnvironment {
  readonly BroadcastChannel?: CrossTabBroadcastChannelConstructor;
  readonly localStorage?: CrossTabStorageLike;
}

export interface CrossTabAdapter {
  isSupported(): boolean;
  publish(message: CrossTabMessagePayload): void;
  subscribe(listener: (message: CrossTabMessagePayload) => void): () => void;
}

export interface CrossTabModuleOptions {
  readonly adapter?: CrossTabAdapter;
  readonly tabId?: string;
  readonly timeProvider?: () => number;
}

export type CrossTabModule = SessionModule;
