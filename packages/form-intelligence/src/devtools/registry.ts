import { FormDevToolsSession } from "./session.js";

import type {
  DevToolsEventRecord,
  DevToolsPerformanceMark,
  DevToolsPluginInfo,
  DevToolsValidationRecord,
  DevToolsWorkflowEvent,
  FormDevToolsInspector,
  FormDevToolsPluginOptions,
  FormDevToolsSummary,
} from "./types.js";
import type { FormInstance, FormState } from "../types/index.js";

export class FormDevToolsRegistry implements FormDevToolsInspector {
  private readonly sessions = new Map<string, FormDevToolsSession>();

  public register(
    form: FormInstance<Record<string, unknown>>,
    options: FormDevToolsPluginOptions = {},
  ): () => void {
    const existing = this.sessions.get(form.id);
    existing?.destroy();

    const session = new FormDevToolsSession(form, options);
    this.sessions.set(form.id, session);

    return () => {
      this.unregister(form.id);
    };
  }

  public unregister(formId: string): void {
    const session = this.sessions.get(formId);
    if (!session) {
      return;
    }

    session.destroy();
    this.sessions.delete(formId);
  }

  public getActiveForms(): readonly FormDevToolsSummary[] {
    return [...this.sessions.values()].map((session) => {
      const state = session.getStateSnapshot();
      return {
        id: session.getFormId(),
        isDirty: state.isDirty,
        isValid: state.isValid,
        isSubmitting: state.isSubmitting,
        submitCount: state.submitCount,
        currentStep: state.workflow.currentStep,
        totalSteps: state.workflow.totalSteps,
      };
    });
  }

  public getEventLog(formId: string): readonly DevToolsEventRecord[] {
    return this.sessions.get(formId)?.getEventLog() ?? [];
  }

  public getValidationLog(formId: string): readonly DevToolsValidationRecord[] {
    return this.sessions.get(formId)?.getValidationLog() ?? [];
  }

  public getWorkflowTimeline(formId: string): readonly DevToolsWorkflowEvent[] {
    return this.sessions.get(formId)?.getWorkflowTimeline() ?? [];
  }

  public getPerformanceMarks(formId: string): readonly DevToolsPerformanceMark[] {
    return this.sessions.get(formId)?.getPerformanceMarks() ?? [];
  }

  public getPlugins(formId: string): readonly DevToolsPluginInfo[] {
    return this.sessions.get(formId)?.getPlugins() ?? [];
  }

  public getStateSnapshot(formId: string): FormState<Record<string, unknown>> | null {
    return this.sessions.get(formId)?.getStateSnapshot() ?? null;
  }

  public clearLogs(formId?: string): void {
    if (formId) {
      this.sessions.get(formId)?.clearLogs();
      return;
    }

    for (const session of this.sessions.values()) {
      session.clearLogs();
    }
  }
}

export const formDevToolsRegistry = new FormDevToolsRegistry();

export function getFormDevTools(): FormDevToolsInspector {
  return formDevToolsRegistry;
}
