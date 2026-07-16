export { clearDraft, loadDraft, saveDraft } from "../engines/draft/index.js";
export type { DraftStorageOptions } from "../engines/draft/storage-adapter.js";
export { resolveDraftStorage } from "../engines/draft/storage-adapter.js";

import { resolveDraftStorage } from "../engines/draft/storage-adapter.js";

import type { DraftConfig } from "../types/index.js";
import type { DraftStorageAdapter } from "../types/index.js";

export interface DraftRestoreResult<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly restored: boolean;
}

export class DraftManager<TValues extends Record<string, unknown>> {
  private readonly storage: DraftStorageAdapter;
  private readonly storageKey: string;
  private readonly config: DraftConfig | undefined;

  public constructor(config: DraftConfig | undefined, fallbackKey: string) {
    this.config = config;
    this.storageKey = config?.storageKey ?? fallbackKey;
    this.storage = resolveDraftStorage(config);
  }

  public resolveInitialValues(defaultValues: TValues): DraftRestoreResult<TValues> {
    if (this.config?.enabled !== true) {
      return { values: defaultValues, restored: false };
    }

    const restoredRaw = this.storage.load(this.storageKey);
    if (!restoredRaw) {
      return { values: defaultValues, restored: false };
    }

    if (this.config.promptOnRestore && this.config.onRestorePrompt?.(restoredRaw) === false) {
      return { values: defaultValues, restored: false };
    }

    const values = { ...defaultValues, ...restoredRaw };
    this.config.onRestore?.(restoredRaw);
    return { values, restored: true };
  }

  public save(values: TValues): void {
    if (this.config?.enabled !== true) {
      return;
    }

    this.storage.save(this.storageKey, values);
  }

  public clear(): void {
    if (this.config?.enabled !== true) {
      return;
    }

    this.storage.clear(this.storageKey);
  }
}
