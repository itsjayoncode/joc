import { useMemo, useState } from "react";

import styles from "./ModulePlayground.module.css";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock, CodeEditor, InlineCode } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { Badge } from "../components/ui/Badge.js";
import { StatusIndicator } from "../components/ui/StatusIndicator.js";
import { useConfigurationPlayground } from "../features/configuration/use-configuration-playground.js";
import { classNames } from "../utils/class-names.js";

function downloadText(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ConfigurationPage() {
  const [importText, setImportText] = useState("");
  const [presetName, setPresetName] = useState("");
  const {
    applyChanges,
    builtinPresets,
    customPresets,
    diffFromApplied,
    diffFromDefault,
    discardChanges,
    exportApplied,
    exportDefaults,
    exportPending,
    fieldRows,
    importError,
    importPreview,
    isRunning,
    lastAppliedAt,
    loadPreset,
    loadCustomPreset,
    parseImport,
    pendingConfig,
    restartSession,
    saveCustomPreset,
    updatePendingJson,
    validation,
  } = useConfigurationPlayground();

  const pendingJson = useMemo(() => exportPending(), [exportPending]);
  const hasPendingChanges = Object.keys(pendingConfig).length > 0;

  return (
    <PageContainer
      description="View, validate, import, export, and apply Browser Lifecycle configuration against a live session."
      eyebrow="Configuration"
      title="Configuration playground"
    >
      <div className={styles.topGrid}>
        <Card title="Live configuration" tone="brand">
          <StatusIndicator tone={validation.valid ? "success" : "warning"}>
            {validation.valid ? "Valid configuration" : "Validation issues detected"}
          </StatusIndicator>
          <StatusIndicator tone={isRunning ? "success" : "info"}>
            {isRunning ? "Session running" : "Session stopped"}
          </StatusIndicator>
          {lastAppliedAt ? (
            <p className={styles.helperText}>
              Last applied: {new Date(lastAppliedAt).toLocaleString()}
            </p>
          ) : null}
          <table className={styles.configTable}>
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
                <th>Type</th>
                <th>Modified</th>
              </tr>
            </thead>
            <tbody>
              {fieldRows.map((row) => (
                <tr key={row.key}>
                  <td>{row.key}</td>
                  <td>
                    <InlineCode>{row.value}</InlineCode>
                  </td>
                  <td>{row.type}</td>
                  <td>
                    {row.modified ? (
                      <Badge tone="warning">pending</Badge>
                    ) : (
                      <Badge tone="info">applied</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Validation and live preview">
          {validation.valid ? (
            <p className={styles.helperText}>Configuration passes Browser Lifecycle validation.</p>
          ) : (
            <ul className={styles.comparisonList}>
              {validation.issues.map((issue) => (
                <li key={`${issue.path}-${issue.message}`}>
                  <strong>{issue.path}</strong>: {issue.message}
                </li>
              ))}
            </ul>
          )}
          <p className={styles.helperText}>
            {hasPendingChanges
              ? "Pending changes require a session restart before they affect the running Browser Lifecycle instance."
              : "No pending changes."}
          </p>
          <div className={styles.toolbarActions}>
            <button
              className={classNames(styles.button, styles.buttonPrimary)}
              disabled={!validation.valid || !hasPendingChanges}
              onClick={applyChanges}
              type="button"
            >
              Apply changes
            </button>
            <button className={styles.button} onClick={discardChanges} type="button">
              Discard
            </button>
            <button className={styles.button} onClick={restartSession} type="button">
              Restart session
            </button>
          </div>
        </Card>
      </div>

      <div className={styles.topGrid}>
        <Card title="Presets">
          <div className={styles.statusRow}>
            {builtinPresets.map((preset) => (
              <button
                key={preset.id}
                className={styles.button}
                onClick={() => {
                  loadPreset(preset.id);
                }}
                type="button"
              >
                {preset.label}
              </button>
            ))}
          </div>
          {customPresets.length > 0 ? (
            <div className={styles.statusRow}>
              {customPresets.map((preset) => (
                <button
                  key={preset.id}
                  className={styles.button}
                  onClick={() => {
                    loadCustomPreset(preset.id);
                  }}
                  type="button"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          ) : null}
          <div className={styles.toolbar}>
            <input
              className={styles.searchInput}
              onChange={(event) => {
                setPresetName(event.target.value);
              }}
              placeholder="Custom preset name"
              type="text"
              value={presetName}
            />
            <button
              className={styles.button}
              disabled={!presetName.trim() || !validation.valid}
              onClick={() => {
                saveCustomPreset(presetName.trim(), "Saved from configuration playground");
                setPresetName("");
              }}
              type="button"
            >
              Save custom preset
            </button>
          </div>
        </Card>
        <Card title="Configuration diff">
          <h3 className={styles.exampleTitle}>Pending vs applied</h3>
          <ol className={styles.eventLog}>
            {diffFromApplied.map((entry) => (
              <li key={`applied-${entry.path}`} className={styles.eventEntry}>
                <span className={styles.eventType}>{entry.kind}</span>
                <span className={styles.eventDetail}>{entry.path}</span>
              </li>
            ))}
          </ol>
          <h3 className={styles.exampleTitle}>Current vs defaults</h3>
          <ol className={styles.eventLog}>
            {diffFromDefault.map((entry) => (
              <li key={`default-${entry.path}`} className={styles.eventEntry}>
                <span className={styles.eventType}>{entry.kind}</span>
                <span className={styles.eventDetail}>{entry.path}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className={styles.topGrid}>
        <Card title="Import">
          <CodeEditor
            language="json"
            onChange={(event) => {
              setImportText(event.target.value);
            }}
            placeholder="Paste configuration JSON"
            rows={8}
            title="Configuration import"
            value={importText}
          />
          {importError ? <p className={styles.helperText}>{importError}</p> : null}
          <div className={styles.toolbarActions}>
            <button
              className={styles.button}
              onClick={() => {
                const result = parseImport(importText);
                if (result.config) {
                  updatePendingJson(importText);
                }
              }}
              type="button"
            >
              Validate import
            </button>
            <button
              className={classNames(styles.button, styles.buttonPrimary)}
              disabled={!importPreview || !validation.valid}
              onClick={applyChanges}
              type="button"
            >
              Apply import
            </button>
          </div>
        </Card>
        <Card title="Export">
          <div className={styles.toolbarActions}>
            <button
              className={styles.button}
              onClick={() => {
                downloadText("configuration-applied.json", exportApplied());
              }}
              type="button"
            >
              Export applied
            </button>
            <button
              className={styles.button}
              onClick={() => {
                downloadText("configuration-defaults.json", exportDefaults());
              }}
              type="button"
            >
              Export defaults
            </button>
            <button
              className={styles.button}
              onClick={() => {
                downloadText("configuration-pending.json", pendingJson);
              }}
              type="button"
            >
              Export pending
            </button>
          </div>
          <CodeBlock
            code={pendingJson}
            language="json"
            maxHeight="24rem"
            title="Pending configuration"
          />
        </Card>
      </div>
    </PageContainer>
  );
}
