import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { diff, hasChanges } from "../lib/object-diff.js";

const PRESETS = {
  small: [{ a: 1 }, { a: 2 }],
  nested: [
    { user: { profile: { name: "John", tags: ["a", "b"] } } },
    { user: { profile: { name: "Jane", tags: ["a", "c"] } } },
  ],
  array: [
    { items: Array.from({ length: 1000 }, (_, i) => i) },
    { items: Array.from({ length: 1000 }, (_, i) => (i === 999 ? -1 : i)) },
  ],
} as const;

export function PerformancePage() {
  const [result, setResult] = useState<string>("Run a benchmark preset.");

  function runPreset(name: keyof typeof PRESETS) {
    const [a, b] = PRESETS[name];
    const started = performance.now();
    const changed = hasChanges(a, b);
    const output = diff(a, b);
    const elapsed = performance.now() - started;

    setResult(
      `${name}: hasChanges=${String(changed)}, changes=${String(output.metadata.changeCount)}, duration=${elapsed.toFixed(3)}ms`,
    );
  }

  return (
    <PageContainer
      compact
      description={
        <>
          Quick preset timings. Use Lab experiments + Benchmark for history charts and large
          datasets from the <Link to="/">Object Diff Lab</Link>.
        </>
      }
    >
      <Card description="Run built-in fixtures against the live package." title="Presets">
        <div className={styles.inlineList}>
          {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((preset) => (
            <button
              className={styles.pill}
              key={preset}
              onClick={() => {
                runPreset(preset);
              }}
              type="button"
            >
              {preset}
            </button>
          ))}
        </div>
        <p className={styles.fieldHint}>{result}</p>
      </Card>
    </PageContainer>
  );
}
