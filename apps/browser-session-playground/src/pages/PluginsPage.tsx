import styles from "./ModulePlayground.module.css";
import { Card } from "../components/primitives/Card.js";
import { CodeBlock } from "../components/primitives/CodeBlock.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { Badge } from "../components/ui/Badge.js";
import { StatusIndicator } from "../components/ui/StatusIndicator.js";
import { usePluginPlayground } from "../features/plugins/use-plugin-playground.js";
import {
  formatPluginLifecycleLabel,
  formatPluginDiagnosticSummary,
} from "../lib/playground-plugins.js";
import { classNames } from "../utils/class-names.js";

export function PluginsPage() {
  const {
    architectureSteps,
    clearEvents,
    developerExamples,
    disablePlugin,
    enablePlugin,
    events,
    isPaused,
    isRunning,
    lifecyclePhases,
    loggerExecutionCount,
    loggerOutput,
    loggerSource,
    pause,
    plugins,
    reloadSession,
    resume,
    searchQuery,
    selectedPlugin,
    setSearchQuery,
    startSession,
    stopSession,
    systemInfo,
  } = usePluginPlayground();

  return (
    <PageContainer
      description="Inspect real Browser Lifecycle plugin registration, lifecycle transitions, hook execution, and plugin events."
      eyebrow="Plugins"
      title="Plugin playground"
    >
      <div className={styles.topGrid}>
        <Card title="Installed plugins" tone="brand">
          {plugins.length === 0 ? (
            <p className={styles.helperText}>No plugins registered yet.</p>
          ) : (
            <ul className={styles.comparisonList}>
              {plugins.map((plugin) => (
                <li key={plugin.id}>
                  <div className={styles.statusRow}>
                    <strong>{plugin.name ?? plugin.id}</strong>
                    <Badge tone={plugin.enabled ? "accent" : "warning"}>
                      {plugin.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Badge tone="info">{plugin.lifecycle}</Badge>
                  </div>
                  <p className={styles.helperText}>{formatPluginDiagnosticSummary(plugin)}</p>
                  <dl className={styles.snapshotList}>
                    <div className={styles.snapshotRow}>
                      <dt>Author</dt>
                      <dd>{plugin.author ?? "—"}</dd>
                    </div>
                    <div className={styles.snapshotRow}>
                      <dt>Version</dt>
                      <dd>{plugin.version ?? "—"}</dd>
                    </div>
                    <div className={styles.snapshotRow}>
                      <dt>Hooks</dt>
                      <dd>{plugin.hookCount}</dd>
                    </div>
                    <div className={styles.snapshotRow}>
                      <dt>Priority</dt>
                      <dd>{plugin.priority}</dd>
                    </div>
                    <div className={styles.snapshotRow}>
                      <dt>Registered</dt>
                      <dd>{new Date(plugin.registeredAt).toLocaleTimeString()}</dd>
                    </div>
                  </dl>
                  <div className={styles.toolbarActions}>
                    {plugin.enabled ? (
                      <button
                        className={styles.button}
                        onClick={() => {
                          disablePlugin(plugin.id);
                        }}
                        type="button"
                      >
                        Disable
                      </button>
                    ) : (
                      <button
                        className={classNames(styles.button, styles.buttonPrimary)}
                        onClick={() => {
                          enablePlugin(plugin.id);
                        }}
                        type="button"
                      >
                        Enable
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Plugin information">
          <dl className={styles.snapshotList}>
            <div className={styles.snapshotRow}>
              <dt>API version</dt>
              <dd>{systemInfo.apiVersion}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>System version</dt>
              <dd>{systemInfo.systemVersion}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Lifecycle hooks</dt>
              <dd>{systemInfo.lifecycleHooks.join(", ")}</dd>
            </div>
            <div className={styles.snapshotRow}>
              <dt>Hook types</dt>
              <dd>{systemInfo.hookTypes.join(", ")}</dd>
            </div>
          </dl>
          <StatusIndicator tone={isRunning ? "success" : "info"}>
            {isRunning ? "Session running" : "Session stopped"}
          </StatusIndicator>
          <div className={styles.toolbarActions}>
            {isRunning ? (
              <button className={styles.button} onClick={stopSession} type="button">
                Stop session
              </button>
            ) : (
              <button
                className={classNames(styles.button, styles.buttonPrimary)}
                onClick={startSession}
                type="button"
              >
                Start session
              </button>
            )}
            <button className={styles.button} onClick={reloadSession} type="button">
              Reload
            </button>
          </div>
        </Card>
      </div>

      <div className={styles.middleGrid}>
        <Card title="Plugin lifecycle">
          <ol className={styles.lifecycleList}>
            {lifecyclePhases.map((phase) => {
              const isActive = selectedPlugin?.lifecycle === phase;
              return (
                <li
                  key={phase}
                  className={classNames(
                    styles.lifecycleStep,
                    isActive && styles.lifecycleStepActive,
                  )}
                >
                  {formatPluginLifecycleLabel(phase)}
                </li>
              );
            })}
          </ol>
          {selectedPlugin ? (
            <dl className={styles.snapshotList}>
              <div className={styles.snapshotRow}>
                <dt>Current</dt>
                <dd>{selectedPlugin.lifecycle}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Previous</dt>
                <dd>{selectedPlugin.previousLifecycle ?? "—"}</dd>
              </div>
              <div className={styles.snapshotRow}>
                <dt>Transitions</dt>
                <dd>{selectedPlugin.transitionCount}</dd>
              </div>
            </dl>
          ) : null}
        </Card>
        <Card title="Plugin architecture">
          <ol className={styles.comparisonList}>
            {architectureSteps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong> — {step.description}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card title="Plugin events">
        <div className={styles.toolbar}>
          <input
            className={styles.searchInput}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            placeholder="Search plugin events"
            type="search"
            value={searchQuery}
          />
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
            <button className={styles.button} onClick={clearEvents} type="button">
              Clear
            </button>
          </div>
        </div>
        <ol className={styles.eventLog}>
          {events.map((entry) => (
            <li key={entry.id} className={styles.eventEntry}>
              <span className={styles.eventTimestamp}>{entry.timestampLabel}</span>
              <span className={styles.eventType}>{entry.type}</span>
              <span className={styles.eventDetail}>{entry.payloadSummary}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card title="LoggerPlugin demo">
        <p className={styles.helperText}>Execution count: {loggerExecutionCount}</p>
        <CodeBlock code={loggerSource} language="typescript" title="LoggerPlugin source" />
        <ol className={styles.eventLog}>
          {loggerOutput.map((line) => (
            <li key={line} className={styles.eventEntry}>
              <span className={styles.eventDetail}>{line}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card title="Developer examples">
        {developerExamples.map((example) => (
          <article key={example.id} className={styles.exampleCard}>
            <h3 className={styles.exampleTitle}>{example.title}</h3>
            <p className={styles.helperText}>{example.description}</p>
            <CodeBlock code={example.snippet} language="typescript" title={example.title} />
          </article>
        ))}
      </Card>
    </PageContainer>
  );
}
