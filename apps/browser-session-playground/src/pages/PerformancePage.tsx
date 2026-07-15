import styles from "./ModulePlayground.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { Badge } from "../components/ui/Badge.js";
import { usePerformancePlayground } from "../features/performance/use-performance-playground.js";
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

export function PerformancePage() {
  const { clear, dispatchPercentile95, exportMetrics, isPaused, metrics, pause, resume, warnings } =
    usePerformancePlayground();

  return (
    <PageContainer
      description="Measure real Browser Lifecycle dispatch timing, event throughput, listener counts, and memory signals."
      eyebrow="Performance"
      title="Performance playground"
    >
      <div className={styles.topGrid}>
        <Card title="Performance overview" tone="brand">
          {metrics ? (
            <dl className={styles.snapshotList}>
              <div className={styles.snapshotRow}>
                <dt>Total events</dt>
                <dd>{metrics.totalEvents}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Events / sec</dt>
                <dd>{metrics.eventsPerSecond}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Events / min</dt>
                <dd>{metrics.eventsPerMinute}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Peak rate</dt>
                <dd>{metrics.peakEventRate}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Dropped samples</dt>
                <dd>{metrics.droppedEvents}</dd>
              </div>
            </dl>
          ) : (
            <p className={styles.helperText}>Collecting runtime metrics…</p>
          )}
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
          </div>
        </Card>
        <Card title="Diagnostics">
          <ol className={styles.comparisonList}>
            {warnings.map((warning) => (
              <li key={warning.message}>
                <Badge tone={warning.severity === "warning" ? "warning" : "info"}>
                  {warning.severity}
                </Badge>{" "}
                {warning.message}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className={styles.topGrid}>
        <Card title="Dispatch time">
          {metrics ? (
            <dl className={styles.snapshotList}>
              <div className={styles.snapshotRow}>
                <dt>Average</dt>
                <dd>{metrics.averageDispatchMs} ms</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Median</dt>
                <dd>{metrics.averageDispatchMs} ms</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>95th percentile</dt>
                <dd>{dispatchPercentile95} ms</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Fastest</dt>
                <dd>{metrics.fastestDispatchMs} ms</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Slowest</dt>
                <dd>{metrics.slowestDispatchMs} ms</dd>
              </div>
            </dl>
          ) : null}
        </Card>
        <Card title="Memory and listeners">
          {metrics ? (
            <dl className={styles.snapshotList}>
              <div className={styles.snapshotRow}>
                <dt>State size</dt>
                <dd>{metrics.memory.estimatedStateBytes} bytes</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Event buffer</dt>
                <dd>{metrics.memory.eventBufferSize}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Heap used</dt>
                <dd>{metrics.memory.heapUsedMb ?? "Not supported"}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Listeners</dt>
                <dd>{metrics.diagnostics.totalListenerCount}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Subscribers</dt>
                <dd>{metrics.diagnostics.subscriberCount}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Modules</dt>
                <dd>{metrics.diagnostics.moduleCount}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Plugins</dt>
                <dd>{metrics.diagnostics.pluginCount}</dd>
              </div>
            </dl>
          ) : null}
        </Card>
      </div>

      <Card title="Event categories">
        <div className={styles.statusRow}>
          {metrics?.categories.map((entry) => (
            <Badge key={entry.category} tone="info">
              {entry.category}: {entry.count}
            </Badge>
          ))}
        </div>
      </Card>

      <Card title="Export">
        <div className={styles.toolbarActions}>
          <button
            className={styles.button}
            onClick={() => {
              downloadText("performance.json", exportMetrics("json"));
            }}
            type="button"
          >
            Export JSON
          </button>
          <button
            className={styles.button}
            onClick={() => {
              downloadText("performance.csv", exportMetrics("csv"));
            }}
            type="button"
          >
            Export CSV
          </button>
          <button
            className={styles.button}
            onClick={() => {
              downloadText("performance.txt", exportMetrics("txt"));
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
