import { OfflineQueueError, isQuotaExceededError } from "../../errors/index.js";

import type {
  FieldPath,
  OfflineOverflowPolicy,
  OfflineQueueRuntimeOptions,
  QueuedSubmission,
} from "./types.js";

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
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QueuedSubmission<TValues>[]) : [];
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

  try {
    localStorage.setItem(`${STORAGE_PREFIX}${storageKey}`, JSON.stringify(queue));
  } catch (error) {
    if (isQuotaExceededError(error)) {
      throw new OfflineQueueError("Offline queue storage quota exceeded.", {
        cause: error,
        details: { reason: "quota" },
      });
    }
    throw error;
  }
}

function applyOverflow<TValues extends Record<string, unknown>>(
  queue: QueuedSubmission<TValues>[],
  maxItems: number,
  policy: OfflineOverflowPolicy,
  onOverflow?: OfflineQueueRuntimeOptions<TValues>["onOverflow"],
): QueuedSubmission<TValues>[] {
  if (queue.length <= maxItems) {
    return queue;
  }

  if (policy === "reject") {
    throw new OfflineQueueError("Offline queue is full.", {
      details: { reason: "overflow", policy, maxItems, pending: queue.length },
    });
  }

  if (policy === "drop-newest") {
    const dropped = queue[queue.length - 1];
    if (dropped) {
      onOverflow?.(dropped, policy);
    }
    return queue.slice(0, maxItems);
  }

  // drop-oldest (default)
  const overflowCount = queue.length - maxItems;
  const droppedItems = queue.slice(0, overflowCount);
  for (const dropped of droppedItems) {
    onOverflow?.(dropped, policy);
  }
  return queue.slice(overflowCount);
}

export class OfflineSubmitQueue<TValues extends Record<string, unknown>> {
  private flushing = false;
  private readonly storageKey: string;
  private readonly options: OfflineQueueRuntimeOptions<TValues>;
  private onlineListener: (() => void) | undefined;

  public constructor(formId: string, options: OfflineQueueRuntimeOptions<TValues> = {}) {
    this.storageKey = formId;
    this.options = options;
  }

  public getState() {
    return {
      pending: readQueue<TValues>(this.storageKey).length,
      flushing: this.flushing,
    };
  }

  /**
   * Enqueue a submission. Returns `false` when an identical idempotency key
   * is already pending (deduped). Throws `OfflineQueueError` on reject overflow / quota.
   */
  public enqueue(values: TValues): boolean {
    const queue = readQueue<TValues>(this.storageKey);
    const idempotencyKey = this.options.idempotencyKey?.(values);

    if (idempotencyKey) {
      const existing = queue.find((item) => item.idempotencyKey === idempotencyKey);
      if (existing) {
        return false;
      }
    }

    const entry: QueuedSubmission<TValues> = {
      id: `${Date.now()}-${queue.length}`,
      values,
      enqueuedAt: Date.now(),
      attempt: 0,
      ...(idempotencyKey ? { idempotencyKey } : {}),
    };

    let next = [...queue, entry];
    const maxItems = this.options.maxItems;
    if (maxItems !== undefined && maxItems > 0) {
      next = applyOverflow(
        next,
        maxItems,
        this.options.overflow ?? "drop-oldest",
        this.options.onOverflow,
      );
    }

    writeQueue(this.storageKey, next);
    return true;
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

        let ok = false;
        let submitError: unknown;
        try {
          ok = await submit(next.values);
        } catch (error) {
          submitError = error;
          ok = false;
        }

        if (ok) {
          flushed += 1;
          queue = rest;
          writeQueue(this.storageKey, queue);
          continue;
        }

        failed += 1;
        const attempt = (next.attempt ?? 0) + 1;
        const updated: QueuedSubmission<TValues> = { ...next, attempt };

        const action =
          (await this.options.onConflict?.(updated, submitError ?? new Error("Flush failed."))) ??
          "keep";

        if (action === "drop") {
          queue = rest;
          writeQueue(this.storageKey, queue);
          continue;
        }

        if (action === "retry") {
          queue = [updated, ...rest];
          writeQueue(this.storageKey, queue);
          continue;
        }

        // keep — leave head in place with updated attempt; stop flush pass
        queue = [updated, ...rest];
        writeQueue(this.storageKey, queue);
        break;
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
