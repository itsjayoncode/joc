import { useState, type CSSProperties, type ReactNode } from "react";

import styles from "./Sandbox.module.css";
import { SandboxCanvas } from "./SandboxCanvas.js";
import { SandboxConfigPanel } from "./SandboxConfigPanel.js";
import { SandboxConsole } from "./SandboxConsole.js";
import { SandboxProvider } from "./SandboxContext.js";
import { SandboxInspector } from "./SandboxInspector.js";
import { SandboxToolbar } from "./SandboxToolbar.js";
import { useColumnResize } from "./use-column-resize.js";
import { classNames } from "../utils/class-names.js";

export function SandboxShell() {
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
    <SandboxProvider>
      <div className={styles.sandbox}>
        <div
          className={classNames(styles.workspace, resizing && styles.workspaceResizing)}
          style={workspaceStyle}
        >
          <SandboxToolbar />
          <SandboxConfigPanel resizeHandle={resizeHandle} />
          <SandboxCanvas />
          <SandboxInspector />
        </div>
        <SandboxConsole
          open={consoleOpen}
          onToggle={() => {
            setConsoleOpen((current) => !current);
          }}
        />
      </div>
    </SandboxProvider>
  );
}
