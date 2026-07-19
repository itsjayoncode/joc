import { getIn } from "./utils.js";
import { WorkflowError } from "../../errors/index.js";

import type { FieldPath } from "./types.js";
import type {
  FieldOption,
  FieldUiMap,
  FieldUiState,
  FormRuleDefinition,
  FormUiState,
  RuleContext,
} from "./types.js";

const DEFAULT_UI: FieldUiState = { visible: true, disabled: false, required: undefined };
const DEFAULT_FORM_UI: FormUiState = { submitDisabled: false };

/**
 * Deterministic rule evaluation order (Phase 5).
 *
 * Rules run in **registration order** (config `rules` first, then runtime
 * `form.when(…).…` commits). For the same `fieldUi` / `formUi` key, **later
 * rules win**. Priority / conflict policies remain PLANNED.
 */
export const RULE_EVALUATION_ORDER = "registration" as const;

export type RuleEvaluationOrder = typeof RULE_EVALUATION_ORDER;

function matchesRule<TValues extends Record<string, unknown>>(
  rule: FormRuleDefinition<TValues>,
  values: TValues,
): boolean {
  const current = getIn(values, rule.watch);

  if (rule.equals !== undefined && current !== rule.equals) {
    return false;
  }

  if (rule.notEquals !== undefined && current === rule.notEquals) {
    return false;
  }

  if (rule.greaterThan !== undefined) {
    const numeric = typeof current === "number" ? current : Number(current);
    if (!Number.isFinite(numeric) || numeric <= rule.greaterThan) {
      return false;
    }
  }

  if (rule.lessThan !== undefined) {
    const numeric = typeof current === "number" ? current : Number(current);
    if (!Number.isFinite(numeric) || numeric >= rule.lessThan) {
      return false;
    }
  }

  return (
    rule.equals !== undefined ||
    rule.notEquals !== undefined ||
    rule.greaterThan !== undefined ||
    rule.lessThan !== undefined ||
    rule.then !== undefined ||
    rule.disableSubmit === true ||
    (rule.changes !== undefined && rule.populate !== undefined)
  );
}

function cloneUiMap(ui: Record<FieldPath, FieldUiState>): Record<FieldPath, FieldUiState> {
  const next: Record<FieldPath, FieldUiState> = {};
  for (const [path, state] of Object.entries(ui)) {
    next[path] = { ...state };
  }
  return next;
}

function ensureField(ui: Record<FieldPath, FieldUiState>, path: FieldPath): FieldUiState {
  if (!ui[path]) {
    ui[path] = { ...DEFAULT_UI };
  }
  return ui[path];
}

function runThen<TValues extends Record<string, unknown>>(
  rule: FormRuleDefinition<TValues>,
  context: RuleContext<TValues>,
): void {
  if (!rule.then) {
    return;
  }

  try {
    rule.then(context);
  } catch (error) {
    if (error instanceof WorkflowError) {
      throw error;
    }
    throw new WorkflowError(
      error instanceof Error ? error.message : "Workflow rule `then` handler failed.",
      { cause: error },
    );
  }
}

export function evaluateFormRules<TValues extends Record<string, unknown>>(options: {
  readonly rules: readonly FormRuleDefinition<TValues>[];
  readonly values: TValues;
  readonly fieldPaths: readonly FieldPath[];
  readonly setValue: (path: FieldPath, value: unknown) => void;
  /**
   * Schema / static `required` validator paths. Seeds default `fieldUi.required`
   * before rules run (ADR-018). Unmatched `.require()` still forces `false`.
   */
  readonly requiredBaseline?: readonly FieldPath[];
}): { fieldUi: FieldUiMap; formUi: FormUiState } {
  const baseline = new Set(options.requiredBaseline ?? []);
  const ui = Object.fromEntries(
    options.fieldPaths.map((path) => [
      path,
      {
        ...DEFAULT_UI,
        ...(baseline.has(path) ? { required: true as const } : {}),
      },
    ]),
  ) as Record<FieldPath, FieldUiState>;
  let formUi: FormUiState = { ...DEFAULT_FORM_UI };

  // Registration order — later rules overwrite earlier UI patches.
  for (const rule of options.rules) {
    const matches = matchesRule(rule, options.values);
    const working = cloneUiMap(ui);

    if (matches) {
      const context: RuleContext<TValues> = {
        values: options.values,
        show: (...paths) => {
          for (const path of paths) {
            ensureField(working, path).visible = true;
          }
        },
        hide: (...paths) => {
          for (const path of paths) {
            ensureField(working, path).visible = false;
          }
        },
        require: (...paths) => {
          for (const path of paths) {
            ensureField(working, path).required = true;
          }
        },
        optional: (...paths) => {
          for (const path of paths) {
            ensureField(working, path).required = false;
          }
        },
        enable: (...paths) => {
          for (const path of paths) {
            ensureField(working, path).disabled = false;
          }
        },
        disable: (...paths) => {
          for (const path of paths) {
            ensureField(working, path).disabled = true;
          }
        },
        disableSubmit: () => {
          formUi = { submitDisabled: true };
        },
        enableSubmit: () => {
          formUi = { submitDisabled: false };
        },
        setValue: options.setValue,
      };

      for (const path of rule.show ?? []) {
        context.show(path);
      }
      for (const path of rule.hide ?? []) {
        context.hide(path);
      }
      for (const path of rule.require ?? []) {
        context.require(path);
      }
      for (const path of rule.optional ?? []) {
        context.optional(path);
      }
      for (const path of rule.enable ?? []) {
        context.enable(path);
      }
      for (const path of rule.disable ?? []) {
        context.disable(path);
      }
      if (rule.disableSubmit) {
        context.disableSubmit();
      }

      runThen(rule, context);
    } else {
      for (const path of rule.show ?? []) {
        ensureField(working, path).visible = false;
      }
      for (const path of rule.require ?? []) {
        ensureField(working, path).required = false;
      }
      for (const path of rule.disable ?? []) {
        ensureField(working, path).disabled = false;
      }
      if (rule.disableSubmit) {
        formUi = { submitDisabled: false };
      }
    }

    for (const [path, state] of Object.entries(working)) {
      ui[path] = state;
    }
  }

  return { fieldUi: ui, formUi };
}

export async function runDependencyRules<TValues extends Record<string, unknown>>(input: {
  readonly rules: readonly FormRuleDefinition<TValues>[];
  readonly changedPath: FieldPath;
  readonly values: TValues;
  readonly signal?: AbortSignal;
}): Promise<Partial<Record<FieldPath, readonly FieldOption[]>>> {
  const updates: Partial<Record<FieldPath, readonly FieldOption[]>> = {};

  for (const rule of input.rules) {
    if (input.signal?.aborted) {
      return updates;
    }

    if (rule.watch !== input.changedPath || !rule.changes || !rule.populate) {
      continue;
    }

    if (!matchesRule(rule, input.values)) {
      continue;
    }

    try {
      const current = getIn(input.values, rule.watch);
      const options = await rule.changes(current, input.values);
      if (input.signal?.aborted) {
        return updates;
      }
      updates[rule.populate] = options;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return updates;
      }
      if (error instanceof WorkflowError) {
        throw error;
      }
      throw new WorkflowError(
        error instanceof Error ? error.message : `Workflow populate for "${rule.populate}" failed.`,
        { cause: error },
      );
    }
  }

  return updates;
}
