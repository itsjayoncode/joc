import { useMemo } from "react";

import styles from "./Pages.module.css";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import {
  createForm,
  formatCreditCard,
  formatCurrency,
  formatPhilippinePhone,
  formatPhone,
  formatSlug,
} from "../lib/form-intelligent.js";
import { normalizeUrl } from "../lib/playground-formatters.js";
import { toInputValue } from "../utils/field-value.js";

const FORMAT_DEMOS = [
  {
    path: "phMobile",
    label: "Philippine phone",
    format: formatPhilippinePhone,
    hint: 'Preset format: "philippine-phone" — 0917 123 4567',
    placeholder: "09171234567",
  },
  {
    path: "phone",
    label: "Phone",
    format: formatPhone,
    hint: "Digits are grouped as (555) 123-4567 while typing.",
    placeholder: "5551234567",
  },
  {
    path: "amount",
    label: "Currency",
    format: formatCurrency,
    hint: "Numeric input is normalized to two decimal places in stored state.",
    placeholder: "42.5",
  },
  {
    path: "slug",
    label: "Slug",
    format: formatSlug,
    hint: "Title text becomes a URL-safe slug.",
    placeholder: "Hello World!",
  },
  {
    path: "card",
    label: "Credit card",
    format: formatCreditCard,
    hint: "Package formatter groups card digits (4111 1111 1111 1111).",
    placeholder: "4242424242424242",
  },
  {
    path: "website",
    label: "URL normalize",
    format: normalizeUrl,
    hint: "Adds https:// and lowercases the stored value.",
    placeholder: "Example.com/path",
  },
] as const;

export function FormatterPage() {
  const form = useMemo(
    () =>
      createForm({
        initialValues: {
          phMobile: "",
          phone: "",
          amount: "",
          slug: "",
          card: "",
          website: "",
        },
      }),
    [],
  );

  const schemaForm = useMemo(
    () =>
      createForm({
        initialValues: { phPreset: "", cardPreset: "" },
        schema: {
          phPreset: { format: "philippine-phone" },
          cardPreset: { format: "credit-card" },
        },
      }),
    [],
  );

  const snapshot = useFormSnapshot(form);
  const schemaSnapshot = useFormSnapshot(schemaForm);

  return (
    <PageContainer
      compact
      description="See how formatters transform values at write time — separate display concerns from validation."
      eyebrow="Formatters"
      title="Formatter Playground"
    >
      <ExplainPanel
        body="Attach format: formatPhone (or a custom formatter) on form.field(path, { format }). The formatter runs inside setValue before state updates. Pair with parse when you need a different wire format."
        title="Format vs parse"
      />

      <div className={styles.cardGrid}>
        {FORMAT_DEMOS.map((demo) => (
          <Card description={demo.hint} key={demo.path} title={demo.label}>
            <label className={styles.fieldLabel}>
              input
              <input
                className={styles.textInput}
                onChange={(event) => {
                  form.field(demo.path, { format: demo.format }).setValue(event.target.value);
                }}
                placeholder={demo.placeholder}
                value={toInputValue(form.values(demo.path))}
              />
            </label>
            <p className={styles.fieldHint}>
              Stored value: <code>{JSON.stringify(snapshot.values[demo.path])}</code>
            </p>
          </Card>
        ))}
      </div>

      <Card
        description='Schema strings "philippine-phone" and "credit-card" compile to format + parse hooks automatically.'
        title="Schema format presets"
      >
        <label className={styles.fieldLabel}>
          Philippine phone (schema preset)
          <input
            className={styles.textInput}
            name="phPreset"
            onChange={(event) => {
              schemaForm.setValue("phPreset", event.target.value);
            }}
            placeholder="09171234567"
            value={toInputValue(schemaForm.values("phPreset"))}
          />
        </label>
        <p className={styles.fieldHint}>
          Stored: <code>{JSON.stringify(schemaSnapshot.values.phPreset)}</code>
        </p>

        <label className={styles.fieldLabel}>
          Credit card (schema preset)
          <input
            className={styles.textInput}
            name="cardPreset"
            onChange={(event) => {
              schemaForm.setValue("cardPreset", event.target.value);
            }}
            placeholder="4242424242424242"
            value={toInputValue(schemaForm.values("cardPreset"))}
          />
        </label>
        <p className={styles.fieldHint}>
          Stored: <code>{JSON.stringify(schemaSnapshot.values.cardPreset)}</code>
        </p>

        <CodeBlock
          code={`createForm({\n  schema: {\n    phone: { format: "philippine-phone" },\n    card: { format: "credit-card" },\n  },\n});`}
          language="typescript"
        />
      </Card>

      <Card description="Built-in and custom formatters side by side." title="Registration pattern">
        <CodeBlock
          code={`import { formatPhone, formatCurrency, formatSlug } from "@jayoncode/form-intelligent/format";\n\nform.field("phone", { format: formatPhone }).setValue(rawInput);\nform.field("amount", { format: formatCurrency }).setValue(rawInput);`}
          language="typescript"
        />
      </Card>
    </PageContainer>
  );
}
