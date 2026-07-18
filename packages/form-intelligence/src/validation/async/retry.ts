import type { AsyncRetryPolicy } from "../../types/async-validation.js";

export function resolveRetryPolicy(retry: number | AsyncRetryPolicy | undefined): AsyncRetryPolicy {
  if (retry === undefined || retry === 0) {
    return { maxAttempts: 1, delayMs: 0 };
  }
  if (typeof retry === "number") {
    return { maxAttempts: Math.max(1, retry), delayMs: 0 };
  }
  return {
    maxAttempts: Math.max(1, retry.maxAttempts),
    ...(retry.delayMs === undefined ? {} : { delayMs: retry.delayMs }),
    ...(retry.shouldRetry === undefined ? {} : { shouldRetry: retry.shouldRetry }),
  };
}

export async function delay(ms: number, signal: AbortSignal): Promise<void> {
  if (ms <= 0) {
    return;
  }
  if (signal.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

export async function runWithRetry<T>(
  policy: AsyncRetryPolicy,
  signal: AbortSignal,
  task: (attempt: number) => Promise<T>,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= policy.maxAttempts; attempt += 1) {
    if (signal.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    try {
      return await task(attempt);
    } catch (error) {
      lastError = error;
      if (error instanceof Error && error.name === "AbortError") {
        throw error;
      }
      const hasMore = attempt < policy.maxAttempts;
      const should = policy.shouldRetry?.(error, attempt) ?? true;
      if (!hasMore || !should) {
        throw error;
      }
      const wait =
        typeof policy.delayMs === "function" ? policy.delayMs(attempt) : (policy.delayMs ?? 0);
      await delay(wait, signal);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Retry exhausted.");
}
