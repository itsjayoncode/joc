import type { PlainObject } from "../types/internal.js";

export type ObjectDiffErrorCode =
  | "circular_reference"
  | "max_depth_exceeded"
  | "invalid_patch"
  | "patch_apply_error"
  | "unsupported_type"
  | "not_implemented"
  | "invalid_options"
  | "plugin_error";

export interface ObjectDiffErrorOptions {
  readonly cause?: unknown;
  readonly details?: PlainObject;
}

export class ObjectDiffError extends Error {
  public readonly code: ObjectDiffErrorCode;
  public readonly details: Readonly<PlainObject> | undefined;

  public constructor(
    message: string,
    code: ObjectDiffErrorCode,
    options: ObjectDiffErrorOptions = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "ObjectDiffError";
    this.code = code;
    this.details = options.details;
  }
}

export class CircularReferenceError extends ObjectDiffError {
  public constructor(message: string, options: ObjectDiffErrorOptions = {}) {
    super(message, "circular_reference", options);
    this.name = "CircularReferenceError";
  }
}

export class MaxDepthExceededError extends ObjectDiffError {
  public constructor(message: string, options: ObjectDiffErrorOptions = {}) {
    super(message, "max_depth_exceeded", options);
    this.name = "MaxDepthExceededError";
  }
}

export class InvalidPatchError extends ObjectDiffError {
  public constructor(message: string, options: ObjectDiffErrorOptions = {}) {
    super(message, "invalid_patch", options);
    this.name = "InvalidPatchError";
  }
}

export class PatchApplyError extends ObjectDiffError {
  public constructor(message: string, options: ObjectDiffErrorOptions = {}) {
    super(message, "patch_apply_error", options);
    this.name = "PatchApplyError";
  }
}

export class UnsupportedTypeError extends ObjectDiffError {
  public constructor(message: string, options: ObjectDiffErrorOptions = {}) {
    super(message, "unsupported_type", options);
    this.name = "UnsupportedTypeError";
  }
}

export class NotImplementedError extends ObjectDiffError {
  public constructor(message: string, options: ObjectDiffErrorOptions = {}) {
    super(message, "not_implemented", options);
    this.name = "NotImplementedError";
  }
}

export class InvalidOptionsError extends ObjectDiffError {
  public constructor(message: string, options: ObjectDiffErrorOptions = {}) {
    super(message, "invalid_options", options);
    this.name = "InvalidOptionsError";
  }
}

export class PluginError extends ObjectDiffError {
  public constructor(message: string, options: ObjectDiffErrorOptions = {}) {
    super(message, "plugin_error", options);
    this.name = "PluginError";
  }
}
