import { useState } from "react";

import { buildSandboxShareUrl, copyTextToClipboard, downloadTextFile } from "./clipboard.js";
import styles from "./Sandbox.module.css";
import { useSandbox } from "./SandboxContext.js";
import { useTheme } from "../hooks/useTheme.js";

export function SandboxToolbar() {
  const { resetForm, exportConfig, importConfig, generatedCode, config, undo, redo } = useSandbox();
  const { preference, togglePreference, resolvedTheme } = useTheme();
  const [status, setStatus] = useState<string | null>(null);

  const flash = (message: string) => {
    setStatus(message);
    window.setTimeout(() => {
      setStatus((current) => (current === message ? null : current));
    }, 2200);
  };

  const handleExportJson = () => {
    const json = exportConfig();
    try {
      downloadTextFile(`form-intelligence-sandbox-${config.templateId}.json`, json);
      flash("JSON downloaded");
    } catch {
      flash("Download failed");
      return;
    }
    void copyTextToClipboard(json).then((ok) => {
      if (ok) {
        flash("JSON downloaded + copied");
      }
    });
  };

  const handleCopyCode = () => {
    void copyTextToClipboard(generatedCode).then((ok) => {
      flash(ok ? "Code copied" : "Copy failed — try again");
    });
  };

  const handleShareUrl = () => {
    const url = buildSandboxShareUrl(config);
    void copyTextToClipboard(url).then((ok) => {
      if (ok) {
        flash("Share URL copied");
        return;
      }
      window.prompt("Copy share URL:", url);
      flash("Share URL shown in prompt");
    });
  };

  return (
    <div className={styles.toolbar}>
      <span className={styles.toolbarTitle}>Sandbox</span>
      <button
        className={styles.toolBtn}
        disabled={!config.undoRedo}
        onClick={undo}
        title={config.undoRedo ? "Undo last value change" : "Enable History plugin"}
        type="button"
      >
        Undo
      </button>
      <button
        className={styles.toolBtn}
        disabled={!config.undoRedo}
        onClick={redo}
        title={config.undoRedo ? "Redo" : "Enable History plugin"}
        type="button"
      >
        Redo
      </button>
      <button className={styles.toolBtn} onClick={resetForm} type="button">
        Reset
      </button>
      <button
        className={styles.toolBtn}
        onClick={() => {
          const raw = window.prompt("Paste sandbox JSON config");
          if (raw) {
            importConfig(raw);
            flash("Config imported");
          }
        }}
        type="button"
      >
        Import JSON
      </button>
      <button
        className={styles.toolBtn}
        onClick={handleExportJson}
        title="Download sandbox config JSON (also copies to clipboard)"
        type="button"
      >
        Export JSON
      </button>
      <button
        className={styles.toolBtnPrimary}
        onClick={handleCopyCode}
        title="Copy generated createForm() code"
        type="button"
      >
        Copy Code
      </button>
      <button
        className={styles.toolBtn}
        onClick={handleShareUrl}
        title="Copy a URL that restores this sandbox config"
        type="button"
      >
        Share URL
      </button>
      <button className={styles.toolBtn} onClick={togglePreference} type="button">
        Theme: {resolvedTheme}
      </button>
      <span className={status ? styles.toolbarStatus : styles.hint} style={{ margin: 0 }}>
        {status ?? `pref ${preference}`}
      </span>
    </div>
  );
}
