import styles from "./Sandbox.module.css";
import { useSandbox } from "./SandboxContext.js";

import type { SimulationAction } from "./simulation.js";
import type { ReactNode } from "react";

function LearnMore({ href }: { readonly href: string }) {
  return (
    <a className={styles.learnMore} href={href} rel="noreferrer" target="_blank">
      Learn more
    </a>
  );
}

function Toggle({
  checked,
  label,
  onChange,
  disabled,
}: {
  readonly checked: boolean;
  readonly label: string;
  readonly onChange: (next: boolean) => void;
  readonly disabled?: boolean;
}) {
  return (
    <div className={styles.toggleRow}>
      <label>
        <input
          checked={checked}
          disabled={disabled}
          onChange={(event) => {
            onChange(event.target.checked);
          }}
          type="checkbox"
        />
        {label}
      </label>
    </div>
  );
}

const SIM_ACTIONS: readonly { id: SimulationAction; label: string }[] = [
  { id: "hide", label: "Hide Tab" },
  { id: "show", label: "Show Tab" },
  { id: "blur", label: "Blur Window" },
  { id: "focus", label: "Focus Window" },
  { id: "offline", label: "Offline" },
  { id: "online", label: "Online" },
  { id: "freeze", label: "Freeze Page" },
  { id: "resume", label: "Resume Page" },
  { id: "reset", label: "Reset Browser State" },
];

