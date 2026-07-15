import { useMemo } from "react";

import styles from "./ConnectivityPage.module.css";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { Badge } from "../components/ui/Badge.js";
import { Placeholder } from "../components/ui/Placeholder.js";
import { StatusIndicator } from "../components/ui/StatusIndicator.js";
import { useConnectivityPlayground } from "../features/connectivity/use-connectivity-playground.js";
import {
  CONNECTIVITY_DEVELOPER_EXAMPLES,
  filterConnectivityEventLog,
  getConnectivityStatusLabel,
  serializeConnectivityEventLogEntry,
} from "../lib/browser-lifecycle.js";
import { classNames } from "../utils/class-names.js";

import type { StatusIndicatorTone } from "../components/ui/StatusIndicator.js";
import type { BrowserLifecycleConnectivityState } from "../lib/browser-lifecycle.js";

function getConnectivityTone(connectivity: BrowserLifecycleConnectivityState): StatusIndicatorTone {
  switch (connectivity) {
    case "online":
      return "success";
    case "offline":
      return "warning";
    default:
      return "info";
  }
}

async function copyText(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}

export function ConnectivityPage() {
  const {
    browserApiInfo,
    clearOfflineHistory,
    connectivity,
    connectivitySupported,
    durationSinceLastChange,
    isPaused,
    isRunning,
    lastConnectivityChangeAt,
    lastReconnectDuration,
    offlineHistory,
    pause,
    phase,
    previousConnectivity,
    reconnectCount,
    reconnectTimeline,
    resume,
    searchQuery,
    setSearchQuery,
    snapshot,
    timeSinceReconnect,
  } = useConnectivityPlayground();

  const filteredOfflineHistory = useMemo(
    () => filterConnectivityEventLog(offlineHistory, searchQuery),
    [offlineHistory, searchQuery],
  );

  if (!connectivitySupported) {
    return (
      <PageContainer
        description="The connectivity module degrades safely when the browser does not expose navigator.onLine or online/offline events."
        eyebrow="Connectivity"
        title="Connectivity capability unavailable"
      >
        <Placeholder
          caption="Start the playground in a modern browser environment to exercise advisory connectivity events."
          description="The Browser Lifecycle session can still be created, but connectivity remains unknown and public connection events will not be emitted."
          eyebrow="Capability unavailable"
          title="Advisory connectivity is not supported in this environment"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      description="Observe advisory online/offline state, reconnect cycles, and browser network hints from a live Browser Lifecycle session."
      eyebrow="Connectivity"
      title="Connectivity diagnostics"
    >
      <div className={styles.topGrid}>
        <Card
          description="Connectivity state comes from the Browser Lifecycle snapshot after the connectivity module normalizes navigator.onLine."
          title="Online status"
          tone="brand"
        >
          <div className={styles.statusRow}>
            <StatusIndicator tone={getConnectivityTone(connectivity)}>
              {getConnectivityStatusLabel(connectivity)}
            </StatusIndicator>
            <Badge tone="info">{isRunning ? "Session running" : "Session stopped"}</Badge>
            <Badge tone="default">Phase {phase}</Badge>
          </div>

          <dl className={styles.snapshotList}>
            <div className={styles.snapshotRow}>
              <dt>Current connectivity state</dt>
              <dd>{connectivity}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Previous connectivity state</dt>
              <dd>{previousConnectivity}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Last connectivity change</dt>
              <dd>
                {lastConnectivityChangeAt !== undefined
                  ? new Date(lastConnectivityChangeAt).toLocaleTimeString()
                  : "—"}
              </dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Duration since change</dt>
              <dd>{durationSinceLastChange}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Session phase</dt>
              <dd>{snapshot?.phase ?? "unknown"}</dd>
            </div>
          </dl>
        </Card>

        <Card
          description="Browser APIs are advisory. Browser Lifecycle normalizes them without claiming server or internet availability."
          title="Network information"
        >
          <dl className={styles.snapshotList}>
            <div className={styles.snapshotRow}>
              <dt>navigator.onLine</dt>
              <dd>
                {browserApiInfo.currentNavigatorOnLine === null
                  ? "unknown"
                  : String(browserApiInfo.currentNavigatorOnLine)}
              </dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>online/offline events</dt>
              <dd>{String(browserApiInfo.onlineEventSupported)}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Network Information API</dt>
              <dd>{browserApiInfo.networkInformation.supported ? "Supported" : "Not supported"}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Connection type</dt>
              <dd>{browserApiInfo.networkInformation.connectionType ?? "—"}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Effective type</dt>
              <dd>{browserApiInfo.networkInformation.effectiveType ?? "—"}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Downlink</dt>
              <dd>
                {browserApiInfo.networkInformation.downlink === null
                  ? "—"
                  : `${String(browserApiInfo.networkInformation.downlink)} Mbps`}
              </dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>RTT</dt>
              <dd>
                {browserApiInfo.networkInformation.rtt === null
                  ? "—"
                  : `${String(browserApiInfo.networkInformation.rtt)} ms`}
              </dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Save data</dt>
              <dd>
                {browserApiInfo.networkInformation.saveData === null
                  ? "—"
                  : String(browserApiInfo.networkInformation.saveData)}
              </dd>
            </div>
          </dl>

          <dl className={styles.mappingList}>
            {browserApiInfo.mappings.map((mapping) => (
              <div key={mapping.browserApi} className={styles.mappingRow}>
                <dt>{mapping.browserApi}</dt>
                <dd>{mapping.sessionEvent}</dd>
              </div>
            ))}
          </dl>

          <ul className={styles.comparisonList}>
            {browserApiInfo.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </Card>
      </div>

      <div className={styles.middleGrid}>
        <Card
          description="Reconnect timeline streams connection:online, connection:offline, and connection:reconnect events with cycle statistics."
          title="Reconnect timeline"
        >
          <div className={styles.toolbar}>
            <div className={styles.statsRow}>
              <Badge tone="info">Reconnect count {reconnectCount}</Badge>
              <Badge tone="default">Last duration {lastReconnectDuration}</Badge>
              <Badge tone="default">Since reconnect {timeSinceReconnect}</Badge>
            </div>
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
            </div>
          </div>

          {reconnectTimeline.length === 0 ? (
            <p className={styles.emptyState}>
              No connectivity events yet. Toggle offline mode in devtools or disconnect the network
              to generate transitions.
            </p>
          ) : (
            <ol className={styles.timeline}>
              {reconnectTimeline.map((entry) => (
                <li key={entry.id} className={styles.timelineItem}>
                  <span aria-hidden="true" className={styles.timelineMarker} />
                  <article className={styles.eventEntry}>
                    <div className={styles.eventHeader}>
                      <div className={styles.eventMeta}>
                        <span className={styles.eventTime}>{entry.timestampLabel}</span>
                        <span className={styles.eventType}>{entry.type}</span>
                      </div>
                      <button
                        className={styles.button}
                        onClick={() => {
                          void copyText(serializeConnectivityEventLogEntry(entry));
                        }}
                        type="button"
                      >
                        Copy event
                      </button>
                    </div>
                    <span className={styles.eventDetail}>{entry.payloadSummary}</span>
                    <span className={styles.eventDetail}>
                      Session state: connectivity={entry.current} · phase=
                      {snapshot?.phase ?? "unknown"}
                    </span>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card
          description="Offline history records connection:offline events only, newest first, capped at 100 entries."
          title="Offline history"
        >
          <div className={styles.toolbar}>
            <input
              aria-label="Search offline events"
              className={styles.searchInput}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
              placeholder="Search offline events"
              type="search"
              value={searchQuery}
            />
            <div className={styles.toolbarActions}>
              {isPaused ? (
                <button className={styles.button} onClick={resume} type="button">
                  Resume
                </button>
              ) : (
                <button className={styles.button} onClick={pause} type="button">
                  Pause
                </button>
              )}
              <button className={styles.button} onClick={clearOfflineHistory} type="button">
                Clear
              </button>
            </div>
          </div>

          {filteredOfflineHistory.length === 0 ? (
            <p className={styles.emptyState}>
              {offlineHistory.length === 0
                ? "No offline events yet."
                : "No offline events match the current search query."}
            </p>
          ) : (
            <ol className={styles.eventLog}>
              {filteredOfflineHistory.map((entry) => (
                <li key={entry.id} className={styles.eventEntry}>
                  <div className={styles.eventHeader}>
                    <div className={styles.eventMeta}>
                      <span className={styles.eventTime}>{entry.timestampLabel}</span>
                      <span className={styles.eventType}>{entry.type}</span>
                    </div>
                    <button
                      className={styles.button}
                      onClick={() => {
                        void copyText(serializeConnectivityEventLogEntry(entry));
                      }}
                      type="button"
                    >
                      Copy event
                    </button>
                  </div>
                  <span className={styles.eventDetail}>
                    {entry.previous} → {entry.current}
                    {entry.reason ? ` · reason=${entry.reason}` : ""} · source={entry.source}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <div className={styles.bottomGrid}>
        <Card
          description="Production-ready examples use createBrowserLifecycle(), the public API entry point for Browser Lifecycle sessions."
          title="Developer examples"
        >
          <div className={styles.examplesGrid}>
            {CONNECTIVITY_DEVELOPER_EXAMPLES.map((example) => (
              <article key={example.id} className={styles.exampleCard}>
                <div className={styles.exampleHeader}>
                  <h3 className={styles.exampleTitle}>{example.title}</h3>
                </div>
                <p className={styles.exampleDescription}>{example.description}</p>
                <CodeBlock code={example.snippet} language="typescript" title={example.title} />
              </article>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
