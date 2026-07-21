import { isEnvelope } from "../core/envelope.js";
import { isExpired } from "../core/ttl.js";
import { ConfigurationError } from "../errors/index.js";
import { getStorageInternals } from "../internals.js";

import type { JayOnCodeStorage, StorageEnvelope } from "../types/index.js";

/** Snapshot document format (independent of envelope wire `v`). */
export const SNAPSHOT_FORMAT = 1 as const;

export interface SnapshotEntry {
  readonly key: string;
  readonly envelope: StorageEnvelope;
}

export interface StorageSnapshot {
  readonly format: typeof SNAPSHOT_FORMAT;
  readonly namespace: string;
  readonly schemaVersion: string;
  readonly createdAt: number;
  readonly entries: readonly SnapshotEntry[];
}

export interface SnapshotOptions {
  /** Include expired envelopes (default: false — skip them). */
  readonly includeExpired?: boolean;
}

export type RestoreMode = "merge" | "overwrite";

export interface RestoreOptions {
  /** `merge` keeps keys not in the snapshot; `overwrite` clears the namespace first. */
  readonly mode?: RestoreMode;
  /** Write expired envelopes from the snapshot (default: false — skip). */
  readonly restoreExpired?: boolean;
}

export interface RestoreReport {
  readonly written: number;
  readonly skippedExpired: number;
  readonly skippedInvalid: number;
  readonly cleared: boolean;
  readonly errors: readonly { readonly key: string; readonly message: string }[];
}

function requireKeys(adapter: { keys?: () => readonly string[] }, op: string): readonly string[] {
  if (typeof adapter.keys !== "function") {
    throw new ConfigurationError(`${op} requires adapter.keys() to enumerate namespace keys.`);
  }
  return adapter.keys();
}

function isStorageSnapshot(value: unknown): value is StorageSnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    record.format === SNAPSHOT_FORMAT &&
    typeof record.namespace === "string" &&
    typeof record.schemaVersion === "string" &&
    typeof record.createdAt === "number" &&
    Array.isArray(record.entries)
  );
}

/**
 * Export all valid envelopes in the storage namespace.
 * Does not run migrate. Skips expired entries unless `includeExpired`.
 */
export function snapshot(
  storage: JayOnCodeStorage,
  options: SnapshotOptions = {},
): StorageSnapshot {
  const { adapter, namespace, prefix, schemaVersion, deserialize, now } =
    getStorageInternals(storage);
  const includeExpired = options.includeExpired === true;
  const entries: SnapshotEntry[] = [];

  for (const physical of requireKeys(adapter, "snapshot()")) {
    if (!physical.startsWith(prefix)) {
      continue;
    }
    const key = physical.slice(prefix.length);
    const raw = adapter.getItem(physical);
    if (raw === null) {
      continue;
    }

    let parsed: unknown;
    try {
      parsed = deserialize(raw);
    } catch {
      continue;
    }
    if (!isEnvelope(parsed)) {
      continue;
    }
    if (!includeExpired && isExpired(parsed.expiresAt, now())) {
      continue;
    }

    entries.push({ key, envelope: parsed });
  }

  return {
    format: SNAPSHOT_FORMAT,
    namespace,
    schemaVersion,
    createdAt: now(),
    entries,
  };
}

/**
 * Import a snapshot into the storage namespace.
 * Writes envelopes as-is (no migrate). Next `get` may migrate if schemaVersion differs.
 */
export function restore(
  storage: JayOnCodeStorage,
  snap: StorageSnapshot,
  options: RestoreOptions = {},
): RestoreReport {
  const { adapter, namespace, prefix, serialize, now } = getStorageInternals(storage);

  if (!isStorageSnapshot(snap)) {
    throw new ConfigurationError("restore() requires a valid StorageSnapshot (format 1).");
  }
  if (snap.namespace !== namespace) {
    throw new ConfigurationError(
      `Snapshot namespace "${snap.namespace}" does not match storage namespace "${namespace}".`,
      { details: { snapshotNamespace: snap.namespace, storageNamespace: namespace } },
    );
  }

  const mode: RestoreMode = options.mode ?? "merge";
  const restoreExpired = options.restoreExpired === true;
  let cleared = false;

  if (mode === "overwrite") {
    for (const physical of requireKeys(adapter, "restore()")) {
      if (physical.startsWith(prefix)) {
        adapter.removeItem(physical);
      }
    }
    cleared = true;
  } else {
    requireKeys(adapter, "restore()");
  }

  let written = 0;
  let skippedExpired = 0;
  let skippedInvalid = 0;
  const errors: { key: string; message: string }[] = [];

  for (const entry of snap.entries) {
    const key = entry.key;
    if (!key || key.includes(":")) {
      skippedInvalid += 1;
      errors.push({ key, message: "Invalid snapshot entry key." });
      continue;
    }
    if (!isEnvelope(entry.envelope)) {
      skippedInvalid += 1;
      errors.push({ key, message: "Snapshot entry is not a valid envelope." });
      continue;
    }
    if (!restoreExpired && isExpired(entry.envelope.expiresAt, now())) {
      skippedExpired += 1;
      continue;
    }

    try {
      adapter.setItem(`${prefix}${key}`, serialize(entry.envelope));
      written += 1;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "setItem failed";
      errors.push({ key, message });
    }
  }

  return {
    written,
    skippedExpired,
    skippedInvalid,
    cleared,
    errors,
  };
}
