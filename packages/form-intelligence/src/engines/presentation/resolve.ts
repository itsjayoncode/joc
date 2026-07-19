import type {
  FieldOption,
  FieldPath,
  FieldUiMap,
  FieldUiState,
  FormUiState,
} from "../../types/index.js";

/** Defaults when a path is missing from `fieldUi` (API freeze §5). */
export const DEFAULT_FIELD_UI: FieldUiState = {
  visible: true,
  disabled: false,
  required: undefined,
};

export const DEFAULT_FORM_UI: FormUiState = {
  submitDisabled: false,
};

export interface PresentationState {
  readonly field: FieldUiState;
  readonly options: readonly FieldOption[] | undefined;
  readonly form: FormUiState;
}

export interface PresentationSnapshot {
  readonly fieldUi: FieldUiMap;
  readonly formUi: FormUiState;
  readonly fieldOptions: Readonly<Record<FieldPath, readonly FieldOption[]>>;
}

/**
 * Resolve presentation flags for a path with freeze defaults.
 */
export function resolveFieldUi(
  path: FieldPath,
  fieldUi: FieldUiMap,
  extras?: { readonly busy?: boolean },
): FieldUiState {
  const base = fieldUi[path];
  const busy = base?.busy ?? extras?.busy;

  return {
    visible: base?.visible ?? DEFAULT_FIELD_UI.visible,
    disabled: base?.disabled ?? DEFAULT_FIELD_UI.disabled,
    required: base?.required ?? DEFAULT_FIELD_UI.required,
    ...(base?.readOnly === undefined ? {} : { readOnly: base.readOnly }),
    ...(busy === undefined ? {} : { busy }),
  };
}

export function buildPresentationState(
  path: FieldPath,
  snapshot: PresentationSnapshot,
  extras?: { readonly busy?: boolean },
): PresentationState {
  return {
    field: resolveFieldUi(path, snapshot.fieldUi, extras),
    options: snapshot.fieldOptions[path],
    form: snapshot.formUi,
  };
}

/**
 * Ownership note (Phase 9 / ADR-018): Workflow rules and schema/static
 * `required` baseline produce UI intents; Presentation exposes them.
 * Validation must not write `visible`/`hidden`/`required` on validate ticks.
 * DOM enhancer and adapters consume `getPresentation` / `field.ui` only.
 */
export const PRESENTATION_OWNERSHIP = {
  producers: ["workflow.rules", "dependency.populate", "schema.requiredBaseline"] as const,
  consumers: ["dom.enhancer", "framework.adapters", "a11y"] as const,
  nonWriters: ["validation", "transform", "format"] as const,
} as const;
