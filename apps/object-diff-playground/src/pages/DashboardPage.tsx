import { Link } from "react-router-dom";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { getPlaygroundMetadata } from "../config/app-metadata.js";
import { CURRENT_NAVIGATION_ITEMS } from "../constants/navigation.js";
import {
  getObjectDiffIntegrationSummary,
  runSampleComparison,
  toMarkdown,
} from "../lib/object-diff.js";

const MODULE_ROUTES = CURRENT_NAVIGATION_ITEMS.filter((item) => item.groupId === "modules");

export function DashboardPage() {
  const integrationSummary = getObjectDiffIntegrationSummary();
  const metadata = getPlaygroundMetadata();
  const sample = runSampleComparison();

  return (
    <PageContainer
      compact
      description={
        <>
          Package overview. Open the <Link to="/">Object Diff Lab</Link> for the full interactive
          workspace.
        </>
      }
    >
      <div className={styles.heroGrid}>
        <Card
          description="Interactive comparison, patch exploration, and performance benchmarks powered by @jayoncode/object-diff."
          title="Package integration"
          tone="brand"
        >
          <ul className={styles.inlineList}>
            <li className={styles.pill}>v{metadata.versions.playground}</li>
            <li className={styles.pill}>
              @{integrationSummary.packageName.replace("@jayoncode/", "")} v
              {metadata.versions.browserLifecycle}
            </li>
            <li className={styles.pill}>{MODULE_ROUTES.length} explorers</li>
          </ul>
        </Card>

        <Card
          description="Sample comparison using built-in fixtures."
          title="Quick diff"
          tone="brand"
        >
          <p className={styles.metricValue}>{sample.metadata.changeCount}</p>
          <p className={styles.fieldHint}>changes detected in the sample objects</p>
        </Card>
      </div>

      <Card description="Markdown preview from the sample diff." title="Sample output">
        <pre className={styles.codeBlock}>{toMarkdown(sample)}</pre>
      </Card>
    </PageContainer>
  );
}
