import { createEnvelope, defaultDeserialize, defaultSerialize, isEnvelope } from "./envelope.js";
import { computeExpiresAt, isExpired } from "./ttl.js";
import { ConfigurationError, MigrationError, SerializationError } from "../errors/index.js";
import { STORAGE_INTERNALS } from "../internals.js";

import type { StorageInternals } from "../internals.js";
import type {
  CreateStorageOptions,
  JayOnCodeStorage,
  SetStorageOptions,
  StorageEnvelope,
  StoragePolicy,
  TtlDuration,
} from "../types/index.js";

function assertNamespace(namespace: string): string {
  const trimmed = namespace.trim();
  if (!trimmed) {
    throw new ConfigurationError("createStorage requires a non-empty namespace.");
  }
  if (trimmed.includes(":")) {
    throw new ConfigurationError('Namespace must not contain ":" (used as the key separator).');
  }
  return trimmed;
}

function assertPolicyName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new ConfigurationError("definePolicy requires a non-empty policy name.");
  }
  return trimmed;
}

function namespacedKey(namespace: string, key: string): string {
  if (!key || key.includes(":")) {
    throw new ConfigurationError('Storage key must be non-empty and must not contain ":".');
  }
  return `${namespace}:${key}`;
}

export function createStorage<T = unknown>(options: CreateStorageOptions<T>): JayOnCodeStorage<T> {
  const namespace = assertNamespace(options.namespace);
  const schemaVersion = options.schemaVersion?.trim() || "1";
  const serialize = options.serialize ?? defaultSerialize;
  const deserialize = options.deserialize ?? defaultDeserialize;
  const prefix = `${namespace}:`;
  const policies = new Map<string, StoragePolicy>();

  if (options.policies) {
    for (const [name, policy] of Object.entries(options.policies)) {
      policies.set(assertPolicyName(name), policy.ttl !== undefined ? { ttl: policy.ttl } : {});
    }
  }

  const internals: StorageInternals = {
    adapter: options.adapter,
    namespace,
    prefix,
    schemaVersion,
    serialize,
    deserialize,
    now: () => Date.now(),
  };

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

  const persistEnvelope = (key: string, envelope: StorageEnvelope<T>): void => {
    internals.adapter.setItem(namespacedKey(namespace, key), serialize(envelope));
  };

  const readEnvelope = (key: string): StorageEnvelope<T> | null => {
    const physical = namespacedKey(namespace, key);
    const raw = internals.adapter.getItem(physical);
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
    if (isExpired(envelope.expiresAt, internals.now())) {
      internals.adapter.removeItem(physical);
      return null;
    }

    return envelope;
  };

  const migrateIfNeeded = (envelope: StorageEnvelope<T>): StorageEnvelope<T> | null => {
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
      const migrated = options.migrate(envelope, envelope.schemaVersion);
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

  const api: JayOnCodeStorage<T> = {
    namespace,
    schemaVersion,

    get(key) {
      const envelope = readEnvelope(key);
      if (!envelope) {
        return null;
      }

      const next = migrateIfNeeded(envelope);
      if (!next) {
        internals.adapter.removeItem(namespacedKey(namespace, key));
        return null;
      }

      if (next !== envelope || next.schemaVersion !== envelope.schemaVersion) {
        persistEnvelope(key, next);
      }

      return next.value;
    },

    set(key, value, setOptions?: SetStorageOptions) {
      const savedAt = internals.now();
      const expiresAt = computeExpiresAt(savedAt, resolveTtl(setOptions));
      persistEnvelope(key, createEnvelope(value, schemaVersion, savedAt, expiresAt));
    },

    remove(key) {
      internals.adapter.removeItem(namespacedKey(namespace, key));
    },

    has(key) {
      return api.peek(key) !== null;
    },

    clear() {
      if (typeof internals.adapter.keys !== "function") {
        throw new ConfigurationError(
          "clear() requires adapter.keys() to enumerate namespace keys.",
        );
      }
      for (const key of internals.adapter.keys()) {
        if (key.startsWith(prefix)) {
          internals.adapter.removeItem(key);
        }
      }
    },

    peek(key) {
      return readEnvelope(key);
    },

    definePolicy(name, policy) {
      policies.set(assertPolicyName(name), policy.ttl !== undefined ? { ttl: policy.ttl } : {});
    },
  };

  Object.defineProperty(api, STORAGE_INTERNALS, {
    value: internals,
    enumerable: false,
    writable: false,
    configurable: false,
  });

  return api;
}
