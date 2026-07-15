/* v8 ignore next */
import { createLifecycleAdapter } from "./lifecycle-adapter.js";
import { LifecycleError } from "../../errors/index.js";

import type {
  LifecycleAdapter,
  LifecycleAdapterSnapshot,
  LifecycleModule,
  LifecycleModuleOptions,
} from "./types.js";
import type { SessionContext } from "../../core/session/index.js";
import type { BrowserLifecyclePageState } from "../../core/session/types.js";

export class BrowserLifecyclePageModule implements LifecycleModule {
  public readonly id = "lifecycle";
  public readonly order = 50;

  private cleanup: (() => void) | undefined;
  private currentState: BrowserLifecyclePageState = "unknown";
  private enabled = false;
  private hasEmittedInitialState = false;
  private initialized = false;
  private readonly adapter: LifecycleAdapter;
  private readonly timeProvider: () => number;

  public constructor(options: LifecycleModuleOptions = {}) {
    this.adapter = options.adapter ?? createLifecycleAdapter();
    this.timeProvider = options.timeProvider ?? Date.now;
  }

  public initialize(context: SessionContext): void {
    this.cleanup?.();
    this.cleanup = undefined;

    this.enabled = context.capabilities.pageLifecycle && this.adapter.isSupported();
    this.initialized = true;
    this.hasEmittedInitialState = false;

    if (!this.enabled) {
      this.currentState = "unknown";
      return;
    }

    const snapshot = this.readLifecycleSnapshot();
    this.currentState = snapshot.lifecycle;
    context.updateSnapshot((current) => ({
      ...current,
      lifecycle: snapshot.lifecycle,
    }));
  }

  public start(context: SessionContext): void {
    if (!this.initialized) {
      this.initialize(context);
    }

    if (!this.enabled || this.cleanup) {
      return;
    }

    const snapshot = this.readLifecycleSnapshot();

    if (snapshot.lifecycle !== this.currentState) {
      this.emitLifecycleChange(context, snapshot);
    } else if (!this.hasEmittedInitialState && context.configuration.emitInitialState) {
      this.emitLifecycleChange(context, snapshot, { forcePreviousUnknown: true });
    }

    this.cleanup = this.adapter.subscribe(() => {
      this.handleLifecycleChange(context);
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

  private emitLifecycleChange(
    context: SessionContext,
    snapshot: LifecycleAdapterSnapshot,
    options: { readonly forcePreviousUnknown?: boolean } = {},
  ): void {
    const previousState = options.forcePreviousUnknown ? "unknown" : this.currentState;
    const timestamp = this.timeProvider();

    this.currentState = snapshot.lifecycle;
    this.hasEmittedInitialState = true;

    if (snapshot.lifecycle === "frozen" || snapshot.lifecycle === "hidden") {
      context.events.emit("internal:lifecycle-changed", {
        current: snapshot.lifecycle === "frozen" ? "frozen" : "hidden",
        metadata: {
          lifecycleSignal: snapshot.reason,
          reason: snapshot.reason,
        },
        previous: previousState,
        timestamp,
        type: "page:suspend",
      });
      return;
    }

    if (snapshot.reason === "pageshow") {
      context.events.emit("internal:lifecycle-changed", {
        current: "running",
        metadata: {
          persisted: false,
          restoreSource: "pageshow",
        },
        previous: previousState === "unknown" ? "stopped" : previousState,
        timestamp,
        type: "session:restored",
      });
    }

    context.events.emit("internal:lifecycle-changed", {
      current: "active",
      metadata: {
        reason: snapshot.reason,
        resumeSource: snapshot.reason,
      },
      previous: previousState,
      timestamp,
      type: "page:resume",
    });
  }

  private handleLifecycleChange(context: SessionContext): void {
    try {
      if (!this.enabled) {
        return;
      }

      const snapshot = this.readLifecycleSnapshot();

      if (snapshot.lifecycle === this.currentState) {
        return;
      }

      this.emitLifecycleChange(context, snapshot);
    } catch (error) {
      const lifecycleError = new LifecycleError("Lifecycle change handling failed.", {
        cause: error,
      });

      context.logger.error(lifecycleError.message, {
        error: lifecycleError,
        moduleId: this.id,
      });
    }
  }

  private readLifecycleSnapshot(): LifecycleAdapterSnapshot {
    const snapshot = this.adapter.read();

    if (!snapshot) {
      throw new LifecycleError("Lifecycle adapter did not return a lifecycle snapshot.");
    }

    return snapshot;
  }
}

export function createLifecycleModule(options: LifecycleModuleOptions = {}): LifecycleModule {
  return new BrowserLifecyclePageModule(options);
}
