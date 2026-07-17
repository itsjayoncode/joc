import type { FieldPath } from "../types/index.js";

type ScheduledRun = (paths: readonly FieldPath[], signal: AbortSignal) => Promise<boolean | void>;

type DebouncedSchedule = ((paths: readonly FieldPath[]) => void) & { cancel: () => void };

export interface RunValidationOptions {
  readonly abortPrevious?: boolean;
}

/**
 * Per-path async validation orchestration: debounce, AbortController, generation
 * tokens, and `isValidating` fidelity (ADR-005 / Phase 4A–4B).
 *
 * Canonical name: `AsyncValidationManager` (SHIPPED). Do not invent synonyms.
 */
export class AsyncValidationManager {
  private readonly controllers = new Map<FieldPath, AbortController>();
  private readonly generations = new Map<FieldPath, number>();
  private readonly debounced = new Map<FieldPath, DebouncedSchedule>();
  private readonly pathDebounceMs = new Map<FieldPath, number>();
  private readonly pathAbortPrevious = new Map<FieldPath, boolean>();
  private readonly scheduledRuns = new Map<FieldPath, ScheduledRun>();
  private readonly scheduleResolvers = new Map<FieldPath, (ok: boolean) => void>();
  private readonly validating = new Map<FieldPath, boolean>();
  private readonly debounceMs: number;
  private onValidatingChange: (() => void) | undefined;
  private destroyed = false;

  public constructor(debounceMs = 300) {
    this.debounceMs = debounceMs;
  }

  public setOnValidatingChange(listener: () => void): void {
    this.onValidatingChange = listener;
  }

  /** Override default debounce for a path (from `asyncValidator({ debounce })`). */
  public setPathDebounceMs(path: FieldPath, ms: number): void {
    this.pathDebounceMs.set(path, ms);
    this.debounced.get(path)?.cancel();
    this.debounced.delete(path);
  }

  public setPathAbortPrevious(path: FieldPath, abortPrevious: boolean): void {
    this.pathAbortPrevious.set(path, abortPrevious);
  }

  public isFieldValidating(path: FieldPath): boolean {
    return this.validating.get(path) ?? false;
  }

  /** Synchronously mark paths validating (e.g. before async middleware/hooks). */
  public setFieldsValidating(paths: readonly FieldPath[], value: boolean): void {
    for (const path of paths) {
      this.setValidating(path, value);
    }
  }

  public getValidatingMap(): Readonly<Record<FieldPath, boolean>> {
    return Object.fromEntries(this.validating);
  }

  public getGeneration(path: FieldPath): number {
    return this.generations.get(path) ?? 0;
  }

  public isCurrentGeneration(path: FieldPath, generation: number): boolean {
    return this.getGeneration(path) === generation;
  }

  /**
   * Debounced schedule. Always uses the **latest** `run` for the path.
   * Superseded schedules resolve `false` so callers do not hang.
   */
  public schedule(path: FieldPath, run: ScheduledRun): Promise<boolean> {
    if (this.destroyed) {
      return Promise.resolve(false);
    }

    this.scheduledRuns.set(path, run);

    return new Promise<boolean>((resolve) => {
      const previous = this.scheduleResolvers.get(path);
      previous?.(false);
      this.scheduleResolvers.set(path, resolve);

      let debounced = this.debounced.get(path);
      if (!debounced) {
        debounced = this.createDebounced(path);
        this.debounced.set(path, debounced);
      }

      debounced([path]);
    });
  }

  public async runImmediate(paths: readonly FieldPath[], run: ScheduledRun): Promise<boolean> {
    if (this.destroyed) {
      return false;
    }

    return this.runValidation(paths, run);
  }

