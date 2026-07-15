import styles from "./ModulePlayground.module.css";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { Badge } from "../components/ui/Badge.js";
import { Placeholder } from "../components/ui/Placeholder.js";
import { StatusIndicator } from "../components/ui/StatusIndicator.js";
import { useCrossTabPlayground } from "../features/cross-tab/use-cross-tab-playground.js";
import { CROSS_TAB_DEVELOPER_EXAMPLES, getTabRoleLabel } from "../lib/playground-cross-tab.js";
import { classNames } from "../utils/class-names.js";

export function CrossTabPage() {
  const {
    browserApiInfo,
    clearMessages,
    crossTabSupported,
    electionCount,
    isPaused,
    isRunning,
    leadershipDuration,
    messages,
    pause,
    primarySince,
    resume,
    searchQuery,
    setSearchQuery,
    tab,
  } = useCrossTabPlayground();

  if (!crossTabSupported) {
    return (
      <PageContainer
        description="BroadcastChannel is required for the cross-tab module in this environment."
        eyebrow="Cross Tab"
        title="Cross-tab capability unavailable"
      >
        <Placeholder
          description="BroadcastChannel is required for the cross-tab module in this environment."
          title="Cross-tab module unavailable"
        />
      </PageContainer>
    );
  }

  const filteredMessages = messages.filter((entry) =>
    [entry.type, entry.label, entry.payloadSummary]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <PageContainer
      description="Observe leader election, heartbeats, and tab messages through Browser Lifecycle."
      eyebrow="Cross Tab"
      title="Cross-tab diagnostics"
    >
      <div className={styles.topGrid}>
        <Card title="Primary tab" tone="brand">
          <StatusIndicator tone={tab === "primary" ? "success" : "info"}>
            {getTabRoleLabel(tab)}
          </StatusIndicator>
          <Badge tone="info">{isRunning ? "Session running" : "Session stopped"}</Badge>
          <dl className={styles.snapshotList}>
            <div className={styles.snapshotRow}>
              <dt>Election count</dt>
              <dd>{electionCount}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Primary since</dt>
              <dd>{primarySince ? new Date(primarySince).toLocaleTimeString() : "—"}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Leadership duration</dt>
              <dd>{leadershipDuration}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Channel</dt>
              <dd>{browserApiInfo.channelName}</dd>
            </div>
          </dl>
        </Card>
        <Card title="Browser API information">
          <dl className={styles.snapshotList}>
            <div className={styles.snapshotRow}>
              <dt>BroadcastChannel</dt>
              <dd>{String(browserApiInfo.broadcastChannelSupported)}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Storage fallback</dt>
              <dd>{String(browserApiInfo.storageEventsSupported)}</dd>
            </div>
          </dl>
          <ul className={styles.comparisonList}>
            {browserApiInfo.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
      <Card title="Tab communication">
        <div className={styles.toolbar}>
          <input
            className={styles.searchInput}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Search messages"
            type="search"
            value={searchQuery}
          />
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
          <button className={styles.button} onClick={clearMessages} type="button">
            Clear
          </button>
        </div>
        <p className={styles.helperText}>
          Open this page in multiple tabs to observe leader election, heartbeats, and broadcast
          messages.
        </p>
        <ol className={styles.eventLog}>
          {filteredMessages.map((entry) => (
            <li key={entry.id} className={styles.eventEntry}>
              <span className={styles.eventType}>{entry.type}</span>
              <span className={styles.eventDetail}>{entry.payloadSummary}</span>
            </li>
          ))}
        </ol>
      </Card>
      <Card title="Developer examples">
        {CROSS_TAB_DEVELOPER_EXAMPLES.map((example) => (
          <article key={example.id} className={styles.exampleCard}>
            <h3 className={styles.exampleTitle}>{example.title}</h3>
            <CodeBlock code={example.snippet} language="typescript" title={example.title} />
          </article>
        ))}
      </Card>
    </PageContainer>
  );
}
