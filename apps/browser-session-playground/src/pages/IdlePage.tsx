import styles from "./ModulePlayground.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { Badge } from "../components/ui/Badge.js";
import { Placeholder } from "../components/ui/Placeholder.js";
import { StatusIndicator } from "../components/ui/StatusIndicator.js";
import { useIdlePlayground } from "../features/idle/use-idle-playground.js";
import { filterIdleEventLog, getIdleStatusLabel } from "../lib/playground-idle.js";
import { classNames } from "../utils/class-names.js";

export function IdlePage() {
  const {
    activity,
    activityHistory,
    browserApiInfo,
    clearActivityHistory,
    clearLiveEvents,
    durationSinceLastChange,
    elapsedMs,
    idleSupported,
    idleTimeoutMs,
    isPaused,
    isRunning,
    lastActivityAt,
    liveEvents,
    pause,
    presets,
    remainingMs,
    resetSession,
    resume,
    searchQuery,
    setIdleTimeoutMs,
    setSearchQuery,
    snapshot,
    transitionCount,
  } = useIdlePlayground();

  const filteredActivity = filterIdleEventLog(activityHistory, searchQuery);
  const progress = idleTimeoutMs > 0 ? Math.min(100, (elapsedMs / idleTimeoutMs) * 100) : 0;

  if (!idleSupported) {
    return (
      <PageContainer
        description="Configure a positive idleTimeout and run in a browser that supports activity observation."
        eyebrow="Idle"
        title="Idle capability unavailable"
      >
        <Placeholder
          description="Configure a positive idleTimeout and run in a browser that supports activity observation."
          title="Idle module unavailable"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      description="Observe session:active and session:idle transitions from real activity heuristics."
      eyebrow="Idle"
      title="Idle diagnostics"
    >
      <div className={styles.topGrid}>
        <Card title="Idle timer" tone="brand">
          <div className={styles.statusRow}>
            <StatusIndicator tone={activity === "idle" ? "warning" : "success"}>
              {getIdleStatusLabel(activity)}
            </StatusIndicator>
            <Badge tone="info">{isRunning ? "Session running" : "Session stopped"}</Badge>
          </div>
          <dl className={styles.snapshotList}>
            <div className={styles.snapshotRow}>
              <dt>Timeout</dt>
              <dd>{idleTimeoutMs}ms</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Elapsed</dt>
              <dd>{elapsedMs}ms</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Remaining</dt>
              <dd>{remainingMs}ms</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Last activity</dt>
              <dd>{lastActivityAt ? new Date(lastActivityAt).toLocaleTimeString() : "—"}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Duration since change</dt>
              <dd>{durationSinceLastChange}</dd>
            </div>
          </dl>
          <div
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress}
            className={styles.progressTrack}
            role="progressbar"
          >
            <div className={styles.progressFill} style={{ width: `${String(progress)}%` }} />
          </div>
          <div className={styles.toolbarActions}>
            {presets.map((preset) => (
              <button
                key={preset.id}
                className={styles.button}
                onClick={() => {
                  setIdleTimeoutMs(preset.value);
                }}
                type="button"
              >
                {preset.label}
              </button>
            ))}
            <button className={styles.button} onClick={resetSession} type="button">
              Restart timer
            </button>
          </div>
        </Card>
        <Card title="Browser API information">
          <p className={styles.helperText}>{browserApiInfo.strategy}</p>
          <ul className={styles.comparisonList}>
            {browserApiInfo.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
      <div className={styles.middleGrid}>
        <Card title="User activity">
          <div className={styles.toolbar}>
            <input
              className={styles.searchInput}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Search activity"
              type="search"
              value={searchQuery}
            />
            <button className={styles.button} onClick={clearActivityHistory} type="button">
              Clear
            </button>
          </div>
          <ol className={styles.eventLog}>
            {filteredActivity.map((entry) => (
              <li key={entry.id} className={styles.eventEntry}>
                <span className={styles.eventType}>{entry.type}</span>
                <span className={styles.eventDetail}>{entry.payloadSummary}</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card title="Live events">
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
            <button className={styles.button} onClick={clearLiveEvents} type="button">
              Clear
            </button>
          </div>
          <Badge tone="default">Transitions {transitionCount}</Badge>
          <ol className={styles.eventLog}>
            {liveEvents.map((entry) => (
              <li key={entry.id} className={styles.eventEntry}>
                <span className={styles.eventType}>{entry.type}</span>
                <span className={styles.eventTime}>{entry.timestampLabel}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
      <Card title="Current state">
        <p className={styles.helperText}>
          Phase {snapshot?.phase ?? "unknown"} · activity {snapshot?.activity ?? "unknown"}
        </p>
      </Card>
    </PageContainer>
  );
}
