import { useMemo, useRef, useState } from "react";

import styles from "./Pages.module.css";
import { EventLog } from "../components/playground/EventLog.js";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { SubmitExplainCard } from "../components/playground/SubmitExplainCard.js";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useEventLog } from "../hooks/useEventLog.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { createForm, required, ui } from "../lib/form-intelligence.js";
import { toInputValue } from "../utils/field-value.js";

const OFFLINE_STORAGE_KEY = "joc.form-intelligence-playground.submission-offline";

export function SubmissionPage() {
  const { clear, entries, push } = useEventLog();
  const [flakyMode, setFlakyMode] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const submitGeneration = useRef(0);
  const activeSubmit = useRef(0);

  const form = useMemo(
    () =>
      createForm({
        initialValues: { message: "" },
        validators: { message: [required] },
        plugins: [ui()],
        workflow: {
          offlineQueue: {
            enabled: true,
            storageKey: OFFLINE_STORAGE_KEY,
          },
        },
        onSubmit: async (values) => {
          const generation = ++submitGeneration.current;
          activeSubmit.current = generation;

          push(`onSubmit started (gen ${String(generation)})`);
          await new Promise((resolve) => setTimeout(resolve, 900));

          if (activeSubmit.current !== generation) {
            push(`onSubmit ignored — cancelled (gen ${String(generation)})`);
            return;
          }

          if (flakyMode && Math.random() < 0.45) {
            throw new Error("Simulated API failure");
          }

          push(`onSubmit succeeded: ${String(values.message)}`);
        },
        onSubmitError: (error) => {
          push(`onSubmitError: ${error instanceof Error ? error.message : "unknown error"}`);
        },
      }),
    [flakyMode, push],
  );

  const snapshot = useFormSnapshot(form);

  const runSubmit = async () => {
    if (offlineMode) {
      Object.defineProperty(window.navigator, "onLine", {
        configurable: true,
        value: false,
      });
    } else {
      Object.defineProperty(window.navigator, "onLine", {
        configurable: true,
        value: true,
      });
    }

    const ok = await form.submit();
    if (!ok && !form.submissionGuard().allowed) {
      push(`submit blocked by guard: ${form.submissionGuard().reasons.join(", ") || "unknown"}`);
      return;
    }
    if (offlineMode) {
      push(
        ok
          ? `engine queued submit (pending ${String(form.state.submissionQueue.pending)})`
          : "submit blocked",
      );
      return;
    }

    push(ok ? "submit() resolved true" : "submit() resolved false");
  };

  const flushQueue = async () => {
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true,
    });

    const result = await form.flushOfflineQueue();
    push(`flush queue — flushed ${String(result.flushed)}, failed ${String(result.failed)}`);
  };

  const cancelInFlight = () => {
    activeSubmit.current = -1;
    push("cancel requested — in-flight handler will no-op when it resumes");
  };

  return (
    <PageContainer
      compact
      description="Submit lifecycle, hard submissionGuard(), form.ui.canSubmit projection, offline queue, and cancel simulation."
      eyebrow="Submission"
      title="Submission Playground"
    >
      <ExplainPanel title="What you are testing">
        <ul className={styles.logList}>
          <li>
            <code>form.ui.canSubmit</code> drives the button (UX) — not a security boundary
          </li>
          <li>
            <code>form.submissionGuard()</code> is enforced inside <code>submit()</code> (hard)
          </li>
          <li>
            Second <code>submit()</code> returns false while the first is in flight
          </li>
          <li>Flaky mode randomly throws to exercise onSubmitError</li>
          <li>Offline mode uses workflow.offlineQueue — flush via form.flushOfflineQueue()</li>
          <li>Cancel bumps a generation counter so late responses are ignored</li>
        </ul>
      </ExplainPanel>

      <div className={styles.explorerLayout}>
        <div className={styles.stack}>
          <Card description="Toggle simulated network behavior." title="Scenario controls">
            <div className={styles.statusRow}>
              <button
                className={flakyMode ? styles.choiceButtonActive : styles.choiceButton}
                onClick={() => {
                  setFlakyMode((value) => !value);
                  push(flakyMode ? "flaky API disabled" : "flaky API enabled");
                }}
                type="button"
              >
                Flaky API {flakyMode ? "on" : "off"}
              </button>
              <button
                className={offlineMode ? styles.choiceButtonActive : styles.choiceButton}
                onClick={() => {
                  setOfflineMode((value) => !value);
                  push(offlineMode ? "offline mode disabled" : "offline mode enabled");
                }}
                type="button"
              >
                Offline queue {offlineMode ? "on" : "off"}
              </button>
            </div>
            <p className={styles.fieldHint}>
              Submit count: {String(snapshot.submitCount)} · Engine queue:{" "}
              {String(snapshot.submissionQueue.pending)}
              {snapshot.submissionQueue.flushing ? " (flushing)" : ""}
            </p>
          </Card>

          <Card description="Submit triggers the async onSubmit handler." title="Submit demo">
            <label className={styles.fieldLabel}>
              message
              <input
                className={styles.textInput}
                onChange={(event) => {
                  form.setValue("message", event.target.value);
                }}
                value={toInputValue(form.values("message"))}
              />
            </label>
            <SubmitExplainCard form={form} />
            <div className={styles.buttonRow}>
              <button
                className={styles.primaryButton}
                disabled={!form.ui.canSubmit}
                onClick={() => {
                  void runSubmit();
                }}
                type="button"
              >
                {snapshot.isSubmitting ? "Submitting…" : offlineMode ? "Queue submit" : "Submit"}
              </button>
              <button
                className={styles.secondaryButton}
                disabled={!form.ui.canSubmit}
                onClick={() => {
                  void form.submit();
                  void form.submit().then((second) => {
                    push(second ? "unexpected second submit success" : "duplicate submit blocked");
                  });
                }}
                type="button"
              >
                Test double submit
              </button>
              <button className={styles.secondaryButton} onClick={cancelInFlight} type="button">
                Cancel in-flight
              </button>
              {offlineMode ? (
                <button
                  className={styles.secondaryButton}
                  onClick={() => {
                    void flushQueue();
                  }}
                  type="button"
                >
                  Flush queue
                </button>
              ) : null}
            </div>
            <div className={styles.statusRow}>
              <span
                className={snapshot.isSubmitting ? styles.statusBadgeActive : styles.statusBadge}
              >
                {snapshot.isSubmitting ? "loading" : "idle"}
              </span>
              {offlineMode ? <span className={styles.statusBadge}>offline</span> : null}
              {flakyMode ? <span className={styles.statusBadge}>flaky</span> : null}
            </div>
          </Card>
        </div>

        <Card description="Chronological submit lifecycle events." title="Submission event log">
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
