import type { TransformFn, TransformPipelineHandle } from "./types.js";
import type { FieldPath } from "../../types/index.js";

/**
 * Per-path transform stage registry for `form.transform(path)`.
 */
export class TransformEngine {
  private readonly pipelines = new Map<FieldPath, TransformFn[]>();

  public get(path: FieldPath): readonly TransformFn[] {
    return this.pipelines.get(path) ?? [];
  }

  public set(path: FieldPath, stages: readonly TransformFn[]): void {
    this.pipelines.set(path, [...stages]);
  }

  public clear(path: FieldPath): void {
    this.pipelines.delete(path);
  }

  public handle(path: FieldPath): TransformPipelineHandle {
    const pipelines = this.pipelines;
    const clearPath = (target: FieldPath): void => {
      this.clear(target);
    };
    const handle: TransformPipelineHandle = {
      pipe(...stages: TransformFn[]) {
        const existing = pipelines.get(path) ?? [];
        pipelines.set(path, [...existing, ...stages]);
        return handle;
      },
      clear() {
        clearPath(path);
      },
    };
    return handle;
  }

  public destroy(): void {
    this.pipelines.clear();
  }
}
