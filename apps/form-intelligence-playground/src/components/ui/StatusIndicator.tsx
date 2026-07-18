import styles from "./StatusIndicator.module.css";
import { classNames } from "../../utils/class-names.js";

import type { PropsWithChildren } from "react";

export type StatusIndicatorTone = "default" | "info" | "success" | "warning";

export interface StatusIndicatorProps extends PropsWithChildren {
  readonly className?: string;
  readonly tone?: StatusIndicatorTone;
}

export function StatusIndicator({ children, className, tone = "default" }: StatusIndicatorProps) {
  return (
    <span
      className={classNames(
        styles.indicator,
        tone === "info" && styles.info,
        tone === "success" && styles.success,
        tone === "warning" && styles.warning,
        className,
      )}
    >
      <span className={styles.dot} />
      <span>{children}</span>
    </span>
  );
}
