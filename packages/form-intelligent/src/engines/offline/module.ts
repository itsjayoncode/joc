import { OfflineSubmitQueue } from "./offline-queue.js";

import type { OfflineQueueRuntimeOptions } from "./types.js";

export class OfflineService<TValues extends Record<string, unknown>> {
  private queue: OfflineSubmitQueue<TValues> | null = null;

  public constructor(
    private readonly storageKey: string,
    private readonly options: OfflineQueueRuntimeOptions<TValues> = {},
  ) {}

  public ensure(): OfflineSubmitQueue<TValues> {
    if (!this.queue) {
      this.queue = new OfflineSubmitQueue<TValues>(this.storageKey, this.options);
    }

    return this.queue;
  }

  public getState() {
    return this.queue?.getState() ?? { pending: 0, flushing: false };
  }

  public isOffline(): boolean {
    return this.ensure().isOffline();
  }

  public destroy(): void {
    this.queue?.destroy();
    this.queue = null;
  }
}

export interface OfflineModuleOptions {
  readonly storageKey: string;
  readonly onReconnect?: () => void;
}

export function createOfflineModule<TValues extends Record<string, unknown>>(
  service: OfflineService<TValues>,
  options: OfflineModuleOptions,
) {
  return {
    id: "offline",
    order: 40,
    start() {
      service.ensure().listenOnline(async () => {
        options.onReconnect?.();
      });
    },
    destroy() {
      service.destroy();
    },
  };
}
