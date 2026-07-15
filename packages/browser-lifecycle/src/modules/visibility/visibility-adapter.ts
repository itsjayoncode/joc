/* v8 ignore next */
import { noop } from "../../utils/index.js";

import type {
  VisibilityAdapter,
  VisibilityAdapterEnvironment,
  VisibilityAdapterSnapshot,
  VisibilityDocumentLike,
} from "./types.js";

/**
 * Creates the Page Visibility API adapter.
 */
export function createVisibilityAdapter(
  environment: VisibilityAdapterEnvironment = getDefaultEnvironment(),
): VisibilityAdapter {
  const documentRef = environment.document;

  return {
    isSupported(): boolean {
      return supportsVisibilityDocument(documentRef);
    },
    read(): VisibilityAdapterSnapshot | undefined {
      if (!documentRef) {
        return undefined;
      }

      return {
        hidden: documentRef.hidden,
        visibilityState: documentRef.visibilityState,
      };
    },
    subscribe(listener: () => void): () => void {
      if (!supportsVisibilityDocument(documentRef)) {
        return noop;
      }

      documentRef.addEventListener("visibilitychange", listener);

      return (): void => {
        documentRef.removeEventListener("visibilitychange", listener);
      };
    },
  };
}

function getDefaultEnvironment(): VisibilityAdapterEnvironment {
  const runtime = globalThis as {
    readonly document?: VisibilityDocumentLike;
  };

  return runtime.document ? { document: runtime.document } : {};
}

function supportsVisibilityDocument(
  documentRef: VisibilityDocumentLike | undefined,
): documentRef is VisibilityDocumentLike {
  return (
    documentRef !== undefined &&
    typeof documentRef.addEventListener === "function" &&
    typeof documentRef.removeEventListener === "function" &&
    "hidden" in documentRef &&
    "visibilityState" in documentRef
  );
}
