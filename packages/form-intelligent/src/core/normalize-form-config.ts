import { isSchemaAdapter } from "../adapters/is-schema-adapter.js";

import type {
  AutosaveConfig,
  FieldSchemaConfig,
  FieldSchemaDefinition,
  FormConfig,
  ValidatorResult,
  WizardConfig,
  WizardStep,
  WorkflowConfig,
} from "../types/index.js";

function parseDurationMs(every: string): number {
  const match = /^(\d+(?:\.\d+)?)(ms|s|m)$/i.exec(every.trim());
  if (!match) {
    return 5000;
  }

  const amount = Number(match[1]);
  const unit = match[2]?.toLowerCase();
  if (unit === "ms") {
    return amount;
  }
  if (unit === "m") {
    return amount * 60_000;
  }
  return amount * 1000;
}

function defaultWizardSteps(): readonly WizardStep[] {
  return [
    { id: "step-1", validate: true },
    { id: "step-2", validate: true },
    { id: "step-3", validate: true },
  ];
}

function normalizeWizard(
  wizard: boolean | WizardConfig | undefined,
  workflow?: WorkflowConfig,
): WizardConfig | undefined {
  if (wizard === true) {
    return workflow?.wizard ?? { steps: defaultWizardSteps() };
  }

  if (wizard && typeof wizard === "object") {
    return wizard;
  }

  return workflow?.wizard;
}

function normalizeSchemaDefinition(definition: FieldSchemaDefinition): FieldSchemaDefinition {
  if (typeof definition === "string") {
    return definition;
  }

  const config = definition as FieldSchemaConfig & {
    validate?: FieldSchemaConfig["validate"] | ((value: unknown) => unknown);
  };

  if (typeof config.validate === "function") {
    const customValidator = config.validate;
    return {
      ...config,
      validate: {
        custom: (context) => customValidator(context.value) as ValidatorResult,
      },
    };
  }

  return config;
}

export function normalizeIncomingFormConfig<TValues extends Record<string, unknown>>(
  config: FormConfig<TValues> & {
    readonly autoSave?: AutosaveConfig & { readonly every?: string };
    readonly wizard?: boolean | WizardConfig;
  },
): FormConfig<TValues> {
  const workflow: {
    autosave?: AutosaveConfig;
    draft?: WorkflowConfig["draft"];
    wizard?: WizardConfig;
    analytics?: WorkflowConfig["analytics"];
    offlineQueue?: WorkflowConfig["offlineQueue"];
    keyboard?: WorkflowConfig["keyboard"];
  } = { ...(config.workflow ?? {}) };

  if (config.autoSave) {
    const debounceMs =
      config.autoSave.debounceMs ??
      (config.autoSave.every ? parseDurationMs(config.autoSave.every) : 5000);

    workflow.autosave = {
      enabled: config.autoSave.enabled ?? true,
      debounceMs,
      onSave: config.autoSave.onSave,
    };
  }

  const wizard = normalizeWizard(config.wizard, workflow as WorkflowConfig);
  if (wizard) {
    workflow.wizard = wizard;
  }

  let schema = config.schema;
  if (schema && !isSchemaAdapter(schema)) {
    const nextSchema: Partial<Record<string, FieldSchemaDefinition>> = {};
    for (const [path, definition] of Object.entries(schema)) {
      if (definition !== undefined) {
        nextSchema[path] = normalizeSchemaDefinition(definition);
      }
    }
    schema = nextSchema;
  }

  const { autoSave: _autoSave, wizard: _wizard, ...rest } = config;

  return {
    ...rest,
    ...(schema === undefined ? {} : { schema }),
    ...(Object.keys(workflow).length > 0 ? { workflow: workflow as WorkflowConfig } : {}),
  };
}
