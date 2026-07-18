import { cloneValue } from "../utils/index.js";

export class ValueHistoryStack<TValues extends Record<string, unknown>> {
  private readonly past: TValues[] = [];
  private readonly future: TValues[] = [];
  private readonly maxDepth: number;

  public constructor(maxDepth = 50) {
    this.maxDepth = maxDepth;
  }

  public record(snapshot: TValues): void {
    this.past.push(cloneValue(snapshot));
    if (this.past.length > this.maxDepth) {
      this.past.shift();
    }
    this.future.length = 0;
  }

  public canUndo(): boolean {
    return this.past.length > 0;
  }

  public canRedo(): boolean {
    return this.future.length > 0;
  }

  public undo(current: TValues): TValues | null {
    if (!this.canUndo()) {
      return null;
    }

    const previous = this.past.pop();
    if (!previous) {
      return null;
    }

    this.future.push(cloneValue(current));
    return cloneValue(previous);
  }

  public redo(current: TValues): TValues | null {
    if (!this.canRedo()) {
      return null;
    }

    this.past.push(cloneValue(current));
    const next = this.future.pop();
    return next ? cloneValue(next) : null;
  }

  public clear(): void {
    this.past.length = 0;
    this.future.length = 0;
  }
}
