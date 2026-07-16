import type { FieldPath, QueuedSubmission } from "./types.js";

const STORAGE_PREFIX = "fi-offline-queue:";

function readQueue<TValues extends Record<string, unknown>>(
  storageKey: string,
): QueuedSubmission<TValues>[] {
  if (typeof localStorage === "undefined") {
    return [];
  }

  const raw = localStorage.getItem(`${STORAGE_PREFIX}${storageKey}`);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as QueuedSubmission<TValues>[];
  } catch {
    return [];
  }
}

function writeQueue<TValues extends Record<string, unknown>>(
  storageKey: string,
  queue: QueuedSubmission<TValues>[],
): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(`${STORAGE_PREFIX}${storageKey}`, JSON.stringify(queue));
}

export class OfflineSubmitQueue<TValues extends Record<string, unknown>> {
  private flushing = false;
  private readonly storageKey: string;
  private onlineListener: (() => void) | undefined;

  public constructor(formId: string) {
    this.storageKey = formId;
  }

  public getState() {
    return {
      pending: readQueue<TValues>(this.storageKey).length,
      flushing: this.flushing,
    };
  }

  public enqueue(values: TValues): void {
    const queue = readQueue<TValues>(this.storageKey);
    queue.push({
      id: `${Date.now()}-${queue.length}`,
      values,
      enqueuedAt: Date.now(),
    });
    writeQueue(this.storageKey, queue);
  }

  public listenOnline(flush: () => Promise<void>): void {
    if (typeof window === "undefined") {
      return;
    }

    this.onlineListener = () => {
      if (navigator.onLine) {
        void flush();
      }
    };

    window.addEventListener("online", this.onlineListener);
  }

  public destroy(): void {
    if (this.onlineListener && typeof window !== "undefined") {
      window.removeEventListener("online", this.onlineListener);
    }
  }

  public async flush(
    submit: (values: TValues) => Promise<boolean>,
  ): Promise<{ flushed: number; failed: number }> {
    if (this.flushing) {
      return { flushed: 0, failed: 0 };
    }

    this.flushing = true;
    let flushed = 0;
    let failed = 0;

    try {
      let queue = readQueue<TValues>(this.storageKey);
      while (queue.length > 0) {
        const [next, ...rest] = queue;
        if (!next) {
          break;
        }

        const ok = await submit(next.values);
        if (!ok) {
          failed += 1;
          break;
        }

        flushed += 1;
        queue = rest;
        writeQueue(this.storageKey, queue);
      }
    } finally {
      this.flushing = false;
    }

    return { flushed, failed };
  }

  public isOffline(): boolean {
    return typeof navigator !== "undefined" && !navigator.onLine;
  }
}

export function clearOfflineQueue(storageKey: FieldPath): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.removeItem(`${STORAGE_PREFIX}${storageKey}`);
}
