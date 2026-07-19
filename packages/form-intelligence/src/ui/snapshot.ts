import { createUiProjection } from "./projection.js";

import type { ResolvedUiPolicies, UiExplainResult, UiFieldStatus } from "./types.js";
import type { FormInstance, FieldPath } from "../types/index.js";

export interface UiFieldProjectionSnapshot {
  readonly path: FieldPath;
  readonly hasError: boolean;
  readonly showError: boolean;
  readonly status: UiFieldStatus;
  readonly disabledReasons: readonly string[];
  readonly showErrorExplain: UiExplainResult;
  readonly disabledExplain: UiExplainResult;
}

/**
 * Read-only UI projection snapshot for DevTools / playground inspectors.
 * Does not mutate form state.
 */
export interface UiProjectionSnapshot {
  readonly policies: ResolvedUiPolicies;
  readonly canSubmit: boolean;
  readonly submitExplain: UiExplainResult;
  readonly phase: FormInstance<Record<string, unknown>>["state"]["submitPhase"];
  readonly invalidFields: readonly FieldPath[];
  readonly visibleFields: readonly FieldPath[];
  readonly requiredFields: readonly FieldPath[];
  readonly validatingFields: readonly FieldPath[];
  readonly fields: readonly UiFieldProjectionSnapshot[];
}

export function snapshotUiProjection(
  form: FormInstance<Record<string, unknown>>,
): UiProjectionSnapshot {
  const projection = createUiProjection(form);
  const submitExplain = projection.explain("submit");
  const paths = new Set<string>([
    ...form.registeredFieldPaths(),
    ...Object.keys(form.state.fieldMeta),
    ...Object.keys(form.state.errors),
    ...Object.keys(form.state.fieldUi),
  ]);

  const fields: UiFieldProjectionSnapshot[] = [];
  for (const path of form.registeredFieldPaths()) {
    paths.delete(path);
    const field = projection.field(path);
    fields.push({
      path,
      hasError: field.hasError,
      showError: field.showError,
      status: field.status,
      disabledReasons: field.disabledReasons,
      showErrorExplain: field.explain("showError"),
      disabledExplain: field.explain("disabled"),
    });
  }

  for (const path of paths) {
    const field = projection.field(path);
    fields.push({
      path,
      hasError: field.hasError,
      showError: field.showError,
      status: field.status,
      disabledReasons: field.disabledReasons,
      showErrorExplain: field.explain("showError"),
      disabledExplain: field.explain("disabled"),
    });
  }

  return {
    policies: projection.policies,
    canSubmit: projection.canSubmit,
    submitExplain,
    phase: projection.phase,
    invalidFields: projection.invalidFields,
    visibleFields: projection.visibleFields,
    requiredFields: projection.requiredFields,
    validatingFields: projection.validatingFields,
    fields,
  };
}
