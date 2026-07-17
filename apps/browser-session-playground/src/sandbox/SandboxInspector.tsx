import { useMemo } from "react";

import { activeCapabilityLabels } from "./capabilities.js";
import styles from "./Sandbox.module.css";
import { useSandbox } from "./SandboxContext.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";

import type { InspectorTab } from "./types.js";

const TABS: readonly { id: InspectorTab; label: string }[] = [
  { id: "runtime", label: "Runtime" },
  { id: "events", label: "Events" },
  { id: "snapshot", label: "Snapshot" },
  { id: "performance", label: "Perf" },
  { id: "capabilities", label: "Caps" },
  { id: "code", label: "Code" },
];

function formatSnapshotValue(value: unknown): string {
  if (value === undefined || value === null) {
    return "—";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "[unserializable]";
  }
}

function snapshotDiff(
  previous: Record<string, unknown> | null,
  current: Record<string, unknown> | null,
): readonly { path: string; from: string; to: string }[] {
  if (!current) {
    return [];
  }
  const keys = [
    "visibility",
    "attention",
    "connectivity",
    "activity",
    "lifecycle",
    "tab",
    "phase",
  ] as const;
  const rows: { path: string; from: string; to: string }[] = [];
  for (const key of keys) {
    const from = previous ? formatSnapshotValue(previous[key]) : "—";
    const to = formatSnapshotValue(current[key]);
    if (from !== to) {
      rows.push({ path: key, from, to });
    }
  }
  return rows;
}

