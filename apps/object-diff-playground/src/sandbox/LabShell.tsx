import { useState, type CSSProperties, type ReactNode } from "react";

import styles from "./Lab.module.css";
import { LabConfigPanel } from "./LabConfigPanel.js";
import { LabConsole } from "./LabConsole.js";
import { LabProvider } from "./LabContext.js";
import { LabInspector } from "./LabInspector.js";
import { LabToolbar } from "./LabToolbar.js";
import { LabWorkspace } from "./LabWorkspace.js";
import { useColumnResize } from "./use-column-resize.js";
import { classNames } from "../utils/class-names.js";

export function LabShell() {
  const [consoleOpen, setConsoleOpen] = useState(true);
  const {
    width: configWidth,
    resizing,
    onHandlePointerDown,
    onHandlePointerMove,
    onHandlePointerUp,
    onHandlePointerCancel,
  } = useColumnResize();

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
    <LabProvider>
      <div className={styles.lab}>
        <div
          className={classNames(styles.workspace, resizing && styles.workspaceResizing)}
          style={workspaceStyle}
        >
          <LabToolbar />
          <LabConfigPanel resizeHandle={resizeHandle} />
          <LabWorkspace />
          <LabInspector />
        </div>
        <LabConsole
          open={consoleOpen}
          onToggle={() => {
            setConsoleOpen((current) => !current);
          }}
        />
      </div>
    </LabProvider>
  );
}
