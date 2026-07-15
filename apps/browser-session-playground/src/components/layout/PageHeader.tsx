import styles from "./PageHeader.module.css";

import type { ReactNode } from "react";

export interface PageHeaderProps {
  readonly description: ReactNode;
  readonly eyebrow: string;
  readonly title: ReactNode;
}

export function PageHeader({ description, eyebrow, title }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </header>
  );
}
