import type { BrowserLifecycle } from "../../core/session/types.js";
import type { MetricsApi } from "../metrics/types.js";

export type EngagementLevel = "low" | "medium" | "high";

export interface SessionPrediction {
  readonly likelyIdle: boolean;
  readonly likelySleep: boolean;
  readonly attentionScore: number;
  readonly engagement: EngagementLevel;
}

export interface SessionPredictApi {
  predict(): Readonly<SessionPrediction>;
  dispose(): void;
}

export interface CreateSessionPredictApiOptions {
  readonly metrics: Pick<MetricsApi, "snapshot" | "attention">;
  readonly lifecycle: Pick<BrowserLifecycle, "getSnapshot">;
}

/**
 * Lightweight derived prediction from Metrics + current snapshot.
 * Heuristic only — not ML.
 */
export function createSessionPredictApi(
  options: CreateSessionPredictApiOptions,
): SessionPredictApi {
  return {
    dispose(): void {
      // No subscriptions.
    },
    predict(): Readonly<SessionPrediction> {
      const snapshot = options.lifecycle.getSnapshot();
      const metrics = options.metrics.snapshot();
      const attention = options.metrics.attention();

      const likelyIdle =
        snapshot.activity === "idle" ||
        (metrics.idleCount > 0 && metrics.idleMs > metrics.activeMs);

      const likelySleep =
        snapshot.lifecycle === "frozen" || (metrics.sleepCount > 0 && metrics.sleepMs > 60_000);

      let engagement: EngagementLevel = "low";
      if (attention.score >= 70 && metrics.focusCount > 0) {
        engagement = "high";
      } else if (attention.score >= 40) {
        engagement = "medium";
      }

      return {
        attentionScore: attention.score,
        engagement,
        likelyIdle,
        likelySleep,
      };
    },
  };
}
