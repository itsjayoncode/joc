import type {
  DevToolsPerformanceMark,
  DevToolsPluginInfo,
  DevToolsValidationRecord,
  DevToolsWorkflowEvent,
  FormDevToolsInspector,
  FormDevToolsSummary,
} from "@jayoncode/form-intelligence/devtools";

import styles from "./DevToolsPanel.module.css";
import { EventLog } from "./EventLog.js";
import { FieldMetaTable } from "./FieldMetaTable.js";
import { Card } from "../primitives/Card.js";
import { CodeBlock } from "../primitives/CodeBlock.js";

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}

function summarizeErrors(errors: Readonly<Record<string, string>>): string {
  const entries = Object.entries(errors);
  if (entries.length === 0) {
    return "no errors";
  }

  return entries.map(([path, message]) => `${path}: ${message}`).join(" · ");
}

export interface DevToolsPanelProps {
  readonly inspector: FormDevToolsInspector;
  readonly selectedFormId: string | null;
  readonly onSelectFormId: (formId: string) => void;
  readonly onClearLogs: () => void;
}

export function DevToolsPanel({
  inspector,
  onClearLogs,
  onSelectFormId,
  selectedFormId,
}: DevToolsPanelProps) {
  const activeForms = inspector.getActiveForms();
  const resolvedFormId = selectedFormId ?? activeForms[0]?.id ?? null;
  const snapshot = resolvedFormId ? inspector.getStateSnapshot(resolvedFormId) : null;
  const eventLog = resolvedFormId ? inspector.getEventLog(resolvedFormId) : [];
  const validationLog = resolvedFormId ? inspector.getValidationLog(resolvedFormId) : [];
  const workflowTimeline = resolvedFormId ? inspector.getWorkflowTimeline(resolvedFormId) : [];
  const performanceMarks = resolvedFormId ? inspector.getPerformanceMarks(resolvedFormId) : [];
  const plugins = resolvedFormId ? inspector.getPlugins(resolvedFormId) : [];

  const fieldRows =
    snapshot === null
      ? []
      : Object.keys({ ...snapshot.values, ...snapshot.errors }).map((path) => ({
          path,
          touched: Boolean(snapshot.touched[path]),
          dirty: Boolean(snapshot.dirty[path]),
          visited: Boolean(snapshot.visited[path]),
          validating: Boolean(snapshot.fieldMeta[path]?.isValidating),
          error: snapshot.errors[path],
        }));

  return (
    <div className={styles.stack}>
      <Card
        description="Registered via enableFormDevTools() or createDevToolsPlugin()."
        title="Active forms"
      >
        {activeForms.length === 0 ? (
          <p className={styles.empty}>No instrumented forms on this page.</p>
        ) : (
          <ul className={styles.formList}>
            {activeForms.map((form: FormDevToolsSummary) => (
              <li key={form.id}>
                <button
                  className={
                    form.id === resolvedFormId ? styles.formButtonActive : styles.formButton
                  }
                  onClick={() => {
                    onSelectFormId(form.id);
                  }}
                  type="button"
                >
                  <span className={styles.formId}>{form.id}</span>
                  <span className={styles.formMeta}>
                    dirty {String(form.isDirty)} · valid {String(form.isValid)} · submits{" "}
                    {form.submitCount}
                    {form.totalSteps > 1
                      ? ` · step ${String(form.currentStep + 1)}/${String(form.totalSteps)}`
                      : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className={styles.toolbar}>
          <button className={styles.secondaryButton} onClick={onClearLogs} type="button">
            Clear logs
          </button>
        </div>
      </Card>

      {snapshot ? (
        <>
          <Card
            description="getStateSnapshot(formId) — same shape as State Explorer."
            title="State tree"
          >
            <FieldMetaTable rows={fieldRows} />
            <CodeBlock code={JSON.stringify(snapshot, null, 2)} language="json" />
          </Card>

          <Card description="form.listPlugins() via getPlugins(formId)." title="Plugins">
            <PluginList entries={plugins} />
          </Card>

          <Card
            description="validate / submit duration marks (getPerformanceMarks)."
            title="Performance marks"
          >
            <PerformanceMarks entries={performanceMarks} />
          </Card>

          <Card
            description="validate / validated phases with error snapshots."
            title="Validation log"
          >
            <ValidationLog entries={validationLog} />
          </Card>

          <Card
            description="submit, autosave, draft, reset, and wizard:step events."
            title="Workflow timeline"
          >
            <WorkflowTimeline entries={workflowTimeline} />
          </Card>

          <Card description="Core form events captured by the devtools plugin." title="Event log">
            <EventLog
              emptyMessage="Interact with the demo forms to populate the log."
              entries={eventLog.map((entry) => ({
                id: entry.id,
                at: formatTimestamp(entry.timestamp),
                message: entry.type,
              }))}
            />
          </Card>
        </>
      ) : (
        <Card title="Inspector">
          <p className={styles.empty}>Select a form to inspect state and logs.</p>
        </Card>
      )}
    </div>
  );
}

function PluginList({ entries }: { readonly entries: readonly DevToolsPluginInfo[] }) {
  if (entries.length === 0) {
    return <p className={styles.empty}>No plugins registered.</p>;
  }

  return (
    <ul className={styles.timeline}>
      {entries.map((plugin) => (
        <li className={styles.timelineEntry} key={plugin.name}>
          <span className={styles.timelineLabel}>
            {plugin.name}
            {plugin.version ? ` @${plugin.version}` : ""}
          </span>
          <span className={styles.timelineDetail}>order {plugin.order}</span>
        </li>
      ))}
    </ul>
  );
}

function PerformanceMarks({ entries }: { readonly entries: readonly DevToolsPerformanceMark[] }) {
  if (entries.length === 0) {
    return <p className={styles.empty}>No performance marks yet — validate or submit.</p>;
  }

  return (
    <ul className={styles.timeline}>
      {[...entries].reverse().map((entry) => (
        <li className={styles.timelineEntry} key={entry.id}>
          <span className={styles.timelineLabel}>{entry.name}</span>
          <span className={styles.timelineDetail}>{entry.durationMs.toFixed(2)} ms</span>
        </li>
      ))}
    </ul>
  );
}

function ValidationLog({ entries }: { readonly entries: readonly DevToolsValidationRecord[] }) {
  if (entries.length === 0) {
    return <p className={styles.empty}>No validation entries yet.</p>;
  }

  return (
    <ul className={styles.timeline}>
      {[...entries].reverse().map((entry) => (
        <li className={styles.timelineEntry} key={entry.id}>
          <span className={styles.timelineTime}>{formatTimestamp(entry.timestamp)}</span>
          <span className={styles.timelineLabel}>
            {entry.phase} · {entry.isValid ? "valid" : "invalid"}
          </span>
          <span className={styles.timelineDetail}>{summarizeErrors(entry.errors)}</span>
        </li>
      ))}
    </ul>
  );
}

function WorkflowTimeline({ entries }: { readonly entries: readonly DevToolsWorkflowEvent[] }) {
  if (entries.length === 0) {
    return <p className={styles.empty}>No workflow events yet.</p>;
  }

  return (
    <ul className={styles.timeline}>
      {[...entries].reverse().map((entry) => (
        <li className={styles.timelineEntry} key={entry.id}>
          <span className={styles.timelineTime}>{formatTimestamp(entry.timestamp)}</span>
          <span className={styles.timelineLabel}>{entry.type}</span>
          {entry.detail ? (
            <CodeBlock code={JSON.stringify(entry.detail, null, 2)} language="json" />
          ) : null}
        </li>
      ))}
    </ul>
  );
}
