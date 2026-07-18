import styles from "./ExplainPanel.module.css";
import { classNames } from "../../utils/class-names.js";

import type { PropsWithChildren, ReactNode } from "react";

export interface ExplainPanelProps extends PropsWithChildren {
  readonly title: string;
  readonly body?: ReactNode;
  readonly variant?: "default" | "tip";
}

export function ExplainPanel({ body, children, title, variant = "default" }: ExplainPanelProps) {
  return (
    <section className={classNames(styles.panel, variant === "tip" && styles.tip)}>
      <h2 className={styles.title}>{title}</h2>
      {body ? <p className={styles.body}>{body}</p> : null}
      {children}
    </section>
  );
}
