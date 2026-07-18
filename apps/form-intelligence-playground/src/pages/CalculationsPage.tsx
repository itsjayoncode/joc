import { useMemo } from "react";

import styles from "./Pages.module.css";
import { EventLog } from "../components/playground/EventLog.js";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { SandboxCue } from "../components/playground/SandboxCue.js";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useEventLog } from "../hooks/useEventLog.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { createForm } from "../lib/form-intelligence.js";
import { toInputValue } from "../utils/field-value.js";

export function CalculationsPage() {
  const { clear, entries, push } = useEventLog();

  const form = useMemo(() => {
    const instance = createForm({
      initialValues: { price: 100, quantity: 1, discount: 0, total: 0 },
    });

    instance
      .calculate("total")
      .from("price", "quantity", "discount")
      .compute(({ values }) => {
        const next = Math.max(0, values.price * values.quantity - values.discount);
        push(`total recomputed → ${String(next)}`);
        return next;
      });

    return instance;
  }, [push]);

  const snapshot = useFormSnapshot(form);

  return (
    <PageContainer
      compact
      description="form.calculate() — derived totals recompute when dependencies change, without manual event wiring."
    >
      <ExplainPanel title="What you are testing">
        <ul className={styles.logList}>
          <li>
            <code>
              calculate(&quot;total&quot;).from(&quot;price&quot;, &quot;quantity&quot;,
              &quot;discount&quot;)
            </code>
          </li>
          <li>Edit inputs — watch total and the event log update</li>
          <li>Readonly total field is driven by the calculation graph</li>
        </ul>
        <SandboxCue hint="Enable Calculations on Checkout or Invoice in the Sandbox." />
      </ExplainPanel>

      <div className={styles.explorerLayout}>
        <div className={styles.stack}>
          <Card description="Shopping line with discount." title="Cart total">
            <div className={styles.formGrid}>
              <label className={styles.fieldLabel}>
                Price
                <input
                  className={styles.textInput}
                  name="price"
                  onChange={(event) => {
                    form.setValue("price", Number(event.target.value));
                  }}
                  type="number"
                  value={toInputValue(form.values("price"))}
                />
              </label>
              <label className={styles.fieldLabel}>
                Quantity
                <input
                  className={styles.textInput}
                  name="quantity"
                  onChange={(event) => {
                    form.setValue("quantity", Number(event.target.value));
                  }}
                  type="number"
                  value={toInputValue(form.values("quantity"))}
                />
              </label>
              <label className={styles.fieldLabel}>
                Discount
                <input
                  className={styles.textInput}
                  name="discount"
                  onChange={(event) => {
                    form.setValue("discount", Number(event.target.value));
                  }}
                  type="number"
                  value={toInputValue(form.values("discount"))}
                />
              </label>
            </div>
            <p className={styles.metricValue}>Total: ₱{toInputValue(form.values("total"))}</p>
          </Card>
        </div>

        <div className={styles.inspectorStack}>
          <Card description="Current values including derived total." title="values">
            <pre className={styles.inspectorPre}>{JSON.stringify(snapshot.values, null, 2)}</pre>
          </Card>
          <Card description="Recompute trail." title="Calculation activity">
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
