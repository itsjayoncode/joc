import type { BrowserLifecycleSnapshot } from "@jayoncode/browser-lifecycle";

import styles from "./Sandbox.module.css";
import { useSandbox } from "./SandboxContext.js";
import { classNames } from "../utils/class-names.js";

import type { WorkspaceTab, SimulatedBrowserState } from "./types.js";

const TABS: readonly { id: WorkspaceTab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "timeline", label: "Timeline" },
  { id: "overview", label: "Overview" },
  { id: "snapshot", label: "Live Snapshot" },
];

function displayVisibility(
  snapshot: BrowserLifecycleSnapshot | null,
  simulated: SimulatedBrowserState,
): { value: string; simulated: boolean } {
  if (simulated.visibility) {
    return { value: simulated.visibility, simulated: true };
  }
  return { value: snapshot?.visibility ?? "—", simulated: false };
}

function StateCard({
  label,
  value,
  simulated,
}: {
  readonly label: string;
  readonly value: string;
  readonly simulated?: boolean;
}) {
  return (
    <div className={classNames(styles.stateCard, simulated && styles.stateSimulated)}>
      <span className={styles.stateLabel}>{label}</span>
      <span className={styles.stateValue}>{value}</span>
    </div>
  );
}

export function SandboxCanvas() {
  const {
    workspaceTab,
    setWorkspaceTab,
    snapshot,
    simulated,
    timeline,
    metricsSnapshot,
    activityView,
    presenceView,
    presenceLabel,
    sessionReport,
    timelineApiEnabled,
    metricsApiEnabled,
    activityApiEnabled,
    presenceApiEnabled,
    reportsApiEnabled,
    running,
    config,
  } = useSandbox();

  const visibility = displayVisibility(snapshot, simulated);
  const attention = simulated.attention
    ? { value: simulated.attention, simulated: true }
    : { value: snapshot?.attention ?? "—", simulated: false };
  const connectivity = simulated.connectivity
    ? { value: simulated.connectivity, simulated: true }
    : { value: snapshot?.connectivity ?? "—", simulated: false };
  const lifecycle = simulated.lifecycle
    ? { value: simulated.lifecycle, simulated: true }
    : { value: snapshot?.lifecycle ?? "—", simulated: false };

  const startedAt = snapshot?.timestamps.startedAt;
  const durationMs = startedAt !== undefined && running ? Date.now() - startedAt : null;

  const caps = snapshot?.capabilities;
  const capEntries = caps ? (Object.entries(caps) as readonly [string, boolean][]) : [];
  const supported = capEntries.filter(([, v]) => v).length;

  const liveJson = {
    visible: visibility.value === "visible",
    focused: attention.value === "focused",
    online: connectivity.value === "online",
    idle: snapshot?.activity === "idle",
    primary: snapshot?.tab === "primary" || snapshot?.tab === "single",
    activity: snapshot?.activity,
    lifecycle: lifecycle.value,
    tab: snapshot?.tab,
    phase: snapshot?.phase,
    timestamp: snapshot?.timestamps.updatedAt ?? Date.now(),
    ...(simulated.visibility || simulated.attention || simulated.connectivity || simulated.lifecycle
      ? { _simulated: true }
      : {}),
  };

  return (
    <section className={styles.canvas}>
      <div className={styles.tabs} role="tablist">
        {TABS.map((tab) => (
          <button
            aria-selected={workspaceTab === tab.id}
            className={workspaceTab === tab.id ? styles.tabActive : styles.tab}
            key={tab.id}
            onClick={() => {
              setWorkspaceTab(tab.id);
            }}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {workspaceTab === "dashboard" ? (
        <>
          <p className={styles.hint}>Current browser state — live from the session snapshot.</p>
          <div className={styles.stateGrid}>
            <StateCard
              label="Visibility"
              simulated={visibility.simulated}
              value={visibility.value}
            />
            <StateCard label="Focused" simulated={attention.simulated} value={attention.value} />
            <StateCard
              label="Online"
              simulated={connectivity.simulated}
              value={connectivity.value}
            />
            <StateCard label="Idle / Activity" value={snapshot?.activity ?? "—"} />
            <StateCard label="Lifecycle" simulated={lifecycle.simulated} value={lifecycle.value} />
            <StateCard label="Primary Tab" value={snapshot?.tab ?? "—"} />
            <StateCard
              label="Session Duration"
              value={durationMs !== null ? `${(durationMs / 1000).toFixed(1)}s` : "—"}
            />
            <StateCard
              label="Timestamp"
              value={
                snapshot?.timestamps.updatedAt
                  ? new Date(snapshot.timestamps.updatedAt).toLocaleTimeString()
                  : "—"
              }
            />
          </div>
          {activityApiEnabled && activityView ? (
            <>
              <p className={styles.hint}>
                Session Intelligence via <code>createActivityApi</code> (page activity facade).
              </p>
              <div className={styles.stateGrid}>
                <StateCard label="Activity status" value={activityView.status} />
                <StateCard
                  label="Last active"
                  value={
                    activityView.lastActiveAt !== undefined
                      ? new Date(activityView.lastActiveAt).toLocaleTimeString()
                      : "—"
                  }
                />
              </div>
            </>
          ) : null}
          {presenceApiEnabled && presenceView ? (
            <>
              <p className={styles.hint}>
                Page-local presence via <code>createPresenceApi</code> (not multi-user).
              </p>
              <div className={styles.stateGrid}>
                <StateCard label="Presence" value={presenceLabel ?? presenceView.status} />
                <StateCard
                  label="Reasons"
                  value={
                    presenceView.reasons.length > 0 ? presenceView.reasons.join(", ") : "none"
                  }
                />
              </div>
            </>
          ) : null}
          {metricsApiEnabled && metricsSnapshot ? (
            <>
              <p className={styles.hint}>
                Session Insights via <code>createMetricsApi</code> (attention + durations).
              </p>
              <div className={styles.stateGrid}>
                <StateCard label="Attention" value={`${String(metricsSnapshot.attentionScore)}%`} />
                <StateCard
                  label="Focused"
                  value={`${(metricsSnapshot.focusedMs / 1000).toFixed(1)}s`}
                />
                <StateCard
                  label="Hidden"
                  value={`${(metricsSnapshot.hiddenMs / 1000).toFixed(1)}s`}
                />
                <StateCard label="Idle" value={`${(metricsSnapshot.idleMs / 1000).toFixed(1)}s`} />
                <StateCard
                  label="Offline"
                  value={`${(metricsSnapshot.offlineMs / 1000).toFixed(1)}s`}
                />
                <StateCard label="Reconnects" value={String(metricsSnapshot.reconnectCount)} />
              </div>
            </>
          ) : null}
          {reportsApiEnabled && sessionReport ? (
            <>
              <p className={styles.hint}>
                Session summary via <code>createReportsApi</code>
                {metricsApiEnabled ? "" : " (metrics allocated for the report only)"}.
              </p>
              <div className={styles.stateGrid}>
                <StateCard
                  label="Session"
                  value={`${(sessionReport.sessionDuration / 1000).toFixed(1)}s`}
                />
                <StateCard
                  label="Attention"
                  value={`${String(sessionReport.attention.score)}%`}
                />
                <StateCard
                  label="Focused"
                  value={`${(sessionReport.focusDuration / 1000).toFixed(1)}s`}
                />
                <StateCard
                  label="Idle"
                  value={`${(sessionReport.idleDuration / 1000).toFixed(1)}s`}
                />
                <StateCard
                  label="Offline"
                  value={`${(sessionReport.offlineDuration / 1000).toFixed(1)}s`}
                />
                <StateCard
                  label="Highlights"
                  value={
                    sessionReport.highlights.length > 0
                      ? sessionReport.highlights.slice(0, 2).join(" · ")
                      : "—"
                  }
                />
              </div>
            </>
          ) : null}
        </>
      ) : null}

      {workspaceTab === "timeline" ? (
        <>
          <p className={styles.hint}>
            {timelineApiEnabled
              ? "Package Timeline (createTimelineApi) — newest first."
              : "Sandbox transition log (enable Timeline toggle to use createTimelineApi)."}
          </p>
          <ul className={styles.timeline}>
            {timeline.map((entry, index) => (
              <li className={styles.timelineItem} key={entry.id}>
                <span className={styles.timelineArrow}>{index === 0 ? "●" : "↓"}</span>
                <span>
                  <span className={styles.consoleTime}>{entry.at}</span>
                  {entry.label}
                </span>
              </li>
            ))}
            {timeline.length === 0 ? <li className={styles.hint}>No transitions yet.</li> : null}
          </ul>
        </>
      ) : null}

      {workspaceTab === "overview" ? (
        <>
          <p className={styles.hint}>Runtime summary.</p>
          <dl className={styles.kv}>
            <dt>Visibility</dt>
            <dd>{visibility.value}</dd>
            <dt>Focus</dt>
            <dd>{attention.value}</dd>
            <dt>Connectivity</dt>
            <dd>{connectivity.value}</dd>
            <dt>Idle</dt>
            <dd>{snapshot?.activity ?? "—"}</dd>
            <dt>Cross Tab</dt>
            <dd>{config.modules.crossTab ? (snapshot?.tab ?? "—") : "disabled"}</dd>
            <dt>Capabilities</dt>
            <dd>
              {supported} / {capEntries.length || "—"} supported
            </dd>
            <dt>Phase</dt>
            <dd>{snapshot?.phase ?? "—"}</dd>
            <dt>Running</dt>
            <dd>{String(running)}</dd>
          </dl>
        </>
      ) : null}

      {workspaceTab === "snapshot" ? (
        <>
          <p className={styles.hint}>Immutable-style live view of the derived browser state.</p>
          <pre className={styles.pre}>{JSON.stringify(liveJson, null, 2)}</pre>
          <p className={styles.hint}>Full package snapshot</p>
          <pre className={styles.pre}>{JSON.stringify(snapshot, null, 2)}</pre>
        </>
      ) : null}
    </section>
  );
}
