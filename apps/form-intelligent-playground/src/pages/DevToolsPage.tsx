import { useEffect, useMemo, useRef, useState } from "react";

import styles from "./Pages.module.css";
import { DevToolsPanel } from "../components/playground/DevToolsPanel.js";
import { EventLog } from "../components/playground/EventLog.js";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useDevToolsInspector } from "../hooks/useDevToolsInspector.js";
import { useEventLog } from "../hooks/useEventLog.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import {
  applyValues,
  copyText,
  createVerboseValidationPlugin,
  downloadText,
  exportFormState,
  parseConfigDocument,
  parseImportedState,
  serializeConfig,
  serializeExportedState,
  toConfigDocument,
  type DebugFlags,
} from "../lib/devtools-utilities.js";
import {
  connectFormDevToolsToGlobal,
  createForm,
  email,
  enableFormDevTools,
  required,
  type FormInstance,
} from "../lib/form-intelligent.js";
import { toInputValue } from "../utils/field-value.js";

const DEVTOOLS_DRAFT_KEY = "joc.form-intelligent-playground.devtools-workflow";

export function DevToolsPage() {
  const { clear, entries, push } = useEventLog(60);
  const debugFlagsRef = useRef<DebugFlags>({
    verboseValidation: false,
    logToConsole: true,
  });
  const [debugFlags, setDebugFlags] = useState<DebugFlags>(debugFlagsRef.current);
  const [configText, setConfigText] = useState("");
  const [importText, setImportText] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const profileForm = useMemo(() => {
    const instance = createForm({
      initialValues: { email: "", name: "" },
      validators: {
        email: [required, email],
        name: [required],
      },
      onSubmit: () => undefined,
    });

    instance.use(
      createVerboseValidationPlugin<{ email: string; name: string }>(
        () => debugFlagsRef.current,
        push,
      ),
    );

    return instance;
  }, [push]);

  const workflowForm = useMemo(() => {
    const instance = createForm({
      initialValues: { title: "", notes: "" },
      validators: {
        title: [required],
        notes: [required],
      },
      workflow: {
        autosave: {
          enabled: true,
          debounceMs: 500,
          onSave: () => undefined,
        },
        draft: {
          enabled: true,
          storageKey: DEVTOOLS_DRAFT_KEY,
        },
        wizard: {
          steps: [
            { id: "title", fields: ["title"] },
            { id: "notes", fields: ["notes"] },
          ],
        },
      },
      onSubmit: () => undefined,
    });

    instance.use(
      createVerboseValidationPlugin<{ title: string; notes: string }>(
        () => debugFlagsRef.current,
        push,
      ),
    );

    return instance;
  }, [push]);

  const instrumentedForms = useMemo(
    () => [profileForm, workflowForm] as unknown as FormInstance<Record<string, unknown>>[],
    [profileForm, workflowForm],
  );

  useEffect(() => {
    enableFormDevTools(profileForm);
    enableFormDevTools(workflowForm);
    connectFormDevToolsToGlobal();
  }, [profileForm, workflowForm]);

  const inspector = useDevToolsInspector(instrumentedForms);
  const profileSnapshot = useFormSnapshot(profileForm);
  const workflowSnapshot = useFormSnapshot(workflowForm);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(profileForm.id);

  const selectedForm =
    instrumentedForms.find((form) => form.id === selectedFormId) ?? instrumentedForms[0] ?? null;

  useEffect(() => {
    if (!selectedForm) {
      return;
    }

    setConfigText(serializeConfig(toConfigDocument(selectedForm)));
  }, [selectedFormId, selectedForm]);

  const workflowStep = workflowSnapshot.workflow.currentStep;
  const workflowField = workflowStep === 0 ? "title" : "notes";

  const updateDebugFlag = <K extends keyof DebugFlags>(key: K, value: DebugFlags[K]) => {
    const next = { ...debugFlagsRef.current, [key]: value };
    debugFlagsRef.current = next;
    setDebugFlags(next);
    push(`debug flag ${key}=${String(value)}`);
  };

  const resolveSelected = (): FormInstance<Record<string, unknown>> | null => selectedForm;

  const handleApplyConfig = () => {
    const form = resolveSelected();
    if (!form) {
      return;
    }

    try {
      const document = parseConfigDocument(configText);
      applyValues(form, document.values);
      setStatusMessage(`Applied config values to ${form.id}`);
      push(`config applied → ${form.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid config JSON";
      setStatusMessage(message);
      push(`config error: ${message}`);
    }
  };

  const handleExport = async () => {
    const form = resolveSelected();
    if (!form) {
      return;
    }

    const payload = serializeExportedState(exportFormState(form));
    setImportText(payload);
    const copied = await copyText(payload);
    downloadText(`form-state-${form.id}.json`, payload);
    setStatusMessage(copied ? "Exported + copied to clipboard" : "Exported (download only)");
    push(`exported state for ${form.id}`);
  };

  const handleImport = () => {
    const form = resolveSelected();
    if (!form) {
      return;
    }

    try {
      const values = parseImportedState(importText);
      applyValues(form, values);
      setStatusMessage(`Imported values into ${form.id}`);
      push(`imported state → ${form.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid import JSON";
      setStatusMessage(message);
      push(`import error: ${message}`);
    }
  };

  return (
    <PageContainer
      description="Inspect active forms, edit config JSON, export/import state, and toggle verbose validation tracing."
      eyebrow="DevTools"
      title="Form DevTools"
    >
      <ExplainPanel
        body="enableFormDevTools(form) registers instances for the inspector. Use the config editor and export/import tools below for local debugging. Verbose validation logs pipeline hooks without changing engine behavior. A future browser extension is planned in Phase 5.4.8."
        title="In-playground developer utilities"
      />

      <div className={styles.explorerLayout}>
        <div className={styles.stack}>
          <Card description="Validation + submit events for the inspector." title="Profile form">
            <label className={styles.fieldLabel}>
              name
              <input
                className={styles.textInput}
                onChange={(event) => {
                  profileForm.setValue("name", event.target.value);
                }}
                value={toInputValue(profileForm.values("name"))}
              />
            </label>
            <label className={styles.fieldLabel}>
              email
              <input
                className={styles.textInput}
                onChange={(event) => {
                  profileForm.setValue("email", event.target.value);
                }}
                value={toInputValue(profileForm.values("email"))}
              />
            </label>
            <p className={styles.fieldHint}>
              valid {String(profileSnapshot.isValid)} · dirty {String(profileSnapshot.isDirty)}
            </p>
            <div className={styles.buttonRow}>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  void profileForm.validate();
                }}
                type="button"
              >
                validate()
              </button>
              <button
                className={styles.primaryButton}
                onClick={() => {
                  void profileForm.submit();
                }}
                type="button"
              >
                submit()
              </button>
            </div>
          </Card>

          <Card
            description="Autosave, draft, wizard steps, and workflow timeline entries."
            title="Workflow form"
          >
            <p className={styles.fieldHint}>
              Step {workflowStep + 1} of {workflowSnapshot.workflow.totalSteps}
            </p>
            <label className={styles.fieldLabel}>
              {workflowField}
              <input
                className={styles.textInput}
                onChange={(event) => {
                  workflowForm.setValue(workflowField, event.target.value);
                }}
                value={toInputValue(workflowForm.values(workflowField))}
              />
            </label>
            <div className={styles.buttonRow}>
              <button
                className={styles.secondaryButton}
                disabled={!workflowSnapshot.workflow.canGoPrev}
                onClick={() => {
                  workflowForm.workflow.prev();
                }}
                type="button"
              >
                workflow.prev()
              </button>
              <button
                className={styles.secondaryButton}
                disabled={!workflowSnapshot.workflow.canGoNext}
                onClick={() => {
                  void workflowForm.workflow.next();
                }}
                type="button"
              >
                workflow.next()
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  workflowForm.reset();
                }}
                type="button"
              >
                reset()
              </button>
            </div>
          </Card>

          <Card
            description="Edit values for the selected form, then apply via reset({ values })."
            title="Form config JSON"
          >
            <p className={styles.fieldHint}>
              Selected: <code>{selectedForm?.id ?? "none"}</code>
            </p>
            <textarea
              aria-label="Form config JSON"
              className={styles.jsonEditor}
              onChange={(event) => {
                setConfigText(event.target.value);
              }}
              spellCheck={false}
              value={configText}
            />
            <div className={styles.buttonRow}>
              <button className={styles.primaryButton} onClick={handleApplyConfig} type="button">
                Apply config
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  if (!selectedForm) {
                    return;
                  }
                  setConfigText(serializeConfig(toConfigDocument(selectedForm)));
                  setStatusMessage("Synced editor from live form");
                }}
                type="button"
              >
                Sync from form
              </button>
            </div>
          </Card>

          <Card
            description="Download/copy a FormState document, or paste values / exported JSON to restore."
            title="Export / import state"
          >
            <textarea
              aria-label="Import form state JSON"
              className={styles.jsonEditor}
              onChange={(event) => {
                setImportText(event.target.value);
              }}
              placeholder='Paste exported JSON or { "values": { ... } }'
              spellCheck={false}
              value={importText}
            />
            <div className={styles.buttonRow}>
              <button
                className={styles.primaryButton}
                onClick={() => void handleExport()}
                type="button"
              >
                Export state
              </button>
              <button className={styles.secondaryButton} onClick={handleImport} type="button">
                Import into selected
              </button>
            </div>
            {statusMessage ? <p className={styles.fieldHint}>{statusMessage}</p> : null}
          </Card>

          <Card
            description="Verbose pipeline tracing via FormPluginApi beforeValidate / afterValidate."
            title="Debug flags"
          >
            <ul className={styles.stackList}>
              <li>
                <label className={styles.checkboxRow}>
                  <input
                    checked={debugFlags.verboseValidation}
                    onChange={(event) => {
                      updateDebugFlag("verboseValidation", event.target.checked);
                    }}
                    type="checkbox"
                  />
                  <span>
                    <strong>Verbose validation pipeline</strong>
                    <br />
                    <span className={styles.muted}>
                      Log paths, mode, values, and validity on each validate()
                    </span>
                  </span>
                </label>
              </li>
              <li>
                <label className={styles.checkboxRow}>
                  <input
                    checked={debugFlags.logToConsole}
                    onChange={(event) => {
                      updateDebugFlag("logToConsole", event.target.checked);
                    }}
                    type="checkbox"
                  />
                  <span>
                    <strong>Also log to console.debug</strong>
                    <br />
                    <span className={styles.muted}>Uses the [form-intelligent] prefix</span>
                  </span>
                </label>
              </li>
            </ul>
          </Card>

          <Card description="Playground-side debug and utility messages." title="Utility event log">
            <div className={styles.buttonRow}>
              <button className={styles.secondaryButton} onClick={clear} type="button">
                Clear log
              </button>
            </div>
            <EventLog
              entries={entries}
              emptyMessage="Toggle flags or apply config to see messages."
            />
          </Card>

          <Card description="Console access for local debugging." title="Global hook">
            <CodeBlock
              code={`import { connectFormDevToolsToGlobal, getFormDevTools } from "@jayoncode/form-intelligent/devtools";\n\nconnectFormDevToolsToGlobal();\n// window.__FORM_INTELLIGENT_DEVTOOLS__.getActiveForms()`}
              language="typescript"
            />
          </Card>
        </div>

        <DevToolsPanel
          inspector={inspector}
          onClearLogs={() => {
            inspector.clearLogs(selectedFormId ?? undefined);
          }}
          onSelectFormId={setSelectedFormId}
          selectedFormId={selectedFormId}
        />
      </div>
    </PageContainer>
  );
}
