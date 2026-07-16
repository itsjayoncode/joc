import { HistoryService } from "../modules/history/module.js";

export { HistoryService, createHistoryModule } from "../modules/history/module.js";
export { ValueHistoryStack, createStateHistory } from "../state/history.js";

export class UndoRedoController<TValues extends Record<string, unknown>> {
  public readonly history: HistoryService<TValues>;

  public constructor(history = new HistoryService<TValues>()) {
    this.history = history;
  }

  public record(snapshot: TValues): void {
    this.history.record(snapshot);
  }

  public undo(current: TValues): TValues | null {
    return this.history.undo(current);
  }

  public redo(current: TValues): TValues | null {
    return this.history.redo(current);
  }

  public destroy(): void {
    this.history.destroy();
  }
}
