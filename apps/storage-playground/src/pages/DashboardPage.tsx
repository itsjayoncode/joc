import { Link } from "react-router-dom";

import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { getPlaygroundMetadata } from "../config/app-metadata.js";
import { CURRENT_NAVIGATION_ITEMS } from "../constants/navigation.js";
import { getStorageIntegrationSummary } from "../lib/storage.js";

const MODULE_ROUTES = CURRENT_NAVIGATION_ITEMS.filter((item) => item.groupId === "modules");

export function DashboardPage() {
  const integrationSummary = getStorageIntegrationSummary();
  const metadata = getPlaygroundMetadata();

  return (
    <PageContainer
      compact
      description={
        <>
          Package overview. Open the <Link to="/">Storage Lab</Link> for the full interactive
          workspace.
        </>
      }
    >
      <div className={styles.heroGrid}>
        <Card
          description="Explicit adapters, TTL, migrations, and envelope inspection powered by @jayoncode/storage."
          title="Package integration"
          tone="brand"
        >
          <ul className={styles.inlineList}>
            <li className={styles.pill}>v{metadata.versions.playground}</li>
            <li className={styles.pill}>
              @{integrationSummary.packageName.replace("@jayoncode/", "")} v
              {metadata.versions.storage}
            </li>
            <li className={styles.pill}>{MODULE_ROUTES.length} explorers</li>
          </ul>
        </Card>

        <Card
          description="Primary entry point for namespaced storage sessions."
          title="Entry point"
          tone="brand"
        >
          <p className={styles.metricValue}>{integrationSummary.entryPoint}</p>
          <p className={styles.fieldHint}>
            createStorage({"{"} namespace, adapter {"}"})
          </p>
        </Card>
      </div>

      <Card
        description="Focused explorers for adapters, TTL, and usage snippets."
        title="Explorers"
      >
        <ul className={styles.inlineList}>
          {MODULE_ROUTES.map((item) => (
            <li key={item.id}>
              <Link className={styles.pill} to={item.path ?? "/"}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </PageContainer>
  );
}
