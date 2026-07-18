import type { AutosaveConfig } from "../types/index.js";

export interface AutosaveHooks {
  readonly onStart: () => void;
  readonly onSuccess: (savedAt: number) => void | Promise<void>;
  readonly onError: () => void;
  readonly persistDraft?: () => void;
}

export class AutosaveScheduler<TValues extends Record<string, unknown>> {
  private config: AutosaveConfig | undefined;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private running = false;
  private destroyed = false;
  private getValues: (() => TValues) | undefined;
  private hooks: AutosaveHooks | undefined;

  public configure(
    config: AutosaveConfig | undefined,
    getValues: () => TValues,
    hooks: AutosaveHooks,
  ): void {
    this.config = config;
    this.getValues = getValues;
    this.hooks = hooks;
  }

  public schedule(): void {
    if (this.destroyed || !this.config?.enabled || !this.getValues || !this.hooks) {
      return;
    }

    if (this.timer !== undefined) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.timer = undefined;
      void this.run();
    }, this.config.debounceMs ?? 400);
  }

  /** Cancel a pending debounced save (does not abort an in-flight `onSave`). */
  public cancel(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  public async run(): Promise<void> {
    if (this.destroyed || !this.config?.enabled || !this.getValues || !this.hooks || this.running) {
      return;
    }

    this.running = true;
    this.hooks.onStart();

    try {
      const values = this.getValues();
      await this.config.onSave(values);
      if (this.destroyed) {
        return;
      }
      await this.hooks.onSuccess(Date.now());
      if (!this.destroyed) {
        this.hooks.persistDraft?.();
      }
    } catch {
      if (!this.destroyed) {
        this.hooks.onError();
      }
    } finally {
      this.running = false;
    }
  }

  public destroy(): void {
    this.destroyed = true;
    this.cancel();
    this.config = undefined;
    this.getValues = undefined;
    this.hooks = undefined;
  }
}
