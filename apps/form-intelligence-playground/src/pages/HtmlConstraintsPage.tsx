import { useEffect, useMemo, useState } from "react";

import styles from "./Pages.module.css";
import { EventLog } from "../components/playground/EventLog.js";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { FieldMetaTable } from "../components/playground/FieldMetaTable.js";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useEventLog } from "../hooks/useEventLog.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { createForm, minLength } from "../lib/form-intelligence.js";

type ModeId = "html-only" | "field-override";

const MODES: readonly { id: ModeId; label: string }[] = [
  { id: "html-only", label: "HTML only" },
  { id: "field-override", label: "Field overrides HTML" },
];

const CODE_HTML_ONLY = `createForm({
  // no validators / schema — constraints come from the DOM
  validateOn: "onBlur",
  onSubmit,
});

<form ref={form.ref}>
  <input name="email" required type="email" />
  <input
    name="username"
    required
    minLength={3}
    maxLength={12}
    pattern="[a-z0-9_]+"
  />
  <input name="website" type="url" />
</form>`;

const CODE_OVERRIDE = `createForm({
  validators: {
    // Field > HTML for kind minLength (HTML still has minlength="3")
    username: [minLength(5)],
  },
  validateOn: "onBlur",
  onSubmit,
});`;

export function HtmlConstraintsPage() {
  const [mode, setMode] = useState<ModeId>("html-only");
  const { clear, entries, push } = useEventLog();

  const form = useMemo(() => {
    const instance = createForm({
      initialValues: {
        email: "",
        username: "",
        website: "",
      },
      validateOn: "onBlur",
      ...(mode === "field-override"
        ? {
            validators: {
              username: [minLength(5)],
            },
          }
        : {}),
      onSubmit: (values) => {
        push(`submit ok — ${values.email} / ${values.username}`);
      },
    });
    return instance;
  }, [mode, push]);

  useEffect(() => () => form.destroy(), [form]);

  const snapshot = useFormSnapshot(form);
  const presentation = {
    email: form.getPresentation("email").field.required,
    username: form.getPresentation("username").field.required,
    website: form.getPresentation("website").field.required,
  };

  const fieldRows = (["email", "username", "website"] as const).map((path) => ({
    path,
    touched: Boolean(snapshot.touched[path]),
    dirty: Boolean(snapshot.dirty[path]),
    visited: Boolean(snapshot.visited[path]),
    error: snapshot.errors[path],
  }));

  return (
    <PageContainer
      compact
      description="DOM-backed forms — Phase 1 HTML attributes become Form Intelligence validators on attach. Browser validation stays off (novalidate)."
      eyebrow="Validation · Adapters"
      title="HTML Constraints"
    >
      <ExplainPanel title="What you are testing">
        <ul className={styles.logList}>
          <li>
            <code>form.ref</code> attach extracts <code>required</code>, <code>minlength</code>,{" "}
            <code>maxlength</code>, <code>pattern</code>, <code>type=email|url</code>
          </li>
          <li>
            Native validation UI is disabled; FI owns messages (try submit / blur with empty
            fields)
          </li>
          <li>
            HTML <code>required</code> seeds Presentation required (ARIA / inspector)
          </li>
          <li>
            Toggle <strong>Field overrides HTML</strong> — <code>minLength(5)</code> wins over
            HTML <code>minlength=&quot;3&quot;</code>
          </li>
        </ul>
      </ExplainPanel>

      <div className={styles.explorerLayout}>
        <div className={styles.stack}>
          <Card
            description="Recreates the form instance. HTML attributes on the inputs stay the same."
            title="Merge mode"
          >
            <div className={styles.toggleGroup}>
              {MODES.map((option) => (
                <button
                  className={option.id === mode ? styles.choiceButtonActive : styles.choiceButton}
                  key={option.id}
                  onClick={() => {
                    setMode(option.id);
                    push(`mode → ${option.id}`);
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className={styles.fieldHint}>
              {mode === "html-only"
                ? "No createForm validators — username needs ≥ 3 characters from HTML."
                : "Field minLength(5) overrides HTML minlength=3 for username."}
            </p>
          </Card>

          <Card
            description="Uncontrolled inputs — the DOM enhancer owns values after form.ref attach."
            title="Native form (attributes = config)"
          >
            <form
              className={styles.formGrid}
              onSubmit={(event) => {
                event.preventDefault();
                void form.submit().then((ok) => {
                  push(ok ? "submit allowed" : "submit blocked by validation");
                });
              }}
              ref={form.ref}
            >
              <label className={styles.fieldLabel}>
                email
                <span className={styles.fieldHint}>required · type=&quot;email&quot;</span>
                <input className={styles.textInput} name="email" required type="email" />
                {snapshot.errors.email ? (
                  <span className={styles.errorText}>{snapshot.errors.email}</span>
                ) : null}
              </label>

              <label className={styles.fieldLabel}>
                username
                <span className={styles.fieldHint}>
                  required · minLength=3 · maxLength=12 · pattern=[a-z0-9_]+
                </span>
                <input
                  className={styles.textInput}
                  maxLength={12}
                  minLength={3}
                  name="username"
                  pattern="[a-z0-9_]+"
                  required
                />
                {snapshot.errors.username ? (
                  <span className={styles.errorText}>{snapshot.errors.username}</span>
                ) : null}
              </label>

              <label className={styles.fieldLabel}>
                website
                <span className={styles.fieldHint}>optional · type=&quot;url&quot;</span>
                <input className={styles.textInput} name="website" type="url" />
                {snapshot.errors.website ? (
                  <span className={styles.errorText}>{snapshot.errors.website}</span>
                ) : null}
              </label>

              <div className={styles.buttonRow}>
                <button className={styles.primaryButton} type="submit">
                  Submit
                </button>
                <button
                  className={styles.secondaryButton}
                  onClick={() => {
                    form.reset();
                    push("reset");
                  }}
                  type="button"
                >
                  Reset
                </button>
              </div>
            </form>
          </Card>

          <Card description="Snippet for the active merge mode." title="Code">
            <CodeBlock code={mode === "html-only" ? CODE_HTML_ONLY : CODE_OVERRIDE} />
          </Card>
        </div>

        <div className={styles.inspectorStack}>
          <Card
            description="Presentation required baseline after HTML attach (018)."
            title="Presentation required"
          >
            <pre className={styles.inspectorPre}>{JSON.stringify(presentation, null, 2)}</pre>
          </Card>

          <Card title="Field meta">
            <FieldMetaTable rows={fieldRows} />
          </Card>

          <Card title="Values">
            <pre className={styles.inspectorPre}>
              {JSON.stringify(snapshot.values, null, 2)}
            </pre>
          </Card>

          <Card
            description="Blur or submit to validate."
            title="Activity"
          >
            <div className={styles.buttonRow}>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  clear();
                }}
                type="button"
              >
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
