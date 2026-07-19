import type {
  DevToolsPerformanceMark,
  DevToolsPluginInfo,
  DevToolsValidationRecord,
  DevToolsWorkflowEvent,
  FormDevToolsInspector,
  FormDevToolsSummary,
  UiProjectionSnapshot,
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
  const uiProjection = resolvedFormId ? inspector.getUiProjection(resolvedFormId) : null;

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
            description="getUiProjection(formId) — hard guard vs UX explain, policies, collections, per-field status."
            title="UI projection"
          >
            {uiProjection ? <UiProjectionInspect snapshot={uiProjection} /> : null}
          </Card>

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

function UiProjectionInspect({ snapshot }: { readonly snapshot: UiProjectionSnapshot }) {
  const submit = snapshot.submitExplain;
  const guard = snapshot.submissionGuard;
  const whyBlocked = submit.value
    ? "Submit UX allows the button."
    : submit.reasons.length > 0
      ? `UX blocked: ${submit.reasons.join(", ")}`
      : "UX blocked (no reasons listed).";

  return (
    <div className={styles.stack}>
      <div className={styles.explainBlock}>
        <p className={styles.sectionLabel}>Hard guard (engine)</p>
        <p className={styles.timelineDetail}>
          submissionGuard.allowed=<code>{String(guard.allowed)}</code>
          {snapshot.formUi.submitDisabled ? " · formUi.submitDisabled" : ""}
        </p>
        {guard.reasons.length === 0 ? (
          <p className={styles.empty}>No hard blocks — pipeline may start.</p>
        ) : (
          <ul className={styles.reasonList}>
            {guard.reasons.map((reason) => (
              <li key={reason}>
                <code>{reason}</code>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.explainBlock}>
        <p className={styles.sectionLabel}>Button UX (projection)</p>
        <p className={styles.timelineDetail}>
          <strong>canSubmit</strong> {String(snapshot.canSubmit)} · phase {snapshot.phase} ·{" "}
          {whyBlocked}
        </p>
        {submit.reasons.length === 0 ? (
          <p className={styles.empty}>No UX block reasons.</p>
        ) : (
          <ul className={styles.reasonList}>
            {submit.reasons.map((reason) => (
              <li key={reason}>
                <code>{reason}</code>
              </li>
            ))}
          </ul>
        )}
        <p className={styles.timelineDetail}>
          contributors: {submit.contributors.join(", ") || "—"}
        </p>
      </div>

      <div className={styles.explainBlock}>
        <p className={styles.sectionLabel}>Policies</p>
        <p className={styles.timelineDetail}>
          errorDisplay=<code>{snapshot.policies.errorDisplay}</code> · disableSubmitWhen=
          <code>[{snapshot.policies.disableSubmitWhen.join(", ")}]</code>
        </p>
      </div>

      <div className={styles.explainBlock}>
        <p className={styles.sectionLabel}>Collections</p>
        <p className={styles.timelineDetail}>
          required [{snapshot.requiredFields.join(", ") || "—"}] · invalid [
          {snapshot.invalidFields.join(", ") || "—"}] · validating [
          {snapshot.validatingFields.join(", ") || "—"}] · visible [
          {snapshot.visibleFields.join(", ") || "—"}]
        </p>
      </div>

      <div className={styles.explainBlock}>
        <p className={styles.sectionLabel}>Fields</p>
        {snapshot.fields.length === 0 ? (
          <p className={styles.empty}>No fields in projection yet.</p>
        ) : (
          <ul className={styles.fieldExplainList}>
            {snapshot.fields.map((field) => (
              <li className={styles.fieldExplainEntry} key={field.path}>
                <span className={styles.fieldPath}>{field.path}</span>
                <span className={styles.timelineDetail}>
                  status=<code>{field.status}</code>
                  {field.showError ? " · showError" : ""}
                  {field.required === true ? " · required" : ""}
                  {field.disabled ? " · disabled" : ""}
                  {!field.visible ? " · hidden" : ""}
                </span>
                {field.showErrorExplain.reasons.length > 0 ? (
                  <span className={styles.timelineDetail}>
                    showError: {field.showErrorExplain.reasons.join(", ")}
                  </span>
                ) : null}
                {field.disabledExplain.reasons.length > 0 ? (
                  <span className={styles.timelineDetail}>
                    disabled: {field.disabledExplain.reasons.join(", ")}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <details className={styles.rawDetails}>
        <summary>Raw getUiProjection() JSON</summary>
        <CodeBlock
          code={JSON.stringify(
            {
              policies: snapshot.policies,
              submissionGuard: snapshot.submissionGuard,
              formUi: snapshot.formUi,
              canSubmit: snapshot.canSubmit,
              submitExplain: snapshot.submitExplain,
              requiredFields: snapshot.requiredFields,
              fields: snapshot.fields.map((field) => ({
                path: field.path,
                status: field.status,
                showError: field.showError,
                required: field.required,
                visible: field.visible,
                disabled: field.disabled,
                disabledReasons: field.disabledReasons,
                showErrorExplain: field.showErrorExplain,
                disabledExplain: field.disabledExplain,
              })),
            },
            null,
            2,
          )}
          language="json"
        />
      </details>
    </div>
  );
}
