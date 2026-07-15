/* v8 ignore next */
import { createConnectivityAdapter } from "./connectivity-adapter.js";
import { LifecycleError } from "../../errors/index.js";

import type {
  ConnectivityAdapter,
  ConnectivityChangeReason,
  ConnectivityModule,
  ConnectivityModuleOptions,
  ConnectivityModuleState,
} from "./types.js";
import type { SessionContext } from "../../core/session/index.js";
import type { BrowserLifecycleConnectivityState } from "../../core/session/types.js";

/**
 * Advisory connectivity observer module.
 */
export class BrowserConnectivityModule implements ConnectivityModule {
  public readonly id = "connectivity";
  public readonly order = 30;

  private cleanup: (() => void) | undefined;
  private currentState: BrowserLifecycleConnectivityState = "unknown";
  private enabled = false;
  private hasEmittedInitialState = false;
  private initialized = false;
  private readonly adapter: ConnectivityAdapter;
  private readonly timeProvider: () => number;

  public constructor(options: ConnectivityModuleOptions = {}) {
    this.adapter = options.adapter ?? createConnectivityAdapter();
    this.timeProvider = options.timeProvider ?? Date.now;
  }

  public initialize(context: SessionContext): void {
    this.cleanup?.();
    this.cleanup = undefined;

    this.enabled = context.capabilities.connectivity && this.adapter.isSupported();
    this.initialized = true;
    this.hasEmittedInitialState = false;

    if (!this.enabled) {
      this.currentState = "unknown";
      return;
    }

    const nextState = this.readConnectivityState();

    this.currentState = nextState;
    context.updateSnapshot((snapshot) => ({
      ...snapshot,
      connectivity: nextState,
      timestamps: {
        ...snapshot.timestamps,
      },
    }));
  }

  public start(context: SessionContext): void {
    if (!this.initialized) {
      this.initialize(context);
    }

    if (!this.enabled || this.cleanup) {
      return;
    }

    const currentState = this.readConnectivityState();

    if (currentState !== this.currentState) {
      this.emitConnectivityChange(
        context,
        currentState,
        currentState === "online" ? "online" : "offline",
      );
    } else if (!this.hasEmittedInitialState && context.configuration.emitInitialState) {
      this.emitConnectivityChange(context, currentState, "initial", {
        forcePreviousUnknown: true,
      });
    }

    this.cleanup = this.adapter.subscribe(() => {
      this.handleConnectivityChange(context);
    });
  }

  public stop(): void {
    this.cleanup?.();
    this.cleanup = undefined;
  }

  public destroy(): void {
    this.stop();
    this.currentState = "unknown";
    this.enabled = false;
    this.hasEmittedInitialState = false;
    this.initialized = false;
  }

  private emitConnectivityChange(
    context: SessionContext,
    currentState: ConnectivityModuleState,
    reason: ConnectivityChangeReason,
    options: {
      readonly forcePreviousUnknown?: boolean;
    } = {},
  ): void {
    const previousState = options.forcePreviousUnknown ? "unknown" : this.currentState;

    this.currentState = currentState;
    this.hasEmittedInitialState = this.hasEmittedInitialState || reason === "initial";

    const timestamp = this.timeProvider();

    if (currentState === "offline") {
      context.events.emit("internal:connectivity-changed", {
        current: "offline",
        metadata: {
          advisory: true,
          reason: reason === "initial" ? "initial" : "offline",
        },
        previous: previousState,
        timestamp,
        type: "connection:offline",
      });
      return;
    }

    context.events.emit("internal:connectivity-changed", {
      current: "online",
      metadata: {
        advisory: true,
        reason: reason === "initial" ? "initial" : "online",
      },
      previous: previousState,
      timestamp,
      type: "connection:online",
    });
  }

  private handleConnectivityChange(context: SessionContext): void {
    try {
      /* v8 ignore start */
      if (!this.enabled) {
        return;
      }
      /* v8 ignore stop */

      const nextState = this.readConnectivityState();

      if (nextState === this.currentState) {
        return;
      }

      this.emitConnectivityChange(
        context,
        nextState,
        nextState === "online" ? "online" : "offline",
      );
    } catch (error) {
      const lifecycleError = new LifecycleError("Connectivity change handling failed.", {
        cause: error,
      });

      context.logger.error(lifecycleError.message, {
        error: lifecycleError,
        moduleId: this.id,
      });
    }
  }

  private readConnectivityState(): ConnectivityModuleState {
    const state = this.adapter.read();

    if (!state) {
      throw new LifecycleError("Connectivity adapter did not return a connectivity snapshot.");
    }

    return state;
  }
}

/**
 * Creates the Connectivity Module used by Session Core.
 */
export function createConnectivityModule(
  options: ConnectivityModuleOptions = {},
): ConnectivityModule {
  return new BrowserConnectivityModule(options);
}
