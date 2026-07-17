import { useCallback, useState } from "react";

import styles from "./Pages.module.css";
import { ExplainPanel } from "../components/playground/ExplainPanel.js";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { createForm, required } from "../lib/form-intelligent.js";

type FieldCount = 25 | 50 | 100;

interface BenchResult {
  readonly label: string;
  readonly elapsedMs: number;
  readonly detail: string;
}

interface MemoryNotes {
  readonly usedJsHeapMb: number | null;
  readonly totalJsHeapMb: number | null;
  readonly note: string;
}

function buildForm(fieldCount: number, fill: boolean) {
  const initialValues: Record<string, string> = {};
  const validators: Record<string, readonly (typeof required)[]> = {};

  for (let index = 0; index < fieldCount; index += 1) {
    const path = `field${String(index)}`;
    initialValues[path] = fill || index % 2 === 0 ? `value-${String(index)}` : "";
    validators[path] = [required];
  }

  return createForm({
    initialValues,
    validators,
  });
}

function readMemoryNotes(): MemoryNotes {
  const perf = performance as Performance & {
    memory?: {
      usedJSHeapSize: number;
      totalJSHeapSize: number;
    };
  };

  if (!perf.memory) {
    return {
      usedJsHeapMb: null,
      totalJsHeapMb: null,
      note: "performance.memory is only available in Chromium with the memory flag enabled. Use DevTools → Memory for heap snapshots.",
    };
  }

  return {
    usedJsHeapMb: perf.memory.usedJSHeapSize / (1024 * 1024),
    totalJsHeapMb: perf.memory.totalJSHeapSize / (1024 * 1024),
    note: "Chrome heap estimate only — treat as a relative signal, not a hard budget.",
  };
}

function formatMs(value: number): string {
  return `${value.toFixed(2)} ms`;
}

