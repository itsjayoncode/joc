import styles from "./Badge.module.css";
import { classNames } from "../../utils/class-names.js";

import type { PropsWithChildren } from "react";

export type BadgeTone = "accent" | "default" | "info" | "warning";

export interface BadgeProps extends PropsWithChildren {
  readonly className?: string;
  readonly tone?: BadgeTone;
}

export function Badge({ children, className, tone = "default" }: BadgeProps) {
  return (
    <span
      className={classNames(
        styles.badge,
        tone === "accent" && styles.accent,
        tone === "info" && styles.info,
        tone === "warning" && styles.warning,
        className,
      )}
    >
      {children}
    </span>
  );
}
