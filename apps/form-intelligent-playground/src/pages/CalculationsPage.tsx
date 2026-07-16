import { useMemo } from "react";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { createForm } from "../lib/form-intelligent.js";
import { toInputValue } from "../utils/field-value.js";

export function CalculationsPage() {
  const form = useMemo(() => {
    const instance = createForm({
      initialValues: { price: 100, quantity: 1, total: 0 },
    });

    instance.calculate("total", ({ values }) => values.price * values.quantity);
    return instance;
  }, []);

  const snapshot = useFormSnapshot(form);

  return (
    <PageContainer
      description="Derived fields update automatically when dependencies change — no manual events."
      eyebrow="Calculations"
      title="form.calculate()"
    >
      <Card title="Shopping cart">
        <label className={styles.fieldLabel}>
          Price
          <input
            name="price"
            type="number"
            value={toInputValue(form.values("price"))}
            onChange={(event) => {
              form.setValue("price", Number(event.target.value));
            }}
          />
        </label>

        <label className={styles.fieldLabel}>
          Quantity
          <input
            name="quantity"
            type="number"
            value={toInputValue(form.values("quantity"))}
            onChange={(event) => {
              form.setValue("quantity", Number(event.target.value));
            }}
          />
        </label>

        <p className={styles.metricValue}>Total: ₱{toInputValue(form.values("total"))}</p>
        <pre>{JSON.stringify(snapshot.values, null, 2)}</pre>
      </Card>
    </PageContainer>
  );
}
