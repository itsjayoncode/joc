import { createUiProjection } from "./projection.js";

import type { ResolvedUiPolicies, UiExplainResult, UiFieldStatus } from "./types.js";
import type { SubmissionGuardResult } from "../submission/guard.js";
import type { FormInstance, FieldPath } from "../types/index.js";

export interface UiFieldProjectionSnapshot {
  readonly path: FieldPath;
  readonly hasError: boolean;
  readonly showError: boolean;
  readonly status: UiFieldStatus;
  readonly required: boolean | undefined;
  readonly visible: boolean;
  readonly disabled: boolean;
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
  /** Hard engine eligibility (`form.submissionGuard()`). */
  readonly submissionGuard: SubmissionGuardResult;
  /** Presentation submit-disabled intent from rules. */
  readonly formUi: { readonly submitDisabled: boolean };
  readonly canSubmit: boolean;
  readonly submitExplain: UiExplainResult;
  readonly phase: FormInstance<Record<string, unknown>>["state"]["submitPhase"];
  readonly invalidFields: readonly FieldPath[];
  readonly visibleFields: readonly FieldPath[];
  readonly requiredFields: readonly FieldPath[];
  readonly validatingFields: readonly FieldPath[];
  readonly fields: readonly UiFieldProjectionSnapshot[];
}

function projectField(
  form: FormInstance<Record<string, unknown>>,
  projection: ReturnType<typeof createUiProjection>,
  path: FieldPath,
): UiFieldProjectionSnapshot {
  const field = projection.field(path);
  const presentation = form.getPresentation(path).field;

  return {
    path,
    hasError: field.hasError,
    showError: field.showError,
    status: field.status,
    required: presentation.required,
    visible: presentation.visible,
    disabled: presentation.disabled,
    disabledReasons: field.disabledReasons,
    showErrorExplain: field.explain("showError"),
    disabledExplain: field.explain("disabled"),
  };
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
    fields.push(projectField(form, projection, path));
  }

  for (const path of paths) {
    fields.push(projectField(form, projection, path));
  }

  return {
    policies: projection.policies,
    submissionGuard: form.submissionGuard(),
    formUi: { submitDisabled: form.getPresentation().formUi.submitDisabled },
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
