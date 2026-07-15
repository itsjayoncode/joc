import { useMemo } from "react";

import styles from "./Pages.module.css";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { useFormSnapshot } from "../hooks/useFormSnapshot.js";
import { createForm, currency, phone, slug } from "../lib/form-intelligent.js";
import { creditCard, normalizeUrl } from "../lib/playground-formatters.js";
import { toInputValue } from "../utils/field-value.js";

const FORMAT_DEMOS = [
  {
    path: "phone",
    label: "Phone",
    format: phone,
    hint: "Digits are grouped as (555) 123-4567 while typing.",
    placeholder: "5551234567",
  },
  {
    path: "amount",
    label: "Currency",
    format: currency,
    hint: "Numeric input is normalized to two decimal places in stored state.",
    placeholder: "42.5",
  },
  {
    path: "slug",
    label: "Slug",
    format: slug,
    hint: "Title text becomes a URL-safe slug.",
    placeholder: "Hello World!",
  },
  {
    path: "card",
    label: "Credit card",
    format: creditCard,
    hint: "Playground formatter groups card digits (display layer demo).",
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
          phone: "",
          amount: "",
          slug: "",
          card: "",
          website: "",
        },
      }),
    [],
  );

  const snapshot = useFormSnapshot(form);

  return (
    <PageContainer
      description="See how formatters transform values at write time — separate display concerns from validation."
      eyebrow="Formatters"
      title="Formatter Playground"
    >
      <ExplainPanel
        body="Attach format: phone (or a custom formatter) on form.field(path, { format }). The formatter runs inside setValue before state updates. Pair with parse when you need a different wire format."
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

      <Card description="Built-in and custom formatters side by side." title="Registration pattern">
        <CodeBlock
          code={`import { phone, currency, slug } from "@jayoncode/form-intelligent";\n\nform.field("phone", { format: phone }).setValue(rawInput);\nform.field("amount", { format: currency }).setValue(rawInput);`}
          language="typescript"
        />
      </Card>
    </PageContainer>
  );
}
