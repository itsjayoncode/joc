import { buildSandboxShareUrl, copyTextToClipboard, downloadTextFile } from "./clipboard.js";
import styles from "./Sandbox.module.css";
import { useSandbox } from "./SandboxContext.js";
import { useTheme } from "../hooks/useTheme.js";

export function SandboxToolbar() {
  const {
    startSession,
    stopSession,
    resetSandbox,
    running,
    exportConfig,
    importConfig,
    generatedCode,
    clearConsole,
    clearTimeline,
    patchDiagnostics,
    config,
    flashStatus,
    statusMessage,
    copyText,
    recreateSession,
  } = useSandbox();
  const { togglePreference } = useTheme();

  return (
    <div className={styles.toolbar}>
      <span className={styles.toolbarTitle}>Lifecycle Sandbox</span>
      <button
        className={styles.toolBtnPrimary}
        disabled={running}
        onClick={startSession}
        type="button"
      >
        Start
      </button>
      <button className={styles.toolBtn} disabled={!running} onClick={stopSession} type="button">
        Stop
      </button>
      <button className={styles.toolBtn} onClick={recreateSession} type="button">
        Reset Runtime
      </button>
      <button className={styles.toolBtn} onClick={resetSandbox} type="button">
        Reset Config
      </button>
      <button
        className={styles.toolBtn}
        onClick={() => {
          const raw = window.prompt("Paste sandbox JSON config");
          if (raw) {
            importConfig(raw);
            flashStatus("Imported");
          }
        }}
        type="button"
      >
        Import JSON
      </button>
      <button
        className={styles.toolBtn}
        onClick={() => {
          const json = exportConfig();
          downloadTextFile("browser-lifecycle-sandbox.json", json);
          void copyTextToClipboard(json).then((ok) => {
            flashStatus(ok ? "Exported + copied" : "Exported");
          });
        }}
        type="button"
      >
        Export JSON
      </button>
      <button
        className={styles.toolBtnPrimary}
        onClick={() => {
          void copyText(generatedCode, "Generated code");
        }}
        type="button"
      >
        Copy Code
      </button>
      <button
        className={styles.toolBtn}
        onClick={() => {
          patchDiagnostics({ debug: !config.diagnostics.debug });
        }}
        type="button"
      >
        Debug: {config.diagnostics.debug ? "on" : "off"}
      </button>
      <button className={styles.toolBtn} onClick={togglePreference} type="button">
        Theme
      </button>
      <button className={styles.toolBtn} onClick={clearTimeline} type="button">
        Clear Timeline
      </button>
      <button className={styles.toolBtn} onClick={clearConsole} type="button">
        Clear Console
      </button>
      <button
        className={styles.toolBtn}
        onClick={() => {
          const url = buildSandboxShareUrl(config);
          void copyTextToClipboard(url).then((ok) => {
            if (ok) {
              flashStatus("Share URL copied");
              return;
            }
            window.prompt("Copy share URL:", url);
          });
        }}
        type="button"
      >
        Share URL
      </button>
      {statusMessage ? <span className={styles.toolbarStatus}>{statusMessage}</span> : null}
      <span
        className={styles.toolbarStatus}
        style={{ marginLeft: statusMessage ? "0.5rem" : "auto" }}
      >
        {running ? "running" : "stopped"}
      </span>
    </div>
  );
}
