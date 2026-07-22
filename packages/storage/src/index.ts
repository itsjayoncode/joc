export { createStorage } from "./core/create-storage.js";
export { defaultDeserialize, defaultSerialize } from "./core/envelope.js";
export {
  createLocalStorageAdapter,
  createMemoryAdapter,
  createSessionStorageAdapter,
} from "./adapters/index.js";
export {
  AdapterError,
  ConfigurationError,
  MigrationError,
  QuotaExceededError,
  SerializationError,
  StorageError,
  isQuotaExceededError,
} from "./errors/index.js";
export type { StorageErrorCode, StorageErrorOptions } from "./errors/index.js";
export type {
  CreateStorageOptions,
  JayOnCodeStorage,
  SetStorageOptions,
  StorageAdapter,
  StorageEnvelope,
  StorageEnvelopeV1,
  StoragePolicy,
  TtlDuration,
} from "./types/index.js";

/** Stable package id for scaffolding / playground demos. */
export const packageId = "storage";
