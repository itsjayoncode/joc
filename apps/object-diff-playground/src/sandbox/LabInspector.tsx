import { activeCapabilityLabels } from "./capabilities.js";
import styles from "./Lab.module.css";
import { useLab } from "./LabContext.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";

import type { InspectorTab } from "./types.js";

const TABS: readonly { id: InspectorTab; label: string }[] = [
  { id: "diff", label: "Diff" },
  { id: "patch", label: "Patch" },
  { id: "stats", label: "Stats" },
  { id: "performance", label: "Perf" },
  { id: "code", label: "Code" },
];

export function LabInspector() {
  const {
    inspectorTab,
    setInspectorTab,
    compute,
    generatedCode,
    config,
    benchmarkHistory,
    copyText,
  } = useLab();

  const active = activeCapabilityLabels(config);
  const maxBench = Math.max(...benchmarkHistory.map((run) => run.compareMs), 1);

  return (
    <aside className={styles.inspector}>
      <div className={styles.tabs} role="tablist">
        {TABS.map((tab) => (
          <button
            aria-selected={inspectorTab === tab.id}
            className={inspectorTab === tab.id ? styles.tabActive : styles.tab}
            key={tab.id}
            onClick={() => {
              setInspectorTab(tab.id);
            }}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.inspectorBody}>
        {!compute.ok ? <p className={styles.errorBanner}>{compute.error}</p> : null}

        {inspectorTab === "diff" && compute.ok ? (
          <>
            <div className={styles.metricGrid}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Changes</span>
                <span className={styles.metricValue}>{compute.result.metadata.changeCount}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Compare ms</span>
                <span className={styles.metricValue}>{compute.timings.compareMs.toFixed(2)}</span>
              </div>
            </div>
            <dl className={styles.kv}>
              <dt>Added</dt>
              <dd>{compute.result.metadata.addedCount}</dd>
              <dt>Removed</dt>
              <dd>{compute.result.metadata.removedCount}</dd>
              <dt>Updated</dt>
              <dd>{compute.result.metadata.changedCount}</dd>
              <dt>Moved</dt>
              <dd>{compute.result.metadata.movedCount}</dd>
              <dt>Unchanged</dt>
              <dd>{compute.result.metadata.unchangedCount}</dd>
              <dt>Detect moves</dt>
              <dd>{String(config.diff.detectMoves)}</dd>
              <dt>Identity key</dt>
              <dd>{config.diff.identityKey || "—"}</dd>
              <dt>Max depth</dt>
              <dd>{config.diff.maxDepth > 0 ? config.diff.maxDepth : "∞"}</dd>
              <dt>Circular</dt>
              <dd>{config.diff.circular}</dd>
              <dt>Active caps</dt>
              <dd>{active.length > 0 ? active.join(", ") : "—"}</dd>
            </dl>
            <p className={styles.hint}>Changed paths</p>
            <ul className={styles.treeList}>
              {compute.result.changes
                .filter((change) => change.type !== "unchanged")
                .slice(0, 40)
                .map((change) => (
                  <li className={styles.treeItem} key={`${change.type}:${change.path}`}>
                    {change.type} · {change.path || "(root)"}
                  </li>
                ))}
            </ul>
          </>
        ) : null}

        {inspectorTab === "patch" && compute.ok ? (
          <>
            <dl className={styles.kv}>
              <dt>Operations</dt>
              <dd>{compute.patchOps.length}</dd>
              <dt>Format</dt>
              <dd>{config.patch.format}</dd>
              <dt>RFC6902 valid</dt>
              <dd>{String(compute.patchValid)}</dd>
              <dt>Patch ms</dt>
              <dd>{compute.timings.patchMs.toFixed(2)}</dd>
              <dt>Est. size</dt>
              <dd>{compute.stats.estimatedPatchSize} B</dd>
            </dl>
            <button
              className={styles.toolBtn}
              onClick={() => {
                void copyText(JSON.stringify(compute.patchOps, null, 2), "Patch");
              }}
              type="button"
            >
              Copy patch
            </button>
            <pre className={styles.pre}>{JSON.stringify(compute.patchOps, null, 2)}</pre>
          </>
        ) : null}

        {inspectorTab === "stats" && compute.ok ? (
          <dl className={styles.kv}>
            <dt>Total changes</dt>
            <dd>{compute.stats.totalChanges}</dd>
            <dt>Changed ratio</dt>
            <dd>{(compute.stats.changedRatio * 100).toFixed(1)}%</dd>
            <dt>Object changes</dt>
            <dd>{compute.stats.objectChangeCount}</dd>
            <dt>Array changes</dt>
            <dd>{compute.stats.arrayChangeCount}</dd>
            <dt>Deepest path</dt>
            <dd>{compute.stats.deepestPath ?? "—"}</dd>
            <dt>Max depth</dt>
            <dd>{compute.stats.maxDepth}</dd>
            <dt>Moves</dt>
            <dd>{compute.stats.moveCount}</dd>
            <dt>Hot prefixes</dt>
            <dd>
              {compute.stats.hotPrefixes.length > 0
                ? compute.stats.hotPrefixes
                    .map((entry) => `${entry.prefix}(${String(entry.count)})`)
                    .join(", ")
                : "—"}
            </dd>
          </dl>
        ) : null}

        {inspectorTab === "performance" && compute.ok ? (
          <>
            <div className={styles.metricGrid}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Compare</span>
                <span className={styles.metricValue}>{compute.timings.compareMs.toFixed(2)}ms</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Patch</span>
                <span className={styles.metricValue}>{compute.timings.patchMs.toFixed(2)}ms</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Serialize</span>
                <span className={styles.metricValue}>
                  {compute.timings.serializeMs.toFixed(2)}ms
                </span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Merge</span>
                <span className={styles.metricValue}>
                  {compute.timings.mergeMs !== null
                    ? `${compute.timings.mergeMs.toFixed(2)}ms`
                    : "—"}
                </span>
              </div>
            </div>
            <p className={styles.hint}>
              Nodes/records: {String(compute.result.changes.length)} · Ops/sec approx:{" "}
              {compute.timings.compareMs > 0
                ? Math.round(compute.result.changes.length / (compute.timings.compareMs / 1000))
                : "—"}
            </p>
            {benchmarkHistory.length > 0 ? (
              <>
                <p className={styles.hint}>Benchmark history</p>
                <div className={styles.benchBar}>
                  {benchmarkHistory.slice(0, 12).map((run) => (
                    <div
                      className={styles.benchCol}
                      key={run.id}
                      style={{
                        height: `${String(Math.max(8, (run.compareMs / maxBench) * 100))}%`,
                      }}
                      title={`${run.label}: ${run.compareMs.toFixed(2)}ms`}
                    />
                  ))}
                </div>
                <ul className={styles.treeList}>
                  {benchmarkHistory.slice(0, 8).map((run) => (
                    <li className={styles.treeItem} key={run.id}>
                      {run.at} · {run.label} · {run.compareMs.toFixed(2)}ms · {run.nodes} nodes ·{" "}
                      {run.ops} ops
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className={styles.hint}>Run Benchmark from the toolbar to build history.</p>
            )}
          </>
        ) : null}

        {inspectorTab === "code" ? (
          <>
            <p className={styles.hint}>Reproduce this experiment with the package API.</p>
            <button
              className={styles.toolBtnPrimary}
              onClick={() => {
                void copyText(generatedCode, "Generated code");
              }}
              type="button"
            >
              Copy code
            </button>
            <CodeBlock code={generatedCode} language="typescript" />
          </>
        ) : null}
      </div>
    </aside>
  );
}
