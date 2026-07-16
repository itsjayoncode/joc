import { debounce } from "../utils/index.js";

import type { FieldPath } from "../types/index.js";

export class AsyncValidationManager {
  private readonly controllers = new Map<FieldPath, AbortController>();
  private readonly debounced = new Map<FieldPath, (paths: readonly FieldPath[]) => void>();
  private readonly validating = new Map<FieldPath, boolean>();
  private readonly debounceMs: number;
  private onValidatingChange: (() => void) | undefined;

  public constructor(debounceMs = 300) {
    this.debounceMs = debounceMs;
  }

  public setOnValidatingChange(listener: () => void): void {
    this.onValidatingChange = listener;
  }

  public isFieldValidating(path: FieldPath): boolean {
    return this.validating.get(path) ?? false;
  }

  public getValidatingMap(): Readonly<Record<FieldPath, boolean>> {
    return Object.fromEntries(this.validating);
  }

  public schedule(
    path: FieldPath,
    run: (paths: readonly FieldPath[], signal: AbortSignal) => Promise<void>,
  ): void {
    let debounced = this.debounced.get(path);
    if (!debounced) {
      debounced = debounce((paths: readonly FieldPath[]) => {
        void this.runValidation(paths, run);
      }, this.debounceMs);
      this.debounced.set(path, debounced);
    }

    debounced([path]);
  }

  public async runImmediate(
    paths: readonly FieldPath[],
    run: (paths: readonly FieldPath[], signal: AbortSignal) => Promise<void>,
  ): Promise<void> {
    await this.runValidation(paths, run);
  }

  public async track<T>(paths: readonly FieldPath[], task: () => Promise<T>): Promise<T> {
    const controller = new AbortController();
    for (const path of paths) {
      this.controllers.get(path)?.abort();
      this.controllers.set(path, controller);
      this.setValidating(path, true);
    }

    try {
      return await task();
    } finally {
      for (const path of paths) {
        if (this.controllers.get(path) === controller) {
          this.controllers.delete(path);
          this.setValidating(path, false);
        }
      }
    }
  }

  public cancel(path: FieldPath): void {
    this.controllers.get(path)?.abort();
    this.controllers.delete(path);
    this.setValidating(path, false);
  }

  public destroy(): void {
    for (const controller of this.controllers.values()) {
      controller.abort();
    }
    this.controllers.clear();
    this.debounced.clear();
    this.validating.clear();
  }

  private async runValidation(
    paths: readonly FieldPath[],
    run: (paths: readonly FieldPath[], signal: AbortSignal) => Promise<void>,
  ): Promise<void> {
    for (const path of paths) {
      this.controllers.get(path)?.abort();
      const controller = new AbortController();
      this.controllers.set(path, controller);
      this.setValidating(path, true);

      try {
        await run(paths, controller.signal);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          continue;
        }
        throw error;
      } finally {
        if (this.controllers.get(path) === controller) {
          this.controllers.delete(path);
          this.setValidating(path, false);
        }
      }
    }
  }

  private setValidating(path: FieldPath, value: boolean): void {
    if (value) {
      this.validating.set(path, true);
    } else {
      this.validating.delete(path);
    }
    this.onValidatingChange?.();
  }
}
