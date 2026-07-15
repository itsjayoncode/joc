import { useMemo } from "react";

import styles from "./FocusPage.module.css";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { Badge } from "../components/ui/Badge.js";
import { Placeholder } from "../components/ui/Placeholder.js";
import { StatusIndicator } from "../components/ui/StatusIndicator.js";
import { useFocusPlayground } from "../features/focus/use-focus-playground.js";
import {
  FOCUS_DEVELOPER_EXAMPLES,
  filterFocusEventLog,
  getFocusStatusLabel,
  serializeFocusEventLogEntry,
} from "../lib/browser-lifecycle.js";
import { classNames } from "../utils/class-names.js";

import type { StatusIndicatorTone } from "../components/ui/StatusIndicator.js";
import type { BrowserLifecycleAttentionState } from "../lib/browser-lifecycle.js";

function getFocusTone(attention: BrowserLifecycleAttentionState): StatusIndicatorTone {
  switch (attention) {
    case "focused":
      return "success";
    case "unfocused":
      return "warning";
    default:
      return "info";
  }
}

async function copyText(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}

export function FocusPage() {
  const {
    attention,
    blurHistory,
    browserApiInfo,
    clearBlurHistory,
    durationSinceLastChange,
    focusSupported,
    isPaused,
    isRunning,
    lastFocusChangeAt,
    liveStream,
    pause,
    phase,
    previousAttention,
    resume,
    searchQuery,
    setSearchQuery,
    snapshot,
  } = useFocusPlayground();

  const filteredBlurHistory = useMemo(
    () => filterFocusEventLog(blurHistory, searchQuery),
    [blurHistory, searchQuery],
  );

  if (!focusSupported) {
    return (
      <PageContainer
        description="The focus module degrades safely when the browser does not expose window focus observation."
        eyebrow="Focus"
        title="Focus capability unavailable"
      >
        <Placeholder
          caption="Start the playground in a modern browser environment to exercise window focus events."
          description="The Browser Lifecycle session can still be created, but attention remains unknown and public window focus events will not be emitted."
          eyebrow="Capability unavailable"
          title="Window focus is not supported in this environment"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      description="Observe normalized attention state, blur history, and public window focus events from a live Browser Lifecycle session."
      eyebrow="Focus"
      title="Window focus diagnostics"
    >
      <div className={styles.topGrid}>
        <Card
          description="Attention state comes from the Browser Lifecycle snapshot after the focus module normalizes window signals."
          title="Focus status"
          tone="brand"
        >
          <div className={styles.statusRow}>
            <StatusIndicator tone={getFocusTone(attention)}>
              {getFocusStatusLabel(attention)}
            </StatusIndicator>
            <Badge tone="info">{isRunning ? "Session running" : "Session stopped"}</Badge>
            <Badge tone="default">Phase {phase}</Badge>
          </div>

          <dl className={styles.snapshotList}>
            <div className={styles.snapshotRow}>
              <dt>Current focus state</dt>
              <dd>{attention}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Previous focus state</dt>
              <dd>{previousAttention}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Last focus change</dt>
              <dd>
                {lastFocusChangeAt !== undefined
                  ? new Date(lastFocusChangeAt).toLocaleTimeString()
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
          description="Browser APIs are mapped into Browser Lifecycle events. Focus tracks attention; visibility tracks document visibility."
          title="Browser API information"
        >
          <dl className={styles.snapshotList}>
            <div className={styles.snapshotRow}>
              <dt>window focus</dt>
              <dd>{String(browserApiInfo.windowFocusSupported)}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>window blur</dt>
              <dd>{String(browserApiInfo.windowBlurSupported)}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>document.hasFocus()</dt>
              <dd>{String(browserApiInfo.documentHasFocusSupported)}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Current browser focus</dt>
              <dd>
                {browserApiInfo.currentBrowserFocus === null
                  ? "unknown"
                  : String(browserApiInfo.currentBrowserFocus)}
              </dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Capability.focus</dt>
              <dd>{String(browserApiInfo.focusCapability)}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Event source</dt>
              <dd>{browserApiInfo.eventSource}</dd>
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
            <li>Focus answers whether the window currently has attention.</li>
            <li>Visibility answers whether the page is visible or hidden.</li>
            <li>
              A hidden tab can still be focused in some browser flows, so the signals stay separate.
            </li>
          </ul>
        </Card>
      </div>

      <div className={styles.middleGrid}>
        <Card
          description="Public window:focus and window:blur events stream in real time. FocusChanged is represented by the normalized attention transition in each payload."
          title="Live event stream"
        >
          <div className={styles.toolbar}>
            <p className={styles.helperText}>
              {isPaused
                ? "Stream paused. Resume to continue recording focus transitions."
                : "Switch to another application or browser tab, then return here to generate blur and focus transitions."}
            </p>
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

          {liveStream.length === 0 ? (
            <p className={styles.emptyState}>
              No focus events yet. Blur this window to generate the first transition.
            </p>
          ) : (
            <ol className={styles.eventLog}>
              {liveStream.map((entry) => (
                <li key={entry.id} className={styles.eventEntry}>
                  <div className={styles.eventHeader}>
                    <div className={styles.eventMeta}>
                      <span className={styles.eventTime}>{entry.timestampLabel}</span>
                      <span className={styles.eventType}>{entry.type}</span>
                    </div>
                    <button
                      className={styles.button}
                      onClick={() => {
                        void copyText(serializeFocusEventLogEntry(entry));
                      }}
                      type="button"
                    >
                      Copy event
                    </button>
                  </div>
                  <span className={styles.eventDetail}>{entry.payloadSummary}</span>
                  <span className={styles.eventDetail}>
                    Session state: attention={entry.current} · phase={snapshot?.phase ?? "unknown"}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <div className={styles.bottomGrid}>
        <Card
          description="Blur history records window:blur events only, newest first, capped at 100 entries."
          title="Blur event history"
        >
          <div className={styles.toolbar}>
            <input
              aria-label="Search blur events"
              className={styles.searchInput}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
              placeholder="Search blur events"
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
              <button className={styles.button} onClick={clearBlurHistory} type="button">
                Clear
              </button>
            </div>
          </div>

          {filteredBlurHistory.length === 0 ? (
            <p className={styles.emptyState}>
              {blurHistory.length === 0
                ? "No blur events yet."
                : "No blur events match the current search query."}
            </p>
          ) : (
            <ol className={styles.eventLog}>
              {filteredBlurHistory.map((entry) => (
                <li key={entry.id} className={styles.eventEntry}>
                  <div className={styles.eventHeader}>
                    <div className={styles.eventMeta}>
                      <span className={styles.eventTime}>{entry.timestampLabel}</span>
                      <span className={styles.eventType}>{entry.type}</span>
                    </div>
                    <button
                      className={styles.button}
                      onClick={() => {
                        void copyText(serializeFocusEventLogEntry(entry));
                      }}
                      type="button"
                    >
                      Copy event
                    </button>
                  </div>
                  <span className={styles.eventDetail}>
                    {entry.previous} → {entry.current} · source={entry.source}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card
          description="Production-ready examples use createBrowserLifecycle(), the public API entry point for Browser Lifecycle sessions."
          title="Developer examples"
        >
          <div className={styles.examplesGrid}>
            {FOCUS_DEVELOPER_EXAMPLES.map((example) => (
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
