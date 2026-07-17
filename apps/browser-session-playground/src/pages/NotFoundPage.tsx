import { Link } from "react-router-dom";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { classNames } from "../utils/class-names.js";

export function NotFoundPage() {
  return (
    <PageContainer
      compact
      description="This route is reserved for future modules or invalid navigation targets."
    >
      <Card
        description="Return to the Lifecycle Sandbox and continue from known routes."
        title="Navigation recovery"
      >
        <div className={styles.toggleGroup}>
          <Link className={classNames(styles.choiceButton, styles.choiceButtonActive)} to="/">
            Go to Lifecycle Sandbox
          </Link>
          <Link className={styles.choiceButton} to="/dashboard">
            Dashboard
          </Link>
        </div>
      </Card>
    </PageContainer>
  );
}