export function SandboxInspector() {
  const {
    inspectorTab,
    setInspectorTab,
    snapshot,
    previousSnapshot,
    diagnostics,
    events,
    eventFilter,
    setEventFilter,
    clearEvents,
    generatedCode,
    copyText,
    config,
    running,
    session,
  } = useSandbox();

  const active = activeCapabilityLabels(config);
  const filteredEvents = useMemo(() => {
    const q = eventFilter.trim().toLowerCase();
    if (!q) {
      return events;
    }
    return events.filter(
      (entry) =>
        entry.type.toLowerCase().includes(q) ||
        entry.source.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q),
    );
  }, [eventFilter, events]);

  const diffs = snapshotDiff(
    previousSnapshot as unknown as Record<string, unknown> | null,
    snapshot as unknown as Record<string, unknown> | null,
  );

  const caps = snapshot?.capabilities;

  return (
    <aside className={styles.inspector}>
      <div className={styles.tabs} role="tablist">
        {TABS.map((tab) => (
          <button
            aria-selected={inspectorTab === tab.id}
            className={inspectorTab === tab.id ? styles.tabActive : styles.tab}
            key={tab.id}
            onClick={() => {
              setInspectorTab(tab.id);
            }}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.inspectorBody}>
        {inspectorTab === "runtime" ? (
          <dl className={styles.kv}>
            <dt>Running</dt>
            <dd>{String(running)}</dd>
            <dt>Phase</dt>
            <dd>{snapshot?.phase ?? "—"}</dd>
            <dt>Started at</dt>
            <dd>
              {snapshot?.timestamps.startedAt
                ? new Date(snapshot.timestamps.startedAt).toLocaleTimeString()
                : "—"}
            </dd>
            <dt>Visibility</dt>
            <dd>{snapshot?.visibility ?? "—"}</dd>
            <dt>Focus</dt>
            <dd>{snapshot?.attention ?? "—"}</dd>
            <dt>Connectivity</dt>
            <dd>{snapshot?.connectivity ?? "—"}</dd>
            <dt>Idle</dt>
            <dd>{snapshot?.activity ?? "—"}</dd>
            <dt>Lifecycle</dt>
            <dd>{snapshot?.lifecycle ?? "—"}</dd>
            <dt>Cross Tab</dt>
            <dd>{snapshot?.tab ?? "—"}</dd>
            <dt>Plugins</dt>
            <dd>
              {session
                ? session
                    .getPlugins()
                    .map((p) => p.id)
                    .join(", ") || "—"
                : "—"}
            </dd>
            <dt>Active caps</dt>
            <dd>{active.join(", ") || "—"}</dd>
            <dt>Idle timeout</dt>
            <dd>{config.modules.idle ? `${String(config.idle.timeoutMs)}ms` : "off"}</dd>
            <dt>Cross-tab channel</dt>
            <dd>{config.modules.crossTab ? config.crossTab.channelName : "off"}</dd>
          </dl>
        ) : null}

        {inspectorTab === "events" ? (
          <>
            <div className={styles.row}>
              <input
                className={styles.select}
                onChange={(event) => {
                  setEventFilter(event.target.value);
                }}
                placeholder="Filter events…"
                type="search"
                value={eventFilter}
              />
              <button className={styles.chip} onClick={clearEvents} type="button">
                Clear
              </button>
            </div>
            <ul className={styles.eventList}>
              {filteredEvents.map((entry) => (
                <li className={styles.eventItem} key={entry.id}>
                  <span className={styles.eventTime}>
                    #{entry.seq} {entry.at}
                  </span>
                  <strong>{entry.type}</strong> · {entry.source}
                  <pre className={styles.pre} style={{ maxHeight: 120 }}>
                    {entry.payload}
                  </pre>
                </li>
              ))}
              {filteredEvents.length === 0 ? (
                <li className={styles.hint}>
                  No events yet. Interact with the browser or simulate.
                </li>
              ) : null}
            </ul>
          </>
        ) : null}

        {inspectorTab === "snapshot" ? (
          <>
            <p className={styles.hint}>Changed fields since previous snapshot</p>
            {diffs.length > 0 ? (
              diffs.map((row) => (
                <div className={styles.diffRow} key={row.path}>
                  <span>{row.path}</span>
                  <span>→</span>
                  <span>
                    {row.from} → {row.to}
                  </span>
                </div>
              ))
            ) : (
              <p className={styles.hint}>No field changes recorded yet.</p>
            )}
            <p className={styles.hint}>Current</p>
            <pre className={styles.pre}>{JSON.stringify(snapshot, null, 2)}</pre>
            <p className={styles.hint}>Previous</p>
            <pre className={styles.pre}>{JSON.stringify(previousSnapshot, null, 2)}</pre>
          </>
        ) : null}

        {inspectorTab === "performance" ? (
          diagnostics ? (
            <dl className={styles.kv}>
              <dt>Modules</dt>
              <dd>{diagnostics.moduleCount}</dd>
              <dt>Plugins</dt>
              <dd>{diagnostics.pluginCount}</dd>
              <dt>Subscribers</dt>
              <dd>{diagnostics.subscriberCount}</dd>
              <dt>Total emissions</dt>
              <dd>{diagnostics.totalEmissionCount}</dd>
              <dt>Total listeners</dt>
              <dd>{diagnostics.totalListenerCount}</dd>
              <dt>Event buffer</dt>
              <dd>{diagnostics.eventBufferSize}</dd>
              <dt>Debug</dt>
              <dd>{String(diagnostics.debug)}</dd>
              <dt>Timeline size</dt>
              <dd>{events.length}</dd>
            </dl>
          ) : (
            <p className={styles.hint}>Diagnostics unavailable until session starts.</p>
          )
        ) : null}

        {inspectorTab === "capabilities" ? (
          caps ? (
            <dl className={styles.kv}>
              {(Object.entries(caps) as readonly [string, boolean][]).map(([key, value]) => (
                <div key={key} style={{ display: "contents" }}>
                  <dt>{key}</dt>
                  <dd className={value ? styles.capOk : styles.capNo}>
                    {value ? "Supported" : "Unsupported"}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className={styles.hint}>Capabilities appear after session creation.</p>
          )
        ) : null}

        {inspectorTab === "code" ? (
          <>
            <p className={styles.hint}>Reproduce this sandbox configuration.</p>
            <button
              className={styles.toolBtnPrimary}
              onClick={() => {
                void copyText(generatedCode, "Generated code");
              }}
              type="button"
            >
              Copy code
            </button>
            <CodeBlock code={generatedCode} language="typescript" />
          </>
        ) : null}
      </div>
    </aside>
  );
}
