import type { ValidationMode } from "@jayoncode/form-intelligence";

export type SandboxTemplateId =
  "login" | "register" | "contact" | "checkout" | "survey" | "employee" | "invoice" | "booking";

export interface SandboxConfig {
  readonly templateId: SandboxTemplateId;
  readonly validateOn: ValidationMode;
  readonly asyncUsername: boolean;
  readonly asyncDebounceMs: number;
  readonly asyncRetry: boolean;
  readonly asyncTimeoutMs: number;
  readonly asyncCache: boolean;
  readonly disableWhileSubmitting: boolean;
  readonly resetAfterSubmit: boolean;
  readonly mockLatencyMs: number;
  readonly simulateFailure: boolean;
  readonly conditionalBusiness: boolean;
  readonly autosave: boolean;
  readonly draft: boolean;
  readonly wizard: boolean;
  readonly offlineQueue: boolean;
  readonly calculations: boolean;
  readonly undoRedo: boolean;
  readonly formatters: boolean;
  /** When > 0, replaces the template with N required text fields. */
  readonly stressFieldCount: number;
}

export const DEFAULT_SANDBOX_CONFIG: SandboxConfig = {
  templateId: "login",
  validateOn: "onBlur",
  asyncUsername: false,
  asyncDebounceMs: 300,
  asyncRetry: false,
  asyncTimeoutMs: 0,
  asyncCache: false,
  disableWhileSubmitting: true,
  resetAfterSubmit: false,
  mockLatencyMs: 600,
  simulateFailure: false,
  conditionalBusiness: false,
  autosave: false,
  draft: false,
  wizard: false,
  offlineQueue: false,
  calculations: false,
  undoRedo: true,
  formatters: false,
  stressFieldCount: 0,
};

export interface SandboxTemplate {
  readonly id: SandboxTemplateId;
  readonly label: string;
  readonly description: string;
  readonly docsPath: string;
  readonly initialValues: Record<string, unknown>;
  readonly fieldOrder: readonly string[];
  readonly fieldMeta: Readonly<
    Record<
      string,
      {
        readonly label: string;
        readonly type?: "text" | "email" | "password" | "number" | "tel" | "select" | "textarea";
        readonly options?: readonly { readonly label: string; readonly value: string }[];
      }
    >
  >;
}

export type InspectorTab = "field" | "form" | "events" | "performance" | "code";

export interface SandboxConsoleEntry {
  readonly id: string;
  readonly at: string;
  readonly level: "info" | "warn" | "error" | "success";
  readonly message: string;
}

export interface SandboxEventEntry {
  readonly id: string;
  readonly at: string;
  readonly event: string;
  readonly durationMs?: number;
  readonly detail?: string;
}
