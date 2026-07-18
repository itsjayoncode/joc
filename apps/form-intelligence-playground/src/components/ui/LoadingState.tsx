import styles from "./LoadingState.module.css";
import { Card } from "../primitives/Card.js";

export interface LoadingStateProps {
  readonly description?: string;
  readonly title?: string;
}

export function LoadingState({
  description = "The playground shell is preparing the current route.",
  title = "Loading playground view",
}: LoadingStateProps) {
  return (
    <Card description={description} title={title}>
      <div className={styles.spinner} aria-hidden="true" />
    </Card>
  );
}
