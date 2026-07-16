import type { FieldPath } from "../types/index.js";

export class FieldRegistry {
  private readonly paths = new Set<FieldPath>();

  public register(path: FieldPath): void {
    this.paths.add(path);
  }

  public unregister(path: FieldPath): void {
    this.paths.delete(path);
  }

  public has(path: FieldPath): boolean {
    return this.paths.has(path);
  }

  public list(): readonly FieldPath[] {
    return [...this.paths];
  }

  public clear(): void {
    this.paths.clear();
  }
}
