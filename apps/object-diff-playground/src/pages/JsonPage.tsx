import { useMemo, useState } from "react";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { SAMPLE_OBJECT_A } from "../lib/object-diff.js";

function renderTree(value: unknown, path = "$"): string[] {
  if (value === null || typeof value !== "object") {
    return [`${path}: ${JSON.stringify(value)}`];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => renderTree(item, `${path}[${String(index)}]`));
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) =>
    renderTree(nested, `${path}.${key}`),
  );
}

export function JsonPage() {
  const [input, setInput] = useState(() => JSON.stringify(SAMPLE_OBJECT_A, null, 2));
  const [error, setError] = useState<string | null>(null);

  const lines = useMemo(() => {
    try {
      const parsed = JSON.parse(input) as unknown;
      setError(null);
      return renderTree(parsed);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Invalid JSON input.");
      return [];
    }
  }, [input]);

  return (
    <PageContainer
      description="Inspect JSON with expandable path lines and copy-friendly output."
      eyebrow="JSON Viewer"
      title="Object tree inspection"
    >
      <Card description="Paste JSON to inspect flattened paths." title="JSON input">
        <textarea
          className={styles.jsonEditor}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          rows={12}
          value={input}
        />
      </Card>

      {error ? <p className={styles.errorText}>{error}</p> : null}

      <Card description="Flattened path listing" title="Tree view">
        <pre className={styles.codeBlock}>{lines.join("\n")}</pre>
      </Card>
    </PageContainer>
  );
}
