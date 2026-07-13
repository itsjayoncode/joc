import type { BrowserLifecycleErrorCode, PlainObject } from "../types/index.js";

/**
 * Shared error options for the public error hierarchy.
 */
export interface BrowserLifecycleErrorOptions {
  readonly cause?: unknown;
  readonly details?: PlainObject;
}

/**
 * Base error for all public Browser Lifecycle infrastructure failures.
 */
export class BrowserLifecycleError extends Error {
  public readonly code: BrowserLifecycleErrorCode;
  public readonly details: Readonly<PlainObject> | undefined;

  public constructor(
    message: string,
    code: BrowserLifecycleErrorCode,
    options: BrowserLifecycleErrorOptions = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "BrowserLifecycleError";
    this.code = code;
    this.details = options.details;
  }
}

/**
 * Error thrown when configuration input is invalid.
 */
export class ConfigurationError extends BrowserLifecycleError {
  public constructor(message: string, options: BrowserLifecycleErrorOptions = {}) {
    super(message, "configuration_error", options);
    this.name = "ConfigurationError";
  }
}

/**
 * Error thrown when a required feature is unavailable.
 */
export class UnsupportedFeatureError extends BrowserLifecycleError {
  public constructor(message: string, options: BrowserLifecycleErrorOptions = {}) {
    super(message, "unsupported_feature_error", options);
    this.name = "UnsupportedFeatureError";
  }
}

/**
 * Error thrown when the package cannot initialize correctly.
 */
export class InitializationError extends BrowserLifecycleError {
  public constructor(message: string, options: BrowserLifecycleErrorOptions = {}) {
    super(message, "initialization_error", options);
    this.name = "InitializationError";
  }
}

/**
 * Error thrown when a lifecycle transition is invalid.
 */
export class LifecycleError extends BrowserLifecycleError {
  public constructor(message: string, options: BrowserLifecycleErrorOptions = {}) {
    super(message, "lifecycle_error", options);
    this.name = "LifecycleError";
  }
}

/**
 * Error thrown when the module registry is used incorrectly.
 */
export class ModuleRegistryError extends BrowserLifecycleError {
  public constructor(message: string, options: BrowserLifecycleErrorOptions = {}) {
    super(message, "module_registry_error", options);
    this.name = "ModuleRegistryError";
  }
}

/**
 * Placeholder plugin error used before the plugin system is implemented.
 */
export class PluginError extends BrowserLifecycleError {
  public constructor(message: string, options: BrowserLifecycleErrorOptions = {}) {
    super(message, "plugin_error", options);
    this.name = "PluginError";
  }
}
