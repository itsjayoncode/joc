import { Badge } from "./Badge.js";
import styles from "./Placeholder.module.css";
import { Card } from "../primitives/Card.js";

import type { ReactNode } from "react";

export interface PlaceholderProps {
  readonly caption?: string;
  readonly description: ReactNode;
  readonly eyebrow?: string;
  readonly title: ReactNode;
}

export function Placeholder({
  caption = "This route is reserved for a later Form Intelligent phase.",
  description,
  eyebrow = "Coming Soon",
  title,
}: PlaceholderProps) {
  return (
    <Card description={description} title={title} tone="subtle">
      <div className={styles.stack}>
        <Badge tone="info">{eyebrow}</Badge>
        <p className={styles.caption}>{caption}</p>
      </div>
    </Card>
  );
}
