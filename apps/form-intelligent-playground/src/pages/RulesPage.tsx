import { useMemo } from "react";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { createForm, when } from "../lib/form-intelligent.js";
import { toInputValue } from "../utils/field-value.js";

export function RulesPage() {
  type RulesValues = {
    customerType: string;
    companyName: string;
    taxNumber: string;
    loanAmount: number;
    managerApproval: string;
  };

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
      }),
    [],
  );

  const snapshot = useFormSnapshot(form);

  return (
    <PageContainer
      description="Declarative when() rules — show, require, enable, and business-rule submit control."
      eyebrow="Rules"
      title="Conditional Logic"
    >
      <div className={styles.cardGrid}>
        <Card title="Loan application">
          <label className={styles.fieldLabel}>
            Customer type
            <select
              name="customerType"
              value={toInputValue(form.values("customerType"))}
              onChange={(event) => {
                form.setValue("customerType", event.target.value);
              }}
            >
              <option value="Personal">Personal</option>
              <option value="Business">Business</option>
            </select>
          </label>

          <div hidden={snapshot.fieldUi.companyName?.visible === false}>
            <label className={styles.fieldLabel}>
              Company name
              <input
                name="companyName"
                value={toInputValue(form.values("companyName"))}
                onChange={(event) => {
                  form.setValue("companyName", event.target.value);
                }}
              />
            </label>
          </div>

          <label className={styles.fieldLabel}>
            Tax number
            {snapshot.fieldUi.taxNumber?.required ? " *" : null}
            <input
              name="taxNumber"
              required={snapshot.fieldUi.taxNumber?.required === true}
              value={toInputValue(form.values("taxNumber"))}
              onChange={(event) => {
                form.setValue("taxNumber", event.target.value);
              }}
            />
          </label>

          <label className={styles.fieldLabel}>
            Loan amount
            <input
              name="loanAmount"
              type="number"
              value={toInputValue(form.values("loanAmount"))}
              onChange={(event) => {
                form.setValue("loanAmount", Number(event.target.value));
              }}
            />
          </label>

          <div hidden={snapshot.fieldUi.managerApproval?.visible === false}>
            <label className={styles.fieldLabel}>
              Manager approval
              <input
                name="managerApproval"
                value={toInputValue(form.values("managerApproval"))}
                onChange={(event) => {
                  form.setValue("managerApproval", event.target.value);
                }}
              />
            </label>
          </div>

          <button disabled={snapshot.formUi.submitDisabled || snapshot.isSubmitting} type="button">
            Submit
          </button>
        </Card>

        <Card title="fieldUi snapshot">
          <pre>{JSON.stringify(snapshot.fieldUi, null, 2)}</pre>
          <p>submitDisabled: {String(snapshot.formUi.submitDisabled)}</p>
        </Card>
      </div>
    </PageContainer>
  );
}
