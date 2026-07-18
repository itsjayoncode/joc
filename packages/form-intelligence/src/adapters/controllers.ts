import type {
  FieldPath,
  FormInstance,
  FormState,
  ResetOptions,
  SubmitOptions,
} from "../types/index.js";
import type { FieldHandle } from "../types/index.js";

/**
 * Preferred UI binding surface over reaching into form internals (Phase 16).
 * Alias of the enhanced `FieldHandle` (includes `aria` / `setAriaIds`).
 */
export type FieldController<TValues extends Record<string, unknown> = Record<string, unknown>> =
  FieldHandle<TValues>;

/**
 * Thin façade over `FormInstance` for adapters and design systems.
 */
export interface FormController<TValues extends Record<string, unknown> = Record<string, unknown>> {
  readonly state: FormState<TValues>;
  subscribe(listener: () => void): () => void;
  getSnapshot(): FormState<TValues>;
  submit(options?: SubmitOptions): Promise<boolean>;
  reset(options?: ResetOptions<TValues>): void;
  field(path: FieldPath): FieldController<TValues>;
  /** First path with a non-empty error message. */
  firstInvalidPath(): FieldPath | undefined;
  /**
   * Focuses the first invalid control when a DOM document is available.
   * Returns the path (or `undefined` if none). Safe no-op under SSR.
   */
  focusFirstInvalid(): FieldPath | undefined;
  destroy(): void;
}

export function createFormController<TValues extends Record<string, unknown>>(
  form: FormInstance<TValues>,
): FormController<TValues> {
  return {
    get state() {
      return form.getSnapshot();
    },
    subscribe(listener) {
      return form.subscribe(listener);
    },
    getSnapshot() {
      return form.getSnapshot();
    },
    submit(options) {
      return form.submit(options);
    },
    reset(options) {
      form.reset(options);
    },
    field(path) {
      return form.field(path);
    },
    firstInvalidPath() {
      return form.firstInvalidPath();
    },
    focusFirstInvalid() {
      return form.focusFirstInvalid();
    },
    destroy() {
      form.destroy();
    },
  };
}
