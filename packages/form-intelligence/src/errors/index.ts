import type { PlainObject } from "../types/internal.js";

export type FormErrorCode =
  | "validation_error"
  | "submit_error"
  | "workflow_error"
  | "configuration_error"
  | "draft_error"
  | "offline_error"
  | "plugin_error";

export interface FormErrorOptions {
  readonly cause?: unknown;
  readonly details?: PlainObject;
}

export class FormIntelligentError extends Error {
  public readonly code: FormErrorCode;
  public readonly details: Readonly<PlainObject> | undefined;

  public constructor(message: string, code: FormErrorCode, options: FormErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = "FormIntelligentError";
    this.code = code;
    this.details = options.details;
  }
}

export class ValidationError extends FormIntelligentError {
  public constructor(message: string, options: FormErrorOptions = {}) {
    super(message, "validation_error", options);
    this.name = "ValidationError";
  }
}

export class SubmitError extends FormIntelligentError {
  public constructor(message: string, options: FormErrorOptions = {}) {
    super(message, "submit_error", options);
    this.name = "SubmitError";
  }
}

export class WorkflowError extends FormIntelligentError {
  public constructor(message: string, options: FormErrorOptions = {}) {
    super(message, "workflow_error", options);
    this.name = "WorkflowError";
  }
}

export class ConfigurationError extends FormIntelligentError {
  public constructor(message: string, options: FormErrorOptions = {}) {
    super(message, "configuration_error", options);
    this.name = "ConfigurationError";
  }
}

/** Recoverable draft persistence failures (quota, corrupt payload). */
export class DraftStorageError extends FormIntelligentError {
  public constructor(message: string, options: FormErrorOptions = {}) {
    super(message, "draft_error", options);
    this.name = "DraftStorageError";
  }
}

/** Offline queue failures (quota, overflow reject). */
export class OfflineQueueError extends FormIntelligentError {
  public constructor(message: string, options: FormErrorOptions = {}) {
    super(message, "offline_error", options);
    this.name = "OfflineQueueError";
  }
}

/** Isolated plugin/middleware failures (setup or hook throw). */
export class PluginError extends FormIntelligentError {
  public constructor(message: string, options: FormErrorOptions = {}) {
    super(message, "plugin_error", options);
    this.name = "PluginError";
  }
}

export function isQuotaExceededError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const name = "name" in error ? String((error as { name?: unknown }).name) : "";
  const code = "code" in error ? (error as { code?: unknown }).code : undefined;
  return (
    name === "QuotaExceededError" ||
    name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    code === 22 ||
    code === 1014
  );
}
