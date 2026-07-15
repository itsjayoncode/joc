import { useMemo, useState } from "react";

import { diff, hasChanges } from "@jayoncode/object-diff";

import styles from "./Pages.module.css";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { FieldMetaTable } from "../components/playground/FieldMetaTable.js";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { createSampleForm } from "../lib/form-intelligent.js";
import { toInputValue } from "../utils/field-value.js";

interface SnapshotRecord {
  readonly id: string;
  readonly label: string;
  readonly state: ReturnType<ReturnType<typeof createSampleForm>["getFormState"]>;
}

export function StateExplorerPage() {
  const form = useMemo(() => createSampleForm(), []);
  const snapshot = useFormSnapshot(form);
  const [history, setHistory] = useState<readonly SnapshotRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedSnapshot = history.find((item) => item.id === selectedId) ?? null;
  const diffSummary =
    selectedSnapshot && hasChanges(selectedSnapshot.state.values, snapshot.values)
      ? diff(selectedSnapshot.state.values, snapshot.values)
      : null;

  const captureSnapshot = () => {
    const record: SnapshotRecord = {
      id: `snap-${String(Date.now())}`,
      label: new Date().toLocaleTimeString(),
      state: form.getFormState(),
    };
    setHistory((current) => [record, ...current].slice(0, 12));
    setSelectedId(record.id);
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
  };

  const fieldRows = (["name", "email", "role"] as const).map((path) => ({
    path,
    touched: Boolean(snapshot.touched[path]),
    dirty: Boolean(snapshot.dirty[path]),
    visited: Boolean(snapshot.visited[path]),
    error: snapshot.errors[path],
  }));

  return (
    <PageContainer
      description="Live values, field meta flags, snapshot history, and optional object-diff between captures."
      eyebrow="State"
      title="State Explorer"
    >
      <ExplainPanel
        body="Form Intelligent exposes the entire form state for debugging and DevTools-style panels. Snapshot history lets you compare how values changed over time using @jayoncode/object-diff."
        title="Why inspect state?"
      />

      <div className={styles.explorerLayout}>
        <div className={styles.stack}>
          <Card description="Edit fields to update the live state tree." title="Interactive fields">
            {(["name", "email", "role"] as const).map((path) => (
              <label className={styles.fieldLabel} key={path}>
                {path}
                <input
                  className={styles.textInput}
                  onChange={(event) => {
                    form.setValue(path, event.target.value);
                  }}
                  value={toInputValue(form.values(path))}
                />
              </label>
            ))}
            <div className={styles.buttonRow}>
              <button className={styles.primaryButton} onClick={captureSnapshot} type="button">
                Capture snapshot
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  void copyJson();
                }}
                type="button"
              >
                Copy JSON
              </button>
            </div>
          </Card>

          <Card description="touched, dirty, visited, and error per field." title="Field flags">
            <FieldMetaTable rows={fieldRows} />
          </Card>
        </div>

        <div className={styles.inspectorStack}>
          <Card description="Full getFormState() output." title="Live state JSON">
            <CodeBlock code={JSON.stringify(snapshot, null, 2)} language="json" />
          </Card>

          <Card
            description="Select a snapshot to diff against the current values."
            title="Snapshot history"
          >
            {history.length === 0 ? (
              <p className={styles.fieldHint}>
                No snapshots yet — capture one to start a timeline.
              </p>
            ) : (
              <ul className={styles.snapshotList}>
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      className={
                        item.id === selectedId ? styles.snapshotButtonActive : styles.snapshotButton
                      }
                      onClick={() => {
                        setSelectedId(item.id);
                      }}
                      type="button"
                    >
                      {item.label} · {JSON.stringify(item.state.values)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {diffSummary ? (
              <CodeBlock code={JSON.stringify(diffSummary.changes, null, 2)} language="json" />
            ) : selectedSnapshot ? (
              <p className={styles.fieldHint}>No value changes since selected snapshot.</p>
            ) : null}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
