import { useEffect, useMemo, useRef } from "react";

import styles from "./ModulePlayground.module.css";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { Badge } from "../components/ui/Badge.js";
import { useEventExplorer } from "../features/events/use-event-explorer.js";
import { exportEventMetadata } from "../lib/playground-events.js";
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

async function copyText(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}

export function EventsPage() {
  const streamRef = useRef<HTMLOListElement | null>(null);
  const {
    autoScroll,
    availableCategories,
    availableSources,
    clear,
    exportRecords,
    filters,
    formatMetadata,
    isPaused,
    pause,
    payloadQuery,
    records,
    resume,
    selectedRecord,
    setAutoScroll,
    setPayloadQuery,
    setSelectedId,
    stats,
    toggleCategory,
    toggleSource,
    updateQuery,
  } = useEventExplorer();

  useEffect(() => {
    if (!autoScroll || !streamRef.current) {
      return;
    }
    streamRef.current.scrollTop = 0;
  }, [autoScroll, records.length]);

  const metadataRows = useMemo(
    () => (selectedRecord ? formatMetadata(selectedRecord) : []),
    [formatMetadata, selectedRecord],
  );

  return (
    <PageContainer
      description="Watch the full Browser Lifecycle public event stream, inspect payloads, filter results, and export history."
      eyebrow="Events"
      title="Event explorer"
    >
      <div className={styles.topGrid}>
        <Card title="Search and filters" tone="brand">
          <input
            className={styles.searchInput}
            onChange={(event) => {
              updateQuery(event.target.value);
            }}
            placeholder="Search events, payloads, modules, sequence"
            type="search"
            value={filters.query}
          />
          <div className={styles.statusRow}>
            {availableCategories.map((category) => (
              <button
                key={category}
                className={classNames(
                  styles.button,
                  filters.categories.includes(category) && styles.buttonPrimary,
                )}
                onClick={() => {
                  toggleCategory(category);
                }}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>
          <div className={styles.statusRow}>
            {availableSources.map((source) => (
              <button
                key={source}
                className={classNames(
                  styles.button,
                  filters.sources.includes(source) && styles.buttonPrimary,
                )}
                onClick={() => {
                  toggleSource(source);
                }}
                type="button"
              >
                {source}
              </button>
            ))}
          </div>
        </Card>
        <Card title="Stream statistics">
          <dl className={styles.snapshotList}>
            <div className={styles.snapshotRow}>
              <dt>Status</dt>
              <dd>{stats.streamStatus}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Total events</dt>
              <dd>{stats.totalEvents}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Events / sec</dt>
              <dd>{stats.eventsPerSecond}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Dropped</dt>
              <dd>{stats.droppedEvents}</dd>
            </div>
          </dl>
          <div className={styles.toolbarActions}>
            {isPaused ? (
              <button
                className={classNames(styles.button, styles.buttonPrimary)}
                onClick={resume}
                type="button"
              >
                Resume
              </button>
            ) : (
              <button className={styles.button} onClick={pause} type="button">
                Pause
              </button>
            )}
            <button className={styles.button} onClick={clear} type="button">
              Clear
            </button>
            <button
              className={classNames(styles.button, autoScroll && styles.buttonPrimary)}
              onClick={() => {
                setAutoScroll(!autoScroll);
              }}
              type="button"
            >
              Auto scroll
            </button>
          </div>
        </Card>
      </div>

      <div className={styles.topGrid}>
        <Card title="Live event stream">
          <ol ref={streamRef} className={classNames(styles.eventLog, styles.eventStream)}>
            {records.map((record) => (
              <li key={record.id}>
                <button
                  className={classNames(
                    styles.eventEntry,
                    selectedRecord?.id === record.id && styles.eventEntrySelected,
                  )}
                  onClick={() => {
                    setSelectedId(record.id);
                  }}
                  type="button"
                >
                  <span className={styles.eventTimestamp}>{record.timestampLabel}</span>
                  <span className={styles.eventType}>
                    #{record.sequence} · {record.type} · {record.module} · {record.priority}
                  </span>
                  <span className={styles.eventDetail}>{record.payloadSummary}</span>
                  <Badge tone="info">{record.status}</Badge>
                </button>
              </li>
            ))}
          </ol>
        </Card>
        <Card title="Event details">
          {selectedRecord ? (
            <>
              <div className={styles.toolbarActions}>
                <button
                  className={styles.button}
                  onClick={() => {
                    void copyText(JSON.stringify(selectedRecord.payload, null, 2));
                  }}
                  type="button"
                >
                  Copy payload
                </button>
                <button
                  className={styles.button}
                  onClick={() => {
                    void copyText(exportEventMetadata(selectedRecord));
                  }}
                  type="button"
                >
                  Copy metadata
                </button>
                <button
                  className={styles.button}
                  onClick={() => {
                    downloadText(
                      `${selectedRecord.eventId}-metadata.json`,
                      exportEventMetadata(selectedRecord),
                    );
                  }}
                  type="button"
                >
                  Download metadata
                </button>
              </div>
              <dl className={styles.snapshotList}>
                {metadataRows.map((row) => (
                  <div key={row.key} className={styles.snapshotRow}>
                    <dt>{row.key}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
              <h3 className={styles.exampleTitle}>Metadata JSON</h3>
              <CodeBlock
                code={JSON.stringify(selectedRecord.metadata ?? {}, null, 2)}
                language="json"
                title="Metadata JSON"
              />
              <h3 className={styles.exampleTitle}>Payload viewer</h3>
              <input
                className={styles.searchInput}
                onChange={(event) => {
                  setPayloadQuery(event.target.value);
                }}
                placeholder="Search inside payload"
                type="search"
                value={payloadQuery}
              />
              <CodeBlock
                code={JSON.stringify(selectedRecord.payload, null, 2)}
                language="json"
                maxHeight="24rem"
                title="Event payload"
              />
            </>
          ) : (
            <p className={styles.helperText}>Select an event to inspect details.</p>
          )}
        </Card>
      </div>

      <Card title="Export">
        <div className={styles.toolbarActions}>
          <button
            className={styles.button}
            onClick={() => {
              downloadText("events.json", exportRecords("json"));
            }}
            type="button"
          >
            Export JSON
          </button>
          <button
            className={styles.button}
            onClick={() => {
              downloadText("events.csv", exportRecords("csv"));
            }}
            type="button"
          >
            Export CSV
          </button>
          <button
            className={styles.button}
            onClick={() => {
              downloadText("events.ndjson", exportRecords("ndjson"));
            }}
            type="button"
          >
            Export NDJSON
          </button>
          <button
            className={styles.button}
            onClick={() => {
              downloadText("events.txt", exportRecords("txt"));
            }}
            type="button"
          >
            Export TXT
          </button>
        </div>
      </Card>
    </PageContainer>
  );
}
