import styles from "./PageContainer.module.css";

import type { PropsWithChildren, ReactNode } from "react";

export interface PageContainerProps extends PropsWithChildren {
  readonly description: ReactNode;
  readonly eyebrow: string;
  readonly title: ReactNode;
}

export function PageContainer({ children, description, eyebrow, title }: PageContainerProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </header>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
