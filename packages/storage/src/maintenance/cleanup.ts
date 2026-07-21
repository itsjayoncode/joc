import { isEnvelope } from "../core/envelope.js";
import { isExpired } from "../core/ttl.js";
import { ConfigurationError } from "../errors/index.js";
import { getStorageInternals } from "../internals.js";

import type { JayOnCodeStorage } from "../types/index.js";

export interface CleanupOptions {
  /** Remove non-envelope / corrupt payloads (default: false). */
  readonly removeInvalid?: boolean;
}

export interface CleanupErrorEntry {
  readonly key: string;
  readonly message: string;
}

export interface CleanupReport {
  readonly scanned: number;
  readonly removedExpired: number;
  readonly removedInvalid: number;
  readonly skipped: number;
  readonly errors: readonly CleanupErrorEntry[];
}

/**
 * Explicit namespace sweep — removes expired envelopes (and optionally invalid payloads).
 * Sync only; no background timers.
 */
export function cleanup(storage: JayOnCodeStorage, options: CleanupOptions = {}): CleanupReport {
  const { adapter, prefix, deserialize, now } = getStorageInternals(storage);
  const removeInvalid = options.removeInvalid === true;

  if (typeof adapter.keys !== "function") {
    throw new ConfigurationError("cleanup() requires adapter.keys() to enumerate namespace keys.");
  }

  let scanned = 0;
  let removedExpired = 0;
  let removedInvalid = 0;
  let skipped = 0;
  const errors: CleanupErrorEntry[] = [];

  for (const physical of adapter.keys()) {
    if (!physical.startsWith(prefix)) {
      continue;
    }

    scanned += 1;
    const key = physical.slice(prefix.length);
    const raw = adapter.getItem(physical);

    if (raw === null) {
      skipped += 1;
      continue;
    }

    let parsed: unknown;
    try {
      parsed = deserialize(raw);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "deserialize failed";
      if (removeInvalid) {
        adapter.removeItem(physical);
        removedInvalid += 1;
      } else {
        errors.push({ key, message });
        skipped += 1;
      }
      continue;
    }

    if (!isEnvelope(parsed)) {
      if (removeInvalid) {
        adapter.removeItem(physical);
        removedInvalid += 1;
      } else {
        errors.push({ key, message: "Stored payload is not a JOC storage envelope." });
        skipped += 1;
      }
      continue;
    }

    if (isExpired(parsed.expiresAt, now())) {
      adapter.removeItem(physical);
      removedExpired += 1;
      continue;
    }

    skipped += 1;
  }

  return {
    scanned,
    removedExpired,
    removedInvalid,
    skipped,
    errors,
  };
}
