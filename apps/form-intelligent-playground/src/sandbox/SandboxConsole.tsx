import styles from "./Sandbox.module.css";
import { useSandbox } from "./SandboxContext.js";
import { useConsoleResize } from "./use-console-resize.js";
import { classNames } from "../utils/class-names.js";

export interface SandboxConsoleProps {
  readonly open: boolean;
  readonly onToggle: () => void;
}

export function SandboxConsole({ open, onToggle }: SandboxConsoleProps) {
  const { consoleEntries, clearConsole } = useSandbox();
  const {
    height,
    resizing,
    onHandlePointerDown,
    onHandlePointerMove,
    onHandlePointerUp,
    onHandlePointerCancel,
  } = useConsoleResize(open);

  return (
    <div
      className={classNames(
        styles.console,
        open ? styles.consoleOpen : styles.consoleMinimized,
        resizing && styles.consoleResizing,
      )}
      style={{ height }}
    >
      {open ? (
        <div
          aria-label="Resize console"
          aria-orientation="horizontal"
          aria-valuemax={Math.round(
            typeof window !== "undefined" ? window.innerHeight * 0.55 : 420,
          )}
          aria-valuemin={96}
          aria-valuenow={height}
          className={styles.consoleHandle}
          onPointerCancel={onHandlePointerCancel}
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerUp}
          role="slider"
          title="Drag to resize console"
        />
      ) : null}
      <div
        aria-expanded={open}
        className={styles.consoleHead}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggle();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className={styles.consoleHeadLeft}>
          <h2 className={styles.sectionTitle}>Console</h2>
          <span className={styles.consoleBadge}>{String(consoleEntries.length)}</span>
          <span className={styles.hint} style={{ margin: 0 }}>
            {open ? "Drag top edge to resize · click to minimize" : "Click to expand"}
          </span>
        </div>
        <div className={styles.consoleHeadActions}>
          {open ? (
            <button
              className={styles.chip}
              onClick={(event) => {
                event.stopPropagation();
                clearConsole();
              }}
              type="button"
            >
              Clear
            </button>
          ) : null}
          <button
            aria-label={open ? "Minimize console" : "Expand console"}
            className={styles.chip}
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            type="button"
          >
            {open ? "Minimize" : "Expand"}
          </button>
        </div>
      </div>
      {open ? (
        <div className={styles.consoleScroll}>
          <ul className={styles.consoleList}>
            {consoleEntries.map((entry) => (
              <li className={styles.consoleItem} key={entry.id}>
                <span className={styles.consoleTime}>{entry.at}</span>
                <span
                  className={
                    entry.level === "error"
                      ? styles.levelError
                      : entry.level === "warn"
                        ? styles.levelWarn
                        : entry.level === "success"
                          ? styles.levelSuccess
                          : styles.levelInfo
                  }
                >
                  {entry.message}
                </span>
              </li>
            ))}
            {consoleEntries.length === 0 ? (
              <li className={styles.consoleItem}>
                <span className={styles.levelInfo}>Waiting for activity…</span>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
