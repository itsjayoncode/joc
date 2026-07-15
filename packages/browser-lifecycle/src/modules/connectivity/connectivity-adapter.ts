/* v8 ignore next */
import { noop } from "../../utils/index.js";

import type {
  ConnectivityAdapter,
  ConnectivityAdapterEnvironment,
  ConnectivityModuleState,
  ConnectivityNavigatorLike,
  ConnectivityWindowLike,
} from "./types.js";

/**
 * Creates the navigator.onLine connectivity adapter.
 */
export function createConnectivityAdapter(
  environment: ConnectivityAdapterEnvironment = getDefaultEnvironment(),
): ConnectivityAdapter {
  const navigatorRef = environment.navigator;
  const windowRef = environment.window;

  return {
    isSupported(): boolean {
      return supportsConnectivityEnvironment(navigatorRef, windowRef);
    },
    read(): ConnectivityModuleState | undefined {
      if (navigatorRef?.onLine === undefined) {
        return undefined;
      }

      return navigatorRef.onLine ? "online" : "offline";
    },
    subscribe(listener: () => void): () => void {
      if (!windowRef) {
        return noop;
      }

      windowRef.addEventListener("online", listener);
      windowRef.addEventListener("offline", listener);

      return (): void => {
        windowRef.removeEventListener("online", listener);
        windowRef.removeEventListener("offline", listener);
      };
    },
  };
}

function getDefaultEnvironment(): ConnectivityAdapterEnvironment {
  const runtime = globalThis as {
    readonly navigator?: ConnectivityNavigatorLike;
    readonly window?: ConnectivityWindowLike;
  };

  return {
    ...(runtime.navigator ? { navigator: runtime.navigator } : {}),
    ...(runtime.window ? { window: runtime.window } : {}),
  };
}

function supportsConnectivityEnvironment(
  navigatorRef: ConnectivityNavigatorLike | undefined,
  windowRef: ConnectivityWindowLike | undefined,
): boolean {
  return (
    navigatorRef !== undefined &&
    typeof navigatorRef.onLine === "boolean" &&
    windowRef !== undefined &&
    typeof windowRef.addEventListener === "function" &&
    typeof windowRef.removeEventListener === "function"
  );
}
