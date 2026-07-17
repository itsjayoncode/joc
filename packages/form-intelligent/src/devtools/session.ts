import { redactValuesRecord } from "./redact.js";
import { RingBuffer } from "./ring-buffer.js";
import { nextDevToolsEventId, hasValidationErrors, summarizeErrors } from "./utils.js";

import type {
  DevToolsEventRecord,
  DevToolsPerformanceMark,
  DevToolsPluginInfo,
  DevToolsValidationRecord,
  DevToolsWorkflowEvent,
  DevToolsWorkflowEventType,
  FormDevToolsPluginOptions,
} from "./types.js";
import type { FormEvent, FormInstance } from "../types/index.js";

const DEFAULT_MAX_EVENTS = 200;
const DEFAULT_MAX_VALIDATION_ENTRIES = 100;
const DEFAULT_MAX_WORKFLOW_ENTRIES = 100;
const DEFAULT_MAX_PERFORMANCE_MARKS = 100;

const WORKFLOW_EVENTS = new Set<DevToolsWorkflowEventType>([
  "submit",
  "autosave",
  "draft",
  "reset",
]);

function nowMs(): number {
  return typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();
}

export class FormDevToolsSession {
  private readonly events: RingBuffer<DevToolsEventRecord>;
  private readonly validationLog: RingBuffer<DevToolsValidationRecord>;
  private readonly workflowTimeline: RingBuffer<DevToolsWorkflowEvent>;
  private readonly performanceMarks: RingBuffer<DevToolsPerformanceMark>;
  private lastStep: number;
  private readonly cleanups: Array<() => void> = [];
  private readonly captureStateOnWorkflowEvents: boolean;
  private readonly redactValues: boolean;
  private validateStartedAt: number | undefined;
  private submitStartedAt: number | undefined;

  public constructor(
    private readonly form: FormInstance<Record<string, unknown>>,
    options: FormDevToolsPluginOptions = {},
  ) {
    this.events = new RingBuffer(options.maxEvents ?? DEFAULT_MAX_EVENTS);
    this.validationLog = new RingBuffer(
      options.maxValidationEntries ?? DEFAULT_MAX_VALIDATION_ENTRIES,
    );
    this.workflowTimeline = new RingBuffer(
      options.maxWorkflowEntries ?? DEFAULT_MAX_WORKFLOW_ENTRIES,
    );
    this.performanceMarks = new RingBuffer(
      options.maxPerformanceMarks ?? DEFAULT_MAX_PERFORMANCE_MARKS,
    );
    this.captureStateOnWorkflowEvents = options.captureStateOnWorkflowEvents ?? false;
    this.redactValues = options.redactValues ?? true;
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
    return this.events.toArray();
  }

  public getValidationLog(): readonly DevToolsValidationRecord[] {
    return this.validationLog.toArray();
  }

  public getWorkflowTimeline(): readonly DevToolsWorkflowEvent[] {
    return this.workflowTimeline.toArray();
  }

  public getPerformanceMarks(): readonly DevToolsPerformanceMark[] {
    return this.performanceMarks.toArray();
  }

  public getPlugins(): readonly DevToolsPluginInfo[] {
    return this.form.listPlugins();
  }

  public clearLogs(): void {
    this.events.clear();
    this.validationLog.clear();
    this.workflowTimeline.clear();
    this.performanceMarks.clear();
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
          if (type === "validate") {
            this.validateStartedAt = nowMs();
          }
          if (type === "validated") {
            this.finishMark("validate", this.validateStartedAt);
            this.validateStartedAt = undefined;
            this.recordValidation(type);
          }
          if (type === "validate") {
            this.recordValidation(type);
          }
          if (type === "submit") {
            this.submitStartedAt = nowMs();
          }
          if (WORKFLOW_EVENTS.has(type as DevToolsWorkflowEventType)) {
            this.recordWorkflow(type as DevToolsWorkflowEventType);
          }
          this.trackWizardStep();
        }),
      );
    }

    this.cleanups.push(
      this.form.subscribe(() => {
        if (this.submitStartedAt === undefined) {
          return;
        }
        if (!this.form.isSubmitting()) {
          this.finishMark("submit", this.submitStartedAt, {
            submitPhase: this.form.getFormState().submitPhase,
          });
          this.submitStartedAt = undefined;
        }
      }),
    );
  }

  private finishMark(
    name: string,
    startedAt: number | undefined,
    detail?: Readonly<Record<string, unknown>>,
  ): void {
    if (startedAt === undefined) {
      return;
    }

    const durationMs = Math.max(0, nowMs() - startedAt);
    const entry: DevToolsPerformanceMark = {
      id: nextDevToolsEventId("perf"),
      formId: this.form.id,
      name,
      startTime: startedAt,
      durationMs,
      ...(detail ? { detail } : {}),
    };
    this.performanceMarks.push(entry);
  }

  private recordEvent(type: FormEvent | "destroy"): void {
    const entry: DevToolsEventRecord = {
      id: nextDevToolsEventId("evt"),
      formId: this.form.id,
      type,
      timestamp: Date.now(),
    };

    this.events.push(entry);
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

    this.validationLog.push(entry);
  }

  private recordWorkflow(type: DevToolsWorkflowEventType): void {
    let detail: Record<string, unknown> | undefined;
    if (this.captureStateOnWorkflowEvents) {
      const values = this.form.getValues();
      detail = {
        values: this.redactValues ? redactValuesRecord(values) : values,
        workflow: this.form.getFormState().workflow,
        submissionQueue: this.form.getFormState().submissionQueue,
      };
    }

    const entry: DevToolsWorkflowEvent = {
      id: nextDevToolsEventId("flow"),
      formId: this.form.id,
      type,
      timestamp: Date.now(),
      ...(detail ? { detail } : {}),
    };

    this.workflowTimeline.push(entry);
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
