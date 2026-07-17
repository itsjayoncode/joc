import { FormAnalyticsTracker, createAnalyticsPlugin, type AnalyticsFormLike } from "./tracker.js";

import type { AnalyticsRuntimeOptions, FormAnalyticsSnapshot } from "./types.js";

export const EMPTY_ANALYTICS_SNAPSHOT: FormAnalyticsSnapshot = {
  startedAt: 0,
  completedAt: null,
  errorCount: 0,
  errorsByField: {},
  abandonedAt: null,
  currentStep: 0,
  fieldViews: {},
  dropOffField: null,
  timeToCompleteMs: null,
  timeToFirstErrorMs: null,
};

export class AnalyticsService {
  private tracker: FormAnalyticsTracker | null = null;

  public constructor(private readonly options: AnalyticsRuntimeOptions = {}) {}

  public ensure(): FormAnalyticsTracker {
    if (!this.tracker) {
      this.tracker = new FormAnalyticsTracker(this.options);
    }

    return this.tracker;
  }

  public getSnapshot(currentStep: number): FormAnalyticsSnapshot {
    if (!this.tracker) {
      return EMPTY_ANALYTICS_SNAPSHOT;
    }

    this.tracker.recordStep(currentStep);
    return this.tracker.getSnapshot();
  }

  public recordSubmitSuccess(): void {
    this.tracker?.recordSubmitSuccess();
  }

  public destroy(): void {
    this.tracker = null;
  }
}

export function createAnalyticsModule(service: AnalyticsService) {
  return {
    id: "analytics",
    order: 50,
    start(context: { form: AnalyticsFormLike; registerCleanup: (cleanup: () => void) => void }) {
      const cleanup = createAnalyticsPlugin(service.ensure()).setup(context.form);
      if (typeof cleanup === "function") {
        context.registerCleanup(cleanup);
      }
    },
    destroy() {
      service.destroy();
    },
  };
}
