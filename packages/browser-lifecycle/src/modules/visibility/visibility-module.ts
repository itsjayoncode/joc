/* v8 ignore next */
import { createVisibilityAdapter } from "./visibility-adapter.js";
import { LifecycleError } from "../../errors/index.js";

import type {
  VisibilityAdapter,
  VisibilityChangeReason,
  VisibilityModule,
  VisibilityModuleOptions,
  VisibilityModuleState,
} from "./types.js";
import type { SessionContext } from "../../core/session/index.js";
import type { BrowserLifecycleVisibilityState } from "../../core/session/types.js";

/**
 * Page Visibility observer module.
 */
export class BrowserVisibilityModule implements VisibilityModule {
  public readonly id = "visibility";
  public readonly order = 10;

  private cleanup: (() => void) | undefined;
  private currentState: BrowserLifecycleVisibilityState = "unknown";
  private enabled = false;
  private hasEmittedInitialState = false;
  private initialized = false;
  private readonly adapter: VisibilityAdapter;
  private readonly timeProvider: () => number;

  public constructor(options: VisibilityModuleOptions = {}) {
    this.adapter = options.adapter ?? createVisibilityAdapter();
    this.timeProvider = options.timeProvider ?? Date.now;
  }

  /**
   * Detects initial visibility state without attaching listeners.
   */
  public initialize(context: SessionContext): void {
    this.cleanup?.();
    this.cleanup = undefined;

    this.enabled = context.capabilities.visibility && this.adapter.isSupported();
    this.initialized = true;
    this.hasEmittedInitialState = false;

    if (!this.enabled) {
      this.currentState = "unknown";
      return;
    }

    const nextState = this.readVisibilityState();

    this.currentState = nextState;
    context.updateSnapshot((snapshot) => ({
      ...snapshot,
      visibility: nextState,
      timestamps: {
        ...snapshot.timestamps,
      },
    }));
  }

  /**
   * Starts listening for visibilitychange updates.
   */
  public start(context: SessionContext): void {
    if (!this.initialized) {
      this.initialize(context);
    }

    if (!this.enabled || this.cleanup) {
      return;
    }

    const currentState = this.readVisibilityState();

    if (currentState !== this.currentState) {
      this.emitVisibilityChange(context, currentState, "visibilitychange");
    } else if (!this.hasEmittedInitialState && context.configuration.emitInitialState) {
      this.emitVisibilityChange(context, currentState, "initial", {
        forcePreviousUnknown: true,
      });
    }

    this.cleanup = this.adapter.subscribe(() => {
      this.handleVisibilityChange(context);
    });
  }

  /**
   * Stops listening for visibilitychange updates.
   */
  public stop(): void {
    this.cleanup?.();
    this.cleanup = undefined;
  }

  /**
   * Clears listeners and local state.
   */
  public destroy(): void {
    this.stop();
    this.currentState = "unknown";
    this.enabled = false;
    this.hasEmittedInitialState = false;
    this.initialized = false;
  }

  private emitVisibilityChange(
    context: SessionContext,
    currentState: VisibilityModuleState,
    reason: VisibilityChangeReason,
    options: {
      readonly forcePreviousUnknown?: boolean;
    } = {},
  ): void {
    const previousState = options.forcePreviousUnknown ? "unknown" : this.currentState;

    this.currentState = currentState;
    this.hasEmittedInitialState = this.hasEmittedInitialState || reason === "initial";

    const timestamp = this.timeProvider();

    if (currentState === "hidden") {
      context.events.emit("internal:visibility-changed", {
        current: "hidden",
        metadata: {
          likelyLastSignal: true,
          reason,
        },
        previous: previousState,
        timestamp,
        type: "page:hidden",
      });
      return;
    }

    context.events.emit("internal:visibility-changed", {
      current: "visible",
      metadata: {
        reason,
      },
      previous: previousState,
      timestamp,
      type: "page:visible",
    });
  }

  private handleVisibilityChange(context: SessionContext): void {
    try {
      /* v8 ignore start */
      if (!this.enabled) {
        return;
      }
      /* v8 ignore stop */

      const nextState = this.readVisibilityState();

      if (nextState === this.currentState) {
        return;
      }

      this.emitVisibilityChange(context, nextState, "visibilitychange");
    } catch (error) {
      const lifecycleError = new LifecycleError("Visibility change handling failed.", {
        cause: error,
      });

      context.logger.error(lifecycleError.message, {
        error: lifecycleError,
        moduleId: this.id,
      });
    }
  }

  private readVisibilityState(): VisibilityModuleState {
    const snapshot = this.adapter.read();

    if (!snapshot) {
      throw new LifecycleError("Visibility adapter did not return a document snapshot.");
    }

    if (snapshot.visibilityState === "hidden" || snapshot.hidden === true) {
      return "hidden";
    }

    if (snapshot.visibilityState === "visible" || snapshot.hidden === false) {
      return "visible";
    }

    throw new LifecycleError("Visibility adapter returned an unsupported visibility state.", {
      details: {
        hidden: snapshot.hidden,
        visibilityState: snapshot.visibilityState,
      },
    });
  }
}

/**
 * Creates the Visibility Module used by Session Core.
 */
export function createVisibilityModule(options: VisibilityModuleOptions = {}): VisibilityModule {
  return new BrowserVisibilityModule(options);
}
