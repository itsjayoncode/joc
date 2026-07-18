import { joinDuplicate } from "./duplicate-gate.js";
import { getValidationCache, resolveCachePolicy } from "./memory-cache.js";
import { parseTtl } from "./parse-ttl.js";
import { resolveRetryPolicy, runWithRetry } from "./retry.js";
import { runWithTimeout } from "./timeout.js";
import { ASYNC_VALIDATOR_OPTION_DEFAULTS } from "../../types/async-validation.js";

import type { AsyncValidatorOptions } from "../../types/async-validation.js";
import type { ValidationContext, ValidatorResult } from "../../types/index.js";

function normalizeResult(result: ValidatorResult): string | undefined {
  if (result === true || result === undefined) {
    return undefined;
  }
  if (result === false) {
    return "Invalid value.";
  }
  return result;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(",")}}`;
}

export function defaultAsyncCacheKey(
  value: unknown,
  context: ValidationContext<Record<string, unknown>>,
): string {
  return `${context.path}:${stableStringify(value)}`;
}

export function resolveAsyncDebounceMs(options: AsyncValidatorOptions | undefined): number {
  return options?.debounce ?? ASYNC_VALIDATOR_OPTION_DEFAULTS.debounce;
}

function isOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

function applyOfflinePolicy(policy: "skip" | "fail" | "queue"): ValidatorResult | "proceed" {
  if (!isOffline()) {
    return "proceed";
  }
  if (policy === "fail") {
    return "You appear to be offline.";
  }
  // skip + queue: do not fail the field; skip network work
  return true;
}

/**
 * Execute an options-configured async validator (cache → duplicates → timeout → retry).
 */
export async function runAsyncValidatorOptions<TValues extends Record<string, unknown>>(
  options: AsyncValidatorOptions<TValues>,
  value: unknown,
  context: ValidationContext<TValues>,
  signal: AbortSignal,
  cacheOwner: object,
): Promise<string | undefined> {
  if (signal.aborted) {
    return undefined;
  }

  const offline = options.offline ?? ASYNC_VALIDATOR_OPTION_DEFAULTS.offline;
  const offlineResult = applyOfflinePolicy(offline);
  if (offlineResult !== "proceed") {
    return normalizeResult(offlineResult);
  }

  const cacheKeyFn = options.cacheKey ?? defaultAsyncCacheKey;
  const cacheKey = cacheKeyFn(value, context);
  const cachePolicy = resolveCachePolicy(options.cache ?? ASYNC_VALIDATOR_OPTION_DEFAULTS.cache);
  const preventDuplicates =
    options.preventDuplicates ?? ASYNC_VALIDATOR_OPTION_DEFAULTS.preventDuplicates;

  if (cachePolicy) {
    const cache = getValidationCache(cacheOwner, options.sharedCache, cachePolicy);
    const hit = cache.get(cacheKey);
    if (hit) {
      return hit.result;
    }
  }

  const retryPolicy = resolveRetryPolicy(options.retry ?? ASYNC_VALIDATOR_OPTION_DEFAULTS.retry);

  const execute = async (): Promise<string | undefined> => {
    return runWithTimeout(options.timeout, signal, async (timedSignal) => {
      return runWithRetry(retryPolicy, timedSignal, async () => {
        if (timedSignal.aborted) {
          throw new DOMException("Aborted", "AbortError");
        }
        const ctx = {
          ...context,
          signal: timedSignal,
        } as ValidationContext<TValues> & { readonly signal: AbortSignal };
        const result = await options.validate(value, ctx);
        if (timedSignal.aborted) {
          throw new DOMException("Aborted", "AbortError");
        }
        return normalizeResult(result);
      });
    });
  };

  try {
    const message = await joinDuplicate(cacheKey, preventDuplicates, execute);

    if (signal.aborted) {
      return undefined;
    }

    if (cachePolicy) {
      const cache = getValidationCache(cacheOwner, options.sharedCache, cachePolicy);
      cache.set(cacheKey, message, parseTtl(cachePolicy.ttl));
    }

    return message;
  } catch (error) {
    if (signal.aborted) {
      return undefined;
    }
    if (isTimeoutError(error)) {
      return "Validation timed out.";
    }
    if (error instanceof Error && error.name === "AbortError") {
      return undefined;
    }
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return "Validation failed.";
  }
}

function isTimeoutError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const name = "name" in error ? String(error.name) : "";
  return name === "TimeoutError";
}
