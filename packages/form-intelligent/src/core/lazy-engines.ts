import type { AnalyticsService } from "../engines/analytics/index.js";
import type { OfflineService } from "../engines/offline/index.js";

type OfflineServiceInstance<TValues extends Record<string, unknown>> = OfflineService<TValues>;
type AnalyticsServiceInstance = AnalyticsService;

const offlineImports = new Map<string, Promise<typeof import("../engines/offline/index.js")>>();
const analyticsImport = lazyImport(() => import("../engines/analytics/index.js"));

function lazyImport<T>(loader: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | undefined;
  return () => {
    promise ??= loader();
    return promise;
  };
}

function loadOfflineModule() {
  const key = "offline";
  let promise = offlineImports.get(key);
  if (!promise) {
    promise = import("../engines/offline/index.js");
    offlineImports.set(key, promise);
  }
  return promise;
}

const workflowImport = lazyImport(() => import("../engines/workflow/index.js"));

export function loadWorkflowEngine(): Promise<typeof import("../engines/workflow/index.js")> {
  return workflowImport();
}

export async function ensureOfflineService<TValues extends Record<string, unknown>>(
  storageKey: string,
): Promise<OfflineServiceInstance<TValues>> {
  const { OfflineService } = await loadOfflineModule();
  return new OfflineService<TValues>(storageKey);
}

export async function ensureAnalyticsService(): Promise<AnalyticsServiceInstance> {
  const { AnalyticsService } = await analyticsImport();
  return new AnalyticsService();
}

export function readOfflineQueueState(storageKey: string): { pending: number; flushing: boolean } {
  if (typeof localStorage === "undefined") {
    return { pending: 0, flushing: false };
  }

  const raw = localStorage.getItem(`fi-offline-queue:${storageKey}`);
  if (!raw) {
    return { pending: 0, flushing: false };
  }

  try {
    const queue = JSON.parse(raw) as unknown[];
    return { pending: Array.isArray(queue) ? queue.length : 0, flushing: false };
  } catch {
    return { pending: 0, flushing: false };
  }
}

export function isNavigatorOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}
