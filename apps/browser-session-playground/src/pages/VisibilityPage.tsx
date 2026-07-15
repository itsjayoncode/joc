import styles from "./VisibilityPage.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { Badge } from "../components/ui/Badge.js";
import { Placeholder } from "../components/ui/Placeholder.js";
import { StatusIndicator } from "../components/ui/StatusIndicator.js";
import { useVisibilityPlayground } from "../features/visibility/use-visibility-playground.js";
import { getVisibilityStatusLabel } from "../lib/browser-lifecycle.js";

import type { StatusIndicatorTone } from "../components/ui/StatusIndicator.js";
import type { BrowserLifecycleVisibilityState } from "../lib/browser-lifecycle.js";

function getVisibilityTone(visibility: BrowserLifecycleVisibilityState): StatusIndicatorTone {
  switch (visibility) {
    case "visible":
      return "success";
    case "hidden":
      return "warning";
    default:
      return "info";
  }
}

export function VisibilityPage() {
  const { eventLog, isRunning, phase, snapshot, visibility, visibilitySupported } =
    useVisibilityPlayground();

  if (!visibilitySupported) {
    return (
      <PageContainer
        description="The visibility module degrades safely when the browser does not expose Page Visibility support."
        eyebrow="Visibility"
        title="Visibility capability unavailable"
      >
        <Placeholder
          caption="Start the playground in a modern browser environment to exercise page visibility events."
          description="The Browser Lifecycle session can still be created, but visibility remains unknown and public page visibility events will not be emitted."
          eyebrow="Capability unavailable"
          title="Page Visibility is not supported in this environment"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      description="Observe normalized visibility state and public page events from a live Browser Lifecycle session wired through the playground integration layer."
      eyebrow="Visibility"
      title="Page visibility diagnostics"
    >
      <div className={styles.heroGrid}>
        <Card
          description="Normalized visibility state comes from the Browser Lifecycle snapshot, not from direct document access in UI components."
          title="Current visibility"
          tone="brand"
        >
          <div className={styles.statusRow}>
            <StatusIndicator tone={getVisibilityTone(visibility)}>
              {getVisibilityStatusLabel(visibility)}
            </StatusIndicator>
            <Badge tone="info">{isRunning ? "Session running" : "Session stopped"}</Badge>
            <Badge tone="default">Phase {phase}</Badge>
          </div>
        </Card>

        <Card
          description="Switch browser tabs or minimize this window to trigger visibility transitions."
          title="Manual QA"
        >
          <ol className={styles.instructionList}>
            <li>Keep this tab active and confirm the state reads Visible.</li>
            <li>Switch to another tab for a few seconds.</li>
            <li>Return here and confirm Hidden, then Visible transitions appear below.</li>
          </ol>
        </Card>
      </div>

      <div className={styles.cardGrid}>
        <Card
          description="Snapshot fields owned by Session Core after the visibility module normalizes browser signals."
          title="Snapshot"
        >
          <dl className={styles.snapshotList}>
            <div className={styles.snapshotRow}>
              <dt>visibility</dt>
              <dd>{snapshot?.visibility ?? "unknown"}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>phase</dt>
              <dd>{snapshot?.phase ?? "unknown"}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>lastEventAt</dt>
              <dd>
                {snapshot?.timestamps.lastEventAt !== undefined
                  ? new Date(snapshot.timestamps.lastEventAt).toLocaleTimeString()
                  : "—"}
              </dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>capability.visibility</dt>
              <dd>{String(snapshot?.capabilities.visibility ?? false)}</dd>
            </div>
          </dl>
        </Card>

        <Card
          description="Public events are emitted by Session Core in lifecycle order. Only page:visible and page:hidden are shown on this page."
          title="Event log"
        >
          {eventLog.length === 0 ? (
            <p className={styles.emptyState}>
              No visibility events yet. Switch away from this tab to generate the first transition.
            </p>
          ) : (
            <ol className={styles.eventLog}>
              {eventLog.map((entry) => (
                <li key={entry.id} className={styles.eventEntry}>
                  <span className={styles.eventTime}>{entry.timestampLabel}</span>
                  <span className={styles.eventType}>{entry.type}</span>
                  <span className={styles.eventDetail}>
                    {entry.previous} → {entry.current}
                    {entry.reason ? ` · reason=${entry.reason}` : ""}
                    {entry.likelyLastSignal !== undefined
                      ? ` · likelyLastSignal=${String(entry.likelyLastSignal)}`
                      : ""}
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
