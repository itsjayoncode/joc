import { Badge } from "./Badge.js";
import styles from "./ErrorState.module.css";
import { Card } from "../primitives/Card.js";

export interface ErrorStateProps {
  readonly description: string;
  readonly title?: string;
}

export function ErrorState({ description, title = "Something went wrong" }: ErrorStateProps) {
  return (
    <Card description={description} title={title}>
      <div className={styles.stack}>
        <Badge tone="warning">Route Error</Badge>
      </div>
    </Card>
  );
}
