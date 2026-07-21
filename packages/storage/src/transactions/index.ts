import { ConfigurationError } from "../errors/index.js";
import { getStorageInternals } from "../internals.js";

import type { JayOnCodeStorage, StorageAdapter } from "../types/index.js";

const activeTransactions = new WeakSet();

/**
 * Same-tab batched writes with rollback on throw.
 * Not ACID / not multi-tab durable — overlay journal, commit flush on success.
 * Import from `@jayoncode/storage/transactions`.
 */
export function transaction<TResult>(storage: JayOnCodeStorage, fn: () => TResult): TResult {
  const internals = getStorageInternals(storage);

  if (activeTransactions.has(storage)) {
    throw new ConfigurationError(
      "Nested transactions are not supported. Finish or roll back the current transaction first.",
    );
  }

  const base = internals.adapter;
  /** Overlay: string = staged value; `null` = staged remove. */
  const overlay = new Map<string, string | null>();

  const txAdapter: StorageAdapter = {
    getItem(key) {
      if (overlay.has(key)) {
        return overlay.get(key) ?? null;
      }
      return base.getItem(key);
    },
    setItem(key, value) {
      overlay.set(key, value);
    },
    removeItem(key) {
      overlay.set(key, null);
    },
    keys() {
      if (typeof base.keys !== "function") {
        throw new ConfigurationError(
          "transaction keys/clear requires adapter.keys() to enumerate namespace keys.",
        );
      }
      const keys = new Set<string>(base.keys());
      for (const [key, value] of overlay) {
        if (value === null) {
          keys.delete(key);
        } else {
          keys.add(key);
        }
      }
      return [...keys];
    },
  };

  activeTransactions.add(storage);
  internals.adapter = txAdapter;

  try {
    const result = fn();

    for (const [key, value] of overlay) {
      if (value === null) {
        base.removeItem(key);
      } else {
        base.setItem(key, value);
      }
    }

    return result;
  } catch (error) {
    // Discard overlay — base adapter unchanged.
    throw error;
  } finally {
    internals.adapter = base;
    activeTransactions.delete(storage);
  }
}
