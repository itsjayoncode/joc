import type { OfflineQueueRuntimeOptions } from "./types.js";
import type { OfflineQueueConfig } from "../../types/index.js";

/** Map public `OfflineQueueConfig` → queue runtime options (exact-optional safe). */
export function toOfflineQueueRuntimeOptions<TValues extends Record<string, unknown>>(
  queueConfig: OfflineQueueConfig | undefined,
): OfflineQueueRuntimeOptions<TValues> {
  if (!queueConfig) {
    return {};
  }

  const options: OfflineQueueRuntimeOptions<TValues> = {};
  if (queueConfig.maxItems !== undefined) {
    (options as { maxItems: number }).maxItems = queueConfig.maxItems;
  }
  if (queueConfig.overflow) {
    (options as { overflow: NonNullable<OfflineQueueConfig["overflow"]> }).overflow =
      queueConfig.overflow;
  }
  if (queueConfig.idempotencyKey) {
    (options as { idempotencyKey: (values: TValues) => string }).idempotencyKey =
      queueConfig.idempotencyKey as (values: TValues) => string;
  }
  if (queueConfig.onConflict) {
    (
      options as {
        onConflict: NonNullable<OfflineQueueRuntimeOptions<TValues>["onConflict"]>;
      }
    ).onConflict = queueConfig.onConflict as NonNullable<
      OfflineQueueRuntimeOptions<TValues>["onConflict"]
    >;
  }
  if (queueConfig.onOverflow) {
    (
      options as {
        onOverflow: NonNullable<OfflineQueueRuntimeOptions<TValues>["onOverflow"]>;
      }
    ).onOverflow = queueConfig.onOverflow as NonNullable<
      OfflineQueueRuntimeOptions<TValues>["onOverflow"]
    >;
  }
  return options;
}
