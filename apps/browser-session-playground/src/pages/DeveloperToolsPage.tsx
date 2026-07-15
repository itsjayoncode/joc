import styles from "./ModulePlayground.module.css";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { Badge } from "../components/ui/Badge.js";
import { StatusIndicator } from "../components/ui/StatusIndicator.js";
import { useDeveloperToolsPlayground } from "../features/developer-tools/use-developer-tools-playground.js";
import { classNames } from "../utils/class-names.js";

export function DeveloperToolsPage() {
  const {
    browserApis,
    clearLogs,
    debugEnabled,
    disableDebug,
    enableDebug,
    filteredLogs,
    inspector,
    isPaused,
    pause,
    restartDebug,
    resume,
    searchQuery,
    setSearchQuery,
  } = useDeveloperToolsPlayground();

  return (
    <PageContainer
      description="Inspect Browser Lifecycle runtime diagnostics, browser APIs, modules, and live trace logs."
      eyebrow="Developer Tools"
      title="Developer tools"
    >
      <div className={styles.topGrid}>
        <Card title="Debug mode" tone="brand">
          <StatusIndicator tone={debugEnabled ? "success" : "info"}>
            {debugEnabled ? "Debug enabled" : "Debug disabled"}
          </StatusIndicator>
          <div className={styles.toolbarActions}>
            {debugEnabled ? (
              <button className={styles.button} onClick={disableDebug} type="button">
                Disable debug
              </button>
            ) : (
              <button
                className={classNames(styles.button, styles.buttonPrimary)}
                onClick={enableDebug}
                type="button"
              >
                Enable debug
              </button>
            )}
            <button className={styles.button} onClick={restartDebug} type="button">
              Restart session
            </button>
          </div>
        </Card>
        <Card title="Runtime diagnostics">
          {inspector ? (
            <dl className={styles.snapshotList}>
              <div className={styles.snapshotRow}>
                <dt>Phase</dt>
                <dd>{inspector.diagnostics.phase}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Modules</dt>
                <dd>{inspector.diagnostics.moduleCount}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Emissions</dt>
                <dd>{inspector.diagnostics.totalEmissionCount}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Listeners</dt>
                <dd>{inspector.diagnostics.totalListenerCount}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Subscribers</dt>
                <dd>{inspector.diagnostics.subscriberCount}</dd>
              </div>
            </dl>
          ) : null}
        </Card>
      </div>

      <div className={styles.topGrid}>
        <Card title="Browser API inspector">
          <ul className={styles.comparisonList}>
            {browserApis.map((api) => (
              <li key={api.id}>
                <div className={styles.statusRow}>
                  <strong>{api.label}</strong>
                  <Badge tone={api.status === "supported" ? "info" : "warning"}>{api.status}</Badge>
                </div>
                <p className={styles.helperText}>
                  {api.browserSessionModule} · {api.description}
                </p>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Module inspector">
          <ul className={styles.comparisonList}>
            {inspector?.modules.map((module) => (
              <li key={module.id}>
                <div className={styles.statusRow}>
                  <strong>{module.label}</strong>
                  <Badge tone="info">{module.status}</Badge>
                </div>
                <p className={styles.helperText}>{module.events.join(", ")}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Runtime logger">
        <div className={styles.toolbar}>
          <input
            className={styles.searchInput}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            placeholder="Search logs"
            type="search"
            value={searchQuery}
          />
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
            <button className={styles.button} onClick={clearLogs} type="button">
              Clear
            </button>
          </div>
        </div>
        <ol className={styles.eventLog}>
          {filteredLogs.map((entry) => (
            <li key={entry.id} className={styles.eventEntry}>
              <span className={styles.eventTimestamp}>{entry.timestampLabel}</span>
              <span className={styles.eventType}>
                {entry.level} · {entry.module}
              </span>
              <span className={styles.eventDetail}>{entry.message}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card title="Internal state JSON">
        <CodeBlock
          code={JSON.stringify(inspector ?? {}, null, 2)}
          language="json"
          maxHeight="28rem"
          title="Inspector state"
        />
      </Card>
    </PageContainer>
  );
}
