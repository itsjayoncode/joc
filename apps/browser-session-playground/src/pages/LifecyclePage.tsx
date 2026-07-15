import styles from "./ModulePlayground.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { Badge } from "../components/ui/Badge.js";
import { Placeholder } from "../components/ui/Placeholder.js";
import { StatusIndicator } from "../components/ui/StatusIndicator.js";
import { useLifecyclePlayground } from "../features/lifecycle/use-lifecycle-playground.js";
import {
  getLifecycleStatusLabel,
  LIFECYCLE_BROWSER_COMPATIBILITY,
} from "../lib/playground-lifecycle.js";
import { classNames } from "../utils/class-names.js";

export function LifecyclePage() {
  const {
    browserApiInfo,
    clearEvents,
    durationSinceTransition,
    eventLog,
    freezeCount,
    isPaused,
    isRunning,
    lifecycle,
    lifecycleSupported,
    pause,
    previousLifecycle,
    resume,
    resumeCount,
    searchQuery,
    setSearchQuery,
    snapshot,
  } = useLifecyclePlayground();

  if (!lifecycleSupported) {
    return (
      <PageContainer
        description="Page lifecycle hooks are unavailable in this environment."
        eyebrow="Lifecycle"
        title="Lifecycle capability unavailable"
      >
        <Placeholder
          description="Page lifecycle hooks are unavailable in this environment."
          title="Lifecycle module unavailable"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      description="Observe normalized page lifecycle transitions from Browser Lifecycle."
      eyebrow="Lifecycle"
      title="Lifecycle diagnostics"
    >
      <div className={styles.topGrid}>
        <Card title="Lifecycle status" tone="brand">
          <StatusIndicator tone="info">{getLifecycleStatusLabel(lifecycle)}</StatusIndicator>
          <Badge tone="info">{isRunning ? "Session running" : "Session stopped"}</Badge>
          <dl className={styles.snapshotList}>
            <div className={styles.snapshotRow}>
              <dt>Previous</dt>
              <dd>{previousLifecycle}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Freeze count</dt>
              <dd>{freezeCount}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Resume count</dt>
              <dd>{resumeCount}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Duration</dt>
              <dd>{durationSinceTransition}</dd>
            </div>
          </dl>
        </Card>
        <Card title="Browser API information">
          <dl className={styles.mappingList}>
            {browserApiInfo.mappings.map((m) => (
              <div key={m.browserApi} className={styles.mappingRow}>
                <dt>{m.browserApi}</dt>
                <dd>{m.sessionEvent}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
      <Card title="Browser compatibility">
        <div className={styles.compatTable}>
          {LIFECYCLE_BROWSER_COMPATIBILITY.map((row) => (
            <div key={row.browser} className={styles.compatRow}>
              <strong>{row.browser}</strong>
              <span>freeze {row.freeze}</span>
              <span>resume {row.resume}</span>
              <span>visibility {row.visibility}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Lifecycle events">
        <div className={styles.toolbar}>
          <input
            className={styles.searchInput}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Search events"
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
          <button className={styles.button} onClick={clearEvents} type="button">
            Clear
          </button>
        </div>
        <ol className={styles.timeline}>
          {eventLog
            .filter((entry) => entry.label.includes(searchQuery) || searchQuery === "")
            .map((entry) => (
              <li key={entry.id} className={styles.timelineItem}>
                <span className={styles.timelineMarker} />
                <article className={styles.eventEntry}>
                  <span className={styles.eventType}>{entry.type}</span>
                  <span className={styles.eventDetail}>{entry.payloadSummary}</span>
                </article>
              </li>
            ))}
        </ol>
      </Card>
      <Card title="Live demo">
        <p className={styles.helperText}>
          Switch tabs, minimize the browser, and return to observe freeze/resume and
          visibility-related lifecycle events. Phase: {snapshot?.phase ?? "unknown"}.
        </p>
      </Card>
    </PageContainer>
  );
}
