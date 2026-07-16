import { useMemo, useState } from "react";

import { diff, hasChanges } from "@jayoncode/object-diff";

import styles from "./Pages.module.css";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { FieldMetaTable } from "../components/playground/FieldMetaTable.js";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { createForm, when } from "../lib/form-intelligent.js";
import { toInputValue } from "../utils/field-value.js";

interface SnapshotRecord {
  readonly id: string;
  readonly label: string;
  readonly state: ReturnType<ReturnType<typeof createForm>["getFormState"]>;
}

export function StateExplorerPage() {
  type StateValues = {
    name: string;
    email: string;
    role: string;
    country: string;
    province: string;
  };

  const form = useMemo(
    () =>
      createForm<StateValues>({
        initialValues: { name: "", email: "", role: "member", country: "", province: "" },
        validators: {
          name: [(value) => (value ? true : "Required")],
          email: [(value) => (String(value).includes("@") ? true : "Invalid email")],
        },
        rules: [
          when<StateValues>("country")
            .changes((country) =>
              country === "PH"
                ? [
                    { label: "Laguna", value: "Laguna" },
                    { label: "Batangas", value: "Batangas" },
                  ]
                : [],
            )
            .populate("province")
            .build(),
        ],
        workflow: { analytics: { enabled: true } },
      }),
    [],
  );

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

  const fieldRows = (["name", "email", "role", "country", "province"] as const).map((path) => ({
    path,
    touched: Boolean(snapshot.touched[path]),
    dirty: Boolean(snapshot.dirty[path]),
    visited: Boolean(snapshot.visited[path]),
    error: snapshot.errors[path],
    validating: Boolean(snapshot.fieldMeta[path]?.isValidating),
  }));

  return (
    <PageContainer
      description="Live values, fieldUi, fieldMeta, fieldOptions, submissionQueue, undo/redo, and object-diff snapshots."
      eyebrow="State"
      title="State Explorer"
    >
      <ExplainPanel
        body="Form Intelligent exposes the full form OS state: values, errors, fieldUi, formUi.submitDisabled, fieldMeta.isValidating, fieldOptions, and submissionQueue."
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
            <label className={styles.fieldLabel}>
              country
              <select
                className={styles.textInput}
                onChange={(event) => {
                  form.setValue("country", event.target.value);
                }}
                value={toInputValue(form.values("country"))}
              >
                <option value="">—</option>
                <option value="PH">Philippines</option>
              </select>
            </label>
            <label className={styles.fieldLabel}>
              province
              <select
                className={styles.textInput}
                onChange={(event) => {
                  form.setValue("province", event.target.value);
                }}
                value={toInputValue(form.values("province"))}
              >
                <option value="">—</option>
                {(snapshot.fieldOptions.province ?? []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
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
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  form.undo();
                }}
                type="button"
              >
                Undo
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  form.redo();
                }}
                type="button"
              >
                Redo
              </button>
            </div>
            <p className={styles.fieldHint}>
              isDirty: {String(snapshot.isDirty)} · changed:{" "}
              {form.changedFields().join(", ") || "—"}
            </p>
          </Card>

          <Card description="Flags, errors, and async validating state." title="Field flags">
            <FieldMetaTable rows={fieldRows} />
          </Card>

          <Card title="Form OS slices">
            <p className={styles.fieldHint}>
              submitDisabled: {String(snapshot.formUi.submitDisabled)}
            </p>
            <p className={styles.fieldHint}>
              queue: pending {snapshot.submissionQueue.pending}, flushing{" "}
              {String(snapshot.submissionQueue.flushing)}
            </p>
            <CodeBlock
              code={JSON.stringify(
                {
                  fieldUi: snapshot.fieldUi,
                  fieldOptions: snapshot.fieldOptions,
                },
                null,
                2,
              )}
              language="json"
            />
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
