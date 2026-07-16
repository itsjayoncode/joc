import { useMemo, useState } from "react";

import type { ValidationMode } from "@jayoncode/form-intelligent";

import styles from "./Pages.module.css";
import { EventLog } from "../components/playground/EventLog.js";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { FieldMetaTable } from "../components/playground/FieldMetaTable.js";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useEventLog } from "../hooks/useEventLog.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import {
  createForm,
  currency,
  email,
  minLength,
  phone,
  regex,
  required,
} from "../lib/form-intelligent.js";
import {
  asyncAvailabilityCheck,
  matchesField,
  passwordStrength,
} from "../lib/playground-validators.js";
import { toInputValue } from "../utils/field-value.js";

const VALIDATION_MODES: readonly ValidationMode[] = ["onChange", "onBlur", "onSubmit"];

export function ValidationPage() {
  const [mode, setMode] = useState<ValidationMode>("onBlur");
  const { clear, entries, push } = useEventLog();

  const form = useMemo(
    () =>
      createForm({
        initialValues: {
          email: "",
          phone: "",
          amount: "",
          username: "",
          password: "",
          confirmPassword: "",
        },
        validateOn: mode,
        validators: {
          email: [required, email],
          phone: [required],
          amount: [required, regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount (e.g. 19.99).")],
          username: [required, asyncAvailabilityCheck(800)],
          password: [required, minLength(8), passwordStrength],
          confirmPassword: [required, matchesField("password", "Passwords must match.")],
        },
        onSubmit: (values) => {
          push(`submit succeeded with ${values.email}`);
        },
      }),
    [mode, push],
  );

  const snapshot = useFormSnapshot(form);

  const fieldRows = (
    ["email", "phone", "amount", "username", "password", "confirmPassword"] as const
  ).map((path) => ({
    path,
    touched: Boolean(snapshot.touched[path]),
    dirty: Boolean(snapshot.dirty[path]),
    visited: Boolean(snapshot.visited[path]),
    error: snapshot.errors[path],
  }));

  return (
    <PageContainer
      description="Built-in validators, async checks, cross-field rules, and validation timing — all without a UI framework."
      eyebrow="Validation"
      title="Validation Playground"
    >
      <ExplainPanel title="What you are testing">
        <ul className={styles.logList}>
          <li>Built-in validators: required, email, minLength, currency</li>
          <li>Phone formatting via field().format(phone)</li>
          <li>Async username availability (simulated API delay)</li>
          <li>Cross-field confirm password rule</li>
          <li>Validation timing: onChange, onBlur, or onSubmit</li>
        </ul>
      </ExplainPanel>

      <div className={styles.explorerLayout}>
        <div className={styles.stack}>
          <Card
            description="Switch when validators run. The form instance is recreated when timing changes."
            title="Validation timing"
          >
            <div className={styles.toggleGroup}>
              {VALIDATION_MODES.map((option) => (
                <button
                  className={option === mode ? styles.choiceButtonActive : styles.choiceButton}
                  key={option}
                  onClick={() => {
                    setMode(option);
                    push(`validateOn set to ${option}`);
                  }}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </Card>

          <Card
            description="Plain HTML inputs bound through field().bind()."
            title="Interactive form"
          >
            <div className={styles.formGrid}>
              <label className={styles.fieldLabel}>
                email
                <input
                  className={styles.textInput}
                  name="email"
                  onBlur={() => {
                    form.field("email").setTouched();
                    void form.validate({ paths: ["email"] });
                    push("blur email");
                  }}
                  onChange={(event) => {
                    form.setValue("email", event.target.value);
                    push(`change email → ${event.target.value || "(empty)"}`);
                  }}
                  value={toInputValue(form.values("email"))}
                />
                {snapshot.errors.email ? (
                  <span className={styles.errorText}>{snapshot.errors.email}</span>
                ) : null}
              </label>

              <label className={styles.fieldLabel}>
                phone (formatted)
                <input
                  className={styles.textInput}
                  onChange={(event) => {
                    form.field("phone", { format: phone }).setValue(event.target.value);
                    push("change phone");
                  }}
                  value={toInputValue(form.values("phone"))}
                />
                {snapshot.errors.phone ? (
                  <span className={styles.errorText}>{snapshot.errors.phone}</span>
                ) : null}
              </label>

              <label className={styles.fieldLabel}>
                amount (currency)
                <input
                  className={styles.textInput}
                  onChange={(event) => {
                    form.field("amount", { format: currency }).setValue(event.target.value);
                    push("change amount");
                  }}
                  value={toInputValue(form.values("amount"))}
                />
                {snapshot.errors.amount ? (
                  <span className={styles.errorText}>{snapshot.errors.amount}</span>
                ) : null}
              </label>

              <label className={styles.fieldLabel}>
                username (async)
                <input
                  className={styles.textInput}
                  onBlur={() => {
                    form.field("username").setTouched();
                    void form.validate({ paths: ["username"] });
                    push("blur username → async check");
                  }}
                  onChange={(event) => {
                    form.setValue("username", event.target.value);
                    push("change username");
                  }}
                  value={toInputValue(form.values("username"))}
                />
                {snapshot.fieldMeta.username?.isValidating ? (
                  <span className={styles.fieldHint}>Checking…</span>
                ) : null}
                {snapshot.errors.username ? (
                  <span className={styles.errorText}>{snapshot.errors.username}</span>
                ) : null}
                <span className={styles.fieldHint}>
                  Try admin, root, or jay to trigger async failure.
                </span>
              </label>

              <label className={styles.fieldLabel}>
                password
                <input
                  className={styles.textInput}
                  onChange={(event) => {
                    form.setValue("password", event.target.value);
                    push("change password");
                  }}
                  type="password"
                  value={toInputValue(form.values("password"))}
                />
                {snapshot.errors.password ? (
                  <span className={styles.errorText}>{snapshot.errors.password}</span>
                ) : null}
              </label>

              <label className={styles.fieldLabel}>
                confirm password
                <input
                  className={styles.textInput}
                  onChange={(event) => {
                    form.setValue("confirmPassword", event.target.value);
                    push("change confirmPassword");
                  }}
                  type="password"
                  value={toInputValue(form.values("confirmPassword"))}
                />
                {snapshot.errors.confirmPassword ? (
                  <span className={styles.errorText}>{snapshot.errors.confirmPassword}</span>
                ) : null}
              </label>
            </div>

            <div className={styles.buttonRow}>
              <button
                className={styles.primaryButton}
                onClick={() => {
                  void form.validate().then((ok) => {
                    push(ok ? "validate → valid" : "validate → errors present");
                  });
                }}
                type="button"
              >
                Run validate()
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  void form.submit();
                  push("submit requested");
                }}
                type="button"
              >
                Submit
              </button>
            </div>
          </Card>
        </div>

        <div className={styles.inspectorStack}>
          <Card
            description="Per-field touched, dirty, visited, and current error message."
            title="Field meta inspector"
          >
            <FieldMetaTable rows={fieldRows} />
          </Card>

          <Card description="Recent validation-related activity in this session." title="Event log">
            <div className={styles.buttonRow}>
              <button className={styles.secondaryButton} onClick={clear} type="button">
                Clear log
              </button>
            </div>
            <EventLog entries={entries} />
          </Card>

          <Card
            description="Custom validator with access to full form values."
            title="Cross-field code"
          >
            <CodeBlock
              code={`validators: {\n  confirmPassword: [\n    required,\n    matchesField("password", "Passwords must match."),\n  ],\n}`}
              language="typescript"
            />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
