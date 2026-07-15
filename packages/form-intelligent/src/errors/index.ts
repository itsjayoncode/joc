import type { PlainObject } from "../types/internal.js";

export type FormErrorCode =
  "validation_error" | "submit_error" | "workflow_error" | "configuration_error";

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
