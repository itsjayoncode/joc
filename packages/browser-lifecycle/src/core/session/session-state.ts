/* v8 ignore next */
import { LifecycleError } from "../../errors/index.js";
import { deepFreeze } from "../../utils/index.js";

import type {
  BrowserLifecyclePhase,
  BrowserLifecycleSnapshot,
} from "./types.js";
import type {
  BrowserLifecycleCapabilities,
  DeepReadonly,
} from "../../types/index.js";

const ALLOWED_PHASE_TRANSITIONS: Record<BrowserLifecyclePhase, readonly BrowserLifecyclePhase[]> = {
  created: ["disposed", "running"],
  disposed: [],
  running: ["disposed", "stopped"],
  stopped: ["disposed", "running"],
};

/**
 * Internal snapshot store and lifecycle transition validator.
 */
export class SessionStateStore {
  private snapshot: DeepReadonly<BrowserLifecycleSnapshot>;

  public constructor(capabilities: BrowserLifecycleCapabilities, now: number) {
    this.snapshot = deepFreeze({
      activity: "unknown",
      attention: "unknown",
      capabilities,
      connectivity: "unknown",
      lifecycle: "unknown",
      phase: "created",
      tab: "unknown",
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
      visibility: "unknown",
    });
  }

  /**
   * Returns the current readonly snapshot.
   */
  public getSnapshot(): Readonly<BrowserLifecycleSnapshot> {
    return this.snapshot;
  }

  /**
   * Returns the current lifecycle phase.
   */
  public getPhase(): BrowserLifecyclePhase {
    return this.snapshot.phase;
  }

  /**
   * Transitions the lifecycle phase and returns the updated snapshot.
   */
  public transitionPhase(
    nextPhase: BrowserLifecyclePhase,
    now: number,
  ): {
    readonly previousPhase: BrowserLifecyclePhase;
    readonly snapshot: Readonly<BrowserLifecycleSnapshot>;
  } {
    const previousPhase = this.snapshot.phase;

    if (previousPhase === nextPhase) {
      return {
        previousPhase,
        snapshot: this.snapshot,
      };
    }

    if (!ALLOWED_PHASE_TRANSITIONS[previousPhase].includes(nextPhase)) {
      throw new LifecycleError(
        `Invalid Browser Lifecycle phase transition from "${previousPhase}" to "${nextPhase}".`,
      );
    }

    const timestamps = {
      ...this.snapshot.timestamps,
      updatedAt: now,
    };

    if (nextPhase === "running") {
      timestamps.startedAt = now;
    }

    if (nextPhase === "stopped") {
      timestamps.stoppedAt = now;
    }

    if (nextPhase === "disposed") {
      timestamps.disposedAt = now;
    }

    this.snapshot = deepFreeze({
      ...this.snapshot,
      phase: nextPhase,
      timestamps,
    });

    return {
      previousPhase,
      snapshot: this.snapshot,
    };
  }

  /**
   * Applies a controlled snapshot update for future modules.
   */
  public update(
    updater: (snapshot: Readonly<BrowserLifecycleSnapshot>) => BrowserLifecycleSnapshot,
    now: number,
  ): Readonly<BrowserLifecycleSnapshot> {
    const nextSnapshot = updater(this.snapshot);

    this.snapshot = deepFreeze({
      ...nextSnapshot,
      capabilities: this.snapshot.capabilities,
      timestamps: {
        ...nextSnapshot.timestamps,
        createdAt: this.snapshot.timestamps.createdAt,
        updatedAt: now,
      },
    });

    return this.snapshot;
  }
}
