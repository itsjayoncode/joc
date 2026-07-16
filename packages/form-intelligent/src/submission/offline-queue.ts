export { OfflineSubmitQueue, clearOfflineQueue } from "../engines/offline/offline-queue.js";
export type { QueuedSubmission, SubmissionQueueState } from "../engines/offline/types.js";

export interface OfflineQueueStorageAdapter {
  load(key: string): string | null;
  save(key: string, value: string): void;
  remove(key: string): void;
}

export const localStorageOfflineAdapter: OfflineQueueStorageAdapter = {
  load(key: string): string | null {
    if (typeof localStorage === "undefined") {
      return null;
    }

    return localStorage.getItem(key);
  },
  save(key: string, value: string): void {
    if (typeof localStorage === "undefined") {
      return;
    }

    localStorage.setItem(key, value);
  },
  remove(key: string): void {
    if (typeof localStorage === "undefined") {
      return;
    }

    localStorage.removeItem(key);
  },
};
