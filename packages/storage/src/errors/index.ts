import type { PlainObject } from "../types/index.js";

export type StorageErrorCode =
  | "configuration_error"
  | "serialization_error"
  | "quota_exceeded"
  | "migration_error"
  | "adapter_error";

export interface StorageErrorOptions {
  readonly cause?: unknown;
  readonly details?: PlainObject;
}

export class StorageError extends Error {
  public readonly code: StorageErrorCode;
  public readonly details: Readonly<PlainObject> | undefined;

  public constructor(message: string, code: StorageErrorCode, options: StorageErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "StorageError";
    this.code = code;
    this.details = options.details;
  }
}

export class ConfigurationError extends StorageError {
  public constructor(message: string, options: StorageErrorOptions = {}) {
    super(message, "configuration_error", options);
    this.name = "ConfigurationError";
  }
}

export class SerializationError extends StorageError {
  public constructor(message: string, options: StorageErrorOptions = {}) {
    super(message, "serialization_error", options);
    this.name = "SerializationError";
  }
}

export class QuotaExceededError extends StorageError {
  public constructor(message: string, options: StorageErrorOptions = {}) {
    super(message, "quota_exceeded", options);
    this.name = "QuotaExceededError";
  }
}

export class MigrationError extends StorageError {
  public constructor(message: string, options: StorageErrorOptions = {}) {
    super(message, "migration_error", options);
    this.name = "MigrationError";
  }
}

export class AdapterError extends StorageError {
  public constructor(message: string, options: StorageErrorOptions = {}) {
    super(message, "adapter_error", options);
    this.name = "AdapterError";
  }
}

export function isQuotaExceededError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const name = "name" in error ? String(error.name) : "";
  const code = "code" in error ? Number(error.code) : undefined;
  return name === "QuotaExceededError" || name === "NS_ERROR_DOM_QUOTA_REACHED" || code === 22;
}
