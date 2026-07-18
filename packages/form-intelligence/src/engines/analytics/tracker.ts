import {
  filterPathRecord,
  isAnalyticsPathAllowed,
  type AnalyticsPrivacyOptions,
  type AnalyticsRuntimeOptions,
  type FieldPath,
  type FormAnalyticsSnapshot,
} from "./types.js";

/**
 * In-memory UX metrics tracker.
 *
 * Privacy contract: never stores field **values** — only path keys, counters, and timings.
 * This is form UX instrumentation, not a product analytics SDK.
 */
export class FormAnalyticsTracker {
  private readonly startedAt = Date.now();
  private completedAt: number | null = null;
  private errorCount = 0;
  private readonly errorsByField: Record<FieldPath, number> = {};
  private abandonedAt: number | null = null;
  private currentStep = 0;
  private readonly fieldViews: Record<FieldPath, number> = {};
  private lastTouchedField: FieldPath | null = null;
  private firstErrorAt: number | null = null;
  private readonly privacy: AnalyticsPrivacyOptions;
  private readonly onSnapshot: AnalyticsRuntimeOptions["onSnapshot"];

  public constructor(options: AnalyticsRuntimeOptions = {}) {
    this.privacy = {
      ...(options.includePaths ? { includePaths: options.includePaths } : {}),
      ...(options.excludePaths ? { excludePaths: options.excludePaths } : {}),
    };
    this.onSnapshot = options.onSnapshot;
  }

  public recordStep(step: number): void {
    this.currentStep = step;
  }

  public recordFieldView(path: FieldPath): void {
    if (!isAnalyticsPathAllowed(path, this.privacy)) {
      return;
    }
    this.fieldViews[path] = (this.fieldViews[path] ?? 0) + 1;
    this.lastTouchedField = path;
  }

  public recordFieldError(path: FieldPath): void {
    if (!isAnalyticsPathAllowed(path, this.privacy)) {
      return;
    }
    this.errorCount += 1;
    this.errorsByField[path] = (this.errorsByField[path] ?? 0) + 1;
    this.lastTouchedField = path;
    this.firstErrorAt ??= Date.now();
  }

  public recordSubmitSuccess(): void {
    this.completedAt = Date.now();
  }

  public recordAbandon(): void {
    this.abandonedAt = Date.now();
  }

  public getSnapshot(): FormAnalyticsSnapshot {
    const dropOff =
      this.abandonedAt &&
      this.lastTouchedField &&
      isAnalyticsPathAllowed(this.lastTouchedField, this.privacy)
        ? this.lastTouchedField
        : null;

    const snapshot: FormAnalyticsSnapshot = {
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      errorCount: this.errorCount,
      errorsByField: filterPathRecord(this.errorsByField, this.privacy),
      abandonedAt: this.abandonedAt,
      currentStep: this.currentStep,
      fieldViews: filterPathRecord(this.fieldViews, this.privacy),
      dropOffField: dropOff,
      timeToCompleteMs:
        this.completedAt === null ? null : Math.max(0, this.completedAt - this.startedAt),
      timeToFirstErrorMs:
        this.firstErrorAt === null ? null : Math.max(0, this.firstErrorAt - this.startedAt),
    };

    this.onSnapshot?.(snapshot);
    return snapshot;
  }
}

interface AnalyticsFormLike {
  on(event: string, listener: () => void): () => void;
  readonly state: { values: Record<string, unknown> };
  getFieldState(path: string): { dirty: boolean };
  getErrors(): Readonly<Record<string, string>>;
}

export type { AnalyticsFormLike };

export function createAnalyticsPlugin(tracker: FormAnalyticsTracker) {
  return {
    name: "analytics",
    setup(form: AnalyticsFormLike) {
      const unsubChange = form.on("change", () => {
        for (const path of Object.keys(form.state.values)) {
          if (form.getFieldState(path).dirty) {
            tracker.recordFieldView(path);
          }
        }
      });

      const unsubValidate = form.on("validated", () => {
        for (const [path, message] of Object.entries(form.getErrors())) {
          if (message) {
            tracker.recordFieldError(path);
          }
        }
      });

      const unsubReset = form.on("reset", () => {
        tracker.recordAbandon();
      });

      return () => {
        unsubChange();
        unsubValidate();
        unsubReset();
      };
    },
  };
}
