export type PlainObject = Record<string, unknown>;

/** Duration for TTL policies — convert to milliseconds at write time. */
export interface TtlDuration {
  readonly milliseconds?: number;
  readonly seconds?: number;
  readonly minutes?: number;
  readonly hours?: number;
  readonly days?: number;
}

/** Named write preset — v1 honors `ttl` only. */
export interface StoragePolicy {
  readonly ttl?: TtlDuration;
}

/** Sync string key/value backend (browser Storage-compatible). */
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  /** Optional: list all keys (required for namespace `clear`). */
  keys?(): readonly string[];
}

/** Async string key/value backend (IndexedDB-compatible). */
export interface AsyncStorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  /** Optional: list all keys (required for namespace `clear`). */
  keys?(): Promise<readonly string[]>;
}

export interface StorageEnvelopeV1<T = unknown> {
  readonly v: 1;
  readonly schemaVersion: string;
  readonly savedAt: number;
  readonly expiresAt?: number;
  readonly value: T;
}

export type StorageEnvelope<T = unknown> = StorageEnvelopeV1<T>;

export interface CreateStorageOptions<T = unknown> {
  readonly namespace: string;
  readonly adapter: StorageAdapter;
  /** Default TTL when `set` omits per-write TTL and policy TTL. */
  readonly ttl?: TtlDuration;
  /** Named write presets (copied into an instance-local map). */
  readonly policies?: Readonly<Record<string, StoragePolicy>>;
  /** App schema id stored on envelopes (default `"1"`). */
  readonly schemaVersion?: string;
  readonly serialize?: (value: unknown) => string;
  readonly deserialize?: (raw: string) => unknown;
  /**
   * Called when a loaded envelope's `schemaVersion` differs from the configured version.
   * Return the migrated envelope, or `null` to drop the entry.
   */
  readonly migrate?: (
    envelope: StorageEnvelope<T>,
    fromVersion: string,
  ) => StorageEnvelope<T> | null;
}

export interface CreateAsyncStorageOptions<T = unknown> {
  readonly namespace: string;
  readonly adapter: AsyncStorageAdapter;
  readonly ttl?: TtlDuration;
  readonly policies?: Readonly<Record<string, StoragePolicy>>;
  readonly schemaVersion?: string;
  readonly serialize?: (value: unknown) => string;
  readonly deserialize?: (raw: string) => unknown;
  readonly migrate?: (
    envelope: StorageEnvelope<T>,
    fromVersion: string,
  ) => StorageEnvelope<T> | null | Promise<StorageEnvelope<T> | null>;
}

export interface SetStorageOptions {
  readonly ttl?: TtlDuration;
  /** Named policy from `policies` / `definePolicy` (validated even when `ttl` overrides). */
  readonly policy?: string;
}

export interface JayOnCodeStorage<T = unknown> {
  readonly namespace: string;
  readonly schemaVersion: string;
  get(key: string): T | null;
  set(key: string, value: T, options?: SetStorageOptions): void;
  remove(key: string): void;
  /**
   * Whether a non-expired envelope exists.
   * Does not migrate or persist — call `get` to upgrade schemaVersion.
   */
  has(key: string): boolean;
  /**
   * Remove all keys in this namespace.
   * Requires `adapter.keys()`; throws `ConfigurationError` if missing.
   */
  clear(): void;
  /** Read the envelope without applying migration (still drops expired). */
  peek(key: string): StorageEnvelope<T> | null;
  /** Register or replace a named write preset (ttl-only in v1). */
  definePolicy(name: string, policy: StoragePolicy): void;
}

export interface JayOnCodeAsyncStorage<T = unknown> {
  readonly namespace: string;
  readonly schemaVersion: string;
  get(key: string): Promise<T | null>;
  set(key: string, value: T, options?: SetStorageOptions): Promise<void>;
  remove(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
  clear(): Promise<void>;
  peek(key: string): Promise<StorageEnvelope<T> | null>;
  definePolicy(name: string, policy: StoragePolicy): void;
}
