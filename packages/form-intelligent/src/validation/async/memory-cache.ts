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

class SessionValidationCache implements ValidationCache {
  private readonly prefix: string;
  private readonly maxEntries: number;
  private readonly memory = new MemoryValidationCache(256);

  public constructor(namespace: string, maxEntries = 256) {
    this.prefix = `fi:async-cache:${namespace}:`;
    this.maxEntries = maxEntries;
  }

  public get(key: string): CacheEntry | undefined {
    const memoryHit = this.memory.get(key);
    if (memoryHit) {
      return memoryHit;
    }

    if (typeof sessionStorage === "undefined") {
      return undefined;
    }

    try {
      const raw = sessionStorage.getItem(this.prefix + key);
      if (!raw) {
        return undefined;
      }
      const parsed = JSON.parse(raw) as CacheEntry;
      if (Date.now() >= parsed.expiresAt) {
        sessionStorage.removeItem(this.prefix + key);
        return undefined;
      }
      this.memory.set(key, parsed.result, Math.max(0, parsed.expiresAt - Date.now()));
      return parsed;
    } catch {
      return undefined;
    }
  }

  public set(key: string, result: string | undefined, ttlMs: number): void {
    this.memory.set(key, result, ttlMs);
    if (typeof sessionStorage === "undefined") {
      return;
    }
    try {
      this.evictSessionIfNeeded();
      sessionStorage.setItem(
        this.prefix + key,
        JSON.stringify({ result, expiresAt: Date.now() + ttlMs } satisfies CacheEntry),
      );
    } catch {
      // Quota / private mode — memory cache still works.
    }
  }

  public clear(): void {
    this.memory.clear();
    if (typeof sessionStorage === "undefined") {
      return;
    }
    try {
      const toRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i += 1) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          toRemove.push(key);
        }
      }
      for (const key of toRemove) {
        sessionStorage.removeItem(key);
      }
    } catch {
      // ignore
    }
  }

  private evictSessionIfNeeded(): void {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const key = sessionStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        keys.push(key);
      }
    }
    while (keys.length >= this.maxEntries) {
      const oldest = keys.shift();
      if (oldest) {
        sessionStorage.removeItem(oldest);
      }
    }
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
  const storage = policy.storage ?? "memory";

  if (sharedCache) {
    const namespace = sharedCache === true ? "default" : sharedCache;
    const sharedKey = `${storage}:${namespace}`;
    let cache = sharedCaches.get(sharedKey);
    if (!cache) {
      cache =
        storage === "session"
          ? new SessionValidationCache(namespace, maxEntries)
          : new MemoryValidationCache(maxEntries);
      sharedCaches.set(sharedKey, cache);
    }
    return cache;
  }

  let cache = privateCaches.get(owner);
  if (!cache) {
    cache =
      storage === "session"
        ? new SessionValidationCache("local", maxEntries)
        : new MemoryValidationCache(maxEntries);
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
