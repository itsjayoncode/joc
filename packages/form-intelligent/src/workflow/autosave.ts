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
    if (!this.config?.enabled || !this.getValues || !this.hooks) {
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

  public cancel(): void {
    if (this.timer !== undefined) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  public async run(): Promise<void> {
    if (!this.config?.enabled || !this.getValues || !this.hooks || this.running) {
      return;
    }

    this.running = true;
    this.hooks.onStart();

    try {
      await this.config.onSave(this.getValues());
      this.hooks.onSuccess(Date.now());
      this.hooks.persistDraft?.();
    } catch {
      this.hooks.onError();
    } finally {
      this.running = false;
    }
  }

  public destroy(): void {
    this.cancel();
    this.config = undefined;
    this.getValues = undefined;
    this.hooks = undefined;
  }
}
