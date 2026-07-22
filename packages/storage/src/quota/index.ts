import { namespacedKey } from "../core/keys.js";
import { ConfigurationError, QuotaExceededError } from "../errors/index.js";
import { STORAGE_INTERNALS, getStorageInternals } from "../internals.js";

import type { JayOnCodeStorage, StorageAdapter } from "../types/index.js";

export interface QuotaWarnInfo {
  readonly approxBytes: number;
  readonly maxApproxBytes: number;
  readonly ratio: number;
  readonly key?: string;
}

export interface EnableQuotaGuardOptions {
  /** Soft ceiling based on sum of raw string lengths (not browser remaining quota). */
  readonly maxApproxBytes: number;
  /** Fire `onWarn` when projected usage reaches this fraction of max (default 0.8). */
  readonly warnAtRatio?: number;
  readonly onWarn?: (info: QuotaWarnInfo) => void;
  /**
   * `throw` (default): block `set` with `QuotaExceededError` when over max.
   * `warn`: never throw from the guard (browser hard quota unchanged).
   */
  readonly mode?: "throw" | "warn";
}

export interface QuotaGuardHandle<T = unknown> {
  readonly storage: JayOnCodeStorage<T>;
  estimate(): number;
  stop(): void;
}

function requireKeys(adapter: StorageAdapter): NonNullable<StorageAdapter["keys"]> {
  if (typeof adapter.keys !== "function") {
    throw new ConfigurationError(
      "Quota helpers require adapter.keys() to enumerate namespace keys.",
    );
  }
  return adapter.keys.bind(adapter);
}

/**
 * Sum of raw string lengths for one namespace (approx; not browser quota remaining).
 */
export function estimateNamespaceBytes(storage: JayOnCodeStorage): number {
  const internals = getStorageInternals(storage);
  const keys = requireKeys(internals.adapter);
  let total = 0;
  for (const physical of keys()) {
    if (!physical.startsWith(internals.prefix)) {
      continue;
    }
    const raw = internals.adapter.getItem(physical);
    if (raw !== null) {
      total += raw.length;
    }
  }
  return total;
}

/**
 * Soft-limit guard for sync storage writes.
 * Uses approximate payload bytes — not exact browser remaining quota.
 * Import from `@jayoncode/storage/quota`.
 */
export function enableQuotaGuard<T = unknown>(
  storage: JayOnCodeStorage<T>,
  options: EnableQuotaGuardOptions,
): QuotaGuardHandle<T> {
  const internals = getStorageInternals(storage);
  const maxApproxBytes = options.maxApproxBytes;
  if (!Number.isFinite(maxApproxBytes) || maxApproxBytes < 0) {
    throw new ConfigurationError("maxApproxBytes must be a non-negative finite number.");
  }

  const warnAtRatio = options.warnAtRatio ?? 0.8;
  if (!Number.isFinite(warnAtRatio) || warnAtRatio <= 0 || warnAtRatio > 1) {
    throw new ConfigurationError("warnAtRatio must be a number in (0, 1].");
  }

  const mode = options.mode ?? "throw";
  let stopped = false;
  let warned = false;

  const estimate = (): number => estimateNamespaceBytes(storage);

  const maybeWarn = (approxBytes: number, key?: string): void => {
    const ratio = maxApproxBytes === 0 ? 1 : approxBytes / maxApproxBytes;
    if (ratio >= warnAtRatio) {
      if (!warned) {
        warned = true;
        options.onWarn?.(
          key === undefined
            ? { approxBytes, maxApproxBytes, ratio }
            : { approxBytes, maxApproxBytes, ratio, key },
        );
      }
    } else {
      warned = false;
    }
  };

  const guarded: JayOnCodeStorage<T> = {
    namespace: storage.namespace,
    schemaVersion: storage.schemaVersion,
    get: (key) => storage.get(key),
    peek: (key) => storage.peek(key),
    has: (key) => storage.has(key),
    definePolicy: (name, policy) => {
      storage.definePolicy(name, policy);
    },
    remove(key) {
      storage.remove(key);
      maybeWarn(estimate());
    },
    clear() {
      storage.clear();
      warned = false;
    },
    set(key, value, setOptions) {
      if (stopped) {
        storage.set(key, value, setOptions);
        return;
      }

      const base = internals.adapter;
      requireKeys(base);

      const physical = namespacedKey(internals.namespace, key);
      const oldRaw = base.getItem(physical);
      const oldLen = oldRaw?.length ?? 0;
      const currentTotal = estimateNamespaceBytes(storage);

      let staged: { readonly key: string; readonly value: string } | undefined;
      const capture: StorageAdapter = {
        getItem: (k) => base.getItem(k),
        setItem(k, v) {
          staged = { key: k, value: v };
        },
        removeItem: (k) => {
          base.removeItem(k);
        },
        keys: () => requireKeys(base)(),
      };

      internals.adapter = capture;
      try {
        storage.set(key, value, setOptions);
      } finally {
        internals.adapter = base;
      }

      if (!staged) {
        return;
      }

      const projected = currentTotal - oldLen + staged.value.length;
      maybeWarn(projected, key);

      if (projected > maxApproxBytes && mode === "throw") {
        throw new QuotaExceededError(
          "Soft quota exceeded (approx namespace bytes over maxApproxBytes).",
          {
            details: {
              key,
              approxBytes: projected,
              maxApproxBytes,
            },
          },
        );
      }

      base.setItem(staged.key, staged.value);
    },
  };

  Object.defineProperty(guarded, STORAGE_INTERNALS, {
    value: internals,
    enumerable: false,
    writable: false,
    configurable: false,
  });

  return {
    storage: guarded,
    estimate,
    stop() {
      stopped = true;
    },
  };
}
