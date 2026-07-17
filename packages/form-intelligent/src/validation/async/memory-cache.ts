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

/**
 * FNV-1a 64-bit hex digest. Session storage must never persist raw field values
 * in keys (`path:JSON(value)` can include passwords / PII).
 */
function digestCacheKey(key: string): string {
  let hash = 0xcbf29ce484222325n;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= BigInt(key.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, "0");
}

/** Paths that must not be mirrored to sessionStorage even as hashed keys. */
function isSensitiveCacheKey(key: string): boolean {
  const separator = key.indexOf(":");
  const path = separator === -1 ? key : key.slice(0, separator);
  return /password|passwd|secret|token|cvv|ssn|\bpin\b|credit.?card/i.test(path);
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

  private sessionKey(logicalKey: string): string {
    return this.prefix + digestCacheKey(logicalKey);
  }

  public get(key: string): CacheEntry | undefined {
    const memoryHit = this.memory.get(key);
    if (memoryHit) {
      return memoryHit;
    }

    if (typeof sessionStorage === "undefined" || isSensitiveCacheKey(key)) {
      return undefined;
    }

    try {
      const raw = sessionStorage.getItem(this.sessionKey(key));
      if (!raw) {
        return undefined;
      }
      const parsed = JSON.parse(raw) as { readonly ok: boolean; readonly expiresAt: number };
      if (Date.now() >= parsed.expiresAt) {
        sessionStorage.removeItem(this.sessionKey(key));
        return undefined;
      }
      // Session only stores validity — never message text (may be tainted / sensitive).
      const result = parsed.ok ? undefined : "Invalid value.";
      this.memory.set(key, result, Math.max(0, parsed.expiresAt - Date.now()));
      return { result, expiresAt: parsed.expiresAt };
    } catch {
      return undefined;
    }
  }

  public set(key: string, result: string | undefined, ttlMs: number): void {
    this.memory.set(key, result, ttlMs);
    // Memory-only for sensitive paths. Session persists only a boolean `ok` flag
    // under a hashed key — never field values or validator messages
    // (CodeQL js/clear-text-storage-of-sensitive-data).
    if (typeof sessionStorage === "undefined" || isSensitiveCacheKey(key)) {
      return;
    }
    try {
      this.evictSessionIfNeeded();
      sessionStorage.setItem(
        this.sessionKey(key),
        JSON.stringify({
          ok: result === undefined,
          expiresAt: Date.now() + ttlMs,
        }),
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
        const storageKey = sessionStorage.key(i);
        if (storageKey?.startsWith(this.prefix)) {
          toRemove.push(storageKey);
        }
      }
      for (const storageKey of toRemove) {
        sessionStorage.removeItem(storageKey);
      }
    } catch {
      // ignore
    }
  }

  private evictSessionIfNeeded(): void {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const storageKey = sessionStorage.key(i);
      if (storageKey?.startsWith(this.prefix)) {
        keys.push(storageKey);
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
