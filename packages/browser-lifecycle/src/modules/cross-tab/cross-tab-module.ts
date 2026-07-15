/* v8 ignore next */
import { createCrossTabAdapter } from "./cross-tab-adapter.js";
import { LifecycleError } from "../../errors/index.js";

import type {
  CrossTabAdapter,
  CrossTabMessagePayload,
  CrossTabModule,
  CrossTabModuleOptions,
  CrossTabRole,
} from "./types.js";
import type { SessionContext } from "../../core/session/index.js";
import type { BrowserLifecycleTabState } from "../../core/session/types.js";

function createTabId(): string {
  return `tab-${Math.random().toString(36).slice(2, 10)}`;
}

export class BrowserCrossTabModule implements CrossTabModule {
  public readonly id = "cross-tab";
  public readonly order = 60;

  private cleanup: (() => void) | undefined;
  private currentRole: BrowserLifecycleTabState = "unknown";
  private enabled = false;
  private heartbeatTimer: ReturnType<typeof setInterval> | undefined;
  private initialized = false;
  private lastHeartbeatAt = 0;
  private adapter: CrossTabAdapter | undefined;
  private readonly adapterFactory: ((channelName: string) => CrossTabAdapter) | undefined;
  private readonly tabId: string;
  private readonly timeProvider: () => number;

  public constructor(options: CrossTabModuleOptions = {}) {
    this.adapterFactory = options.adapter
      ? undefined
      : (channelName: string) => createCrossTabAdapter(channelName);
    this.adapter = options.adapter;
    this.tabId = options.tabId ?? createTabId();
    this.timeProvider = options.timeProvider ?? Date.now;
  }

  public initialize(context: SessionContext): void {
    this.cleanup?.();
    this.cleanup = undefined;
    this.clearHeartbeat();

    this.enabled =
      context.configuration.crossTab.enabled &&
      context.capabilities.broadcastChannel &&
      this.getAdapter(context).isSupported();
    this.initialized = true;

    if (!this.enabled) {
      this.currentRole = "single";
      context.updateSnapshot((snapshot) => ({
        ...snapshot,
        tab: "single",
      }));
      return;
    }

    this.claimLeadership(context);
  }

  public start(context: SessionContext): void {
    if (!this.initialized) {
      this.initialize(context);
    }

    if (!this.enabled || this.cleanup) {
      return;
    }

    this.cleanup = this.getAdapter(context).subscribe((message) => {
      this.handleMessage(context, message);
    });
    this.startHeartbeat(context);
    this.publish(context, { type: "leader-claim" });
  }

  public stop(): void {
    this.cleanup?.();
    this.cleanup = undefined;
    this.clearHeartbeat();
  }

  public destroy(): void {
    this.stop();
    this.currentRole = "unknown";
    this.enabled = false;
    this.initialized = false;
    this.lastHeartbeatAt = 0;
  }

  private claimLeadership(context: SessionContext): void {
    this.transitionRole(context, "primary", "leader-claim");
  }

  private handleMessage(context: SessionContext, message: CrossTabMessagePayload): void {
    try {
      if (!this.enabled || message.senderId === this.tabId) {
        return;
      }

      context.events.emit("internal:cross-tab-message", {
        message,
        tabId: this.tabId,
        timestamp: this.timeProvider(),
      });

      if (message.type === "heartbeat" || message.type === "leader-claim") {
        if (this.currentRole === "primary") {
          const elapsed = this.timeProvider() - this.lastHeartbeatAt;

          if (elapsed > context.configuration.crossTab.leaderTimeout) {
            this.transitionRole(context, "secondary", "timeout-loss");
          }
        } else {
          this.transitionRole(context, "secondary", "remote-leader");
        }
      }
    } catch (error) {
      const lifecycleError = new LifecycleError("Cross-tab message handling failed.", {
        cause: error,
      });

      context.logger.error(lifecycleError.message, {
        error: lifecycleError,
        moduleId: this.id,
      });
    }
  }

  private publish(
    context: SessionContext,
    options: Pick<CrossTabMessagePayload, "type" | "value">,
  ): void {
    const message: CrossTabMessagePayload = {
      senderId: this.tabId,
      timestamp: this.timeProvider(),
      type: options.type,
      ...(options.value ? { value: options.value } : {}),
    };

    this.getAdapter(context).publish(message);
    context.events.emit("internal:cross-tab-message", {
      message,
      tabId: this.tabId,
      timestamp: message.timestamp,
    });
  }

  private startHeartbeat(context: SessionContext): void {
    this.clearHeartbeat();
    this.lastHeartbeatAt = this.timeProvider();

    this.heartbeatTimer = setInterval(() => {
      this.lastHeartbeatAt = this.timeProvider();
      this.publish(context, { type: "heartbeat" });
    }, context.configuration.crossTab.heartbeatInterval);
  }

  private transitionRole(context: SessionContext, nextRole: CrossTabRole, reason: string): void {
    if (this.currentRole === nextRole) {
      return;
    }

    const previousRole = this.currentRole;
    const timestamp = this.timeProvider();

    this.currentRole = nextRole;
    context.updateSnapshot((snapshot) => ({
      ...snapshot,
      tab: nextRole,
    }));

    if (nextRole === "primary") {
      context.events.emit("internal:cross-tab-changed", {
        current: "primary",
        metadata: {
          reason,
          tabId: this.tabId,
          transport: "broadcast-channel",
        },
        previous: previousRole,
        timestamp,
        type: "tab:primary",
      });
      return;
    }

    context.events.emit("internal:cross-tab-changed", {
      current: "secondary",
      metadata: {
        reason,
        tabId: this.tabId,
        transport: "broadcast-channel",
      },
      previous: previousRole,
      timestamp,
      type: "tab:secondary",
    });
  }

  private clearHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  private getAdapter(context: SessionContext): CrossTabAdapter {
    if (this.adapter) {
      return this.adapter;
    }

    const adapter = this.adapterFactory?.(context.configuration.crossTab.channelName);

    if (!adapter) {
      throw new LifecycleError("Cross-tab adapter is unavailable.");
    }

    this.adapter = adapter;
    return adapter;
  }
}

export function createCrossTabModule(options: CrossTabModuleOptions = {}): CrossTabModule {
  return new BrowserCrossTabModule(options);
}
