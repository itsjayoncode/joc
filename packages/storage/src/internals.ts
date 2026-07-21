import { ConfigurationError } from "./errors/index.js";

import type { JayOnCodeStorage, StorageAdapter } from "./types/index.js";

/** Package-internal handle for capability subpaths (not part of public Stable API). */
export const STORAGE_INTERNALS = Symbol.for("@jayoncode/storage.internals");

export interface StorageInternals {
  /** Mutable so transactions can install a journaling overlay adapter. */
  adapter: StorageAdapter;
  readonly namespace: string;
  readonly prefix: string;
  readonly schemaVersion: string;
  readonly serialize: (value: unknown) => string;
  readonly deserialize: (raw: string) => unknown;
  readonly now: () => number;
}

export function getStorageInternals(storage: JayOnCodeStorage): StorageInternals {
  const withInternals = storage as JayOnCodeStorage & {
    readonly [STORAGE_INTERNALS]?: StorageInternals;
  };
  const internals = withInternals[STORAGE_INTERNALS];
  if (!internals) {
    throw new ConfigurationError(
      "This capability requires a storage instance created by createStorage().",
    );
  }
  return internals;
}
