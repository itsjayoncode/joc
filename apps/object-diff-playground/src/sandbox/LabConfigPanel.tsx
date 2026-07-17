import styles from "./Lab.module.css";
import { useLab, type ExperimentKind } from "./LabContext.js";
import { LAB_TEMPLATES } from "./templates.js";

import type { SerializeFormat } from "../lib/object-diff.js";
import type { ReactNode } from "react";

const FORMATS: readonly SerializeFormat[] = [
  "json",
  "pretty",
  "markdown",
  "html",
  "human",
  "console",
  "table",
];

const EXPERIMENTS: readonly { id: ExperimentKind; label: string }[] = [
  { id: "objects-100", label: "100 Objects" },
  { id: "objects-1000", label: "1,000 Objects" },
  { id: "objects-10000", label: "10,000 Objects" },
  { id: "large-arrays", label: "Large Arrays" },
  { id: "nested", label: "Nested Objects" },
  { id: "circular", label: "Circular Refs" },
  { id: "random-changes", label: "Random Changes" },
  { id: "array-reorder", label: "Array Reorder" },
  { id: "identity-changes", label: "Identity Changes" },
  { id: "merge-conflicts", label: "Merge Conflicts" },
  { id: "broken-json", label: "Broken JSON" },
  { id: "stress", label: "Stress Test" },
];

function LearnMore({ href }: { readonly href: string }) {
  return (
    <a className={styles.learnMore} href={href} rel="noreferrer" target="_blank">
      Learn more
    </a>
  );
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  readonly checked: boolean;
  readonly label: string;
  readonly onChange: (next: boolean) => void;
}) {
  return (
    <div className={styles.toggleRow}>
      <label>
        <input
          checked={checked}
          onChange={(event) => {
            onChange(event.target.checked);
          }}
          type="checkbox"
        />
        {label}
      </label>
    </div>
  );
}

