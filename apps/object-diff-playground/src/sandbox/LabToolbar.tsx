import { buildLabShareUrl, copyTextToClipboard, downloadTextFile } from "./clipboard.js";
import styles from "./Lab.module.css";
import { useLab } from "./LabContext.js";
import { useTheme } from "../hooks/useTheme.js";

export function LabToolbar() {
  const {
    resetLab,
    exportExperiment,
    importExperiment,
    generatedCode,
    config,
    undo,
    redo,
    canUndo,
    canRedo,
    swapSnapshots,
    compute,
    copyText,
    flashStatus,
    statusMessage,
    runBenchmark,
  } = useLab();
  const { togglePreference } = useTheme();

  const handleExportJson = () => {
    const json = exportExperiment();
    try {
      downloadTextFile(`object-diff-lab-${config.templateId}.json`, json);
      flashStatus("JSON downloaded");
    } catch {
      flashStatus("Download failed");
      return;
    }
    void copyTextToClipboard(json).then((ok) => {
      if (ok) {
        flashStatus("JSON downloaded + copied");
      }
    });
  };

  return (
    <div className={styles.toolbar}>
      <span className={styles.toolbarTitle}>Object Diff Lab</span>
      <button className={styles.toolBtn} disabled={!canUndo} onClick={undo} type="button">
        Undo
      </button>
      <button className={styles.toolBtn} disabled={!canRedo} onClick={redo} type="button">
        Redo
      </button>
      <button className={styles.toolBtn} onClick={resetLab} type="button">
        Reset
      </button>
      <button className={styles.toolBtn} onClick={swapSnapshots} type="button">
        Swap
      </button>
      <button
        className={styles.toolBtn}
        onClick={() => {
          const raw = window.prompt("Paste lab experiment JSON");
          if (raw) {
            importExperiment(raw);
            flashStatus("Config imported");
          }
        }}
        type="button"
      >
        Import JSON
      </button>
      <button className={styles.toolBtn} onClick={handleExportJson} type="button">
        Export JSON
      </button>
      <button
        className={styles.toolBtn}
        onClick={() => {
          if (compute.ok) {
            void copyText(JSON.stringify(compute.result, null, 2), "Diff result");
          }
        }}
        type="button"
      >
        Copy Result
      </button>
      <button
        className={styles.toolBtn}
        onClick={() => {
          if (compute.ok) {
            void copyText(JSON.stringify(compute.patchOps, null, 2), "Patch");
          }
        }}
        type="button"
      >
        Copy Patch
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
          const url = buildLabShareUrl(config);
          void copyTextToClipboard(url).then((ok) => {
            if (ok) {
              flashStatus("Share URL copied");
              return;
            }
            window.prompt("Copy share URL:", url);
            flashStatus("Share URL shown in prompt");
          });
        }}
        type="button"
      >
        Share URL
      </button>
      <button
        className={styles.toolBtn}
        onClick={() => {
          runBenchmark("manual");
        }}
        type="button"
      >
        Benchmark
      </button>
      <button className={styles.toolBtn} onClick={togglePreference} type="button">
        Theme
      </button>
      {statusMessage ? <span className={styles.toolbarStatus}>{statusMessage}</span> : null}
    </div>
  );
}
