/* v8 ignore next */
import { createActivityAdapter } from "./activity-adapter.js";
import { LifecycleError } from "../../errors/index.js";

import type {
  IdleActivitySource,
  IdleAdapter,
  IdleModule,
  IdleModuleActivityState,
  IdleModuleOptions,
} from "./types.js";
import type { SessionContext } from "../../core/session/index.js";
import type { BrowserLifecycleActivityState } from "../../core/session/types.js";

export class BrowserIdleModule implements IdleModule {
  public readonly id = "idle";
  public readonly order = 40;

  private activityCleanup: (() => void) | undefined;
  private currentState: BrowserLifecycleActivityState = "unknown";
  private debounceTimer: ReturnType<typeof setTimeout> | undefined;
  private enabled = false;
  private idleTimer: ReturnType<typeof setTimeout> | undefined;
  private initialized = false;
  private lastActivityAt = 0;
  private readonly adapter: IdleAdapter;
  private readonly timeProvider: () => number;

  public constructor(options: IdleModuleOptions = {}) {
    this.adapter = options.adapter ?? createActivityAdapter();
    this.timeProvider = options.timeProvider ?? Date.now;
  }

  public initialize(context: SessionContext): void {
    this.clearTimers();
    this.activityCleanup?.();
    this.activityCleanup = undefined;

    const idleTimeout = context.configuration.idleTimeout;
    this.enabled =
      context.capabilities.idle &&
      idleTimeout !== false &&
      this.adapter.isSupported(context.configuration.activityEvents);
    this.initialized = true;

    if (!this.enabled) {
      this.currentState = "unknown";
      return;
    }

    this.lastActivityAt = this.timeProvider();
    this.currentState = "active";
    context.updateSnapshot((snapshot) => ({
      ...snapshot,
      activity: "active",
    }));
  }

  public start(context: SessionContext): void {
    if (!this.initialized) {
      this.initialize(context);
    }

    if (!this.enabled || this.activityCleanup) {
      return;
    }

    this.scheduleIdleTimer(context);
    this.activityCleanup = this.adapter.subscribe(
      context.configuration.activityEvents,
      (source) => {
        this.handleActivity(context, source);
      },
    );
  }

  public stop(): void {
    this.clearTimers();
    this.activityCleanup?.();
    this.activityCleanup = undefined;
  }

  public destroy(): void {
    this.stop();
    this.currentState = "unknown";
    this.enabled = false;
    this.initialized = false;
    this.lastActivityAt = 0;
  }

  private handleActivity(context: SessionContext, source: IdleActivitySource): void {
    try {
      if (!this.enabled) {
        return;
      }

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        this.debounceTimer = undefined;
        this.recordActivity(context, source);
      }, context.configuration.activityDebounce);
    } catch (error) {
      const lifecycleError = new LifecycleError("Idle activity handling failed.", { cause: error });

      context.logger.error(lifecycleError.message, {
        error: lifecycleError,
        moduleId: this.id,
      });
    }
  }

  private recordActivity(context: SessionContext, source: IdleActivitySource): void {
    const timestamp = this.timeProvider();
    const previousIdleDuration =
      this.currentState === "idle" ? timestamp - this.lastActivityAt : undefined;

    this.lastActivityAt = timestamp;

    context.events.emit("internal:activity-detected", {
      metadata: {
        activitySource: source,
      },
      timestamp,
      type: "activity:detected",
    });

    if (this.currentState === "idle") {
      this.transitionTo(context, "active", timestamp, {
        activitySource: source,
        ...(previousIdleDuration !== undefined ? { idleDuration: previousIdleDuration } : {}),
      });
    } else {
      context.events.emit("internal:activity-reset", {
        metadata: {
          activitySource: source,
        },
        timestamp,
        type: "activity:reset",
      });
    }

    this.scheduleIdleTimer(context);
  }

  private scheduleIdleTimer(context: SessionContext): void {
    const idleTimeout = context.configuration.idleTimeout;

    if (idleTimeout === false || !this.enabled) {
      return;
    }

    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }

    this.idleTimer = setTimeout(() => {
      this.idleTimer = undefined;
      this.transitionTo(context, "idle", this.timeProvider(), {
        idleTimeout,
        lastActivityAt: this.lastActivityAt,
      });
    }, idleTimeout);
  }

  private transitionTo(
    context: SessionContext,
    nextState: IdleModuleActivityState,
    timestamp: number,
    metadata:
      | {
          readonly activitySource: IdleActivitySource;
          readonly idleDuration?: number;
        }
      | {
          readonly idleTimeout: number;
          readonly lastActivityAt: number;
        },
  ): void {
    if (this.currentState === nextState) {
      return;
    }

    const previousState = this.currentState;
    this.currentState = nextState;

    if (nextState === "idle") {
      context.events.emit("internal:activity-changed", {
        current: "idle",
        metadata: metadata as { readonly idleTimeout: number; readonly lastActivityAt: number },
        previous: previousState,
        timestamp,
        type: "session:idle",
      });
      return;
    }

    context.events.emit("internal:activity-changed", {
      current: "active",
      metadata: metadata as {
        readonly activitySource: IdleActivitySource;
        readonly idleDuration?: number;
      },
      previous: previousState,
      timestamp,
      type: "session:active",
    });
  }

  private clearTimers(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = undefined;
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = undefined;
    }
  }
}

export function createIdleModule(options: IdleModuleOptions = {}): IdleModule {
  return new BrowserIdleModule(options);
}
