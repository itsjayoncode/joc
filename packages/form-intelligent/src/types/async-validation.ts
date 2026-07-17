/**
 * Async validation option contracts (Phase 4B / API_SIGNATURE_FREEZE §1).
 */

import type { ValidationContext, ValidatorResult } from "./index.js";

export type TtlInput = number | `${number}ms` | `${number}s` | `${number}m` | `${number}h`;

export interface AsyncRetryPolicy {
  /** Total attempts including the first; minimum 1. */
  readonly maxAttempts: number;
  /** Attempt is 1-based after a failure. */
  readonly delayMs?: number | ((attempt: number) => number);
  readonly shouldRetry?: (error: unknown, attempt: number) => boolean;
}

export interface AsyncCachePolicy {
  readonly ttl: TtlInput;
  /** Default `"memory"`. `"session"` uses sessionStorage with hashed keys and a boolean ok flag only (no field values or error messages). Sensitive paths stay memory-only. */
  readonly storage?: "memory" | "session";
  /** Default 256. */
  readonly maxEntries?: number;
}

export interface AsyncValidatorOptions<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly validate: (
    value: unknown,
    context: ValidationContext<TValues> & { readonly signal: AbortSignal },
  ) => ValidatorResult | Promise<ValidatorResult>;

  readonly debounce?: number;
  readonly retry?: number | AsyncRetryPolicy;
  readonly timeout?: number;
  readonly cache?: false | TtlInput | AsyncCachePolicy;
  readonly abortPrevious?: boolean;
  readonly preventDuplicates?: boolean;
  readonly cacheKey?: (value: unknown, context: ValidationContext<TValues>) => string;
  readonly sharedCache?: boolean | string;
  readonly offline?: "skip" | "fail" | "queue";
}

export interface AsyncJob {
  readonly id: string;
  readonly path: string;
  readonly generation: number;
  readonly cacheKey: string;
  readonly signal: AbortSignal;
  readonly startedAt: number;
  readonly status: "scheduled" | "running" | "settled" | "aborted" | "timeout" | "queued";
}

/** Defaults when the options-object overload is used (API_SIGNATURE_FREEZE §1). */
export const ASYNC_VALIDATOR_OPTION_DEFAULTS = {
  debounce: 300,
  retry: 0,
  timeout: undefined,
  cache: false,
  abortPrevious: true,
  preventDuplicates: true,
  sharedCache: false,
  offline: "skip",
} as const;
