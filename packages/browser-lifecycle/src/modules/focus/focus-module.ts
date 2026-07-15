/* v8 ignore next */
import { createFocusAdapter } from "./focus-adapter.js";
import { LifecycleError } from "../../errors/index.js";

import type {
  FocusAdapter,
  FocusChangeReason,
  FocusModule,
  FocusModuleOptions,
  FocusModuleState,
} from "./types.js";
import type { SessionContext } from "../../core/session/index.js";
import type { BrowserLifecycleAttentionState } from "../../core/session/types.js";

/**
 * Window focus observer module.
 */
export class BrowserFocusModule implements FocusModule {
  public readonly id = "focus";
  public readonly order = 20;

  private cleanup: (() => void) | undefined;
  private currentState: BrowserLifecycleAttentionState = "unknown";
  private enabled = false;
  private hasEmittedInitialState = false;
  private initialized = false;
  private readonly adapter: FocusAdapter;
  private readonly timeProvider: () => number;

  public constructor(options: FocusModuleOptions = {}) {
    this.adapter = options.adapter ?? createFocusAdapter();
    this.timeProvider = options.timeProvider ?? Date.now;
  }

  public initialize(context: SessionContext): void {
    this.cleanup?.();
    this.cleanup = undefined;

    this.enabled = context.capabilities.focus && this.adapter.isSupported();
    this.initialized = true;
    this.hasEmittedInitialState = false;

    if (!this.enabled) {
      this.currentState = "unknown";
      return;
    }

    const nextState = this.readFocusState();

    this.currentState = nextState;
    context.updateSnapshot((snapshot) => ({
      ...snapshot,
      attention: nextState,
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

    const currentState = this.readFocusState();

    if (currentState !== this.currentState) {
      this.emitFocusChange(context, currentState, currentState === "focused" ? "focus" : "blur");
    } else if (!this.hasEmittedInitialState && context.configuration.emitInitialState) {
      this.emitFocusChange(context, currentState, "initial", {
        forcePreviousUnknown: true,
      });
    }

    this.cleanup = this.adapter.subscribe(() => {
      this.handleFocusChange(context);
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

  private emitFocusChange(
    context: SessionContext,
    currentState: FocusModuleState,
    reason: FocusChangeReason,
    options: {
      readonly forcePreviousUnknown?: boolean;
    } = {},
  ): void {
    const previousState = options.forcePreviousUnknown ? "unknown" : this.currentState;

    this.currentState = currentState;
    this.hasEmittedInitialState = this.hasEmittedInitialState || reason === "initial";

    const timestamp = this.timeProvider();

    if (currentState === "unfocused") {
      context.events.emit("internal:focus-changed", {
        current: "unfocused",
        metadata: {
          reason: reason === "initial" ? "initial" : "blur",
        },
        previous: previousState,
        timestamp,
        type: "window:blur",
      });
      return;
    }

    context.events.emit("internal:focus-changed", {
      current: "focused",
      metadata: {
        reason: reason === "initial" ? "initial" : "focus",
      },
      previous: previousState,
      timestamp,
      type: "window:focus",
    });
  }

  private handleFocusChange(context: SessionContext): void {
    try {
      /* v8 ignore start */
      if (!this.enabled) {
        return;
      }
      /* v8 ignore stop */

      const nextState = this.readFocusState();

      if (nextState === this.currentState) {
        return;
      }

      this.emitFocusChange(context, nextState, nextState === "focused" ? "focus" : "blur");
    } catch (error) {
      const lifecycleError = new LifecycleError("Focus change handling failed.", {
        cause: error,
      });

      context.logger.error(lifecycleError.message, {
        error: lifecycleError,
        moduleId: this.id,
      });
    }
  }

  private readFocusState(): FocusModuleState {
    const state = this.adapter.read();

    if (!state) {
      throw new LifecycleError("Focus adapter did not return an attention snapshot.");
    }

    return state;
  }
}

/**
 * Creates the Focus Module used by Session Core.
 */
export function createFocusModule(options: FocusModuleOptions = {}): FocusModule {
  return new BrowserFocusModule(options);
}
