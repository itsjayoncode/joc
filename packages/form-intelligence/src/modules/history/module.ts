import { ValueHistoryStack } from "../../history/stack.js";

export class HistoryService<TValues extends Record<string, unknown>> {
  private stack: ValueHistoryStack<TValues> | null = null;

  public record(snapshot: TValues): void {
    this.ensure().record(snapshot);
  }

  public undo(current: TValues): TValues | null {
    if (!this.stack) {
      return null;
    }

    return this.stack.undo(current);
  }

  public redo(current: TValues): TValues | null {
    if (!this.stack) {
      return null;
    }

    return this.stack.redo(current);
  }

  public destroy(): void {
    this.stack?.clear();
    this.stack = null;
  }

  private ensure(): ValueHistoryStack<TValues> {
    if (!this.stack) {
      this.stack = new ValueHistoryStack<TValues>();
    }

    return this.stack;
  }
}

export function createHistoryModule<TValues extends Record<string, unknown>>(
  service: HistoryService<TValues>,
): import("../../core/module-types.js").FormModule<TValues> {
  return {
    id: "history",
    order: 20,
    destroy() {
      service.destroy();
    },
  };
}
