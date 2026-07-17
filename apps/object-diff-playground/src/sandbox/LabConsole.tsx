import styles from "./Lab.module.css";
import { useLab } from "./LabContext.js";
import { useConsoleResize } from "./use-console-resize.js";
import { classNames } from "../utils/class-names.js";

export function LabConsole({
  open,
  onToggle,
}: {
  readonly open: boolean;
  readonly onToggle: () => void;
}) {
  const { consoleEntries, clearConsole } = useLab();
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
        open && styles.consoleOpen,
        !open && styles.consoleMinimized,
        resizing && styles.consoleResizing,
      )}
      style={{ height }}
    >
      {open ? (
        <div
          aria-label="Resize console"
          aria-orientation="horizontal"
          className={styles.consoleHandle}
          onPointerCancel={onHandlePointerCancel}
          onPointerDown={onHandlePointerDown}
          onPointerMove={onHandlePointerMove}
          onPointerUp={onHandlePointerUp}
          role="separator"
          title="Drag to resize console"
        />
      ) : null}
      <div
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
          <strong>Console</strong>
          <span className={styles.consoleBadge}>{consoleEntries.length}</span>
          <span className={styles.hint} style={{ margin: 0 }}>
            {open ? "Drag top edge to resize" : "Click to expand"}
          </span>
        </div>
        <div className={styles.consoleHeadActions}>
          <button
            className={styles.toolBtn}
            onClick={(event) => {
              event.stopPropagation();
              clearConsole();
            }}
            type="button"
          >
            Clear
          </button>
          <button
            className={styles.toolBtn}
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            type="button"
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div className={styles.consoleScroll}>
        <ul className={styles.consoleList}>
          {consoleEntries.map((entry) => (
            <li
              className={classNames(
                styles.consoleItem,
                entry.level === "info" && styles.levelInfo,
                entry.level === "warn" && styles.levelWarn,
                entry.level === "error" && styles.levelError,
                entry.level === "success" && styles.levelSuccess,
              )}
              key={entry.id}
            >
              <span className={styles.consoleTime}>{entry.at}</span>[{entry.category}]{" "}
              {entry.message}
              {entry.durationMs !== undefined ? ` (${entry.durationMs.toFixed(2)}ms)` : ""}
            </li>
          ))}
          {consoleEntries.length === 0 ? (
            <li className={styles.hint}>No console entries yet.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
