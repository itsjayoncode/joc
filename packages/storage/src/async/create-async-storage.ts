import {
  createEnvelope,
  defaultDeserialize,
  defaultSerialize,
  isEnvelope,
} from "../core/envelope.js";
import { assertNamespace, assertPolicyName, namespacedKey } from "../core/keys.js";
import { computeExpiresAt, isExpired } from "../core/ttl.js";
import { ConfigurationError, MigrationError, SerializationError } from "../errors/index.js";

import type {
  AsyncStorageAdapter,
  CreateAsyncStorageOptions,
  JayOnCodeAsyncStorage,
  SetStorageOptions,
  StorageEnvelope,
  StoragePolicy,
  TtlDuration,
} from "../types/index.js";

export function createAsyncStorage<T = unknown>(
  options: CreateAsyncStorageOptions<T>,
): JayOnCodeAsyncStorage<T> {
  const namespace = assertNamespace(options.namespace);
  const schemaVersion = options.schemaVersion?.trim() || "1";
  const serialize = options.serialize ?? defaultSerialize;
  const deserialize = options.deserialize ?? defaultDeserialize;
  const prefix = `${namespace}:`;
  const policies = new Map<string, StoragePolicy>();
  const adapter = options.adapter;
  const now = (): number => Date.now();

  if (options.policies) {
    for (const [name, policy] of Object.entries(options.policies)) {
      policies.set(assertPolicyName(name), policy.ttl !== undefined ? { ttl: policy.ttl } : {});
    }
  }

  const resolveTtl = (setOptions?: SetStorageOptions): TtlDuration | undefined => {
    let policy: StoragePolicy | undefined;

    if (setOptions?.policy !== undefined) {
      const name = setOptions.policy.trim();
      if (!name) {
        throw new ConfigurationError("set() policy name must be non-empty.");
      }
      policy = policies.get(name);
      if (!policy) {
        throw new ConfigurationError(`Unknown storage policy "${name}".`, {
          details: { policy: name },
        });
      }
    }

    if (setOptions?.ttl !== undefined) {
      return setOptions.ttl;
    }
    if (policy?.ttl !== undefined) {
      return policy.ttl;
    }
    return options.ttl;
  };

  const persistEnvelope = async (key: string, envelope: StorageEnvelope<T>): Promise<void> => {
    await adapter.setItem(namespacedKey(namespace, key), serialize(envelope));
  };

  const readEnvelope = async (key: string): Promise<StorageEnvelope<T> | null> => {
    const physical = namespacedKey(namespace, key);
    const raw = await adapter.getItem(physical);
    if (raw === null) {
      return null;
    }

    let parsed: unknown;
    try {
      parsed = deserialize(raw);
    } catch (cause) {
      if (cause instanceof SerializationError) {
        throw cause;
      }
      throw new SerializationError("Failed to deserialize storage payload.", { cause });
    }

    if (!isEnvelope(parsed)) {
      throw new SerializationError("Stored payload is not a JOC storage envelope.", {
        details: { key },
      });
    }

    const envelope = parsed as StorageEnvelope<T>;
    if (isExpired(envelope.expiresAt, now())) {
      await adapter.removeItem(physical);
      return null;
    }

    return envelope;
  };

  const migrateIfNeeded = async (
    envelope: StorageEnvelope<T>,
  ): Promise<StorageEnvelope<T> | null> => {
    if (envelope.schemaVersion === schemaVersion) {
      return envelope;
    }

    if (!options.migrate) {
      throw new MigrationError(
        `Stored schemaVersion "${envelope.schemaVersion}" does not match "${schemaVersion}" and no migrate hook was provided.`,
        { details: { from: envelope.schemaVersion, to: schemaVersion } },
      );
    }

    try {
      const migrated = await options.migrate(envelope, envelope.schemaVersion);
      if (migrated === null) {
        return null;
      }
      if (!isEnvelope(migrated)) {
        throw new MigrationError("migrate() must return a storage envelope or null.");
      }
      return createEnvelope(migrated.value, schemaVersion, migrated.savedAt, migrated.expiresAt);
    } catch (cause) {
      if (cause instanceof MigrationError) {
        throw cause;
      }
      throw new MigrationError("migrate() failed.", { cause });
    }
  };

  const api: JayOnCodeAsyncStorage<T> = {
    namespace,
    schemaVersion,

    async get(key) {
      const envelope = await readEnvelope(key);
      if (!envelope) {
        return null;
      }

      const next = await migrateIfNeeded(envelope);
      if (!next) {
        await adapter.removeItem(namespacedKey(namespace, key));
        return null;
      }

      if (next !== envelope || next.schemaVersion !== envelope.schemaVersion) {
        await persistEnvelope(key, next);
      }

      return next.value;
    },

    async set(key, value, setOptions?: SetStorageOptions) {
      const savedAt = now();
      const expiresAt = computeExpiresAt(savedAt, resolveTtl(setOptions));
      await persistEnvelope(key, createEnvelope(value, schemaVersion, savedAt, expiresAt));
    },

    async remove(key) {
      await adapter.removeItem(namespacedKey(namespace, key));
    },

    async has(key) {
      return (await api.peek(key)) !== null;
    },

    async clear() {
      if (typeof adapter.keys !== "function") {
        throw new ConfigurationError(
          "clear() requires adapter.keys() to enumerate namespace keys.",
        );
      }
      for (const key of await adapter.keys()) {
        if (key.startsWith(prefix)) {
          await adapter.removeItem(key);
        }
      }
    },

    async peek(key) {
      return readEnvelope(key);
    },

    definePolicy(name, policy) {
      policies.set(assertPolicyName(name), policy.ttl !== undefined ? { ttl: policy.ttl } : {});
    },
  };

  return api;
}

/** In-memory async adapter for tests and ephemeral sessions. */
export function createMemoryAsyncAdapter(): AsyncStorageAdapter {
  const map = new Map<string, string>();
  return {
    getItem(key) {
      return Promise.resolve(map.get(key) ?? null);
    },
    setItem(key, value) {
      map.set(key, value);
      return Promise.resolve();
    },
    removeItem(key) {
      map.delete(key);
      return Promise.resolve();
    },
    keys() {
      return Promise.resolve([...map.keys()]);
    },
  };
}
