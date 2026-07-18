export interface RetryPolicy {
  readonly maxAttempts?: number;
  readonly delayMs?: number | ((attempt: number) => number);
  readonly shouldRetry?: (error: unknown, attempt: number) => boolean;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxAttempts: 1,
  delayMs: 0,
};

export function normalizeRetryPolicy(policy: RetryPolicy | number | undefined): RetryPolicy {
  if (policy === undefined) {
    return DEFAULT_RETRY_POLICY;
  }

  if (typeof policy === "number") {
    return {
      maxAttempts: Math.max(1, policy),
      delayMs: 250,
    };
  }

  return {
    maxAttempts: policy.maxAttempts ?? 1,
    delayMs: policy.delayMs ?? 0,
    ...(policy.shouldRetry ? { shouldRetry: policy.shouldRetry } : {}),
  };
}

export function resolveRetryDelay(policy: RetryPolicy, attempt: number): number {
  const delay = policy.delayMs ?? 0;
  return typeof delay === "function" ? delay(attempt) : delay;
}

export function shouldRetryError(
  policy: RetryPolicy,
  error: unknown,
  attempt: number,
  maxAttempts: number,
): boolean {
  if (attempt >= maxAttempts) {
    return false;
  }

  if (policy.shouldRetry) {
    return policy.shouldRetry(error, attempt);
  }

  if (error instanceof Error && error.name === "AbortError") {
    return false;
  }

  return true;
}

export async function waitForRetry(delayMs: number, signal: AbortSignal): Promise<void> {
  if (delayMs <= 0) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, delayMs);

    const onAbort = (): void => {
      cleanup();
      reject(new DOMException("Submit cancelled.", "AbortError"));
    };

    const cleanup = (): void => {
      clearTimeout(timer);
      signal.removeEventListener("abort", onAbort);
    };

    if (signal.aborted) {
      onAbort();
      return;
    }

    signal.addEventListener("abort", onAbort, { once: true });
  });
}
