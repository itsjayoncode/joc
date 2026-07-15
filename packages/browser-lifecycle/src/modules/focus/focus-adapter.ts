/* v8 ignore next */
import { noop } from "../../utils/index.js";

import type {
  FocusAdapter,
  FocusAdapterEnvironment,
  FocusDocumentLike,
  FocusModuleState,
  FocusWindowLike,
} from "./types.js";

/**
 * Creates the window focus/blur adapter.
 */
export function createFocusAdapter(
  environment: FocusAdapterEnvironment = getDefaultEnvironment(),
): FocusAdapter {
  const windowRef = environment.window;
  const documentRef = environment.document;

  return {
    isSupported(): boolean {
      return supportsFocusEnvironment(windowRef, documentRef);
    },
    read(): FocusModuleState | undefined {
      if (!documentRef || typeof documentRef.hasFocus !== "function") {
        return undefined;
      }

      return documentRef.hasFocus() ? "focused" : "unfocused";
    },
    subscribe(listener: () => void): () => void {
      if (!windowRef) {
        return noop;
      }

      windowRef.addEventListener("focus", listener);
      windowRef.addEventListener("blur", listener);

      return (): void => {
        windowRef.removeEventListener("focus", listener);
        windowRef.removeEventListener("blur", listener);
      };
    },
  };
}

function getDefaultEnvironment(): FocusAdapterEnvironment {
  const runtime = globalThis as {
    readonly document?: FocusDocumentLike;
    readonly window?: FocusWindowLike;
  };
  return {
    ...(runtime.document ? { document: runtime.document } : {}),
    ...(runtime.window ? { window: runtime.window } : {}),
  };
}

function supportsFocusEnvironment(
  windowRef: FocusWindowLike | undefined,
  documentRef: FocusDocumentLike | undefined,
): boolean {
  return (
    windowRef !== undefined &&
    typeof windowRef.addEventListener === "function" &&
    typeof windowRef.removeEventListener === "function" &&
    documentRef !== undefined &&
    typeof documentRef.hasFocus === "function"
  );
}