  /**
   * Tracks in-flight work with a fresh AbortController per call.
   * Passes `signal` into `task` so validators can honor cancellation.
   */
  public async track<T>(
    paths: readonly FieldPath[],
    task: (signal: AbortSignal) => Promise<T>,
    options?: RunValidationOptions,
  ): Promise<T> {
    if (this.destroyed) {
      const error = new DOMException("Form destroyed", "AbortError");
      return Promise.reject(error);
    }

    const abortPrevious =
      options?.abortPrevious ??
      (paths[0] !== undefined ? this.pathAbortPrevious.get(paths[0]) : undefined) ??
      true;
    const controller = new AbortController();
    const generationByPath = new Map<FieldPath, number>();

    for (const path of paths) {
      if (abortPrevious) {
        this.controllers.get(path)?.abort();
      }
      this.controllers.set(path, controller);
      const generation = (this.generations.get(path) ?? 0) + 1;
      this.generations.set(path, generation);
      generationByPath.set(path, generation);
      this.setValidating(path, true);
    }

    try {
      return await task(controller.signal);
    } finally {
      for (const path of paths) {
        if (this.controllers.get(path) === controller) {
          this.controllers.delete(path);
          this.setValidating(path, false);
        }
      }
      void generationByPath;
    }
  }

  public cancel(path: FieldPath): void {
    this.controllers.get(path)?.abort();
    this.controllers.delete(path);
    this.debounced.get(path)?.cancel();
    this.setValidating(path, false);
    const resolver = this.scheduleResolvers.get(path);
    if (resolver) {
      this.scheduleResolvers.delete(path);
      resolver(false);
    }
  }

  public destroy(): void {
    this.destroyed = true;
    for (const controller of this.controllers.values()) {
      controller.abort();
    }
    this.controllers.clear();

    for (const debounced of this.debounced.values()) {
      debounced.cancel();
    }
    this.debounced.clear();
    this.pathDebounceMs.clear();
    this.pathAbortPrevious.clear();
    this.scheduledRuns.clear();

    for (const resolve of this.scheduleResolvers.values()) {
      resolve(false);
    }
    this.scheduleResolvers.clear();
    this.validating.clear();
    this.generations.clear();
    this.onValidatingChange = undefined;
  }

  private resolveDebounceMs(path: FieldPath): number {
    return this.pathDebounceMs.get(path) ?? this.debounceMs;
  }

  private createDebounced(path: FieldPath): DebouncedSchedule {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const debounced = ((paths: readonly FieldPath[]) => {
      if (timer !== undefined) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        timer = undefined;
        const run = this.scheduledRuns.get(path);
        const resolve = this.scheduleResolvers.get(path);
        if (!run || !resolve) {
          return;
        }

        this.scheduleResolvers.delete(path);
        void this.runValidation(paths, run).then(resolve, () => {
          resolve(false);
        });
      }, this.resolveDebounceMs(path));
    }) as DebouncedSchedule;

    debounced.cancel = () => {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
    };

    return debounced;
  }

  private async runValidation(paths: readonly FieldPath[], run: ScheduledRun): Promise<boolean> {
    if (this.destroyed || paths.length === 0) {
      return false;
    }

    const primaryPath = paths[0];
    if (!primaryPath) {
      return false;
    }

    const abortPrevious = this.pathAbortPrevious.get(primaryPath) ?? true;
    if (abortPrevious) {
      for (const path of paths) {
        this.controllers.get(path)?.abort();
      }
    }

    const controller = new AbortController();
    const generation = (this.generations.get(primaryPath) ?? 0) + 1;
    for (const path of paths) {
      this.controllers.set(path, controller);
      this.generations.set(path, generation);
      this.setValidating(path, true);
    }

    try {
      const result = await run(paths, controller.signal);
      if (controller.signal.aborted || this.destroyed) {
        return false;
      }

      if (!this.isCurrentGeneration(primaryPath, generation)) {
        return false;
      }

      return result === false ? false : Boolean(result ?? true);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return false;
      }
      throw error;
    } finally {
      for (const path of paths) {
        if (this.controllers.get(path) === controller) {
          this.controllers.delete(path);
          this.setValidating(path, false);
        }
      }
    }
  }

  private setValidating(path: FieldPath, value: boolean): void {
    const previous = this.validating.get(path) ?? false;
    if (value) {
      this.validating.set(path, true);
    } else {
      this.validating.delete(path);
    }

    if (previous !== value) {
      this.onValidatingChange?.();
    }
  }
}
