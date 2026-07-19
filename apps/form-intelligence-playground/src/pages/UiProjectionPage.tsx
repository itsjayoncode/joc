import { useEffect, useMemo, useState } from "react";

import styles from "./Pages.module.css";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { SubmitExplainCard } from "../components/playground/SubmitExplainCard.js";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { createForm, email, required, setUiPolicies, ui, when } from "../lib/form-intelligence.js";
import { toInputValue } from "../utils/field-value.js";

import type { UiDisableSubmitWhen, UiErrorDisplay } from "../lib/form-intelligence.js";

const ERROR_DISPLAY_OPTIONS: readonly UiErrorDisplay[] = [
  "touched",
  "submit",
  "always",
  "touchedOrSubmit",
];

const DISABLE_SUBMIT_TOKENS: readonly UiDisableSubmitWhen[] = [
  "submitting",
  "validating",
  "invalid",
  "ruleDisabled",
];

const DEFAULT_DISABLE: readonly UiDisableSubmitWhen[] = [
  "submitting",
  "validating",
  "ruleDisabled",
];

type LabValues = {
  email: string;
  loanAmount: number;
};

/**
 * Interactive lab for `/ui` policies — errorDisplay + disableSubmitWhen —
 * with live field status and submit explain.
 */
export function UiProjectionPage() {
  const [errorDisplay, setErrorDisplay] = useState<UiErrorDisplay>("touched");
  const [disableSubmitWhen, setDisableSubmitWhen] =
    useState<readonly UiDisableSubmitWhen[]>(DEFAULT_DISABLE);
  const [policyTick, setPolicyTick] = useState(0);

  const form = useMemo(
    () =>
      createForm({
        initialValues: { email: "", loanAmount: 0 } satisfies LabValues,
        validators: {
          email: [required, email],
        },
        validateOn: "onChange",
        plugins: [
          ui({
            errorDisplay: "touched",
            disableSubmitWhen: DEFAULT_DISABLE,
          }),
        ],
        rules: [when("loanAmount").greaterThan(500_000).disableSubmit().build()],
        onSubmit: async () => {
          await new Promise((resolve) => setTimeout(resolve, 600));
        },
      }),
    [],
  );

  useEffect(() => {
    return () => {
      form.destroy();
    };
  }, [form]);

  useEffect(() => {
    setUiPolicies(form, { errorDisplay, disableSubmitWhen });
    setPolicyTick((tick) => tick + 1);
  }, [form, errorDisplay, disableSubmitWhen]);

  const snapshot = useFormSnapshot(form);
  // Re-read projection after policy-only changes (no store notify).
  void policyTick;

  const emailUi = form.field("email").ui;
  const showErrorExplain = form.ui.explain("showError", "email");
  const disabledExplain = form.ui.explain("disabled", "email");

  const toggleToken = (token: UiDisableSubmitWhen) => {
    setDisableSubmitWhen((current) =>
      current.includes(token) ? current.filter((item) => item !== token) : [...current, token],
    );
  };

  return (
    <PageContainer
      compact
      description="Toggle errorDisplay and disableSubmitWhen — watch showError, status, and canSubmit update live."
      eyebrow="UI projection"
      title="UI Projection Lab"
    >
      <ExplainPanel title="What you are testing">
        <ul className={styles.logList}>
          <li>
            <code>errorDisplay</code> controls when <code>field.ui.showError</code> becomes true
          </li>
          <li>
            <code>disableSubmitWhen</code> is button UX only — hard <code>submissionGuard()</code>{" "}
            still owns engine refusal
          </li>
          <li>
            Loan amount &gt; 500k applies <code>disableSubmit()</code> (hard{" "}
            <code>ruleDisabled</code>)
          </li>
        </ul>
      </ExplainPanel>

      <div className={styles.explorerLayout}>
        <div className={styles.stack}>
          <Card
            description="Applied via setUiPolicies — same as ui({ … }) at create time."
            title="Policies"
          >
            <div className={styles.preferenceField}>
              <span className={styles.fieldLabel}>errorDisplay</span>
              <div className={styles.toggleGroup} role="group" aria-label="errorDisplay">
                {ERROR_DISPLAY_OPTIONS.map((option) => (
                  <button
                    className={
                      errorDisplay === option ? styles.choiceButtonActive : styles.choiceButton
                    }
                    key={option}
                    onClick={() => {
                      setErrorDisplay(option);
                    }}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.preferenceField}>
              <span className={styles.fieldLabel}>disableSubmitWhen</span>
              <p className={styles.fieldHint}>
                <code>invalid</code> is opt-in — default omits it so submit-click validation works.
              </p>
              <div className={styles.toggleGroup} role="group" aria-label="disableSubmitWhen">
                {DISABLE_SUBMIT_TOKENS.map((token) => {
                  const active = disableSubmitWhen.includes(token);
                  return (
                    <button
                      aria-pressed={active}
                      className={active ? styles.choiceButtonActive : styles.choiceButton}
                      key={token}
                      onClick={() => {
                        toggleToken(token);
                      }}
                      type="button"
                    >
                      {token}
                    </button>
                  );
                })}
              </div>
            </div>

            <pre className={styles.codeBlock}>{JSON.stringify(form.ui.policies, null, 2)}</pre>
          </Card>

          <Card description="Touch, blur, and edit to exercise errorDisplay." title="Live form">
            <div className={styles.formGrid}>
              <label className={styles.fieldLabel}>
                Email
                <input
                  className={styles.textInput}
                  data-fi-status={emailUi.status}
                  name="email"
                  onBlur={() => {
                    form.field("email").setTouched(true);
                  }}
                  onChange={(event) => {
                    form.setValue("email", event.target.value);
                  }}
                  value={toInputValue(snapshot.values.email)}
                />
              </label>
              {emailUi.showError ? (
                <span className={styles.errorText} role="alert">
                  {emailUi.errorMessage ?? snapshot.errors.email}
                </span>
              ) : null}
              <p className={styles.fieldHint}>
                status=<code>{emailUi.status}</code> · showError=
                <code>{String(emailUi.showError)}</code> · hasError=
                <code>{String(emailUi.hasError)}</code>
              </p>

              <label className={styles.fieldLabel}>
                Loan amount
                <input
                  className={styles.textInput}
                  min={0}
                  name="loanAmount"
                  onChange={(event) => {
                    form.setValue("loanAmount", Number(event.target.value) || 0);
                  }}
                  step={1000}
                  type="number"
                  value={toInputValue(snapshot.values.loanAmount)}
                />
              </label>
              <p className={styles.fieldHint}>
                Try <code>600000</code> to trigger rule <code>disableSubmit()</code>
              </p>
            </div>

            <SubmitExplainCard form={form} />

            <div className={styles.buttonRow}>
              <button
                className={styles.primaryButton}
                disabled={!form.ui.canSubmit}
                onClick={() => {
                  void form.submit();
                }}
                type="button"
              >
                {snapshot.isSubmitting ? "Submitting…" : "Submit"}
              </button>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  form.reset();
                }}
                type="button"
              >
                Reset
              </button>
            </div>
          </Card>
        </div>

        <div className={styles.stack}>
          <Card
            description='explain("showError") / explain("disabled") for email.'
            title="Field explain"
          >
            <p className={styles.fieldHint}>
              showError explain · value=<code>{String(showErrorExplain.value)}</code>
            </p>
            <pre className={styles.codeBlock}>{JSON.stringify(showErrorExplain, null, 2)}</pre>
            <p className={styles.fieldHint}>
              disabled explain · value=<code>{String(disabledExplain.value)}</code>
            </p>
            <pre className={styles.codeBlock}>{JSON.stringify(disabledExplain, null, 2)}</pre>
          </Card>

          <Card description="Registration-order collections from form.ui." title="Collections">
            <pre className={styles.codeBlock}>
              {JSON.stringify(
                {
                  invalidFields: form.ui.invalidFields,
                  validatingFields: form.ui.validatingFields,
                  requiredFields: form.ui.requiredFields,
                  visibleFields: form.ui.visibleFields,
                },
                null,
                2,
              )}
            </pre>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
