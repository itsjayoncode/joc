import { useMemo, useState } from "react";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import {
  SAMPLE_OBJECT_A,
  SAMPLE_OBJECT_B,
  runQuickCompare,
  toMarkdown,
  toTable,
} from "../lib/object-diff.js";

function parseJson(input: string): unknown {
  return JSON.parse(input) as unknown;
}

export function DiffPage() {
  const [objectA, setObjectA] = useState(() => JSON.stringify(SAMPLE_OBJECT_A, null, 2));
  const [objectB, setObjectB] = useState(() => JSON.stringify(SAMPLE_OBJECT_B, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"table" | "markdown">("table");

  const result = useMemo(() => {
    try {
      const parsedA = parseJson(objectA);
      const parsedB = parseJson(objectB);
      setError(null);
      return runQuickCompare(parsedA, parsedB);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Invalid JSON input.");
      return null;
    }
  }, [objectA, objectB]);

  return (
    <PageContainer
      description="Compare Object A and Object B using the real @jayoncode/object-diff engine."
      eyebrow="Diff Explorer"
      title="Structured change inspection"
    >
      <div className={styles.splitGrid}>
        <Card description="Source object" title="Object A">
          <textarea
            className={styles.jsonEditor}
            onChange={(event) => {
              setObjectA(event.target.value);
            }}
            rows={14}
            value={objectA}
          />
        </Card>
        <Card description="Target object" title="Object B">
          <textarea
            className={styles.jsonEditor}
            onChange={(event) => {
              setObjectB(event.target.value);
            }}
            rows={14}
            value={objectB}
          />
        </Card>
      </div>

      {error ? <p className={styles.errorText}>{error}</p> : null}

      {result ? (
        <Card
          description={`${String(result.metadata.changeCount)} changes in ${result.metadata.durationMs.toFixed(2)}ms`}
          title="Diff result"
        >
          <div className={styles.inlineList}>
            <button
              className={styles.pill}
              onClick={() => {
                setView("table");
              }}
              type="button"
            >
              Table
            </button>
            <button
              className={styles.pill}
              onClick={() => {
                setView("markdown");
              }}
              type="button"
            >
              Markdown
            </button>
          </div>
          <pre className={styles.codeBlock}>
            {view === "table" ? toTable(result) : toMarkdown(result)}
          </pre>
        </Card>
      ) : null}
    </PageContainer>
  );
}
