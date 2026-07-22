import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

import {
  createStorage,
  isQuotaExceededError,
  type JayOnCodeStorage,
  type StorageEnvelope,
} from "@jayoncode/storage";
import { enableCrossTabSync } from "@jayoncode/storage/cross-tab";
import {
  createDiagnostics,
  type DiagnosticsReport,
  type StorageDiagnostics,
} from "@jayoncode/storage/diagnostics";
import { cleanup, type CleanupReport } from "@jayoncode/storage/maintenance";
import { observe, type StorageEventType } from "@jayoncode/storage/observable";
import {
  restore,
  snapshot,
  type RestoreReport,
  type StorageSnapshot,
} from "@jayoncode/storage/snapshots";
import { transaction } from "@jayoncode/storage/transactions";

import {
  demoMigrateEnvelope,
  resolveAdapter,
  withQuotaSimulation,
  type AdapterKind,
} from "./lab-helpers.js";
import styles from "./Lab.module.css";
import { useColumnResize } from "./use-column-resize.js";
import { STORAGE_DOCS_URL } from "../lib/playground-links.js";
import { classNames } from "../utils/class-names.js";

type PolicyKind = "none" | "preferences" | "cache";
type SchemaKind = "1" | "2";

function formatExpiresIn(expiresAt: number | undefined, now: number): string {
  if (expiresAt === undefined) {
    return "no expiry";
  }
  const ms = expiresAt - now;
  if (ms <= 0) {
    return "expired";
  }
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return `${String(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${String(minutes)}m ${String(seconds % 60)}s`;
  }
  const hours = Math.floor(minutes / 60);
  return `${String(hours)}h ${String(minutes % 60)}m`;
}

