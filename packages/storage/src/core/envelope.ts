import { SerializationError } from "../errors/index.js";

import type { StorageEnvelope } from "../types/index.js";

export const ENVELOPE_VERSION = 1 as const;

export function defaultSerialize(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch (cause) {
    throw new SerializationError("Failed to serialize storage value.", { cause });
  }
}

export function defaultDeserialize(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch (cause) {
    throw new SerializationError("Failed to deserialize storage value.", { cause });
  }
}

export function isEnvelope(value: unknown): value is StorageEnvelope {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  if (
    record.v !== ENVELOPE_VERSION ||
    typeof record.schemaVersion !== "string" ||
    typeof record.savedAt !== "number" ||
    !("value" in record)
  ) {
    return false;
  }

  if (record.expiresAt === undefined) {
    return true;
  }

  return typeof record.expiresAt === "number" && Number.isFinite(record.expiresAt);
}

export function createEnvelope<T>(
  value: T,
  schemaVersion: string,
  savedAt: number,
  expiresAt: number | undefined,
): StorageEnvelope<T> {
  if (expiresAt === undefined) {
    return {
      v: ENVELOPE_VERSION,
      schemaVersion,
      savedAt,
      value,
    };
  }

  return {
    v: ENVELOPE_VERSION,
    schemaVersion,
    savedAt,
    expiresAt,
    value,
  };
}
