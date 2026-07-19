import { explainSubmit } from "./can-submit.js";
import {
  collectInvalidFields,
  collectRequiredFields,
  collectValidatingFields,
  collectVisibleFields,
} from "./collections.js";
import { explainDisabled } from "./explain-disabled.js";
import { explainShowError, projectFieldUi } from "./field-projection.js";
import { resolvePoliciesForForm } from "./store.js";

import type { FieldUiDerived, ResolvedUiPolicies, UiExplainResult } from "./types.js";
import type { FormInstance, FieldPath } from "../types/index.js";

export type UiExplainTopic = "submit" | "showError" | "disabled";

export interface FieldUiProjection extends FieldUiDerived {
  readonly disabledReasons: readonly string[];
  explain(topic: "showError" | "disabled"): UiExplainResult;
}

export interface FormUiProjection<
  TValues extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly policies: ResolvedUiPolicies;
  readonly canSubmit: boolean;
  readonly submitBlockedReasons: readonly string[];
  readonly invalidFields: readonly FieldPath[];
  readonly visibleFields: readonly FieldPath[];
  readonly requiredFields: readonly FieldPath[];
  readonly validatingFields: readonly FieldPath[];
  readonly phase: FormInstance<TValues>["state"]["submitPhase"];
  explain(topic: "submit"): UiExplainResult;
  explain(topic: "showError" | "disabled", path: FieldPath): UiExplainResult;
  field(path: FieldPath): FieldUiProjection;
}

function anyFieldValidating(form: FormInstance<Record<string, unknown>>): boolean {
  const meta = form.state.fieldMeta;
  for (const path of Object.keys(meta)) {
    if (meta[path]?.isValidating) {
      return true;
    }
  }
  return form.state.isValidating;
}

function fieldInput(
  form: FormInstance<Record<string, unknown>>,
  path: FieldPath,
  policies: ResolvedUiPolicies,
) {
  const error = form.state.errors[path];
  const presentation = form.getPresentation(path).field;
  const isValidating = Boolean(form.state.fieldMeta[path]?.isValidating);
  return {
    error: typeof error === "string" ? error : undefined,
    touched: Boolean(form.state.touched[path]),
    submitCount: form.state.submitCount,
    isValidating,
    busy: presentation.busy === true || isValidating,
    policies,
  };
}

function disabledInput(form: FormInstance<Record<string, unknown>>, path: FieldPath) {
  const ui = form.getPresentation(path).field;
  return {
    disabled: ui.disabled,
    readOnly: ui.readOnly === true,
    isSubmitting: form.state.isSubmitting,
    isValidating: Boolean(form.state.fieldMeta[path]?.isValidating) || ui.busy === true,
  };
}

export function createUiProjection<TValues extends Record<string, unknown>>(
  form: FormInstance<TValues>,
): FormUiProjection<TValues> {
  const formLike = form as FormInstance<Record<string, unknown>>;

  const read = (): {
    policies: ResolvedUiPolicies;
    submitExplain: UiExplainResult;
  } => {
    const policies = resolvePoliciesForForm(formLike);
    const submitExplain = explainSubmit({
      guard: formLike.submissionGuard(),
      isValidating: anyFieldValidating(formLike),
      isValid: formLike.isValid(),
      policies,
    });
    return { policies, submitExplain };
  };

  const explain = (topic: UiExplainTopic, path?: FieldPath): UiExplainResult => {
    const { policies, submitExplain } = read();
    if (topic === "submit") {
      return submitExplain;
    }
    if (path === undefined) {
      throw new TypeError(`form.ui.explain("${topic}") requires a field path.`);
    }
    if (topic === "showError") {
      return explainShowError(fieldInput(formLike, path, policies));
    }
    return explainDisabled(disabledInput(formLike, path));
  };

  return {
    get policies() {
      return read().policies;
    },
    get canSubmit() {
      return read().submitExplain.value;
    },
    get submitBlockedReasons() {
      return read().submitExplain.reasons;
    },
    get invalidFields() {
      return collectInvalidFields(formLike);
    },
    get visibleFields() {
      return collectVisibleFields(formLike);
    },
    get requiredFields() {
      return collectRequiredFields(formLike);
    },
    get validatingFields() {
      return collectValidatingFields(formLike);
    },
    get phase() {
      return form.state.submitPhase;
    },
    explain(topic: UiExplainTopic, path?: FieldPath): UiExplainResult {
      return explain(topic, path);
    },
    field(path: FieldPath): FieldUiProjection {
      const { policies } = read();
      const derived = projectFieldUi(fieldInput(formLike, path, policies));
      const disabledExplain = explainDisabled(disabledInput(formLike, path));
      return {
        ...derived,
        disabledReasons: disabledExplain.reasons,
        explain(topic: "showError" | "disabled"): UiExplainResult {
          return explain(topic, path);
        },
      };
    },
  };
}
