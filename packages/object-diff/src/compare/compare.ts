import { normalizeCompareOptions } from "../core/options.js";
import { compareValues } from "./comparison/compare-values.js";

import type { CompareOptions } from "../types/index.js";

/**
 * Deep equality comparison for structured values.
 */
export function compare(a: unknown, b: unknown, options?: CompareOptions): boolean {
  const resolved = normalizeCompareOptions(options);
  return compareValues(a, b, resolved);
}
