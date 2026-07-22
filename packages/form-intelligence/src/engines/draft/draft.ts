import { restoreDeclinedMarkerKey } from "./decline-marker.js";
import { resolveDraftStorage } from "./storage-adapter.js";

import type { DraftStorageOptions } from "./storage-adapter.js";

export function loadDraft(
  storageKey: string,
  options?: DraftStorageOptions,
): Record<string, unknown> | null {
  return resolveDraftStorage(options).load(storageKey);
}

export function saveDraft(
  storageKey: string,
  values: Record<string, unknown>,
  options?: DraftStorageOptions,
): void {
  resolveDraftStorage(options).save(storageKey, values);
}

export function clearDraft(storageKey: string, options?: DraftStorageOptions): void {
  const storage = resolveDraftStorage(options);
  storage.clear(storageKey);
  storage.clear(restoreDeclinedMarkerKey(storageKey));
}
