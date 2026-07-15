import styles from "./ModulePlayground.module.css";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock, InlineCode } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { Badge } from "../components/ui/Badge.js";
import { StatusIndicator } from "../components/ui/StatusIndicator.js";
import { useStateExplorer } from "../features/state/use-state-explorer.js";
import { classNames } from "../utils/class-names.js";

function downloadText(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function StatePage() {
  const {
    clearHistory,
    compareSnapshot,
    diff,
    exportSnapshot,
    filteredJson,
    history,
    isRunning,
    moduleCards,
    overview,
    payloadQuery,
    selectedSnapshot,
    setCompareSnapshotId,
    setPayloadQuery,
    setSelectedSnapshotId,
  } = useStateExplorer();

  return (
    <PageContainer
      description="Inspect live Browser Lifecycle snapshots, module state, history, and diffs from the real session runtime."
      eyebrow="State"
      title="State explorer"
    >
      <div className={styles.topGrid}>
        <Card title="Session overview" tone="brand">
          {overview ? (
            <dl className={styles.snapshotList}>
              <div className={styles.snapshotRow}>
                <dt>Status</dt>
                <dd>{overview.sessionStatus}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Session ID</dt>
                <dd>{overview.sessionId}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Version</dt>
                <dd>{overview.version}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Started</dt>
                <dd>{overview.startedAtLabel}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Uptime</dt>
                <dd>{overview.uptime}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Modules</dt>
                <dd>{overview.moduleCount}</dd>
              </div>
            </dl>
          ) : null}
          <StatusIndicator tone={isRunning ? "success" : "info"}>
            {isRunning ? "Session running" : "Session stopped"}
          </StatusIndicator>
        </Card>
        <Card title="JSON viewer">
          <input
            className={styles.searchInput}
            onChange={(event) => {
              setPayloadQuery(event.target.value);
            }}
            placeholder="Search state JSON"
            type="search"
            value={payloadQuery}
          />
          <div className={styles.toolbarActions}>
            <button
              className={styles.button}
              onClick={() => {
                downloadText("state-snapshot.json", exportSnapshot());
              }}
              type="button"
            >
              Download JSON
            </button>
          </div>
          <CodeBlock code={filteredJson} language="json" maxHeight="32rem" title="Snapshot JSON" />
        </Card>
      </div>

      <Card title="Module state">
        <div className={styles.middleGrid}>
          {moduleCards.map((module) => (
            <article key={module.id} className={styles.exampleCard}>
              <div className={styles.statusRow}>
                <h3 className={styles.exampleTitle}>{module.label}</h3>
                <Badge tone="info">{module.status}</Badge>
              </div>
              <dl className={styles.snapshotList}>
                <div className={styles.snapshotRow}>
                  <dt>Current</dt>
                  <dd>{module.current}</dd>
                </div>
                <div className={styles.snapshotRow}>
                  <dt>Previous</dt>
                  <dd>{module.previous ?? "—"}</dd>
                </div>
                <div className={styles.snapshotRow}>
                  <dt>Transitions</dt>
                  <dd>{module.transitionCount}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </Card>

      <div className={styles.topGrid}>
        <Card title="State history">
          <div className={styles.toolbarActions}>
            <button className={styles.button} onClick={clearHistory} type="button">
              Clear history
            </button>
          </div>
          <ol className={styles.eventLog}>
            {history.map((entry) => (
              <li key={entry.id}>
                <div className={styles.toolbar}>
                  <button
                    className={classNames(
                      styles.button,
                      selectedSnapshot?.id === entry.id && styles.buttonPrimary,
                    )}
                    onClick={() => {
                      setSelectedSnapshotId(entry.id);
                    }}
                    type="button"
                  >
                    Current #{entry.sequence}
                  </button>
                  <button
                    className={classNames(
                      styles.button,
                      compareSnapshot?.id === entry.id && styles.buttonPrimary,
                    )}
                    onClick={() => {
                      setCompareSnapshotId(entry.id);
                    }}
                    type="button"
                  >
                    Compare
                  </button>
                  <span className={styles.helperText}>{entry.capturedAtLabel}</span>
                </div>
              </li>
            ))}
          </ol>
        </Card>
        <Card title="State diff">
          {diff.length === 0 ? (
            <p className={styles.helperText}>Select two snapshots to compare changes.</p>
          ) : (
            <ol className={styles.eventLog}>
              {diff.map((entry) => (
                <li key={`${entry.path}-${entry.kind}`} className={styles.eventEntry}>
                  <span className={styles.eventType}>{entry.kind}</span>
                  <span className={styles.eventDetail}>{entry.path}</span>
                  <span className={styles.helperText}>
                    {entry.previous !== undefined ? (
                      <>
                        prev=<InlineCode>{JSON.stringify(entry.previous)}</InlineCode>
                      </>
                    ) : null}
                    {entry.current !== undefined ? (
                      <>
                        {" "}
                        curr=<InlineCode>{JSON.stringify(entry.current)}</InlineCode>
                      </>
                    ) : null}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
