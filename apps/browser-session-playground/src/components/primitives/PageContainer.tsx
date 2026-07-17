import styles from "./PageContainer.module.css";
import { classNames } from "../../utils/class-names.js";

import type { PropsWithChildren, ReactNode } from "react";

export interface PageContainerProps extends PropsWithChildren {
  readonly description?: ReactNode;
  readonly eyebrow?: string;
  readonly title?: ReactNode;
  readonly compact?: boolean;
}

export function PageContainer({
  children,
  compact = false,
  description,
  eyebrow,
  title,
}: PageContainerProps) {
  return (
    <div className={classNames(styles.container, compact && styles.compact)}>
      {compact ? (
        description ? (
          <p className={styles.purpose}>{description}</p>
        ) : null
      ) : (
        <header className={styles.header}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          {title ? <h1 className={styles.title}>{title}</h1> : null}
          {description ? <p className={styles.description}>{description}</p> : null}
        </header>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
