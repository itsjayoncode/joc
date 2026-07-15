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
 * Returns true when the environment supports idle activity observation.
 */
export function supportsIdle(
  environment: BrowserFeatureEnvironment = getDefaultEnvironment(),
): boolean {
  const windowRef = environment.window;
  const documentRef = environment.document;

  if (!windowRef) {
    return false;
  }

  return (
    typeof windowRef.addEventListener === "function" &&
    typeof windowRef.removeEventListener === "function" &&
    documentRef !== undefined
  );
}

/**
 * Returns true when the environment supports advisory connectivity observation.
 */
export function supportsConnectivity(
  environment: BrowserFeatureEnvironment = getDefaultEnvironment(),
): boolean {
  const navigatorRef = environment.navigator;
  const windowRef = environment.window;

  if (!navigatorRef || !windowRef) {
    return false;
  }

  return (
    typeof navigatorRef.onLine === "boolean" &&
    typeof windowRef.addEventListener === "function" &&
    typeof windowRef.removeEventListener === "function"
  );
}

/**
 * Returns true when the environment supports window focus observation.
 */
export function supportsFocus(
  environment: BrowserFeatureEnvironment = getDefaultEnvironment(),
): boolean {
  const windowRef = environment.window;
  const documentRef = environment.document;

  if (!windowRef || !documentRef) {
    return false;
  }

  return (
    typeof windowRef.addEventListener === "function" &&
    typeof windowRef.removeEventListener === "function" &&
    typeof documentRef.hasFocus === "function"
  );
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
    connectivity: supportsConnectivity(environment),
    focus: supportsFocus(environment),
    idle: supportsIdle(environment),
    pageLifecycle: supportsPageLifecycle(environment),
    requestIdleCallback: supportsRequestIdleCallback(environment),
    visibility: supportsVisibility(environment),
  };
}

function getDefaultEnvironment(): BrowserFeatureEnvironment {
  return globalThis as unknown as BrowserFeatureEnvironment;
}
