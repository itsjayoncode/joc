export { clearDraft, loadDraft, saveDraft } from "../engines/draft/index.js";
export type { DraftStorageOptions } from "../engines/draft/storage-adapter.js";
export { resolveDraftStorage } from "../engines/draft/storage-adapter.js";

import { applyDraftRestore, wrapDraftEnvelope } from "../engines/draft/envelope.js";
import { resolveDraftStorage } from "../engines/draft/storage-adapter.js";
import { DraftStorageError, isQuotaExceededError } from "../errors/index.js";

import type { DraftMergeMode } from "../engines/draft/merge.js";
import type { DraftConfig } from "../types/index.js";
import type { DraftStorageAdapter } from "../types/index.js";

export interface DraftRestoreResult<TValues extends Record<string, unknown>> {
  readonly values: TValues;
  readonly restored: boolean;
  readonly workflow?: { readonly currentStep: number };
  readonly reason?: "disabled" | "empty" | "declined" | "version_mismatch" | "corrupt";
}

export interface DraftManagerRestoreOptions {
  readonly merge?: DraftMergeMode;
  /**
   * `true` — always call `onRestorePrompt` when set.
   * `false` — never prompt.
   * `undefined` — honor `DraftConfig.promptOnRestore` (init path).
   */
  readonly prompt?: boolean;
}

export class DraftManager<TValues extends Record<string, unknown>> {
  private readonly storage: DraftStorageAdapter;
  private readonly storageKey: string;
  private readonly config: DraftConfig | undefined;
  private readonly formId: string | undefined;

  public constructor(
    config: DraftConfig | undefined,
    fallbackKey: string,
    options: { readonly formId?: string } = {},
  ) {
    this.config = config;
    this.storageKey = config?.storageKey ?? fallbackKey;
    this.storage = resolveDraftStorage(config);
    this.formId = options.formId;
  }

  public get enabled(): boolean {
    return this.config?.enabled === true;
  }

  public loadRaw(): Record<string, unknown> | null {
    if (!this.enabled) {
      return null;
    }
    return this.storage.load(this.storageKey);
  }

  public resolveInitialValues(defaultValues: TValues): DraftRestoreResult<TValues> {
    return this.applyLoadedDraft(defaultValues, {});
  }

  /**
   * Shared restore path for init + `form.restoreDraft()`.
   */
  public applyLoadedDraft(
    defaultValues: TValues,
    options: DraftManagerRestoreOptions = {},
  ): DraftRestoreResult<TValues> {
    if (!this.enabled) {
      return { values: defaultValues, restored: false, reason: "disabled" };
    }

    const restoredRaw = this.loadRaw();
    if (!restoredRaw) {
      return { values: defaultValues, restored: false, reason: "empty" };
    }

    const shouldPrompt =
      options.prompt === true ||
      (options.prompt === undefined && this.config?.promptOnRestore === true);

    if (shouldPrompt && this.config?.onRestorePrompt?.(restoredRaw) === false) {
      return { values: defaultValues, restored: false, reason: "declined" };
    }

    const applied = applyDraftRestore({
      defaults: defaultValues,
      raw: restoredRaw,
      merge: options.merge ?? "overlay",
      envelope: {
        versioning: this.config?.versioning === true,
        ...(this.config?.schemaVersion ? { schemaVersion: this.config.schemaVersion } : {}),
        ...(this.formId ? { formId: this.formId } : {}),
        ...(this.config?.migrateDraft ? { migrateDraft: this.config.migrateDraft } : {}),
      },
    });

    if (!applied.restored) {
      return {
        values: defaultValues,
        restored: false,
        reason: applied.reason ?? "empty",
      };
    }

    this.config?.onRestore?.(applied.values);
    return {
      values: applied.values,
      restored: true,
      ...(applied.workflow ? { workflow: applied.workflow } : {}),
    };
  }

  public save(
    values: TValues,
    options: {
      readonly currentStep?: number;
      readonly persistWorkflow?: boolean;
    } = {},
  ): void {
    if (!this.enabled) {
      return;
    }

    const persistWorkflow = options.persistWorkflow === true;
    const payload = wrapDraftEnvelope(values, {
      versioning: this.config?.versioning === true,
      persistWorkflow,
      ...(this.config?.schemaVersion ? { schemaVersion: this.config.schemaVersion } : {}),
      ...(this.formId ? { formId: this.formId } : {}),
      ...(options.currentStep !== undefined
        ? { workflow: { currentStep: options.currentStep } }
        : {}),
    }) as Record<string, unknown>;

    try {
      this.storage.save(this.storageKey, payload);
    } catch (error) {
      if (error instanceof DraftStorageError) {
        throw error;
      }
      if (isQuotaExceededError(error)) {
        throw new DraftStorageError("Draft storage quota exceeded.", {
          cause: error,
          details: { reason: "quota" },
        });
      }
      throw error;
    }
  }

  public clear(): void {
    if (!this.enabled) {
      return;
    }

    this.storage.clear(this.storageKey);
  }
}
