import { computeFieldAria } from "../engines/accessibility/compute-aria.js";

import type { FieldAriaIds, FieldAriaResult } from "../engines/accessibility/types.js";
import type {
  FieldBinding,
  FieldHandle,
  FieldMetaState,
  FieldPath,
  FieldState,
} from "../types/index.js";
import type { FieldUiView } from "../ui/types.js";

export interface FieldHandleContext {
  readonly path: FieldPath;
  getValue(): unknown;
  getError(): string | undefined;
  getTouched(): boolean;
  getDirty(): boolean;
  getVisited(): boolean;
  getUi(): FieldUiView;
  getMeta(): FieldMetaState;
  getFieldState(): FieldState;
  getAriaIds(): FieldAriaIds | undefined;
  setAriaIds(ids: FieldAriaIds): void;
  setValue(value: unknown): void;
  setTouched(touched?: boolean): void;
  setVisited(visited?: boolean): void;
  validateField(): Promise<boolean>;
  emitBlur(): void;
  emitFocus(): void;
  validateOnBlur(): void;
}

function resolveAria(context: FieldHandleContext): FieldAriaResult {
  const ui = context.getUi();
  return computeFieldAria({
    error: context.getError(),
    required: ui.required === true,
    ids: context.getAriaIds(),
  });
}

export function createFieldHandle<TValues extends Record<string, unknown>>(
  context: FieldHandleContext,
): FieldHandle<TValues> {
  const onBlur = (): void => {
    context.setTouched(true);
    context.setVisited(true);
    context.emitBlur();
    context.validateOnBlur();
  };

  const onFocus = (): void => {
    context.setVisited(true);
    context.emitFocus();
  };

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
    get ui() {
      return context.getUi();
    },
    get meta() {
      return {
        ...context.getFieldState(),
        ...context.getMeta(),
      };
    },
    get aria() {
      return resolveAria(context);
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
    setAriaIds(ids) {
      context.setAriaIds(ids);
    },
    onBlur,
    onFocus,
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
        onBlur,
        onFocus,
      };
    },
  };
}
