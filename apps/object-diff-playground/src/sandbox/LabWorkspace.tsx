import styles from "./Lab.module.css";
import { useLab } from "./LabContext.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { classNames } from "../utils/class-names.js";

import type { WorkspaceTab } from "./types.js";
import type { DiffType } from "../lib/object-diff.js";

const TABS: readonly { id: WorkspaceTab; label: string }[] = [
  { id: "raw", label: "Raw JSON" },
  { id: "tree", label: "Tree" },
  { id: "side-by-side", label: "Side-by-side" },
  { id: "patch", label: "Patch" },
  { id: "merge", label: "Merge" },
  { id: "visual", label: "Visual" },
  { id: "formatter", label: "Formatter" },
];

function changeClass(type: DiffType): string {
  switch (type) {
    case "added":
      return styles.changeAdded ?? "";
    case "removed":
      return styles.changeRemoved ?? "";
    case "changed":
      return styles.changeChanged ?? "";
    case "moved":
      return styles.changeMoved ?? "";
    default:
      return styles.changeUnchanged ?? "";
  }
}

export function LabWorkspace() {
  const { workspaceTab, setWorkspaceTab, config, setSnapshotA, setSnapshotB, compute } = useLab();

  return (
    <section className={styles.canvas}>
      <div className={styles.tabs} role="tablist">
        {TABS.map((tab) => (
          <button
            aria-selected={workspaceTab === tab.id}
            className={workspaceTab === tab.id ? styles.tabActive : styles.tab}
            key={tab.id}
            onClick={() => {
              setWorkspaceTab(tab.id);
            }}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!compute.ok ? <p className={styles.errorBanner}>{compute.error}</p> : null}

      {workspaceTab === "raw" ? (
        <div className={styles.splitPair}>
          <div>
            <p className={styles.fieldLabel}>Snapshot A</p>
            <textarea
              className={styles.jsonEditor}
              onChange={(event) => {
                setSnapshotA(event.target.value);
              }}
              rows={16}
              spellCheck={false}
              value={config.snapshotA}
            />
          </div>
          <div>
            <p className={styles.fieldLabel}>Snapshot B</p>
            <textarea
              className={styles.jsonEditor}
              onChange={(event) => {
                setSnapshotB(event.target.value);
              }}
              rows={16}
              spellCheck={false}
              value={config.snapshotB}
            />
          </div>
        </div>
      ) : null}

      {workspaceTab === "tree" && compute.ok ? (
        <ul className={styles.treeList}>
          {compute.result.changes.map((change) => (
            <li
              className={classNames(styles.treeItem, changeClass(change.type))}
              key={`${change.type}:${change.path}:${change.from ?? ""}`}
            >
              <strong>{change.type}</strong> {change.path || "(root)"}
              {change.from ? ` ← ${change.from}` : ""}
              {change.type === "changed" || change.type === "added" || change.type === "removed"
                ? `  ${JSON.stringify(change.previous)} → ${JSON.stringify(change.current)}`
                : null}
            </li>
          ))}
          {compute.result.changes.length === 0 ? (
            <li className={styles.hint}>No changes recorded.</li>
          ) : null}
        </ul>
      ) : null}

      {workspaceTab === "side-by-side" && compute.ok ? (
        <div className={styles.splitPair}>
          <div>
            <p className={styles.fieldLabel}>Before</p>
            <CodeBlock code={JSON.stringify(compute.before, null, 2)} language="json" />
          </div>
          <div>
            <p className={styles.fieldLabel}>After</p>
            <CodeBlock code={JSON.stringify(compute.after, null, 2)} language="json" />
          </div>
        </div>
      ) : null}

      {workspaceTab === "patch" && compute.ok ? (
        <>
          <p className={styles.hint}>
            {String(compute.patchOps.length)} operations · valid={String(compute.patchValid)}
            {compute.patchValidationError ? ` · ${compute.patchValidationError}` : ""}
          </p>
          <CodeBlock code={JSON.stringify(compute.patchOps, null, 2)} language="json" />
          <div className={styles.splitPair}>
            <div>
              <p className={styles.fieldLabel}>Apply preview</p>
              <CodeBlock code={JSON.stringify(compute.applied, null, 2)} language="json" />
            </div>
            <div>
              <p className={styles.fieldLabel}>Revert preview</p>
              <CodeBlock code={JSON.stringify(compute.reverted, null, 2)} language="json" />
            </div>
          </div>
        </>
      ) : null}

      {workspaceTab === "merge" ? (
        compute.ok && compute.mergeResult ? (
          <>
            <p className={styles.hint}>
              Strategy {config.merge.strategy} · {String(compute.mergeResult.conflicts.length)}{" "}
              conflicts
            </p>
            <div className={styles.splitPair}>
              <div>
                <p className={styles.fieldLabel}>Base</p>
                <CodeBlock code={JSON.stringify(compute.base, null, 2)} language="json" />
              </div>
              <div>
                <p className={styles.fieldLabel}>Merged</p>
                <CodeBlock
                  code={JSON.stringify(compute.mergeResult.value, null, 2)}
                  language="json"
                />
              </div>
            </div>
            {compute.mergeResult.conflicts.length > 0 ? (
              <CodeBlock
                code={JSON.stringify(compute.mergeResult.conflicts, null, 2)}
                language="json"
              />
            ) : null}
          </>
        ) : (
          <p className={styles.hint}>
            Enable Merge Laboratory in the left panel to simulate three-way merge.
          </p>
        )
      ) : null}

      {workspaceTab === "visual" && compute.ok ? (
        <div className={styles.flow}>
          <div>
            <p className={styles.fieldLabel}>Before</p>
            <CodeBlock code={JSON.stringify(compute.before, null, 2)} language="json" />
          </div>
          <div className={styles.flowArrow}>
            ↓ compare → {String(compute.result.metadata.changeCount)} changes
          </div>
          <div>
            <p className={styles.fieldLabel}>After</p>
            <CodeBlock code={JSON.stringify(compute.after, null, 2)} language="json" />
          </div>
          <div className={styles.flowArrow}>↓ patch → {String(compute.patchOps.length)} ops</div>
          <div>
            <p className={styles.fieldLabel}>Applied</p>
            <CodeBlock code={JSON.stringify(compute.applied, null, 2)} language="json" />
          </div>
        </div>
      ) : null}

      {workspaceTab === "formatter" && compute.ok ? (
        <pre className={styles.pre}>{compute.formatted}</pre>
      ) : null}
    </section>
  );
}
