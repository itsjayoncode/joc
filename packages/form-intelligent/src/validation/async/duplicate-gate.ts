const inflight = new Map<string, Promise<string | undefined>>();

/**
 * Coalesce identical in-flight validations by cache key.
 */
export async function joinDuplicate<T>(
  key: string,
  enabled: boolean,
  run: () => Promise<T>,
): Promise<T> {
  if (!enabled) {
    return run();
  }

  const existing = inflight.get(key) as Promise<T> | undefined;
  if (existing) {
    return existing;
  }

  const pending = run().finally(() => {
    if (inflight.get(key) === pending) {
      inflight.delete(key);
    }
  }) as Promise<T>;

  inflight.set(key, pending as Promise<string | undefined>);
  return pending;
}

export function clearDuplicateGate(): void {
  inflight.clear();
}
