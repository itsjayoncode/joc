import type { BrowserFeatureEnvironment, BrowserLifecycleCapabilities } from "../../types/index.js";

/**
 * Returns true when the environment supports the Page Visibility API.
 */
export function supportsVisibility(
  environment: BrowserFeatureEnvironment = getDefaultEnvironment(),
): boolean {
  const documentRef = environment.document;

  if (!documentRef) {
    return false;
  }

  return "hidden" in documentRef && "visibilityState" in documentRef;
}

/**
 * Returns true when the environment supports BroadcastChannel.
 */
export function supportsBroadcastChannel(
  environment: BrowserFeatureEnvironment = getDefaultEnvironment(),
): boolean {
  return typeof environment.BroadcastChannel === "function";
}

/**
 * Returns true when the environment supports the pagehide and pageshow lifecycle hooks.
 */
export function supportsPageLifecycle(
  environment: BrowserFeatureEnvironment = getDefaultEnvironment(),
): boolean {
  const windowRef = environment.window;

  if (!windowRef) {
    return false;
  }

  return "onpagehide" in windowRef && "onpageshow" in windowRef;
}

/**
 * Returns true when the environment supports requestIdleCallback.
 */
export function supportsRequestIdleCallback(
  environment: BrowserFeatureEnvironment = getDefaultEnvironment(),
): boolean {
  return typeof environment.requestIdleCallback === "function";
}

/**
 * Returns true when the environment supports AbortController.
 */
export function supportsAbortController(
  environment: BrowserFeatureEnvironment = getDefaultEnvironment(),
): boolean {
  return typeof environment.AbortController === "function";
}

/**
 * Detects the package capability surface without relying on browser sniffing.
 */
export function detectBrowserLifecycleCapabilities(
  environment: BrowserFeatureEnvironment = getDefaultEnvironment(),
): BrowserLifecycleCapabilities {
  return {
    abortController: supportsAbortController(environment),
    broadcastChannel: supportsBroadcastChannel(environment),
    pageLifecycle: supportsPageLifecycle(environment),
    requestIdleCallback: supportsRequestIdleCallback(environment),
    visibility: supportsVisibility(environment),
  };
}

function getDefaultEnvironment(): BrowserFeatureEnvironment {
  return globalThis as unknown as BrowserFeatureEnvironment;
}
