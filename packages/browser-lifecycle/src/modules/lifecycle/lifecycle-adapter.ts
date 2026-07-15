/* v8 ignore next */
import { noop } from "../../utils/index.js";

import type {
  LifecycleAdapter,
  LifecycleAdapterEnvironment,
  LifecycleAdapterSnapshot,
  LifecycleChangeReason,
  LifecycleDocumentLike,
  LifecycleModuleState,
  LifecycleWindowLike,
} from "./types.js";

export function createLifecycleAdapter(
  environment: LifecycleAdapterEnvironment = getDefaultEnvironment(),
): LifecycleAdapter {
  const windowRef = environment.window;
  const documentRef = environment.document;
  let lifecycleState: LifecycleModuleState = readLifecycleState(documentRef);
  let lastReason: LifecycleChangeReason = "initial";

  return {
    isSupported(): boolean {
      return supportsLifecycleEnvironment(windowRef, documentRef);
    },
    read(): LifecycleAdapterSnapshot | undefined {
      if (!supportsLifecycleEnvironment(windowRef, documentRef)) {
        return undefined;
      }

      return {
        lifecycle: lifecycleState,
        reason: lastReason,
      };
    },
    subscribe(listener: () => void): () => void {
      if (!supportsLifecycleEnvironment(windowRef, documentRef)) {
        return noop;
      }

      const cleanups: Array<() => void> = [];

      if (windowRef) {
        const onPageHide = (): void => {
          lifecycleState = "hidden";
          lastReason = "pagehide";
          listener();
        };
        const onPageShow = (): void => {
          lifecycleState = "active";
          lastReason = "pageshow";
          listener();
        };

        windowRef.addEventListener("pagehide", onPageHide);
        windowRef.addEventListener("pageshow", onPageShow);
        cleanups.push(() => {
          windowRef.removeEventListener("pagehide", onPageHide);
          windowRef.removeEventListener("pageshow", onPageShow);
        });
      }

      if (documentRef?.addEventListener && documentRef.removeEventListener) {
        const onFreeze = (): void => {
          lifecycleState = "frozen";
          lastReason = "freeze";
          listener();
        };
        const onResume = (): void => {
          lifecycleState = "active";
          lastReason = "resume";
          listener();
        };
        const onVisibilityChange = (): void => {
          lifecycleState = readLifecycleState(documentRef);
          lastReason = "visibilitychange";
          listener();
        };

        documentRef.addEventListener("freeze", onFreeze);
        documentRef.addEventListener("resume", onResume);
        documentRef.addEventListener("visibilitychange", onVisibilityChange);
        cleanups.push(() => {
          documentRef.removeEventListener?.("freeze", onFreeze);
          documentRef.removeEventListener?.("resume", onResume);
          documentRef.removeEventListener?.("visibilitychange", onVisibilityChange);
        });
      }

      return (): void => {
        for (const cleanup of cleanups) {
          cleanup();
        }
      };
    },
  };
}

function getDefaultEnvironment(): LifecycleAdapterEnvironment {
  const runtime = globalThis as {
    readonly document?: LifecycleDocumentLike;
    readonly window?: LifecycleWindowLike;
  };

  return {
    ...(runtime.document ? { document: runtime.document } : {}),
    ...(runtime.window ? { window: runtime.window } : {}),
  };
}

function readLifecycleState(documentRef: LifecycleDocumentLike | undefined): LifecycleModuleState {
  if (documentRef?.hidden === true || documentRef?.visibilityState === "hidden") {
    return "hidden";
  }

  return "active";
}

function supportsLifecycleEnvironment(
  windowRef: LifecycleWindowLike | undefined,
  documentRef: LifecycleDocumentLike | undefined,
): boolean {
  return (
    windowRef !== undefined &&
    typeof windowRef.addEventListener === "function" &&
    typeof windowRef.removeEventListener === "function" &&
    documentRef !== undefined
  );
}