export function LabConfigPanel({ resizeHandle }: { readonly resizeHandle?: ReactNode }) {
  const {
    config,
    docsBase,
    loadTemplate,
    setSnapshotA,
    setSnapshotB,
    copyAtoB,
    patchDiff,
    patchPatch,
    patchMerge,
    patchPerformance,
    setConfig,
    runExperiment,
    resetLab,
  } = useLab();

  const docs = (path: string) => `${docsBase}${path}`;

  return (
    <aside className={styles.config}>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Snapshot A</h2>
          <LearnMore href={docs("/modules/concepts")} />
        </div>
        <p className={styles.hint}>Before state. Edit JSON live.</p>
        <label className={styles.fieldLabel} htmlFor="lab-template">
          Template
        </label>
        <select
          className={styles.select}
          id="lab-template"
          onChange={(event) => {
            loadTemplate(event.target.value as (typeof LAB_TEMPLATES)[number]["id"]);
          }}
          value={config.templateId}
        >
          {LAB_TEMPLATES.map((template) => (
            <option key={template.id} value={template.id}>
              {template.label}
            </option>
          ))}
        </select>
        <textarea
          className={styles.jsonEditor}
          onChange={(event) => {
            setSnapshotA(event.target.value);
          }}
          rows={8}
          spellCheck={false}
          value={config.snapshotA}
        />
        <div className={styles.row}>
          <button className={styles.chip} onClick={resetLab} type="button">
            Reset
          </button>
          <button
            className={styles.chip}
            onClick={() => {
              loadTemplate(config.templateId);
            }}
            type="button"
          >
            Reload template
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Snapshot B</h2>
          <LearnMore href={docs("/modules/diff")} />
        </div>
        <p className={styles.hint}>After state. Generate or copy from A.</p>
        <textarea
          className={styles.jsonEditor}
          onChange={(event) => {
            setSnapshotB(event.target.value);
          }}
          rows={8}
          spellCheck={false}
          value={config.snapshotB}
        />
        <div className={styles.row}>
          <button className={styles.chip} onClick={copyAtoB} type="button">
            Copy A → B
          </button>
          <button
            className={styles.chip}
            onClick={() => {
              runExperiment("random-changes");
            }}
            type="button"
          >
            Randomize
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Diff options</h2>
          <LearnMore href={docs("/modules/diff")} />
        </div>
        <label className={styles.fieldLabel} htmlFor="max-depth">
          Max depth (0 = ∞)
        </label>
        <input
          className={styles.numberInput}
          id="max-depth"
          min={0}
          onChange={(event) => {
            patchDiff({ maxDepth: Number(event.target.value) || 0 });
          }}
          type="number"
          value={config.diff.maxDepth}
        />
        <Toggle
          checked={config.diff.includeUnchanged}
          label="Include unchanged"
          onChange={(includeUnchanged) => {
            patchDiff({ includeUnchanged });
          }}
        />
        <Toggle
          checked={config.diff.treatUndefinedAsMissing}
          label="Treat undefined as missing"
          onChange={(treatUndefinedAsMissing) => {
            patchDiff({ treatUndefinedAsMissing });
          }}
        />
        <Toggle
          checked={config.diff.detectMoves}
          label="Detect moves"
          onChange={(detectMoves) => {
            patchDiff({ detectMoves });
          }}
        />
        <label className={styles.fieldLabel} htmlFor="circular">
          Circular refs
        </label>
        <select
          className={styles.select}
          id="circular"
          onChange={(event) => {
            patchDiff({ circular: event.target.value as "error" | "skip" });
          }}
          value={config.diff.circular}
        >
          <option value="error">error</option>
          <option value="skip">skip</option>
        </select>
        <label className={styles.fieldLabel} htmlFor="identity-key">
          Identity key
        </label>
        <input
          className={styles.select}
          id="identity-key"
          onChange={(event) => {
            patchDiff({ identityKey: event.target.value });
          }}
          placeholder="e.g. id"
          type="text"
          value={config.diff.identityKey}
        />
        <label className={styles.fieldLabel} htmlFor="ignore-paths">
          Ignore paths
        </label>
        <input
          className={styles.select}
          id="ignore-paths"
          onChange={(event) => {
            patchDiff({ ignorePaths: event.target.value });
          }}
          placeholder="secrets.*, meta.token"
          type="text"
          value={config.diff.ignorePaths}
        />
        <label className={styles.fieldLabel} htmlFor="include-paths">
          Include paths
        </label>
        <input
          className={styles.select}
          id="include-paths"
          onChange={(event) => {
            patchDiff({ includePaths: event.target.value });
          }}
          placeholder="user.**"
          type="text"
          value={config.diff.includePaths}
        />
        <Toggle
          checked={config.injectCircular}
          label="Inject circular refs"
          onChange={(injectCircular) => {
            setConfig({ injectCircular });
          }}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Patch options</h2>
          <LearnMore href={docs("/modules/patch")} />
        </div>
        <label className={styles.fieldLabel} htmlFor="patch-format">
          Format
        </label>
        <select
          className={styles.select}
          id="patch-format"
          onChange={(event) => {
            patchPatch({ format: event.target.value as "json-patch" | "merge" });
          }}
          value={config.patch.format}
        >
          <option value="json-patch">JSON Patch (RFC 6902)</option>
          <option value="merge">Merge Patch</option>
        </select>
        <Toggle
          checked={config.patch.optimize}
          label="Optimize patch"
          onChange={(optimize) => {
            patchPatch({ optimize });
          }}
        />
        <Toggle
          checked={config.patch.validate}
          label="Validate on apply"
          onChange={(validate) => {
            patchPatch({ validate });
          }}
        />
        <Toggle
          checked={config.patch.mutable}
          label="Mutable apply"
          onChange={(mutable) => {
            patchPatch({ mutable });
          }}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Merge options</h2>
          <LearnMore href={docs("/modules/merge")} />
        </div>
        <Toggle
          checked={config.merge.enabled}
          label="Enable merge laboratory"
          onChange={(enabled) => {
            patchMerge({ enabled });
          }}
        />
        <label className={styles.fieldLabel} htmlFor="merge-strategy">
          Strategy
        </label>
        <select
          className={styles.select}
          disabled={!config.merge.enabled}
          id="merge-strategy"
          onChange={(event) => {
            patchMerge({ strategy: event.target.value as "latest-wins" | "manual" });
          }}
          value={config.merge.strategy}
        >
          <option value="latest-wins">Latest wins</option>
          <option value="manual">Manual (list conflicts)</option>
        </select>
        {config.merge.enabled ? (
          <>
            <label className={styles.fieldLabel} htmlFor="merge-base">
              Base
            </label>
            <textarea
              className={styles.jsonEditor}
              id="merge-base"
              onChange={(event) => {
                patchMerge({ baseJson: event.target.value });
              }}
              rows={5}
              spellCheck={false}
              value={config.merge.baseJson}
            />
          </>
        ) : null}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Formatter</h2>
          <LearnMore href={docs("/modules/serialize")} />
        </div>
        <div className={styles.row}>
          {FORMATS.map((format) => (
            <button
              className={config.format === format ? styles.chipActive : styles.chip}
              key={format}
              onClick={() => {
                setConfig({ format });
              }}
              type="button"
            >
              {format}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Performance</h2>
          <LearnMore href={docs("/modules/performance")} />
        </div>
        <Toggle
          checked={config.performance.benchmarkMode}
          label="Benchmark mode"
          onChange={(benchmarkMode) => {
            patchPerformance({ benchmarkMode });
          }}
        />
        <Toggle
          checked={config.performance.timing}
          label="Timing"
          onChange={(timing) => {
            patchPerformance({ timing });
          }}
        />
        <Toggle
          checked={config.performance.largeDataset}
          label="Large dataset flag"
          onChange={(largeDataset) => {
            patchPerformance({ largeDataset });
          }}
        />
        <Toggle
          checked={config.performance.stressTest}
          label="Stress test flag"
          onChange={(stressTest) => {
            patchPerformance({ stressTest });
          }}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Experiments</h2>
        </div>
        <div className={styles.row}>
          {EXPERIMENTS.map((experiment) => (
            <button
              className={styles.chip}
              key={experiment.id}
              onClick={() => {
                runExperiment(experiment.id);
              }}
              type="button"
            >
              {experiment.label}
            </button>
          ))}
        </div>
      </section>
      {resizeHandle}
    </aside>
  );
}
