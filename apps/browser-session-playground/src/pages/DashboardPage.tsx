import styles from "./Pages.module.css";
import { Card } from "../components/primitives/Card.js";
import { PageContainer } from "../components/primitives/PageContainer.js";
import { getPlaygroundMetadata } from "../config/app-metadata.js";
import { CURRENT_NAVIGATION_ITEMS } from "../constants/navigation.js";
import { usePlaygroundUi } from "../hooks/usePlaygroundUi.js";
import { getBrowserLifecycleIntegrationSummary } from "../lib/browser-lifecycle.js";

const MODULE_ROUTES = CURRENT_NAVIGATION_ITEMS.filter((item) => item.groupId === "modules");

export function DashboardPage() {
  const { recentRoutes } = usePlaygroundUi();
  const integrationSummary = getBrowserLifecycleIntegrationSummary();
  const metadata = getPlaygroundMetadata();

  return (
    <PageContainer
      description="Operational overview for the Browser Session Playground release. All module routes, explorer tools, and developer diagnostics are available for manual QA."
      eyebrow="Dashboard"
      title="Browser Session Playground v1.0.0"
    >
      <div className={styles.heroGrid}>
        <Card
          description="The playground ships with live Browser Lifecycle integration across visibility, focus, connectivity, idle, lifecycle, cross-tab, plugins, events, state, configuration, performance, and developer tools."
          title="Release readiness"
          tone="brand"
        >
          <ul className={styles.inlineList}>
            <li className={styles.pill}>v{metadata.versions.playground}</li>
            <li className={styles.pill}>
              @{metadata.browserLifecyclePackageName} v{metadata.versions.browserLifecycle}
            </li>
            <li className={styles.pill}>{MODULE_ROUTES.length} module routes</li>
            <li className={styles.pill}>Production build</li>
          </ul>
        </Card>

        <Card
          description="Use module pages for interactive documentation and integration validation."
          title="Module coverage"
          tone="brand"
        >
          <p className={styles.metricValue}>{MODULE_ROUTES.length}</p>
          <p className={styles.fieldHint}>
            Live module playgrounds mapped in navigation and routing.
          </p>
        </Card>
      </div>

      <div className={styles.cardGrid}>
        <Card
          description="All Browser Lifecycle entry points stay isolated behind a dedicated integration layer."
          title="Integration boundary"
        >
          <ul className={styles.inlineList}>
            <li className={styles.pill}>{integrationSummary.packageName}</li>
            <li className={styles.pill}>{integrationSummary.entryPoint}</li>
            <li className={styles.pill}>Config-first</li>
          </ul>
        </Card>
        <Card
          description="The shell tracks recent navigation and preference state separately from package runtime state."
          title="UI state"
        >
          <p className={styles.fieldHint}>
            Theme, sidebar behavior, and recent activity live in React context instead of package
            state.
          </p>
        </Card>
        <Card
          description="Documentation is synchronized through the VitePress site and playground docs."
          title="Documentation"
        >
          <p className={styles.fieldHint}>
            See RELEASE_NOTES.md, deployment guide, and engineering note 023 for release details.
          </p>
        </Card>
      </div>

      <Card
        description="Recent navigation helps manual QA sessions resume context quickly."
        title="Recent activity"
      >
        <ul className={styles.recentList}>
          {recentRoutes.length === 0 ? (
            <li className={styles.recentRoute}>
              <span className={styles.routeLabel}>No route history yet</span>
              <span className={styles.routePath}>Start moving through the shell</span>
            </li>
          ) : (
            recentRoutes.map((route) => (
              <li key={route.path} className={styles.recentRoute}>
                <span className={styles.routeLabel}>{route.label}</span>
                <span className={styles.routePath}>{route.path}</span>
              </li>
            ))
          )}
        </ul>
      </Card>
    </PageContainer>
  );
}
