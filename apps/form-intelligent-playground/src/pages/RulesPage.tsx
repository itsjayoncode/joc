import { useMemo } from "react";
import { Link } from "react-router-dom";

import styles from "./Pages.module.css";
import { EventLog } from "../components/playground/EventLog.js";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { SandboxCue } from "../components/playground/SandboxCue.js";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useEventLog } from "../hooks/useEventLog.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { createForm, when } from "../lib/form-intelligent.js";
import { toInputValue } from "../utils/field-value.js";

type RulesValues = {
  customerType: string;
  companyName: string;
  taxNumber: string;
  loanAmount: number;
  managerApproval: string;
};

export function RulesPage() {
  const { clear, entries, push } = useEventLog();

  const form = useMemo(
    () =>
      createForm<RulesValues>({
        initialValues: {
          customerType: "Personal",
          companyName: "",
          taxNumber: "",
          loanAmount: 0,
          managerApproval: "",
        },
        rules: [
          when<RulesValues>("customerType")
            .equals("Business")
            .show("companyName")
            .require("taxNumber")
            .build(),
          when<RulesValues>("loanAmount")
            .greaterThan(500_000)
            .show("managerApproval")
            .require("managerApproval")
            .disableSubmit()
            .build(),
        ],
        onSubmit: (values) => {
          push(`submit ok — type=${values.customerType} loan=${String(values.loanAmount)}`);
        },
      }),
    [push],
  );

  const snapshot = useFormSnapshot(form);

  return (
    <PageContainer
      compact
      description="Focused lab for when() — visibility, required flags, and disableSubmit business rules. Shell title already names this route."
    >
      <ExplainPanel title="What you are testing">
        <ul className={styles.logList}>
          <li>
            <code>
              when(&quot;customerType&quot;).equals(&quot;Business&quot;).show().require()
            </code>
          </li>
          <li>
            <code>when(&quot;loanAmount&quot;).greaterThan(500000).disableSubmit()</code>
          </li>
          <li>
            Inspect live <code>fieldUi</code> / <code>formUi.submitDisabled</code> on the right
          </li>
        </ul>
        <SandboxCue hint="Toggle Business rules on the Employee template for free-form experiments." />
      </ExplainPanel>

      <div className={styles.explorerLayout}>
        <div className={styles.stack}>
          <Card
            description="Change customer type and loan amount — fields and submit react from rules, not useEffect."
            title="Loan application"
          >
            <div className={styles.formGrid}>
              <label className={styles.fieldLabel}>
                Customer type
                <select
                  className={styles.textInput}
                  name="customerType"
                  onChange={(event) => {
                    form.setValue("customerType", event.target.value);
                    push(`customerType → ${event.target.value}`);
                  }}
                  value={toInputValue(form.values("customerType"))}
                >
                  <option value="Personal">Personal</option>
                  <option value="Business">Business</option>
                </select>
              </label>

              <div hidden={snapshot.fieldUi.companyName?.visible === false}>
                <label className={styles.fieldLabel}>
                  Company name
                  <input
                    className={styles.textInput}
                    name="companyName"
                    onChange={(event) => {
                      form.setValue("companyName", event.target.value);
                    }}
                    value={toInputValue(form.values("companyName"))}
                  />
                </label>
              </div>

              <label className={styles.fieldLabel}>
                Tax number
                {snapshot.fieldUi.taxNumber?.required ? " *" : null}
                <input
                  className={styles.textInput}
                  name="taxNumber"
                  onChange={(event) => {
                    form.setValue("taxNumber", event.target.value);
                  }}
                  value={toInputValue(form.values("taxNumber"))}
                />
              </label>

              <label className={styles.fieldLabel}>
                Loan amount
                <input
                  className={styles.textInput}
                  name="loanAmount"
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    form.setValue("loanAmount", next);
                    push(`loanAmount → ${String(next)}`);
                  }}
                  type="number"
                  value={toInputValue(form.values("loanAmount"))}
                />
              </label>

              <div hidden={snapshot.fieldUi.managerApproval?.visible === false}>
                <label className={styles.fieldLabel}>
                  Manager approval
                  {snapshot.fieldUi.managerApproval?.required ? " *" : null}
                  <input
                    className={styles.textInput}
                    name="managerApproval"
                    onChange={(event) => {
                      form.setValue("managerApproval", event.target.value);
                    }}
                    value={toInputValue(form.values("managerApproval"))}
                  />
                </label>
              </div>
            </div>

            <div className={styles.buttonRow}>
              <button
                className={styles.primaryButton}
                disabled={snapshot.formUi.submitDisabled || snapshot.isSubmitting}
                onClick={() => {
                  void form.submit();
                }}
                type="button"
              >
                {snapshot.isSubmitting ? "Submitting…" : "Submit"}
              </button>
              <span className={styles.muted}>
                {snapshot.formUi.submitDisabled
                  ? "Submit blocked — loan requires manager approval"
                  : "Submit enabled"}
              </span>
            </div>
          </Card>

          <p className={styles.muted}>
            Also try the{" "}
            <Link className={styles.sandboxCueLink} to="/">
              Sandbox
            </Link>{" "}
            Employee template with Business rules enabled.
          </p>
        </div>

        <div className={styles.inspectorStack}>
          <Card description="Presentation flags driven by when()." title="fieldUi">
            <pre className={styles.inspectorPre}>{JSON.stringify(snapshot.fieldUi, null, 2)}</pre>
            <p className={styles.muted}>submitDisabled: {String(snapshot.formUi.submitDisabled)}</p>
          </Card>
          <Card description="Customer / loan changes and submits." title="Rule activity">
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
