import styles from "./Lab.module.css";
import { useLab } from "./LabContext.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { classNames } from "../utils/class-names.js";

import type { WorkspaceTab } from "./types.js";
import type { DiffType } from "../lib/object-diff.js";
import type { ReactElement } from "react";

const TABS: readonly { id: WorkspaceTab; label: string }[] = [
  { id: "raw", label: "Raw JSON" },
  { id: "tree", label: "Tree" },
  { id: "side-by-side", label: "Side-by-side" },
  { id: "moves", label: "Moves" },
  { id: "patch", label: "Patch" },
  { id: "merge", label: "Merge" },
  { id: "explain", label: "Explain" },
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

function extractIndex(path: string): number | undefined {
  const match = /\[(\d+)\]$/.exec(path);
  return match ? Number(match[1]) : undefined;
}

function ArrayLane(props: {
  readonly title: string;
  readonly items: readonly unknown[];
  readonly highlight: ReadonlySet<number>;
}): ReactElement {
  return (
    <div>
      <p className={styles.fieldLabel}>{props.title}</p>
      <ol className={styles.moveLane}>
        {props.items.map((item, index) => (
          <li
            className={classNames(
              styles.moveLaneItem,
              props.highlight.has(index) ? styles.moveLaneHot : undefined,
            )}
            key={index}
          >
            <span className={styles.moveIndex}>[{String(index)}]</span>
            <code>{JSON.stringify(item)}</code>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function LabWorkspace() {
  const { workspaceTab, setWorkspaceTab, config, setSnapshotA, setSnapshotB, compute } = useLab();

  const moves = compute.ok
    ? compute.result.changes.filter((change) => change.type === "moved")
    : [];
  const fromIndexes = new Set(
    moves
      .map((change) => (change.from ? extractIndex(change.from) : undefined))
      .filter((index): index is number => index !== undefined),
  );
  const toIndexes = new Set(
    moves
      .map((change) => extractIndex(change.path))
      .filter((index): index is number => index !== undefined),
  );
  const rootArrays =
    compute.ok && Array.isArray(compute.before) && Array.isArray(compute.after)
      ? { before: compute.before as unknown[], after: compute.after as unknown[] }
      : null;

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

      {workspaceTab === "moves" && compute.ok ? (
        <>
          <p className={styles.hint}>
            {config.diff.detectMoves
              ? `${String(moves.length)} moved · detectMoves on${config.diff.identityKey ? ` · identityKey=${config.diff.identityKey}` : ""}`
              : "Enable Detect Moves (and optionally Identity Key) in Diff options, or run the Array Reorder experiment."}
          </p>
          {rootArrays ? (
            <div className={styles.splitPair}>
              <ArrayLane highlight={fromIndexes} items={rootArrays.before} title="Before" />
              <ArrayLane highlight={toIndexes} items={rootArrays.after} title="After" />
            </div>
          ) : null}
          {moves.length > 0 ? (
            <ul className={styles.moveArrows}>
              {moves.map((change) => (
                <li className={styles.moveArrow} key={`move:${change.from ?? ""}:${change.path}`}>
                  <span className={styles.moveFrom}>{change.from ?? "?"}</span>
                  <span className={styles.moveGlyph} aria-hidden>
                    →
                  </span>
                  <span className={styles.moveTo}>{change.path}</span>
                  {change.current !== undefined ? (
                    <code className={styles.moveValue}>{JSON.stringify(change.current)}</code>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.hint}>No `moved` records in this diff.</p>
          )}
        </>
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
              Strategy {config.merge.strategy}
              {config.diff.identityKey ? ` · identityKey=${config.diff.identityKey}` : ""} ·{" "}
              {String(compute.mergeResult.conflicts.length)} conflicts
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
              <ul className={styles.conflictList}>
                {compute.mergeResult.conflicts.map((conflict) => (
                  <li className={styles.conflictCard} key={`${conflict.path}:${conflict.reason}`}>
                    <div className={styles.conflictHead}>
                      <strong>{conflict.reason}</strong>
                      <span>{conflict.path || "(root)"}</span>
                      {conflict.identity !== undefined ? (
                        <span className={styles.conflictId}>id={String(conflict.identity)}</span>
                      ) : null}
                    </div>
                    <div className={styles.conflictBody}>
                      <div>
                        <span className={styles.fieldLabel}>Left</span>
                        <code>{JSON.stringify(conflict.left)}</code>
                      </div>
                      <div>
                        <span className={styles.fieldLabel}>Right</span>
                        <code>{JSON.stringify(conflict.right)}</code>
                      </div>
                      {"base" in conflict ? (
                        <div>
                          <span className={styles.fieldLabel}>Base</span>
                          <code>{JSON.stringify(conflict.base)}</code>
                        </div>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.hint}>No conflicts — strategy applied cleanly.</p>
            )}
          </>
        ) : (
          <p className={styles.hint}>
            Enable Merge Laboratory in the left panel to simulate three-way merge. Identity Key on
            Diff options also applies to merge when set.
          </p>
        )
      ) : null}

      {workspaceTab === "explain" && compute.ok ? (
        <>
          <p className={styles.hint}>
            DiffView `explain()` — structured + human. Pass identityKey in Diff options to improve
            move wording.
          </p>
          <pre className={styles.pre}>{compute.explainHuman}</pre>
          <p className={styles.fieldLabel}>Structured</p>
          <CodeBlock code={JSON.stringify(compute.explanations, null, 2)} language="json" />
        </>
      ) : null}

      {workspaceTab === "visual" && compute.ok ? (
        <div className={styles.flow}>
          <div>
            <p className={styles.fieldLabel}>Before</p>
            <CodeBlock code={JSON.stringify(compute.before, null, 2)} language="json" />
          </div>
          <div className={styles.flowArrow}>
            ↓ compare → {String(compute.result.metadata.changeCount)} changes
            {compute.result.metadata.movedCount > 0
              ? ` (${String(compute.result.metadata.movedCount)} moved)`
              : ""}
          </div>
          <div>
            <p className={styles.fieldLabel}>After</p>
            <CodeBlock code={JSON.stringify(compute.after, null, 2)} language="json" />
          </div>
          {moves.length > 0 ? (
            <ul className={styles.moveArrows}>
              {moves.slice(0, 8).map((change) => (
                <li className={styles.moveArrow} key={`viz:${change.from ?? "?"}:${change.path}`}>
                  {change.from ?? "?"} → {change.path}
                </li>
              ))}
            </ul>
          ) : null}
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
