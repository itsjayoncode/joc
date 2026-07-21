import type { TtlDuration } from "../types/index.js";

export function ttlToMilliseconds(ttl: TtlDuration | undefined): number | undefined {
  if (!ttl) {
    return undefined;
  }

  const total =
    (ttl.milliseconds ?? 0) +
    (ttl.seconds ?? 0) * 1_000 +
    (ttl.minutes ?? 0) * 60_000 +
    (ttl.hours ?? 0) * 3_600_000 +
    (ttl.days ?? 0) * 86_400_000;

  if (total <= 0) {
    return undefined;
  }

  return total;
}

export function computeExpiresAt(now: number, ttl: TtlDuration | undefined): number | undefined {
  const ms = ttlToMilliseconds(ttl);
  if (ms === undefined) {
    return undefined;
  }
  return now + ms;
}

export function isExpired(expiresAt: number | undefined, now: number): boolean {
  return expiresAt !== undefined && expiresAt <= now;
}