export function SandboxConfigPanel({ resizeHandle }: { readonly resizeHandle?: ReactNode }) {
  const {
    config,
    docsBase,
    running,
    startSession,
    stopSession,
    recreateSession,
    resetSandbox,
    exportConfig,
    importConfig,
    patchModules,
    patchIdle,
    patchCrossTab,
    patchDiagnostics,
    setConfig,
    simulate,
    snapshot,
    flashStatus,
  } = useSandbox();

  const docs = (path: string) => `${docsBase}${path}`;

  return (
    <aside className={styles.config}>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Runtime</h2>
          <LearnMore href={docs("/modules/getting-started")} />
        </div>
        <p className={styles.hint}>Status: {running ? "running" : "stopped"}</p>
        <div className={styles.row}>
          <button className={styles.chip} disabled={running} onClick={startSession} type="button">
            Create / Start
          </button>
          <button className={styles.chip} disabled={!running} onClick={stopSession} type="button">
            Destroy / Stop
          </button>
          <button className={styles.chip} onClick={recreateSession} type="button">
            Reset Runtime
          </button>
          <button
            className={styles.chip}
            onClick={() => {
              downloadExport(exportConfig());
              flashStatus("Exported");
            }}
            type="button"
          >
            Export Config
          </button>
          <button
            className={styles.chip}
            onClick={() => {
              const raw = window.prompt("Paste sandbox JSON");
              if (raw) {
                importConfig(raw);
              }
            }}
            type="button"
          >
            Import Config
          </button>
          <button className={styles.chip} onClick={resetSandbox} type="button">
            Reset Config
          </button>
        </div>
        <Toggle
          checked={config.autoStart}
          label="Auto-start on recreate"
          onChange={(autoStart) => {
            setConfig({ autoStart });
          }}
        />
        <Toggle
          checked={config.emitInitialState}
          label="Emit initial state"
          onChange={(emitInitialState) => {
            setConfig({ emitInitialState });
          }}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Modules</h2>
          <LearnMore href={docs("/modules/concepts")} />
        </div>
        <p className={styles.hint}>
          Idle & Cross Tab map to package config. Visibility/Focus/Connectivity/Lifecycle are always
          observed when the session runs.
        </p>
        <Toggle
          checked={config.modules.visibility}
          label="Visibility"
          onChange={(visibility) => {
            patchModules({ visibility });
          }}
        />
        <Toggle
          checked={config.modules.focus}
          label="Focus"
          onChange={(focus) => {
            patchModules({ focus });
          }}
        />
        <Toggle
          checked={config.modules.connectivity}
          label="Connectivity"
          onChange={(connectivity) => {
            patchModules({ connectivity });
          }}
        />
        <Toggle
          checked={config.modules.idle}
          label="Idle"
          onChange={(idle) => {
            patchModules({ idle });
          }}
        />
        <Toggle
          checked={config.modules.lifecycle}
          label="Lifecycle"
          onChange={(lifecycle) => {
            patchModules({ lifecycle });
          }}
        />
        <Toggle
          checked={config.modules.crossTab}
          label="Cross Tab"
          onChange={(crossTab) => {
            patchModules({ crossTab });
          }}
        />
        <p className={styles.hint}>Session Intelligence & Insights (opt-in factories)</p>
        <Toggle
          checked={config.modules.activity}
          label="Activity (createActivityApi)"
          onChange={(activity) => {
            patchModules({ activity });
          }}
        />
        <Toggle
          checked={config.modules.presence}
          label="Presence (createPresenceApi)"
          onChange={(presence) => {
            patchModules({ presence });
          }}
        />
        <Toggle
          checked={config.modules.timeline}
          label="Timeline (createTimelineApi)"
          onChange={(timeline) => {
            patchModules({ timeline });
          }}
        />
        <Toggle
          checked={config.modules.metrics}
          label="Metrics (createMetricsApi)"
          onChange={(metrics) => {
            patchModules({ metrics });
          }}
        />
        <Toggle
          checked={config.modules.reports}
          label="Reports (createReportsApi)"
          onChange={(reports) => {
            patchModules({ reports });
          }}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Idle</h2>
          <LearnMore href={docs("/modules/idle")} />
        </div>
        <label className={styles.fieldLabel} htmlFor="idle-timeout">
          Idle timeout (ms)
        </label>
        <input
          className={styles.numberInput}
          disabled={!config.modules.idle}
          id="idle-timeout"
          min={500}
          onChange={(event) => {
            patchIdle({ timeoutMs: Number(event.target.value) || 15_000 });
          }}
          type="number"
          value={config.idle.timeoutMs}
        />
        <label className={styles.fieldLabel} htmlFor="idle-debounce">
          Activity debounce (ms)
        </label>
        <input
          className={styles.numberInput}
          disabled={!config.modules.idle}
          id="idle-debounce"
          min={0}
          onChange={(event) => {
            patchIdle({ debounceMs: Number(event.target.value) || 0 });
          }}
          type="number"
          value={config.idle.debounceMs}
        />
        <Toggle
          checked={config.idle.useDefaultEvents}
          disabled={!config.modules.idle}
          label="Default interaction events"
          onChange={(useDefaultEvents) => {
            patchIdle({ useDefaultEvents });
          }}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Cross Tab</h2>
          <LearnMore href={docs("/modules/cross-tab")} />
        </div>
        <label className={styles.fieldLabel} htmlFor="channel">
          BroadcastChannel name
        </label>
        <input
          className={styles.select}
          disabled={!config.modules.crossTab}
          id="channel"
          onChange={(event) => {
            patchCrossTab({ channelName: event.target.value });
          }}
          type="text"
          value={config.crossTab.channelName}
        />
        <label className={styles.fieldLabel} htmlFor="heartbeat">
          Heartbeat (ms)
        </label>
        <input
          className={styles.numberInput}
          disabled={!config.modules.crossTab}
          id="heartbeat"
          min={100}
          onChange={(event) => {
            patchCrossTab({ heartbeatInterval: Number(event.target.value) || 1000 });
          }}
          type="number"
          value={config.crossTab.heartbeatInterval}
        />
        <label className={styles.fieldLabel} htmlFor="leader">
          Leader timeout (ms)
        </label>
        <input
          className={styles.numberInput}
          disabled={!config.modules.crossTab}
          id="leader"
          min={200}
          onChange={(event) => {
            patchCrossTab({ leaderTimeout: Number(event.target.value) || 3000 });
          }}
          type="number"
          value={config.crossTab.leaderTimeout}
        />
        <dl className={styles.kv}>
          <dt>Tab role</dt>
          <dd>{snapshot?.tab ?? "—"}</dd>
          <dt>Channel</dt>
          <dd>{config.modules.crossTab ? config.crossTab.channelName : "off"}</dd>
        </dl>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Plugins</h2>
          <LearnMore href={docs("/modules/plugins")} />
        </div>
        <Toggle
          checked={config.loggerPlugin}
          label="Sandbox Logger plugin"
          onChange={(loggerPlugin) => {
            setConfig({ loggerPlugin });
          }}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Diagnostics</h2>
          <LearnMore href={docs("/modules/configuration")} />
        </div>
        <Toggle
          checked={config.diagnostics.eventLogging}
          label="Event logging"
          onChange={(eventLogging) => {
            patchDiagnostics({ eventLogging });
          }}
        />
        <Toggle
          checked={config.diagnostics.performanceLogging}
          label="Performance logging"
          onChange={(performanceLogging) => {
            patchDiagnostics({ performanceLogging });
          }}
        />
        <Toggle
          checked={config.diagnostics.debug}
          label="Debug mode"
          onChange={(debug) => {
            patchDiagnostics({ debug });
          }}
        />
        <Toggle
          checked={config.diagnostics.snapshotLogging}
          label="Snapshot logging"
          onChange={(snapshotLogging) => {
            patchDiagnostics({ snapshotLogging });
          }}
        />
        <label className={styles.fieldLabel} htmlFor="buffer">
          Event buffer size
        </label>
        <input
          className={styles.numberInput}
          id="buffer"
          min={0}
          onChange={(event) => {
            setConfig({ eventBufferSize: Number(event.target.value) || 0 });
          }}
          type="number"
          value={config.eventBufferSize}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Browser Simulation</h2>
        </div>
        <Toggle
          checked={config.mockSimulation}
          label="Mock simulation mode"
          onChange={(mockSimulation) => {
            setConfig({ mockSimulation });
          }}
        />
        <p className={styles.hint}>
          Native APIs are often read-only. Mock mode overlays educational state when events cannot
          force the browser.
        </p>
        <div className={styles.row}>
          {SIM_ACTIONS.map((action) => (
            <button
              className={styles.chip}
              key={action.id}
              onClick={() => {
                simulate(action.id);
              }}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      </section>
      {resizeHandle}
    </aside>
  );
}

function downloadExport(json: string): void {
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "browser-lifecycle-sandbox.json";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
