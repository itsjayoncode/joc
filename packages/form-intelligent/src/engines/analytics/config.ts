import type { AnalyticsRuntimeOptions } from "./types.js";
import type { AnalyticsConfig } from "../../types/index.js";

/** Map public `AnalyticsConfig` → tracker options (exact-optional safe). */
export function toAnalyticsRuntimeOptions(
  config: AnalyticsConfig | undefined,
): AnalyticsRuntimeOptions {
  if (!config) {
    return {};
  }

  const options: AnalyticsRuntimeOptions = {};
  if (config.includePaths) {
    (options as { includePaths: readonly string[] }).includePaths = config.includePaths;
  }
  if (config.excludePaths) {
    (options as { excludePaths: readonly string[] }).excludePaths = config.excludePaths;
  }
  if (config.onSnapshot) {
    (options as { onSnapshot: NonNullable<AnalyticsRuntimeOptions["onSnapshot"]> }).onSnapshot =
      config.onSnapshot;
  }
  return options;
}
