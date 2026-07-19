import type { FormInstance, FieldPath } from "../types/index.js";

function pathOrder(form: FormInstance<Record<string, unknown>>): readonly FieldPath[] {
  const ordered: FieldPath[] = [];
  const seen = new Set<string>();

  for (const path of form.registeredFieldPaths()) {
    if (!seen.has(path)) {
      ordered.push(path);
      seen.add(path);
    }
  }

  for (const path of Object.keys(form.state.fieldUi)) {
    if (!seen.has(path)) {
      ordered.push(path);
      seen.add(path);
    }
  }

  for (const path of Object.keys(form.state.fieldMeta)) {
    if (!seen.has(path)) {
      ordered.push(path);
      seen.add(path);
    }
  }

  for (const path of Object.keys(form.state.errors)) {
    if (!seen.has(path)) {
      ordered.push(path);
      seen.add(path);
    }
  }

  return ordered;
}

/** Shown iff presentation visible !== false AND meta.hidden !== true (Phase 0 Q5). */
export function isFieldShown(
  form: FormInstance<Record<string, unknown>>,
  path: FieldPath,
): boolean {
  const ui = form.getPresentation(path).field;
  const hidden = form.state.fieldMeta[path]?.hidden === true;
  return ui.visible && !hidden;
}

export function collectInvalidFields(
  form: FormInstance<Record<string, unknown>>,
): readonly FieldPath[] {
  const errors = form.state.errors;
  const ordered: FieldPath[] = [];
  const seen = new Set<string>();

  for (const path of pathOrder(form)) {
    if (errors[path] && !seen.has(path)) {
      ordered.push(path);
      seen.add(path);
    }
  }

  return ordered;
}

export function collectVisibleFields(
  form: FormInstance<Record<string, unknown>>,
): readonly FieldPath[] {
  return pathOrder(form).filter((path) => isFieldShown(form, path));
}

export function collectRequiredFields(
  form: FormInstance<Record<string, unknown>>,
): readonly FieldPath[] {
  return pathOrder(form).filter((path) => form.getPresentation(path).field.required === true);
}

export function collectValidatingFields(
  form: FormInstance<Record<string, unknown>>,
): readonly FieldPath[] {
  return pathOrder(form).filter((path) => form.state.fieldMeta[path]?.isValidating === true);
}
