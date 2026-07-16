import type { FormEvent, FormState } from "../types/index.js";

export type DevToolsWorkflowEventType = "submit" | "autosave" | "draft" | "reset" | "wizard:step";

export interface DevToolsEventRecord {
  readonly id: string;
  readonly formId: string;
  readonly type: FormEvent | "destroy";
  readonly timestamp: number;
  readonly detail?: Readonly<Record<string, unknown>>;
}

export interface DevToolsValidationRecord {
  readonly id: string;
  readonly formId: string;
  readonly phase: "validate" | "validated";
  readonly timestamp: number;
  readonly isValid: boolean;
  readonly errors: Readonly<Record<string, string>>;
}

export interface DevToolsWorkflowEvent {
  readonly id: string;
  readonly formId: string;
  readonly type: DevToolsWorkflowEventType;
  readonly timestamp: number;
  readonly detail?: Readonly<Record<string, unknown>>;
}

export interface FormDevToolsSummary {
  readonly id: string;
  readonly isDirty: boolean;
  readonly isValid: boolean;
  readonly isSubmitting: boolean;
  readonly submitCount: number;
  readonly currentStep: number;
  readonly totalSteps: number;
}

export interface FormDevToolsInspector {
  getActiveForms(): readonly FormDevToolsSummary[];
  getEventLog(formId: string): readonly DevToolsEventRecord[];
  getValidationLog(formId: string): readonly DevToolsValidationRecord[];
  getWorkflowTimeline(formId: string): readonly DevToolsWorkflowEvent[];
  getStateSnapshot(formId: string): FormState<Record<string, unknown>> | null;
  clearLogs(formId?: string): void;
}

export interface FormDevToolsPluginOptions {
  readonly maxEvents?: number;
  readonly maxValidationEntries?: number;
  readonly maxWorkflowEntries?: number;
  readonly captureStateOnWorkflowEvents?: boolean;
}

export interface FormDevToolsGlobalOptions extends FormDevToolsPluginOptions {
  readonly globalKey?: string;
}
