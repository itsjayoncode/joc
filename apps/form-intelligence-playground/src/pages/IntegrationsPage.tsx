import { useMemo } from "react";

import styles from "./Pages.module.css";
import { EventLog } from "../components/playground/EventLog.js";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { SandboxCue } from "../components/playground/SandboxCue.js";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useEventLog } from "../hooks/useEventLog.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import {
  createBrowserLifecyclePlugin,
  createForm,
  createKeyboardPlugin,
  keyboard,
} from "../lib/form-intelligence.js";
import { toInputValue } from "../utils/field-value.js";

import type { FormPlugin } from "../lib/form-intelligence.js";

type IntegrationValues = {
  notes: string;
};

export function IntegrationsPage() {
  const { clear, entries, push } = useEventLog();

  const form = useMemo(() => {
    const instance = createForm<IntegrationValues>({
      initialValues: { notes: "" },
      workflow: {
        draft: {
          enabled: true,
          storageKey: "fi-playground-integrations",
          onRestore: () => {
            push("draft restored");
          },
        },
        keyboard: [
          { combo: "Ctrl+S", action: "saveDraft" },
          { combo: "Ctrl+Z", action: "undo" },
        ],
        analytics: { enabled: true },
      },
      onSubmit: () => {
        push("submit succeeded");
      },
    });

    instance.use(createBrowserLifecyclePlugin() as unknown as FormPlugin<IntegrationValues>);
    instance.use(
      createKeyboardPlugin([
        keyboard.shortcut("Ctrl+Enter", (target) => {
          push("Ctrl+Enter → submit");
          void target.submit();
        }),
      ]) as unknown as FormPlugin<IntegrationValues>,
    );

    return instance;
  }, [push]);

  const snapshot = useFormSnapshot(form);
  const analytics = form.getAnalytics();

  return (
    <PageContainer
      compact
      description="Draft persistence, keyboard shortcuts, browser lifecycle, and analytics snapshot — integration surface for Form Intelligence."
    >
      <ExplainPanel title="What you are testing">
        <ul className={styles.logList}>
          <li>
            <code>Ctrl+S</code> save draft · <code>Ctrl+Z</code> undo · <code>Ctrl+Enter</code>{" "}
            submit
          </li>
          <li>Hide the tab to trigger browser-lifecycle draft save</li>
          <li>
            Inspect <code>getAnalytics()</code> paths (values never captured)
          </li>
        </ul>
        <SandboxCue hint="Enable Draft / History plugins in the Sandbox for the same APIs on templates." />
      </ExplainPanel>

      <div className={styles.explorerLayout}>
        <div className={styles.stack}>
          <Card description="Edit notes, then try shortcuts or hide the tab." title="Session notes">
            <label className={styles.fieldLabel}>
              Notes
              <textarea
                className={styles.textInput}
                name="notes"
                onChange={(event) => {
                  form.setValue("notes", event.target.value);
                }}
                rows={5}
                value={toInputValue(form.values("notes"))}
              />
            </label>
            <div className={styles.buttonRow}>
              <button
                className={styles.primaryButton}
                onClick={() => {
                  form.saveDraft();
                  push("saveDraft()");
                }}
                type="button"
              >
                Save draft
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  const ok = form.undo();
                  push(ok ? "undo()" : "nothing to undo");
                }}
                type="button"
              >
                Undo
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  void form.submit();
                }}
                type="button"
              >
                Submit
              </button>
            </div>
            <p className={styles.muted}>isDirty: {String(snapshot.isDirty)}</p>
          </Card>
        </div>

        <div className={styles.inspectorStack}>
          <Card description="Path-only metrics (no field values)." title="Analytics">
            <pre className={styles.inspectorPre}>{JSON.stringify(analytics, null, 2)}</pre>
          </Card>
          <Card description="Shortcuts, draft, and submit." title="Integration activity">
            <div className={styles.buttonRow}>
              <button className={styles.secondaryButton} onClick={clear} type="button">
                Clear log
              </button>
            </div>
            <EventLog entries={entries} />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
