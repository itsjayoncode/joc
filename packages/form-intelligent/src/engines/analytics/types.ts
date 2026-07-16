export type FieldPath = string;

export interface FormAnalyticsSnapshot {
  readonly startedAt: number;
  readonly completedAt: number | null;
  readonly errorCount: number;
  readonly errorsByField: Readonly<Record<FieldPath, number>>;
  readonly abandonedAt: number | null;
  readonly currentStep: number;
  readonly fieldViews: Readonly<Record<FieldPath, number>>;
  readonly dropOffField: FieldPath | null;
}
