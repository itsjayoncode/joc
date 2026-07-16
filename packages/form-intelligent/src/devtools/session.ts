import { nextDevToolsEventId, capLog, hasValidationErrors, summarizeErrors } from "./utils.js";

import type {
  DevToolsEventRecord,
  DevToolsValidationRecord,
  DevToolsWorkflowEvent,
  DevToolsWorkflowEventType,
  FormDevToolsPluginOptions,
} from "./types.js";
import type { FormEvent, FormInstance } from "../types/index.js";

const DEFAULT_MAX_EVENTS = 200;
const DEFAULT_MAX_VALIDATION_ENTRIES = 100;
const DEFAULT_MAX_WORKFLOW_ENTRIES = 100;

const WORKFLOW_EVENTS = new Set<DevToolsWorkflowEventType>([
  "submit",
  "autosave",
  "draft",
  "reset",
]);

export class FormDevToolsSession {
  private events: DevToolsEventRecord[] = [];
  private validationLog: DevToolsValidationRecord[] = [];
  private workflowTimeline: DevToolsWorkflowEvent[] = [];
  private lastStep: number;
  private readonly cleanups: Array<() => void> = [];
  private readonly maxEvents: number;
  private readonly maxValidationEntries: number;
  private readonly maxWorkflowEntries: number;
  private readonly captureStateOnWorkflowEvents: boolean;

  public constructor(
    private readonly form: FormInstance<Record<string, unknown>>,
    options: FormDevToolsPluginOptions = {},
  ) {
    this.maxEvents = options.maxEvents ?? DEFAULT_MAX_EVENTS;
    this.maxValidationEntries = options.maxValidationEntries ?? DEFAULT_MAX_VALIDATION_ENTRIES;
    this.maxWorkflowEntries = options.maxWorkflowEntries ?? DEFAULT_MAX_WORKFLOW_ENTRIES;
    this.captureStateOnWorkflowEvents = options.captureStateOnWorkflowEvents ?? true;
    this.lastStep = form.getFormState().workflow.currentStep;
    this.attachEventListeners();
  }

  public getFormId(): string {
    return this.form.id;
  }

  public getStateSnapshot() {
    return this.form.getFormState();
  }

  public getEventLog(): readonly DevToolsEventRecord[] {
    return this.events;
  }

  public getValidationLog(): readonly DevToolsValidationRecord[] {
    return this.validationLog;
  }

  public getWorkflowTimeline(): readonly DevToolsWorkflowEvent[] {
    return this.workflowTimeline;
  }

  public clearLogs(): void {
    this.events = [];
    this.validationLog = [];
    this.workflowTimeline = [];
  }

  public destroy(): void {
    this.recordEvent("destroy");
    for (const cleanup of this.cleanups.splice(0)) {
      cleanup();
    }
  }

  private attachEventListeners(): void {
    const events: FormEvent[] = [
      "change",
      "blur",
      "focus",
      "reset",
      "submit",
      "validate",
      "validated",
      "autosave",
      "draft",
    ];

    for (const type of events) {
      this.cleanups.push(
        this.form.on(type, () => {
          this.recordEvent(type);
          if (type === "validate" || type === "validated") {
            this.recordValidation(type);
          }
          if (WORKFLOW_EVENTS.has(type as DevToolsWorkflowEventType)) {
            this.recordWorkflow(type as DevToolsWorkflowEventType);
          }
          this.trackWizardStep();
        }),
      );
    }
  }

  private recordEvent(type: FormEvent | "destroy"): void {
    const entry: DevToolsEventRecord = {
      id: nextDevToolsEventId("evt"),
      formId: this.form.id,
      type,
      timestamp: Date.now(),
    };

    this.events = capLog(this.events, this.maxEvents, entry);
  }

  private recordValidation(phase: "validate" | "validated"): void {
    const errors = summarizeErrors(this.form.getErrors());
    const entry: DevToolsValidationRecord = {
      id: nextDevToolsEventId("val"),
      formId: this.form.id,
      phase,
      timestamp: Date.now(),
      isValid: !hasValidationErrors(errors),
      errors,
    };

    this.validationLog = capLog(this.validationLog, this.maxValidationEntries, entry);
  }

  private recordWorkflow(type: DevToolsWorkflowEventType): void {
    const detail = this.captureStateOnWorkflowEvents
      ? {
          values: this.form.getValues(),
          workflow: this.form.getFormState().workflow,
          submissionQueue: this.form.getFormState().submissionQueue,
        }
      : undefined;

    const entry: DevToolsWorkflowEvent = {
      id: nextDevToolsEventId("flow"),
      formId: this.form.id,
      type,
      timestamp: Date.now(),
      ...(detail ? { detail } : {}),
    };

    this.workflowTimeline = capLog(this.workflowTimeline, this.maxWorkflowEntries, entry);
  }

  private trackWizardStep(): void {
    const currentStep = this.form.getFormState().workflow.currentStep;
    if (currentStep === this.lastStep) {
      return;
    }

    this.lastStep = currentStep;
    this.recordWorkflow("wizard:step");
  }
}
