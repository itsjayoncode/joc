import type { AsyncCachePolicy, TtlInput } from "../../types/async-validation.js";

export interface CacheEntry {
  readonly result: string | undefined;
  readonly expiresAt: number;
}

export interface ValidationCache {
  get(key: string): CacheEntry | undefined;
  set(key: string, result: string | undefined, ttlMs: number): void;
  clear(): void;
}

class MemoryValidationCache implements ValidationCache {
  private readonly entries = new Map<string, CacheEntry>();
  private readonly maxEntries: number;

  public constructor(maxEntries = 256) {
    this.maxEntries = maxEntries;
  }

  public get(key: string): CacheEntry | undefined {
    const entry = this.entries.get(key);
    if (!entry) {
      return undefined;
    }
    if (Date.now() >= entry.expiresAt) {
      this.entries.delete(key);
      return undefined;
    }
    // Refresh LRU order
    this.entries.delete(key);
    this.entries.set(key, entry);
    return entry;
  }

  public set(key: string, result: string | undefined, ttlMs: number): void {
    if (this.entries.has(key)) {
      this.entries.delete(key);
    }
    while (this.entries.size >= this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest === undefined) {
        break;
      }
      this.entries.delete(oldest);
    }
    this.entries.set(key, { result, expiresAt: Date.now() + ttlMs });
  }

  public clear(): void {
    this.entries.clear();
  }
}

const privateCaches = new WeakMap<object, ValidationCache>();
const sharedCaches = new Map<string, ValidationCache>();

export function resolveCachePolicy(
  cache: false | TtlInput | AsyncCachePolicy | undefined,
): AsyncCachePolicy | false {
  if (cache === undefined || cache === false) {
    return false;
  }
  if (typeof cache === "object") {
    return cache;
  }
  return { ttl: cache, storage: "memory", maxEntries: 256 };
}

export function getValidationCache(
  owner: object,
  sharedCache: boolean | string | undefined,
  policy: AsyncCachePolicy,
): ValidationCache {
  const maxEntries = policy.maxEntries ?? 256;
  // `"session"` is accepted for API compatibility but intentionally maps to
  // in-memory only. Persisting validator outcomes (even booleans) to
  // sessionStorage is cleartext storage of sensitive data under CodeQL
  // (js/clear-text-storage-of-sensitive-data) when password/matchesField
  // results flow into the cache.
  const storage = policy.storage ?? "memory";

  if (sharedCache) {
    const namespace = sharedCache === true ? "default" : sharedCache;
    const sharedKey = `${storage}:${namespace}`;
    let cache = sharedCaches.get(sharedKey);
    if (!cache) {
      cache = new MemoryValidationCache(maxEntries);
      sharedCaches.set(sharedKey, cache);
    }
    return cache;
  }

  let cache = privateCaches.get(owner);
  if (!cache) {
    cache = new MemoryValidationCache(maxEntries);
    privateCaches.set(owner, cache);
  }
  return cache;
}

/** Test helper — clears shared namespaces. */
export function clearSharedValidationCaches(): void {
  for (const cache of sharedCaches.values()) {
    cache.clear();
  }
  sharedCaches.clear();
}
