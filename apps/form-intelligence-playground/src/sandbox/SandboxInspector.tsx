import { useMemo } from "react";

import styles from "./Sandbox.module.css";
import { useSandbox } from "./SandboxContext.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";

import type { InspectorTab } from "./types.js";

const TABS: readonly { id: InspectorTab; label: string }[] = [
  { id: "field", label: "Field" },
  { id: "form", label: "Form" },
  { id: "events", label: "Events" },
  { id: "performance", label: "Perf" },
  { id: "code", label: "Code" },
];

function Flag({ value }: { readonly value: boolean }) {
  return <span className={value ? styles.flagTrue : styles.flagFalse}>{String(value)}</span>;
}

export function SandboxInspector() {
  const {
    form,
    selectedPath,
    inspectorTab,
    setInspectorTab,
    eventEntries,
    clearEvents,
    generatedCode,
    config,
    fieldPaths,
  } = useSandbox();
  const snapshot = useFormSnapshot(form);

  const lastValidationMs = useMemo(() => {
    const hit = eventEntries.find(
      (entry) => entry.event === "validated" && entry.durationMs !== undefined,
    );
    return hit?.durationMs ?? null;
  }, [eventEntries]);

  const path = selectedPath;
  const fieldUi = path ? snapshot.fieldUi[path] : undefined;
  const fieldMeta = path ? snapshot.fieldMeta[path] : undefined;
  const error = path ? snapshot.errors[path] : undefined;

  return (
    <aside className={styles.inspector}>
      <div className={styles.tabs} role="tablist">
        {TABS.map((tab) => (
          <button
            aria-selected={inspectorTab === tab.id}
            className={inspectorTab === tab.id ? styles.tabActive : styles.tab}
            key={tab.id}
            onClick={() => {
              setInspectorTab(tab.id);
            }}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.inspectorBody}>
        {inspectorTab === "field" ? (
          path ? (
            <>
              <p className={styles.hint}>Selected: {path}</p>
              <dl className={styles.kv}>
                <dt>Value</dt>
                <dd>{JSON.stringify(path ? form.values(path) : null)}</dd>
                <dt>Error</dt>
                <dd>{error ?? "—"}</dd>
                <dt>showError</dt>
                <dd>
                  <Flag value={Boolean(path && form.field(path).ui.showError)} />
                </dd>
                <dt>status</dt>
                <dd>{path ? form.field(path).ui.status : "—"}</dd>
                <dt>Touched</dt>
                <dd>
                  <Flag value={Boolean(path && snapshot.touched[path])} />
                </dd>
                <dt>Dirty</dt>
                <dd>
                  <Flag value={Boolean(path && snapshot.dirty[path])} />
                </dd>
                <dt>Valid</dt>
                <dd>
                  <Flag value={!error && !fieldMeta?.isValidating} />
                </dd>
                <dt>Invalid</dt>
                <dd>
                  <Flag value={Boolean(error)} />
                </dd>
                <dt>Validating</dt>
                <dd>
                  <Flag value={Boolean(fieldMeta?.isValidating)} />
                </dd>
                <dt>Required</dt>
                <dd>
                  <Flag value={Boolean(fieldUi?.required)} />
                </dd>
                <dt>Visible</dt>
                <dd>
                  <Flag value={fieldUi?.visible !== false} />
                </dd>
                <dt>Disabled</dt>
                <dd>
                  <Flag value={Boolean(fieldUi?.disabled)} />
                </dd>
                <dt>Readonly</dt>
                <dd>
                  <Flag value={path === "total" || path === "tax"} />
                </dd>
                <dt>Last validation</dt>
                <dd>{lastValidationMs !== null ? `${String(lastValidationMs)}ms` : "—"}</dd>
              </dl>
            </>
          ) : (
            <p className={styles.hint}>Select a field on the canvas.</p>
          )
        ) : null}

        {inspectorTab === "form" ? (
          <>
            <dl className={styles.kv}>
              <dt>canSubmit</dt>
              <dd>
                <Flag value={form.ui.canSubmit} />
              </dd>
              <dt>submissionGuard</dt>
              <dd>
                <Flag value={form.submissionGuard().allowed} />
                {form.submissionGuard().reasons.length > 0
                  ? ` (${form.submissionGuard().reasons.join(", ")})`
                  : ""}
              </dd>
              <dt>Submit blocked (UX)</dt>
              <dd>
                {form.ui.submitBlockedReasons.length > 0
                  ? form.ui.submitBlockedReasons.join(", ")
                  : "—"}
              </dd>
              <dt>Submitting</dt>
              <dd>
                <Flag value={snapshot.isSubmitting} />
              </dd>
              <dt>Valid</dt>
              <dd>
                <Flag value={snapshot.isValid} />
              </dd>
              <dt>Invalid</dt>
              <dd>
                <Flag value={!snapshot.isValid} />
              </dd>
              <dt>Dirty</dt>
              <dd>
                <Flag value={snapshot.isDirty} />
              </dd>
              <dt>Validating</dt>
              <dd>
                <Flag value={snapshot.isValidating} />
              </dd>
              <dt>Submit phase</dt>
              <dd>{snapshot.submitPhase}</dd>
              <dt>Submit count</dt>
              <dd>{String(snapshot.submitCount)}</dd>
              <dt>Current step</dt>
              <dd>
                {String(snapshot.workflow.currentStep + 1)} /{" "}
                {String(snapshot.workflow.totalSteps || 1)}
              </dd>
              <dt>Registered fields</dt>
              <dd>{String(fieldPaths.length)}</dd>
              <dt>Active plugins</dt>
              <dd>
                {[
                  config.draft && "draft",
                  config.autosave && "autosave",
                  config.wizard && "wizard",
                  config.offlineQueue && "offline",
                  config.undoRedo && "history",
                  config.formatters && "formatter",
                ]
                  .filter(Boolean)
                  .join(", ") || "none"}
              </dd>
            </dl>
            <p className={styles.hint}>Hard guard</p>
            <pre className={styles.pre}>{JSON.stringify(form.submissionGuard(), null, 2)}</pre>
            <p className={styles.hint}>Why can’t I submit? (UX explain)</p>
            <pre className={styles.pre}>{JSON.stringify(form.ui.explain("submit"), null, 2)}</pre>
            <p className={styles.hint}>Values</p>
            <pre className={styles.pre}>{JSON.stringify(snapshot.values, null, 2)}</pre>
            <p className={styles.hint}>Errors</p>
            <pre className={styles.pre}>{JSON.stringify(snapshot.errors, null, 2)}</pre>
            <p className={styles.hint}>Touched</p>
            <pre className={styles.pre}>{JSON.stringify(snapshot.touched, null, 2)}</pre>
          </>
        ) : null}

        {inspectorTab === "events" ? (
          <>
            <div className={styles.sectionHead}>
              <p className={styles.hint} style={{ margin: 0 }}>
                Live event stream
              </p>
              <button className={styles.chip} onClick={clearEvents} type="button">
                Clear
              </button>
            </div>
            <ul className={styles.eventList}>
              {eventEntries.map((entry) => (
                <li className={styles.eventItem} key={entry.id}>
                  <span className={styles.eventTime}>{entry.at}</span>
                  <strong>{entry.event}</strong>
                  {entry.durationMs !== undefined ? ` · ${String(entry.durationMs)}ms` : ""}
                </li>
              ))}
              {eventEntries.length === 0 ? (
                <li className={styles.eventItem}>No events yet — interact with the form.</li>
              ) : null}
            </ul>
          </>
        ) : null}

        {inspectorTab === "performance" ? (
          <div className={styles.metricGrid}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Validation</span>
              <div className={styles.metricValue}>
                {lastValidationMs !== null ? `${String(lastValidationMs)}ms` : "—"}
              </div>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Fields</span>
              <div className={styles.metricValue}>{String(fieldPaths.length)}</div>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Events logged</span>
              <div className={styles.metricValue}>{String(eventEntries.length)}</div>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Submit latency</span>
              <div className={styles.metricValue}>{String(config.mockLatencyMs)}ms</div>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Async debounce</span>
              <div className={styles.metricValue}>{String(config.asyncDebounceMs)}ms</div>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Autosaving</span>
              <div className={styles.metricValue}>
                {snapshot.workflow.isAutosaving ? "yes" : "no"}
              </div>
            </div>
          </div>
        ) : null}

        {inspectorTab === "code" ? (
          <>
            <p className={styles.hint}>Exact code to recreate this sandbox state.</p>
            <CodeBlock code={generatedCode} language="typescript" showCopy title="createForm" />
            <button
              className={styles.chip}
              disabled
              style={{ marginTop: "0.5rem" }}
              title="Coming soon"
              type="button"
            >
              Open in StackBlitz
            </button>
          </>
        ) : null}
      </div>
    </aside>
  );
}
