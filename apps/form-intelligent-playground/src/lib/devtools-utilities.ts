import type { FormInstance, FormPlugin, FormState } from "@jayoncode/form-intelligent";

export interface PlaygroundFormConfigDocument {
  readonly formId: string;
  readonly values: Record<string, unknown>;
  readonly note?: string;
}

export interface ExportedFormStateDocument {
  readonly version: 1;
  readonly exportedAt: string;
  readonly formId: string;
  readonly state: FormState<Record<string, unknown>>;
}

export interface DebugFlags {
  readonly verboseValidation: boolean;
  readonly logToConsole: boolean;
}

export function toConfigDocument(
  form: FormInstance<Record<string, unknown>>,
): PlaygroundFormConfigDocument {
  return {
    formId: form.id,
    values: { ...form.getValues() },
    note: "Edit values JSON, then Apply to reset the selected form.",
  };
}

export function serializeConfig(document: PlaygroundFormConfigDocument): string {
  return JSON.stringify(document, null, 2);
}

export function parseConfigDocument(raw: string): PlaygroundFormConfigDocument {
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Config must be a JSON object.");
  }

  const record = parsed as Record<string, unknown>;
  if (!record.values || typeof record.values !== "object" || Array.isArray(record.values)) {
    throw new Error('Config requires a "values" object.');
  }

  return {
    formId: typeof record.formId === "string" ? record.formId : "unknown",
    values: { ...(record.values as Record<string, unknown>) },
    ...(typeof record.note === "string" ? { note: record.note } : {}),
  };
}

export function exportFormState(
  form: FormInstance<Record<string, unknown>>,
): ExportedFormStateDocument {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    formId: form.id,
    state: form.getFormState(),
  };
}

export function serializeExportedState(document: ExportedFormStateDocument): string {
  return JSON.stringify(document, null, 2);
}

export function parseImportedState(raw: string): Record<string, unknown> {
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Import payload must be a JSON object.");
  }

  const record = parsed as Record<string, unknown>;

  if (record.state && typeof record.state === "object" && !Array.isArray(record.state)) {
    const state = record.state as Record<string, unknown>;
    if (state.values && typeof state.values === "object" && !Array.isArray(state.values)) {
      return { ...(state.values as Record<string, unknown>) };
    }
  }

  if (record.values && typeof record.values === "object" && !Array.isArray(record.values)) {
    return { ...(record.values as Record<string, unknown>) };
  }

  // Allow a bare values object.
  return { ...record };
}

export function applyValues(
  form: FormInstance<Record<string, unknown>>,
  values: Record<string, unknown>,
): void {
  form.reset({ values });
}

export function createVerboseValidationPlugin<
  TValues extends Record<string, unknown> = Record<string, unknown>,
>(
  getFlags: () => DebugFlags,
  onTrace: (message: string) => void,
): FormPlugin<TValues> {
  return {
    name: "playground-verbose-validation",
    order: 0,
    setup(_form, api) {
      api.on("beforeValidate", ({ paths, mode, values }) => {
        const flags = getFlags();
        if (!flags.verboseValidation) {
          return;
        }

        const message = `verbose:beforeValidate mode=${mode} paths=${paths.join(",") || "*"} values=${JSON.stringify(values)}`;
        onTrace(message);
        if (flags.logToConsole) {
          console.debug("[form-intelligent]", message);
        }
      });

      api.on("afterValidate", ({ paths, mode, valid, values }) => {
        const flags = getFlags();
        if (!flags.verboseValidation) {
          return;
        }

        const message = `verbose:afterValidate mode=${mode} valid=${String(valid)} paths=${paths.join(",") || "*"} values=${JSON.stringify(values)}`;
        onTrace(message);
        if (flags.logToConsole) {
          console.debug("[form-intelligent]", message);
        }
      });
    },
  };
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
