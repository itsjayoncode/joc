export type FieldPath = string;

export interface QueuedSubmission<TValues extends Record<string, unknown>> {
  readonly id: string;
  readonly values: TValues;
  readonly enqueuedAt: number;
}

export interface SubmissionQueueState {
  readonly pending: number;
  readonly flushing: boolean;
}
