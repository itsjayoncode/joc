import type { FieldBinding, FieldHandle, FieldPath } from "../types/index.js";

export interface FieldHandleContext {
  readonly path: FieldPath;
  getValue(): unknown;
  getError(): string | undefined;
  getTouched(): boolean;
  getDirty(): boolean;
  getVisited(): boolean;
  setValue(value: unknown): void;
  setTouched(touched?: boolean): void;
  setVisited(visited?: boolean): void;
  validateField(): Promise<boolean>;
  emitBlur(): void;
  emitFocus(): void;
  validateOnBlur(): void;
}

export function createFieldHandle<TValues extends Record<string, unknown>>(
  context: FieldHandleContext,
): FieldHandle<TValues> {
  return {
    path: context.path,
    get value() {
      return context.getValue();
    },
    get error() {
      return context.getError();
    },
    get touched() {
      return context.getTouched();
    },
    get dirty() {
      return context.getDirty();
    },
    get visited() {
      return context.getVisited();
    },
    setValue(value: unknown) {
      context.setValue(value);
    },
    setTouched(touched = true) {
      context.setTouched(touched);
    },
    setVisited(visited = true) {
      context.setVisited(visited);
    },
    async validate() {
      return context.validateField();
    },
    bind(): FieldBinding {
      return {
        name: context.path,
        get value() {
          return context.getValue();
        },
        onChange: (value: unknown) => {
          context.setValue(value);
        },
        onBlur: () => {
          context.setTouched(true);
          context.setVisited(true);
          context.emitBlur();
          context.validateOnBlur();
        },
        onFocus: () => {
          context.setVisited(true);
          context.emitFocus();
        },
      };
    },
  };
}
