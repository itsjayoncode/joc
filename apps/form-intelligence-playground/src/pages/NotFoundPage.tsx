import { Link } from "react-router-dom";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { classNames } from "../utils/class-names.js";

export function NotFoundPage() {
  return (
    <PageContainer
      description="This route is not registered — return to the sandbox or another explorer."
      eyebrow="Not Found"
      title="Page not found"
    >
      <Card description="Pick a recovery path." title="Continue">
        <div className={styles.toggleGroup}>
          <Link className={classNames(styles.choiceButton, styles.choiceButtonActive)} to="/">
            Open Sandbox
          </Link>
          <Link className={styles.choiceButton} to="/dashboard">
            Dashboard
          </Link>
          <Link className={styles.choiceButton} to="/about">
            Architecture
          </Link>
        </div>
      </Card>
    </PageContainer>
  );
}
