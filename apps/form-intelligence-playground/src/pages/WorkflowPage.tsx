import { useMemo } from "react";

import styles from "./Pages.module.css";
import { EventLog } from "../components/playground/EventLog.js";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useEventLog } from "../hooks/useEventLog.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { createForm, required } from "../lib/form-intelligence.js";
import { toInputValue } from "../utils/field-value.js";

const DRAFT_KEY = "joc.form-intelligence-playground.workflow-demo";

export function WorkflowPage() {
  const { clear, entries, push } = useEventLog();

  const form = useMemo(() => {
    const instance = createForm({
      initialValues: {
        accountType: "personal",
        fullName: "",
        companyName: "",
        notes: "",
      },
      validators: {
        fullName: [required],
        companyName: [
          (value, context) => {
            if (context.values.accountType !== "company") {
              return true;
            }

            return required(value, context);
          },
        ],
        notes: [required],
      },
      workflow: {
        draft: {
          enabled: true,
          storageKey: DRAFT_KEY,
          promptOnRestore: true,
          onRestorePrompt: () => window.confirm("Draft found — continue editing?"),
          onRestore: () => {
            push("draft restored from localStorage");
          },
        },
        autosave: {
          enabled: true,
          debounceMs: 400,
          onSave: (values) => {
            push(`autosave persisted ${JSON.stringify(values)}`);
          },
        },
        wizard: {
          steps: [
            { id: "profile", fields: ["accountType", "fullName", "companyName"] },
            { id: "details", fields: ["notes"] },
          ],
        },
      },
    });

    return instance;
  }, [push]);

  const snapshot = useFormSnapshot(form);
  const workflow = snapshot.workflow;
  const stepIndex = workflow.currentStep;
  const isCompany = toInputValue(form.values("accountType")) === "company";

  const stepFields =
    stepIndex === 0
      ? (["accountType", "fullName", ...(isCompany ? (["companyName"] as const) : [])] as const)
      : (["notes"] as const);

  return (
    <PageContainer
      compact
      description="Debounced autosave, draft restore, wizard guards, and conditional fields."
      eyebrow="Workflow"
      title="Workflow Playground"
    >
      <ExplainPanel
        body="Reload this page after editing fields — draft storage restores your progress. Autosave fires after debounce when values change."
        title="Autosave & drafts"
      />

      <div className={styles.explorerLayout}>
        <div className={styles.stack}>
          <Card
            description={`Step ${String(stepIndex + 1)} of ${String(workflow.totalSteps)}`}
            title="Wizard progress"
          >
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-valuenow={workflow.progress}
            >
              <div
                className={styles.progressFill}
                style={{ width: `${String(workflow.progress)}%` }}
              />
            </div>
            <p className={styles.fieldHint}>
              {workflow.canGoPrev ? "You can go back." : "On the first step."}{" "}
              {workflow.canGoNext ? "Next validates current step fields." : "Final step reached."}
            </p>
            {snapshot.workflow.isAutosaving ? (
              <span className={styles.statusBadgeActive}>autosaving…</span>
            ) : snapshot.workflow.lastAutosaveAt ? (
              <span className={styles.statusBadge}>
                last autosave {new Date(snapshot.workflow.lastAutosaveAt).toLocaleTimeString()}
              </span>
            ) : null}
          </Card>

          <Card
            description="Step navigation calls validate() on the active step before advancing."
            title="Multi-step wizard"
          >
            {stepIndex === 0 ? (
              <div className={styles.formGrid}>
                <label className={styles.fieldLabel}>
                  account type
                  <select
                    className={styles.textInput}
                    onChange={(event) => {
                      const next = event.target.value;
                      form.setValue("accountType", next);
                      if (next !== "company") {
                        form.setValue("companyName", "");
                        form.clearErrors("companyName");
                      }
                      push(`accountType → ${next}`);
                    }}
                    value={toInputValue(form.values("accountType"))}
                  >
                    <option value="personal">personal</option>
                    <option value="company">company</option>
                  </select>
                </label>

                <label className={styles.fieldLabel}>
                  full name
                  <input
                    className={styles.textInput}
                    onChange={(event) => {
                      form.setValue("fullName", event.target.value);
                    }}
                    value={toInputValue(form.values("fullName"))}
                  />
                  {snapshot.errors.fullName ? (
                    <span className={styles.errorText}>{snapshot.errors.fullName}</span>
                  ) : null}
                </label>

                {isCompany ? (
                  <label className={styles.fieldLabel}>
                    company name (conditional)
                    <input
                      className={styles.textInput}
                      onChange={(event) => {
                        form.setValue("companyName", event.target.value);
                      }}
                      value={toInputValue(form.values("companyName"))}
                    />
                    {snapshot.errors.companyName ? (
                      <span className={styles.errorText}>{snapshot.errors.companyName}</span>
                    ) : null}
                  </label>
                ) : (
                  <p className={styles.fieldHint}>
                    Select company account type to reveal company name field.
                  </p>
                )}
              </div>
            ) : (
              <label className={styles.fieldLabel}>
                notes
                <textarea
                  className={styles.jsonEditor}
                  onChange={(event) => {
                    form.setValue("notes", event.target.value);
                  }}
                  value={toInputValue(form.values("notes"))}
                />
                {snapshot.errors.notes ? (
                  <span className={styles.errorText}>{snapshot.errors.notes}</span>
                ) : null}
              </label>
            )}

            <div className={styles.buttonRow}>
              <button
                className={styles.secondaryButton}
                disabled={!workflow.canGoPrev}
                onClick={() => {
                  form.workflow.prev();
                  push("workflow.prev()");
                }}
                type="button"
              >
                Previous
              </button>
              <button
                className={styles.primaryButton}
                disabled={!workflow.canGoNext}
                onClick={() => {
                  void form.workflow.next().then((advanced) => {
                    push(
                      advanced
                        ? "workflow.next() advanced"
                        : "workflow.next() blocked by validation",
                    );
                  });
                }}
                type="button"
              >
                Next
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  form.reset();
                  push("form.reset()");
                }}
                type="button"
              >
                Reset form
              </button>
            </div>
            <p className={styles.fieldHint}>Active step fields: {stepFields.join(", ")}</p>
          </Card>
        </div>

        <Card
          description="Autosave, draft restore, and navigation events."
          title="Workflow event log"
        >
          <div className={styles.buttonRow}>
            <button className={styles.secondaryButton} onClick={clear} type="button">
              Clear log
            </button>
          </div>
          <EventLog entries={entries} />
        </Card>
      </div>
    </PageContainer>
  );
}