export function LabShell() {
  const [adapterKind, setAdapterKind] = useState<AdapterKind>("memory");
  const [policyKind, setPolicyKind] = useState<PolicyKind>("none");
  const [schemaVersion, setSchemaVersion] = useState<SchemaKind>("1");
  const [migrateEnabled, setMigrateEnabled] = useState(true);
  const [simulateQuota, setSimulateQuota] = useState(false);
  const [observeEnabled, setObserveEnabled] = useState(false);
  const [crossTabEnabled, setCrossTabEnabled] = useState(false);
  const [eventLog, setEventLog] = useState<readonly string[]>([]);
  const [crossTabLog, setCrossTabLog] = useState<readonly string[]>([]);
  const [key, setKey] = useState("demo");
  const [value, setValue] = useState('{\n  "hello": "storage"\n}');
  const [ttlMinutes, setTtlMinutes] = useState(5);
  const [log, setLog] = useState<string>("Ready.");
  const [envelope, setEnvelope] = useState<StorageEnvelope | null>(null);
  const [dryRun, setDryRun] = useState<{
    readonly before: StorageEnvelope;
    readonly after: StorageEnvelope | null;
  } | null>(null);
  const [cleanupReport, setCleanupReport] = useState<CleanupReport | null>(null);
  const [diagnosticsReport, setDiagnosticsReport] = useState<DiagnosticsReport | null>(null);
  const [diagnostics, setDiagnostics] = useState<StorageDiagnostics | null>(null);
  const [snapDoc, setSnapDoc] = useState<StorageSnapshot | null>(null);
  const [restoreReport, setRestoreReport] = useState<RestoreReport | null>(null);
  const [ttlSource, setTtlSource] = useState<string>("instance");
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [now, setNow] = useState(() => Date.now());

  const {
    width: configWidth,
    resizing,
    onHandlePointerDown,
    onHandlePointerMove,
    onHandlePointerUp,
    onHandlePointerCancel,
  } = useColumnResize();

  useEffect(() => {
    if (envelope?.expiresAt === undefined) {
      return;
    }
    const id = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      window.clearInterval(id);
    };
  }, [envelope?.expiresAt]);

  const baseAdapter = useMemo(() => resolveAdapter(adapterKind), [adapterKind]);

  const baseStorage = useMemo((): JayOnCodeStorage => {
    const adapter = withQuotaSimulation(baseAdapter, simulateQuota);
    const options = {
      namespace: "playground",
      adapter,
      schemaVersion,
      ttl: { minutes: ttlMinutes },
      policies: {
        preferences: { ttl: { days: 365 } },
        cache: { ttl: { minutes: 15 } },
      },
      ...(schemaVersion === "2" && migrateEnabled
        ? {
            migrate: (envelope: StorageEnvelope, fromVersion: string) =>
              demoMigrateEnvelope(envelope, fromVersion),
          }
        : {}),
    };
    return createStorage(options);
  }, [baseAdapter, ttlMinutes, schemaVersion, migrateEnabled, simulateQuota]);

  const [storage, setStorage] = useState<JayOnCodeStorage>(baseStorage);

  useEffect(() => {
    if (!crossTabEnabled) {
      setStorage(baseStorage);
      return;
    }
    const handle = enableCrossTabSync(baseStorage, {
      onRemote: (event) => {
        const line = `${event.via}:${event.type}${event.key ? ` ${event.key}` : ""}`;
        setCrossTabLog((current) => [line, ...current].slice(0, 30));
        setLog(`cross-tab remote → ${line}`);
      },
    });
    setStorage(handle.storage);
    return () => {
      handle.stop();
    };
  }, [baseStorage, crossTabEnabled]);

  useEffect(() => {
    const handle = createDiagnostics(storage, { activityLimit: 40 });
    setDiagnostics(handle);
    setDiagnosticsReport(null);
    return () => {
      handle.disconnect();
    };
  }, [storage]);

  useEffect(() => {
    if (!observeEnabled) {
      return;
    }
    const observed = observe(storage);
    const types: StorageEventType[] = ["set", "remove", "clear", "expired", "migrated"];
    const offs = types.map((type) =>
      observed.on(type, (event) => {
        setEventLog((current) => [`${type} ${JSON.stringify(event)}`, ...current].slice(0, 30));
      }),
    );
    return () => {
      for (const off of offs) {
        off();
      }
    };
  }, [storage, observeEnabled]);

  const seedV1 = () => {
    try {
      const writer = createStorage({
        namespace: "playground",
        adapter: baseAdapter,
        schemaVersion: "1",
        ttl: { minutes: ttlMinutes },
      });
      const parsed: unknown = JSON.parse(value) as unknown;
      writer.set(key, parsed);
      setSchemaVersion("1");
      setDryRun(null);
      setEnvelope(writer.peek(key));
      setTtlSource(`instance (${String(ttlMinutes)}m)`);
      setLog(`seed v1 set(${key}) — switch schema to v2 to dry-run / migrate`);
    } catch (error) {
      setLog(error instanceof Error ? error.message : "Seed failed");
    }
  };

  const write = () => {
    try {
      const parsed: unknown = JSON.parse(value) as unknown;
      if (policyKind === "none") {
        storage.set(key, parsed);
        setTtlSource(`instance (${String(ttlMinutes)}m)`);
      } else {
        storage.set(key, parsed, { policy: policyKind });
        setTtlSource(
          policyKind === "preferences" ? "policy:preferences (365d)" : "policy:cache (15m)",
        );
      }
      setDryRun(null);
      setEnvelope(storage.peek(key));
      setLog(`set(${key}${policyKind === "none" ? "" : `, policy:${policyKind}`}) ok`);
    } catch (error) {
      if (isQuotaExceededError(error)) {
        const message = error instanceof Error ? error.message : "quota exceeded";
        setLog(`QuotaExceededError (simulated=${String(simulateQuota)}): ${message}`);
        return;
      }
      setLog(error instanceof Error ? error.message : "Write failed");
    }
  };

  const read = () => {
    try {
      const next = storage.get(key);
      setDryRun(null);
      setEnvelope(storage.peek(key));
      setLog(`get(${key}) → ${JSON.stringify(next)}`);
    } catch (error) {
      setLog(error instanceof Error ? error.message : "Read failed");
    }
  };

  const dryRunMigrate = () => {
    try {
      const before = storage.peek(key);
      if (!before) {
        setDryRun(null);
        setLog(`dry-run: no envelope at ${key} (seed v1 first)`);
        return;
      }
      const after = demoMigrateEnvelope(before, before.schemaVersion);
      setDryRun({ before, after });
      setEnvelope(before);
      setLog(
        after
          ? `dry-run migrate ${before.schemaVersion} → ${after.schemaVersion} (not persisted)`
          : "dry-run migrate → null (would delete)",
      );
    } catch (error) {
      setLog(error instanceof Error ? error.message : "Dry-run failed");
    }
  };

  const remove = () => {
    storage.remove(key);
    setEnvelope(null);
    setDryRun(null);
    setLog(`remove(${key})`);
  };

  const clear = () => {
    storage.clear();
    setEnvelope(null);
    setDryRun(null);
    setCleanupReport(null);
    setLog("clear()");
  };

  const runCleanup = () => {
    try {
      const report = cleanup(storage, { removeInvalid: true });
      setCleanupReport(report);
      setEnvelope(storage.peek(key));
      setLog(
        `cleanup → expired=${String(report.removedExpired)} invalid=${String(report.removedInvalid)} skipped=${String(report.skipped)}`,
      );
    } catch (error) {
      setLog(error instanceof Error ? error.message : "Cleanup failed");
    }
  };

  const runDiagnostics = () => {
    if (!diagnostics) {
      setLog("diagnostics: not ready");
      return;
    }
    try {
      const report = diagnostics.report();
      setDiagnosticsReport(report);
      setLog(
        `report → entries=${String(report.entryCount)} expired=${String(report.expiredCount)} bytes≈${String(report.approxBytes)}`,
      );
    } catch (error) {
      setLog(error instanceof Error ? error.message : "Diagnostics failed");
    }
  };

  const runTxCommit = () => {
    try {
      const parsed: unknown = JSON.parse(value) as unknown;
      transaction(storage, () => {
        storage.set(key, parsed);
        storage.set(`${key}:meta`, { ok: true, at: Date.now() });
      });
      setEnvelope(storage.peek(key));
      setLog(`tx commit → set(${key}) + set(${key}:meta)`);
    } catch (error) {
      setLog(error instanceof Error ? error.message : "Tx commit failed");
    }
  };

  const runTxAbort = () => {
    try {
      transaction(storage, () => {
        storage.set(key, { aborted: true });
        storage.set(`${key}:meta`, { ok: false });
        throw new Error("lab abort");
      });
      setLog("tx abort: unexpected commit");
      setEnvelope(storage.peek(key));
    } catch (error) {
      setEnvelope(storage.peek(key));
      setLog(
        error instanceof Error
          ? `tx abort → rolled back (${error.message})`
          : "tx abort → rolled back",
      );
    }
  };

  const runSnapshot = () => {
    try {
      const snap = snapshot(storage);
      setSnapDoc(snap);
      setRestoreReport(null);
      setLog(`snapshot → ${String(snap.entries.length)} entries`);
    } catch (error) {
      setLog(error instanceof Error ? error.message : "Snapshot failed");
    }
  };

  const runRestore = (mode: "merge" | "overwrite") => {
    if (!snapDoc) {
      setLog("restore: take a snapshot first");
      return;
    }
    try {
      const report = restore(storage, snapDoc, { mode });
      setRestoreReport(report);
      setEnvelope(storage.peek(key));
      setLog(`restore(${mode}) → written=${String(report.written)}`);
    } catch (error) {
      setLog(error instanceof Error ? error.message : "Restore failed");
    }
  };

  const workspaceStyle = {
    "--sandbox-config-width": `${String(configWidth)}px`,
  } as CSSProperties;

  const resizeHandle: ReactNode = (
    <div
      aria-label="Resize config panel"
      aria-orientation="vertical"
      aria-valuemax={520}
      aria-valuemin={200}
      aria-valuenow={configWidth}
      className={styles.configHandle}
      onPointerCancel={onHandlePointerCancel}
      onPointerDown={onHandlePointerDown}
      onPointerMove={onHandlePointerMove}
      onPointerUp={onHandlePointerUp}
      role="separator"
      title="Drag to resize config panel"
    />
  );

  return (
    <div className={styles.lab}>
      <div
        className={classNames(styles.workspace, resizing && styles.workspaceResizing)}
        style={workspaceStyle}
      >
        <div className={styles.toolbar}>
          <span className={styles.toolbarTitle}>Storage Lab</span>
          <button className={styles.toolBtnPrimary} onClick={write} type="button">
            Set
          </button>
          <button className={styles.toolBtn} onClick={read} type="button">
            Get
          </button>
          <button className={styles.toolBtn} onClick={seedV1} type="button">
            Seed v1
          </button>
          <button className={styles.toolBtn} onClick={dryRunMigrate} type="button">
            Dry-run migrate
          </button>
          <button className={styles.toolBtn} onClick={remove} type="button">
            Remove
          </button>
          <button className={styles.toolBtn} onClick={clear} type="button">
            Clear
          </button>
          <button className={styles.toolBtn} onClick={runCleanup} type="button">
            Cleanup
          </button>
          <button className={styles.toolBtn} onClick={runDiagnostics} type="button">
            Report
          </button>
          <button className={styles.toolBtn} onClick={runTxCommit} type="button">
            Tx commit
          </button>
          <button className={styles.toolBtn} onClick={runTxAbort} type="button">
            Tx abort
          </button>
          <button className={styles.toolBtn} onClick={runSnapshot} type="button">
            Snapshot
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => {
              runRestore("merge");
            }}
            type="button"
          >
            Restore merge
          </button>
          <button
            className={styles.toolBtn}
            onClick={() => {
              runRestore("overwrite");
            }}
            type="button"
          >
            Restore overwrite
          </button>
          <span className={styles.toolbarStatus}>{log}</span>
        </div>

        <aside className={styles.config}>
          {resizeHandle}
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Adapter</h2>
              <a
                className={styles.learnMore}
                href={STORAGE_DOCS_URL}
                rel="noreferrer"
                target="_blank"
              >
                Learn more
              </a>
            </div>
            <div className={styles.row}>
              {(
                [
                  ["memory", "Memory"],
                  ["local", "Local"],
                  ["session", "Session"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  className={classNames(styles.chip, adapterKind === id && styles.chipActive)}
                  onClick={() => {
                    setAdapterKind(id);
                    setEnvelope(null);
                    setDryRun(null);
                    setLog(`adapter → ${id}`);
                  }}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
            <label className={styles.field} style={{ marginTop: "0.65rem" }}>
              <span className={styles.fieldLabel}>
                <input
                  checked={simulateQuota}
                  onChange={(event) => {
                    setSimulateQuota(event.target.checked);
                    setLog(`quota sim → ${String(event.target.checked)}`);
                  }}
                  type="checkbox"
                />{" "}
                Simulate quota on set
              </span>
            </label>
            <label className={styles.field} style={{ marginTop: "0.35rem" }}>
              <span className={styles.fieldLabel}>
                <input
                  checked={observeEnabled}
                  onChange={(event) => {
                    setObserveEnabled(event.target.checked);
                    setEventLog([]);
                    setLog(`observe → ${String(event.target.checked)} (in-process only)`);
                  }}
                  type="checkbox"
                />{" "}
                Observe events (in-process)
              </span>
            </label>
            <label className={styles.field} style={{ marginTop: "0.35rem" }}>
              <span className={styles.fieldLabel}>
                <input
                  checked={crossTabEnabled}
                  onChange={(event) => {
                    setCrossTabEnabled(event.target.checked);
                    setCrossTabLog([]);
                    setLog(
                      `cross-tab → ${String(event.target.checked)} (open two Lab tabs; prefer Local)`,
                    );
                  }}
                  type="checkbox"
                />{" "}
                Cross-tab notify (`/cross-tab`)
              </span>
            </label>
            <p className={styles.hint}>
              Quota sim is Lab-only. Observe is in-process. Cross-tab uses BroadcastChannel (+{" "}
              <code>storage</code> events with Local). IndexedDB lives on{" "}
              <code>@jayoncode/storage/async</code> (see docs) — not this sync Lab shell.
            </p>
            {crossTabLog.length > 0 ? (
              <ul className={styles.hint} style={{ marginTop: "0.5rem" }}>
                {crossTabLog.slice(0, 8).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Schema / migrate</h2>
            </div>
            <div className={styles.row}>
              {(["1", "2"] as const).map((id) => (
                <button
                  key={id}
                  className={classNames(styles.chip, schemaVersion === id && styles.chipActive)}
                  onClick={() => {
                    setSchemaVersion(id);
                    setDryRun(null);
                    setLog(`schemaVersion → ${id}`);
                  }}
                  type="button"
                >
                  v{id}
                </button>
              ))}
            </div>
            <label className={styles.field} style={{ marginTop: "0.65rem" }}>
              <span className={styles.fieldLabel}>
                <input
                  checked={migrateEnabled}
                  disabled={schemaVersion !== "2"}
                  onChange={(event) => {
                    setMigrateEnabled(event.target.checked);
                  }}
                  type="checkbox"
                />{" "}
                migrate hook (v2)
              </span>
            </label>
            <p className={styles.hint}>
              Seed v1 → Dry-run (peek only) → switch to v2 + Get to persist.
            </p>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Policy</h2>
            </div>
            <div className={styles.row}>
              {(
                [
                  ["none", "Instance TTL"],
                  ["preferences", "preferences"],
                  ["cache", "cache"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  className={classNames(styles.chip, policyKind === id && styles.chipActive)}
                  onClick={() => {
                    setPolicyKind(id);
                    setLog(`policy → ${id}`);
                  }}
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Key & instance TTL</h2>
            </div>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Key</span>
              <input
                className={styles.fieldInput}
                onChange={(event) => {
                  setKey(event.target.value);
                }}
                value={key}
              />
            </label>
            <label className={styles.field} style={{ marginTop: "0.65rem" }}>
              <span className={styles.fieldLabel}>Instance TTL (minutes)</span>
              <input
                className={styles.numberInput}
                disabled={policyKind !== "none"}
                min={0}
                onChange={(event) => {
                  setTtlMinutes(Number(event.target.value));
                }}
                type="number"
                value={ttlMinutes}
              />
            </label>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Namespace</h2>
            </div>
            <div className={styles.badges}>
              <span className={classNames(styles.badge, styles.badgeOn)}>playground</span>
              <span className={styles.badge}>schema v{schemaVersion}</span>
              <span className={styles.badge}>{adapterKind}</span>
              {simulateQuota ? <span className={styles.badge}>quota-sim</span> : null}
            </div>
          </div>
        </aside>

        <section className={styles.canvas} aria-label="Value editor">
          <label
            className={styles.field}
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <span className={styles.fieldLabel}>JSON value</span>
            <textarea
              className={styles.fieldTextarea}
              onChange={(event) => {
                setValue(event.target.value);
              }}
              spellCheck={false}
              style={{
                flex: 1,
                minHeight: "12rem",
                fontFamily: "var(--font-mono)",
                resize: "none",
              }}
              value={value}
            />
          </label>
        </section>

        <aside className={styles.inspector} aria-label="Envelope inspector">
          <div className={styles.tabs}>
            <span className={classNames(styles.tab, styles.tabActive)}>Envelope</span>
          </div>
          <div className={styles.inspectorBody}>
            <div className={styles.metricGrid} style={{ marginBottom: "0.75rem" }}>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>TTL source</span>
                <span className={styles.metricValue}>{ttlSource}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricLabel}>Expires in</span>
                <span className={styles.metricValue}>
                  {formatExpiresIn(envelope?.expiresAt, now)}
                </span>
              </div>
            </div>
            {cleanupReport ? (
              <div style={{ marginBottom: "0.75rem" }}>
                <p className={styles.hint}>Cleanup report</p>
                <pre className={styles.pre} style={{ maxHeight: "8rem" }}>
                  {JSON.stringify(cleanupReport, null, 2)}
                </pre>
              </div>
            ) : null}
            {diagnosticsReport ? (
              <div style={{ marginBottom: "0.75rem" }}>
                <p className={styles.hint}>Diagnostics report</p>
                <pre className={styles.pre} style={{ maxHeight: "10rem" }}>
                  {JSON.stringify(diagnosticsReport, null, 2)}
                </pre>
              </div>
            ) : null}
            {snapDoc ? (
              <div style={{ marginBottom: "0.75rem" }}>
                <p className={styles.hint}>Snapshot ({String(snapDoc.entries.length)} entries)</p>
                <pre className={styles.pre} style={{ maxHeight: "8rem" }}>
                  {JSON.stringify(snapDoc, null, 2)}
                </pre>
              </div>
            ) : null}
            {restoreReport ? (
              <div style={{ marginBottom: "0.75rem" }}>
                <p className={styles.hint}>Restore report</p>
                <pre className={styles.pre} style={{ maxHeight: "6rem" }}>
                  {JSON.stringify(restoreReport, null, 2)}
                </pre>
              </div>
            ) : null}
            {dryRun ? (
              <div style={{ marginBottom: "0.75rem" }}>
                <p className={styles.hint}>Dry-run (not persisted)</p>
                <pre className={styles.pre} style={{ maxHeight: "8rem" }}>
                  {JSON.stringify({ before: dryRun.before, after: dryRun.after }, null, 2)}
                </pre>
              </div>
            ) : null}
            <pre className={styles.pre}>
              {envelope ? JSON.stringify(envelope, null, 2) : "— peek after set/get/seed"}
            </pre>
          </div>
        </aside>
      </div>

      <div className={classNames(styles.console, consoleOpen && styles.consoleOpen)}>
        <button
          className={styles.consoleHead}
          onClick={() => {
            setConsoleOpen((current) => !current);
          }}
          type="button"
        >
          <span className={styles.consoleHeadLeft}>
            Console
            <span className={styles.consoleBadge}>{log === "Ready." ? "idle" : "log"}</span>
          </span>
          <span className={styles.consoleHeadActions}>{consoleOpen ? "Hide" : "Show"}</span>
        </button>
        {consoleOpen ? (
          <div className={styles.consoleScroll}>
            <ul className={styles.consoleList}>
              <li className={styles.consoleItem}>
                <span className={styles.consoleTime}>{new Date().toLocaleTimeString()}</span>
                <span>{log}</span>
              </li>
              {eventLog.map((entry, index) => (
                <li className={styles.consoleItem} key={`${entry}-${String(index)}`}>
                  <span className={styles.consoleTime}>event</span>
                  <span>{entry}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
