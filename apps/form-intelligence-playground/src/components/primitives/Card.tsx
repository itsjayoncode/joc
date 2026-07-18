import styles from "./Card.module.css";
import { classNames } from "../../utils/class-names.js";

import type { PropsWithChildren, ReactNode } from "react";

type CardTone = "accent" | "brand" | "default" | "subtle";

export interface CardProps extends PropsWithChildren {
  readonly description?: ReactNode;
  readonly title?: ReactNode;
  readonly tone?: CardTone;
}

export function Card({ children, description, title, tone = "default" }: CardProps) {
  return (
    <section
      className={classNames(
        styles.card,
        tone === "accent" && styles.accent,
        tone === "brand" && styles.brand,
        tone === "subtle" && styles.subtle,
      )}
    >
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      {description ? <p className={styles.description}>{description}</p> : null}
      {children}
    </section>
  );
}
