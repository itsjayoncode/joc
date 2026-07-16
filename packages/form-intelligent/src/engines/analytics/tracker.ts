import type { FieldPath, FormAnalyticsSnapshot } from "./types.js";

export class FormAnalyticsTracker {
  private readonly startedAt = Date.now();
  private completedAt: number | null = null;
  private errorCount = 0;
  private readonly errorsByField: Record<FieldPath, number> = {};
  private abandonedAt: number | null = null;
  private currentStep = 0;
  private readonly fieldViews: Record<FieldPath, number> = {};
  private lastTouchedField: FieldPath | null = null;

  public recordStep(step: number): void {
    this.currentStep = step;
  }

  public recordFieldView(path: FieldPath): void {
    this.fieldViews[path] = (this.fieldViews[path] ?? 0) + 1;
    this.lastTouchedField = path;
  }

  public recordFieldError(path: FieldPath): void {
    this.errorCount += 1;
    this.errorsByField[path] = (this.errorsByField[path] ?? 0) + 1;
    this.lastTouchedField = path;
  }

  public recordSubmitSuccess(): void {
    this.completedAt = Date.now();
  }

  public recordAbandon(): void {
    this.abandonedAt = Date.now();
  }

  public getSnapshot(): FormAnalyticsSnapshot {
    return {
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      errorCount: this.errorCount,
      errorsByField: { ...this.errorsByField },
      abandonedAt: this.abandonedAt,
      currentStep: this.currentStep,
      fieldViews: { ...this.fieldViews },
      dropOffField: this.abandonedAt ? this.lastTouchedField : null,
    };
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
