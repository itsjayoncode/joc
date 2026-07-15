import { Link } from "react-router-dom";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { classNames } from "../utils/class-names.js";

export function NotFoundPage() {
  return (
    <PageContainer
      description="This route is reserved for future modules or invalid navigation targets."
      eyebrow="Not Found"
      title="The requested playground view is not available"
    >
      <Card
        description="Return to the dashboard and continue from the foundation routes."
        title="Navigation recovery"
      >
        <div className={styles.toggleGroup}>
          <Link className={classNames(styles.choiceButton, styles.choiceButtonActive)} to="/">
            Go to dashboard
          </Link>
          <Link className={styles.choiceButton} to="/about">
            Review architecture
          </Link>
        </div>
      </Card>
    </PageContainer>
  );
}