export function PerformancePage() {
  const [fieldCount, setFieldCount] = useState<FieldCount>(50);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<readonly BenchResult[]>([]);
  const [memory, setMemory] = useState<MemoryNotes>(() => readMemoryNotes());

  const appendResult = useCallback((result: BenchResult) => {
    setResults((current) => [result, ...current].slice(0, 12));
  }, []);

  const runValidationBench = async (fill: boolean) => {
    setBusy(true);
    try {
      const form = buildForm(fieldCount, fill);
      await form.validate();

      const started = performance.now();
      const ok = await form.validate();
      const elapsed = performance.now() - started;
      form.destroy();

      appendResult({
        label: fill
          ? `validate ${String(fieldCount)} filled`
          : `validate ${String(fieldCount)} mixed`,
        elapsedMs: elapsed,
        detail: `valid=${String(ok)} (warm second pass)`,
      });
      setMemory(readMemoryNotes());
    } finally {
      setBusy(false);
    }
  };

  const runAutosaveStress = async () => {
    setBusy(true);
    try {
      let saves = 0;
      const form = createForm({
        initialValues: { note: "" },
        workflow: {
          autosave: {
            enabled: true,
            debounceMs: 50,
            onSave: () => {
              saves += 1;
            },
          },
        },
      });

      const started = performance.now();
      for (let index = 0; index < 200; index += 1) {
        form.setValue("note", `burst-${String(index)}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 120));
      const elapsed = performance.now() - started;
      form.destroy();

      appendResult({
        label: "autosave stress (200 setValue)",
        elapsedMs: elapsed,
        detail: `debounce coalesced to ${String(saves)} save(s)`,
      });
      setMemory(readMemoryNotes());
    } finally {
      setBusy(false);
    }
  };

  const runSubmitThroughput = async () => {
    setBusy(true);
    try {
      let submits = 0;
      const form = createForm({
        initialValues: { message: "ok" },
        validators: { message: [required] },
        onSubmit: () => {
          submits += 1;
        },
      });

      const rounds = 25;
      const started = performance.now();
      for (let index = 0; index < rounds; index += 1) {
        await form.submit();
      }
      const elapsed = performance.now() - started;
      form.destroy();

      appendResult({
        label: `submit throughput (${String(rounds)}×)`,
        elapsedMs: elapsed,
        detail: `${String(submits)} onSubmit calls · ${(elapsed / rounds).toFixed(2)} ms/submit`,
      });
      setMemory(readMemoryNotes());
    } finally {
      setBusy(false);
    }
  };

  const runManualComparison = async () => {
    setBusy(true);
    try {
      const values: Record<string, string> = {};
      for (let index = 0; index < fieldCount; index += 1) {
        values[`field${String(index)}`] = `value-${String(index)}`;
      }

      const manualStart = performance.now();
      let manualErrors = 0;
      for (let pass = 0; pass < 2; pass += 1) {
        manualErrors = 0;
        for (const value of Object.values(values)) {
          if (value.trim() === "") {
            manualErrors += 1;
          }
        }
      }
      const manualElapsed = performance.now() - manualStart;

      const form = buildForm(fieldCount, true);
      await form.validate();
      const engineStart = performance.now();
      await form.validate();
      const engineElapsed = performance.now() - engineStart;
      form.destroy();

      appendResult({
        label: `manual required loop (${String(fieldCount)})`,
        elapsedMs: manualElapsed,
        detail: `errors=${String(manualErrors)} · bare loop baseline`,
      });
      appendResult({
        label: `engine validate (${String(fieldCount)})`,
        elapsedMs: engineElapsed,
        detail: "includes field meta, errors map, subscribers",
      });
      setMemory(readMemoryNotes());
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageContainer
      compact
      description="Run in-browser microbenchmarks for validation, autosave coalescing, and submit throughput."
      eyebrow="Performance"
      title="Performance Playground"
    >
      <ExplainPanel
        body="These numbers are relative to this browser tab — warm the engine once, then measure. Autosave should coalesce bursts; validation of ~50 fields should stay well under 100ms on a warm path (same budget as the package performance suite)."
        title="How to read these benches"
      />

      <div className={styles.explorerLayout}>
        <Card description="Choose field count, then run a scenario." title="Controls">
          <div className={styles.toggleGroup} role="group" aria-label="Field count">
            {([25, 50, 100] as const).map((count) => (
              <button
                className={fieldCount === count ? styles.choiceButtonActive : styles.choiceButton}
                disabled={busy}
                key={count}
                onClick={() => {
                  setFieldCount(count);
                }}
                type="button"
              >
                {count} fields
              </button>
            ))}
          </div>
          <div className={styles.buttonRow}>
            <button
              className={styles.primaryButton}
              disabled={busy}
              onClick={() => {
                void runValidationBench(false);
              }}
              type="button"
            >
              Validate (mixed)
            </button>
            <button
              className={styles.secondaryButton}
              disabled={busy}
              onClick={() => {
                void runValidationBench(true);
              }}
              type="button"
            >
              Validate (filled)
            </button>
            <button
              className={styles.secondaryButton}
              disabled={busy}
              onClick={() => {
                void runAutosaveStress();
              }}
              type="button"
            >
              Autosave stress
            </button>
            <button
              className={styles.secondaryButton}
              disabled={busy}
              onClick={() => {
                void runSubmitThroughput();
              }}
              type="button"
            >
              Submit throughput
            </button>
            <button
              className={styles.secondaryButton}
              disabled={busy}
              onClick={() => {
                void runManualComparison();
              }}
              type="button"
            >
              vs manual loop
            </button>
          </div>
          {busy ? <p className={styles.muted}>Running…</p> : null}
        </Card>

        <Card description="Most recent runs first." title="Results">
          {results.length === 0 ? (
            <p className={styles.muted}>No runs yet — pick a scenario above.</p>
          ) : (
            <ul className={styles.stackList}>
              {results.map((result, index) => (
                <li key={`${result.label}-${String(index)}-${String(result.elapsedMs)}`}>
                  <strong>{result.label}</strong>
                  <p className={styles.metricValue}>{formatMs(result.elapsedMs)}</p>
                  <p className={styles.fieldHint}>{result.detail}</p>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.buttonRow}>
            <button
              className={styles.secondaryButton}
              disabled={results.length === 0}
              onClick={() => {
                setResults([]);
              }}
              type="button"
            >
              Clear results
            </button>
          </div>
        </Card>

        <Card
          description="Optional Chromium heap signal + how to profile properly."
          title="Memory notes"
        >
          {memory.usedJsHeapMb === null ? (
            <p className={styles.fieldHint}>{memory.note}</p>
          ) : (
            <>
              <p className={styles.metricValue}>{memory.usedJsHeapMb.toFixed(1)} MB</p>
              <p className={styles.fieldHint}>
                used / total ≈ {memory.usedJsHeapMb.toFixed(1)} /{" "}
                {memory.totalJsHeapMb?.toFixed(1) ?? "?"} MB
              </p>
              <p className={styles.fieldHint}>{memory.note}</p>
            </>
          )}
          <button
            className={styles.secondaryButton}
            onClick={() => {
              setMemory(readMemoryNotes());
            }}
            type="button"
          >
            Refresh memory
          </button>
        </Card>
      </div>

      <Card
        description="Engine work includes error maps, field meta, and subscribers — expect more cost than a bare required() loop."
        title="Comparison notes"
      >
        <ul className={styles.stackList}>
          <li>
            Manual loop: iterates values only — no dirty/touched meta, no plugin hooks, no
            subscribers.
          </li>
          <li>
            Form Intelligent validate: updates fieldMeta, errors, isValidating, and notifies
            subscribers after the pipeline.
          </li>
          <li>
            Autosave stress: 200 rapid setValue calls should collapse to ~1 save when debounce is
            50ms.
          </li>
          <li>
            Package suite: <code>tests/performance/validation-benchmark.test.ts</code> asserts 50
            fields under 100ms warm.
          </li>
        </ul>
      </Card>
    </PageContainer>
  );
}
