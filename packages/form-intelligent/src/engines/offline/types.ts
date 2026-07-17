export type FieldPath = string;

export type OfflineOverflowPolicy = "drop-oldest" | "drop-newest" | "reject";

export type OfflineConflictAction = "keep" | "drop" | "retry";

export interface QueuedSubmission<TValues extends Record<string, unknown>> {
  readonly id: string;
  readonly values: TValues;
  readonly enqueuedAt: number;
  /** Flush attempt count (0 until first failed flush). Additive — older payloads omit it. */
  readonly attempt?: number;
  /** Optional dedupe key from `OfflineQueueConfig.idempotencyKey`. */
  readonly idempotencyKey?: string;
}

export interface SubmissionQueueState {
  readonly pending: number;
  readonly flushing: boolean;
}

export interface OfflineQueueRuntimeOptions<TValues extends Record<string, unknown>> {
  readonly maxItems?: number;
  readonly overflow?: OfflineOverflowPolicy;
  readonly idempotencyKey?: (values: TValues) => string;
  readonly onConflict?: (
    local: QueuedSubmission<TValues>,
    error: unknown,
  ) => OfflineConflictAction | void | Promise<OfflineConflictAction | void>;
  readonly onOverflow?: (dropped: QueuedSubmission<TValues>, policy: OfflineOverflowPolicy) => void;
}
